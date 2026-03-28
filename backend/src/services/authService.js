import bcrypt from 'bcrypt'
import ms from 'ms'
import { StatusCodes } from 'http-status-codes'
import User from '../models/User.js'
import Session from '../models/Session.js'
import { JwtProvider } from '../providers/JwtProvider.js'
import { env } from '../config/environment.js'
import ApiError from '../utils/ApiError.js'
import crypto from 'crypto'
import { emailService } from './emailService.js'
import ResetPassword from '../models/ResetPassword.js'
import ResetPasswordRateLimit from '../models/ResetPasswordRateLimit.js'
import { z } from 'zod'

const ACCESS_TOKEN_TTL = '15m'
const REFRESH_TOKEN_TTL_MS = 14 * 24 * 60 * 60 * 1000 // 14 days

// ─── Helpers for Modular Auth ───────────────────────────────────────────────

/**
 * Generates both Access and Refresh tokens for a user
 * @param {Object} userInfo - Information to be encoded in tokens
 */
const generateTokens = async (userInfo) => {
  const accessToken = await JwtProvider.generateToken(
    { userInfo },
    env.ACCESS_TOKEN_SECRET,
    ACCESS_TOKEN_TTL,
  )

  const refreshToken = await JwtProvider.generateToken(
    { userInfo },
    env.REFRESH_TOKEN_SECRET,
    REFRESH_TOKEN_TTL_MS + 'ms',
  )

  return { accessToken, refreshToken }
}

/**
 * Persists a new session to the database
 * @param {string} userId - User ID
 * @param {string} refreshToken - Generated refresh token
 */
const createSession = async (userId, refreshToken) => {
  return await Session.create({
    userId,
    refreshToken,
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
  })
}

// ─── Input Validation Schemas ────────────────────────────────────────────────

const signInSchema = z.object({
  username: z.string().min(1, 'Username or Email is required'),
  password: z.string().min(1, 'Password is required'),
})

// ─── Main Auth Services ──────────────────────────────────────────────────────

const signUp = async (body) => {
  const { username, email, password, role, firstname, lastname } = body

  if (!username || !email || !password || !role || !firstname || !lastname) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'All fields are required!')
  }

  const existingUser = await User.findOne({ email })
  if (existingUser) {
    throw new ApiError(StatusCodes.CONFLICT, 'User already exists')
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  await User.create({
    username,
    email,
    hashedPassword,
    role,
    displayName: `${firstname} ${lastname}`,
  })

  return { message: 'User created successfully' }
}

const signIn = async (body) => {
  // 1. Validation
  const validation = signInSchema.safeParse(body)
  if (!validation.success) {
    const errorMessage = validation.error.issues?.[0]?.message || 'Invalid input'
    console.warn(`[AUTH] Login Attempt: INVALID_INPUT. Error: ${errorMessage}`)
    throw new ApiError(StatusCodes.BAD_REQUEST, errorMessage)
  }

  const { username, password } = validation.data

  console.log(`[AUTH] Login Attempt: ${username}`)

  // 2. Find User (Username or Email)
  const user = await User.findOne({
    $or: [{ username }, { email: username }]
  })

  // 3. Guards
  if (!user) {
    console.error(`[AUTH] Login Fail: USER_NOT_FOUND - ${username}`)
    throw new ApiError(StatusCodes.NOT_FOUND, 'Invalid username or email')
  }

  if (user.isActive === false) {
    console.error(`[AUTH] Login Fail: USER_INACTIVE - ${username}`)
    throw new ApiError(StatusCodes.FORBIDDEN, 'Your account is deactivated. Please contact admin.')
  }

  // 4. Verify Password
  const isPasswordValid = await bcrypt.compare(password, user.hashedPassword)
  if (!isPasswordValid) {
    console.error(`[AUTH] Login Fail: INVALID_PASSWORD - ${username}`)
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid password')
  }

  // 5. Success Flow: Tokens & Session
  const userInfo = {
    _id: user._id,
    username: user.username,
    role: user.role,
  }

  const { accessToken, refreshToken } = await generateTokens(userInfo)
  await createSession(user._id, refreshToken)

  console.log(`[AUTH] Login Success: ${username} (Role: ${user.role})`)

  // 6. Standardized Output
  return {
    status: 'success',
    data: {
      userInfo,
      accessToken,
      refreshToken,
      displayName: user.displayName,
    }
  }
}

const signOut = async (refreshToken) => {
  if (refreshToken) {
    await Session.deleteOne({ refreshToken })
  }
  return { message: 'Sign out successful' }
}

const refreshToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Refresh token is required')
  }

  const session = await Session.findOne({ refreshToken })
  if (!session) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Session not found')
  }

  if (session.expiresAt < new Date()) {
    await Session.deleteOne({ _id: session._id })
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Refresh token expired (DB)')
  }

  let decoded
  try {
    decoded = await JwtProvider.verifyToken(
      refreshToken,
      env.REFRESH_TOKEN_SECRET,
    )
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Refresh token expired')
    }
    if (err.name === 'JsonWebTokenError') {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid refresh token')
    }
    throw err
  }

  const userInfo = { userInfo: decoded.userInfo }

  const newAccessToken = await JwtProvider.generateToken(
    userInfo,
    env.ACCESS_TOKEN_SECRET,
    ACCESS_TOKEN_TTL,
  )

  return { accessToken: newAccessToken }
}

const forgotPassword = async ({ email }) => {
  if (!email) throw new ApiError(StatusCodes.BAD_REQUEST, 'Email is required')

  const user = await User.findOne({ email })
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Email does not exist in our system.')
  }

  // 1. Rate Limiting Check
  let rateLimit = await ResetPasswordRateLimit.findOne({ email: user.email })
  const now = new Date()

  if (rateLimit) {
    // Check if currently blocked
    if (rateLimit.blockedUntil && rateLimit.blockedUntil > now) {
      const waitMinutes = Math.ceil((rateLimit.blockedUntil - now) / (60 * 1000))
      throw new ApiError(
        StatusCodes.TOO_MANY_REQUESTS,
        `Too many requests. Please try again after ${waitMinutes} minutes.`
      )
    }

    // Check if 30-min window has expired
    const windowStart = new Date(rateLimit.firstAttemptAt.getTime() + 30 * 60 * 1000)
    if (now > windowStart) {
      // Reset window
      rateLimit.attempts = 1
      rateLimit.firstAttemptAt = now
      rateLimit.blockedUntil = null
    } else {
      // Within window
      rateLimit.attempts += 1
      if (rateLimit.attempts > 5) {
        rateLimit.blockedUntil = new Date(now.getTime() + 60 * 60 * 1000) // Block for 1 hour
        await rateLimit.save()
        throw new ApiError(
          StatusCodes.TOO_MANY_REQUESTS,
          'You have exceeded the limit of 5 requests per 30 minutes. Please try again after 1 hour.'
        )
      }
    }
    await rateLimit.save()
  } else {
    // Create first record
    await ResetPasswordRateLimit.create({
      email: user.email,
      attempts: 1,
      firstAttemptAt: now
    })
  }

  // 2. Generate 6-digit token
  const token = crypto.randomInt(100000, 999999).toString()
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes

  // Clear previous tokens
  await ResetPassword.deleteMany({ userId: user._id })
  
  // Save new token
  await ResetPassword.create({
    userId: user._id,
    email: user.email,
    token,
    expiresAt,
  })

  // Send email
  const emailSent = await emailService.sendPasswordResetEmail(user.email, token)
  if (!emailSent) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to send password reset email. Check server configuration.')
  }

  return { message: 'Password reset code sent to your email.' }
}

const verifyResetToken = async ({ email, token }) => {
  if (!email || !token) throw new ApiError(StatusCodes.BAD_REQUEST, 'Email and token are required')

  const resetRecord = await ResetPassword.findOne({ 
    email,
    token,
    expiresAt: { $gt: new Date() } // Token must not be expired
  })

  if (!resetRecord) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid or expired token')
  }

  return { message: 'Token is valid' }
}

const resetPassword = async ({ email, token, newPassword }) => {
  if (!email || !token || !newPassword) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'All fields are required')
  }

  const resetRecord = await ResetPassword.findOne({ 
    email,
    token,
    expiresAt: { $gt: new Date() }
  })

  if (!resetRecord) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid or expired token')
  }

  if (resetRecord.usageCount >= 1) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'This token has already been used.')
  }

  // Mark token as used to strictly enforce single use
  resetRecord.usageCount += 1
  await resetRecord.save()

  const user = await User.findById(resetRecord.userId)
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10)
  
  // Force strict overwrite directly on document and fetch new state
  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    { hashedPassword },
    { new: true, runValidators: true }
  )

  if (!updatedUser) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to properly overwrite the password in the database.')
  }

  // Security measure: Destroy all active login sessions for this specific user
  await Session.deleteMany({ userId: user._id })
  
  // Clean up tokens
  await ResetPassword.deleteMany({ userId: user._id })

  return { message: 'Password has been reset successfully' }
}

const changePassword = async (userId, { currentPassword, newPassword }) => {
  if (!currentPassword || !newPassword) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Current and new password are required')
  }

  if (newPassword.length < 6) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'New password must be at least 6 characters long')
  }

  const user = await User.findById(userId)
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
  }

  const isPasswordValid = await bcrypt.compare(currentPassword, user.hashedPassword)
  if (!isPasswordValid) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Incorrect current password')
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10)
  
  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    { hashedPassword },
    { new: true, runValidators: true }
  )

  if (!updatedUser) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to properly overwrite the password in the database.')
  }

  // Destroy sessions so old devices are forcibly logged out
  await Session.deleteMany({ userId: user._id })

  return { message: 'Password changed successfully' }
}

const signInWithGoogle = async ({ accessToken }) => {
  if (!accessToken) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Google access token is required')
  }

  // 1. Verify token & get user info from Google
  let googlePayload
  try {
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v3/userinfo`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    if (!response.ok) throw new Error('Google token invalid')
    googlePayload = await response.json()
  } catch {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid Google access token')
  }

  const { sub: googleId, email, name, picture } = googlePayload

  console.log(`[AUTH] Google Login Attempt: ${email}`)

  // 2. Find existing user by email
  const user = await User.findOne({ email })
  if (!user) {
    console.error(`[AUTH] Google Login Fail: USER_NOT_FOUND - ${email}`)
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'This Google account is not registered in the system. Please contact admin.'
    )
  }

  // 3. Guard: inactive account
  if (user.isActive === false) {
    console.error(`[AUTH] Google Login Fail: USER_INACTIVE - ${email}`)
    throw new ApiError(StatusCodes.FORBIDDEN, 'Your account is deactivated. Please contact admin.')
  }

  // 4. Link googleId on first Google login
  if (!user.googleId) {
    user.googleId = googleId
    if (!user.avatarUrl && picture) {
      user.avatarUrl = picture
    }
    await user.save()
  }

  // 5. Success Flow: same as normal signIn
  const userInfo = {
    _id: user._id,
    username: user.username,
    role: user.role,
  }

  const { accessToken: femsAccessToken, refreshToken: femsRefreshToken } = await generateTokens(userInfo)
  await createSession(user._id, femsRefreshToken)

  console.log(`[AUTH] Google Login Success: ${email} (Role: ${user.role})`)

  return {
    status: 'success',
    data: {
      userInfo,
      accessToken: femsAccessToken,
      refreshToken: femsRefreshToken,
      displayName: user.displayName,
    }
  }
}

export const authService = {
  signUp,
  signIn,
  signInWithGoogle,
  signOut,
  refreshToken,
  forgotPassword,
  verifyResetToken,
  resetPassword,
  changePassword,
  generateTokens, // Export for testing
  createSession,  // Export for testing
}
