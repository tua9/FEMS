import { describe, it, expect, vi, beforeEach } from 'vitest'
import { authService } from '../src/services/authService.js'
import User from '../src/models/User.js'
import Session from '../src/models/Session.js'
import { JwtProvider } from '../src/providers/JwtProvider.js'
import ResetPassword from '../src/models/ResetPassword.js'
import ResetPasswordRateLimit from '../src/models/ResetPasswordRateLimit.js'
import bcrypt from 'bcrypt'
import { emailService } from '../src/services/emailService.js'
import { StatusCodes } from 'http-status-codes'

// ─── MOCKS ──────────────────────────────────────────────────────────────────
vi.mock('../src/models/User.js')
vi.mock('../src/models/Session.js')
vi.mock('../src/providers/JwtProvider.js')
vi.mock('../src/models/ResetPassword.js')
vi.mock('../src/models/ResetPasswordRateLimit.js')
vi.mock('bcrypt')
vi.mock('../src/services/emailService.js')
vi.mock('../src/utils/ApiError.js', () => {
  return {
    default: class ApiError extends Error {
      constructor(statusCode, message) {
        super(message)
        this.statusCode = statusCode
      }
    }
  }
})

describe('authService Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ─── 2️⃣ signIn ─────────────────────────────────────────────────────────────
  describe('signIn()', () => {
    const validBody = { username: 'testuser', password: 'password123' }

    // --- Black Box: EP / BVA ---
    it('should throw "Username or Email is required" if username is empty (BVA)', async () => {
      console.log('🧪 Test: signIn BVA - empty username')
      await expect(authService.signIn({ username: '', password: '123' }))
        .rejects.toThrow('Username or Email is required')
    })

    it('should throw "Password is required" if password is empty (BVA)', async () => {
      console.log('🧪 Test: signIn BVA - empty password')
      await expect(authService.signIn({ username: 'user', password: '' }))
        .rejects.toThrow('Password is required')
    })

    // --- White Box: Decision Coverage ---
    it('should throw "Invalid username or email" if user does not exist (Decision: User found = false)', async () => {
      User.findOne.mockResolvedValue(null)
      
      console.log('🧪 Test: signIn Decision - user not found')
      await expect(authService.signIn(validBody))
        .rejects.toThrow('Invalid username or email')
      expect(User.findOne).toHaveBeenCalled()
    })

    it('should throw "account is deactivated" if user.isActive is false (Decision: isActive = false)', async () => {
      User.findOne.mockResolvedValue({ 
        username: 'testuser', 
        isActive: false 
      })
      
      console.log('🧪 Test: signIn Decision - inactive user')
      await expect(authService.signIn(validBody))
        .rejects.toThrow(/account is deactivated/i)
    })

    it('should throw "Invalid password" if password check fails (Decision: password valid = false)', async () => {
      User.findOne.mockResolvedValue({ 
        username: 'testuser', 
        isActive: true, 
        hashedPassword: 'hashed' 
      })
      bcrypt.compare.mockResolvedValue(false)
      
      console.log('🧪 Test: signIn Decision - invalid password')
      await expect(authService.signIn(validBody))
        .rejects.toThrow('Invalid password')
    })

    it('should return success and tokens if all checks pass (Decision: Success Path)', async () => {
      const mockUser = { 
        _id: 'u123', 
        username: 'testuser', 
        role: 'student', 
        isActive: true, 
        hashedPassword: 'hashed',
        displayName: 'Test User'
      }
      User.findOne.mockResolvedValue(mockUser)
      bcrypt.compare.mockResolvedValue(true)
      JwtProvider.generateToken.mockResolvedValue('mock_token')
      Session.create.mockResolvedValue({})

      console.log('🧪 Test: signIn Decision - Success Flow 100% Coverage reached')
      const result = await authService.signIn(validBody)

      expect(result.status).toBe('success')
      expect(result.data.userInfo.username).toBe('testuser')
      expect(result.data.accessToken).toBe('mock_token')
      expect(Session.create).toHaveBeenCalled()
    })
  })

  // ─── 3️⃣ forgotPassword ─────────────────────────────────────────────────────
  describe('forgotPassword()', () => {
    const email = 'user@example.com'

    it('should throw "Email does not exist" if user not found', async () => {
      User.findOne.mockResolvedValue(null)

      console.log('🧪 Test: forgotPassword with non-existent email')
      await expect(authService.forgotPassword({ email })).rejects.toThrow('Email does not exist in our system.')
    })

    it('should throw "Too many requests" if rate limit > 5 (Decision: Rate limit exceeded)', async () => {
      User.findOne.mockResolvedValue({ email, _id: 'user123' })
      
      // Mock existing rate limit record with 5 attempts within 30 mins
      const mockRateLimit = {
        email,
        attempts: 5,
        firstAttemptAt: new Date(),
        blockedUntil: null,
        save: vi.fn()
      }
      ResetPasswordRateLimit.findOne.mockResolvedValue(mockRateLimit)

      console.log('🧪 Test: forgotPassword rate limit exceeded (6th attempt)')
      await expect(authService.forgotPassword({ email })).rejects.toThrow(/exceeded the limit of 5 requests/i)
      
      expect(mockRateLimit.attempts).toBe(6)
      expect(mockRateLimit.blockedUntil).toBeDefined()
      expect(mockRateLimit.save).toHaveBeenCalled()
    })

    it('should generate token and send email successfully (Success Flow)', async () => {
      User.findOne.mockResolvedValue({ email, _id: 'user123' })
      ResetPasswordRateLimit.findOne.mockResolvedValue(null) // First time
      ResetPasswordRateLimit.create.mockResolvedValue({})
      ResetPassword.deleteMany.mockResolvedValue({})
      ResetPassword.create.mockResolvedValue({})
      emailService.sendPasswordResetEmail.mockResolvedValue(true)

      console.log('🧪 Test: forgotPassword success')
      const result = await authService.forgotPassword({ email })

      expect(result).toEqual({ message: 'Password reset code sent to your email.' })
      expect(ResetPassword.create).toHaveBeenCalledWith(expect.objectContaining({
        email,
        token: expect.any(String)
      }))
      expect(emailService.sendPasswordResetEmail).toHaveBeenCalled()
    })

    it('should reset attempts if 30-minute window passed (Decision: Window expired)', async () => {
      User.findOne.mockResolvedValue({ email, _id: 'user123' })
      
      const oldDate = new Date(Date.now() - 40 * 60 * 1000) // 40 mins ago
      const mockRateLimit = {
        email,
        attempts: 3,
        firstAttemptAt: oldDate,
        blockedUntil: null,
        save: vi.fn()
      }
      ResetPasswordRateLimit.findOne.mockResolvedValue(mockRateLimit)
      emailService.sendPasswordResetEmail.mockResolvedValue(true)

      console.log('🧪 Test: forgotPassword window reset after 40 mins')
      await authService.forgotPassword({ email })

      expect(mockRateLimit.attempts).toBe(1) // Reset to 1
      expect(mockRateLimit.save).toHaveBeenCalled()
    })
  })

  // ─── 4️⃣ changePassword ───────────────────────────────────────────────────
  describe('changePassword()', () => {
    const userId = 'u123'
    const mockUser = { _id: userId, hashedPassword: 'old_hashed_password' }

    it('should throw error if input is missing (BVA)', async () => {
      console.log('🧪 Test: changePassword missing input')
      await expect(authService.changePassword(userId, { currentPassword: '', newPassword: '' }))
        .rejects.toThrow('Current and new password are required')
    })

    it('should throw error if new password is too short (BVA - under limit)', async () => {
      console.log('🧪 Test: changePassword BVA - password too short (length 5)')
      await expect(authService.changePassword(userId, { currentPassword: 'old', newPassword: '12345' }))
        .rejects.toThrow('New password must be at least 6 characters long')
    })

    it('should throw "Incorrect current password" if check fails (Decision)', async () => {
      User.findById.mockResolvedValue(mockUser)
      bcrypt.compare.mockResolvedValue(false)

      console.log('🧪 Test: changePassword Decision - incorrect current password')
      await expect(authService.changePassword(userId, { currentPassword: 'wrong', newPassword: 'newPassword123' }))
        .rejects.toThrow('Incorrect current password')
    })

    it('should succeed and clear sessions on valid input (Success Path)', async () => {
      User.findById.mockResolvedValue(mockUser)
      bcrypt.compare.mockResolvedValue(true)
      bcrypt.hash.mockResolvedValue('new_hashed')
      User.findByIdAndUpdate.mockResolvedValue({ ...mockUser, hashedPassword: 'new_hashed' })
      Session.deleteMany.mockResolvedValue({})

      console.log('🧪 Test: changePassword Success - Decision Coverage 100%')
      const result = await authService.changePassword(userId, { currentPassword: 'oldSecret', newPassword: 'verySecretNew123' })

      expect(result.message).toBe('Password changed successfully')
      expect(bcrypt.hash).toHaveBeenCalled()
      expect(Session.deleteMany).toHaveBeenCalled()
    })
  })
})
