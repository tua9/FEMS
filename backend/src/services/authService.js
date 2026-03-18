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

const ACCESS_TOKEN_TTL = '15m'
const REFRESH_TOKEN_TTL_MS = 14 * 24 * 60 * 60 * 1000 // 14 days

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
  const { username, password } = body

  if (!username || !password) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Username and password are required!',
    )
  }

  const user = await User.findOne({
    $or: [{ username }, { email: username }]
  })
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Invalid username or email')
  }

  if (user.isActive === false) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Your account is deactivated. Please contact admin.')
  }

  const isPasswordValid = await bcrypt.compare(password, user.hashedPassword)
  if (!isPasswordValid) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid password')
  }

  const userInfo = {
    _id: user._id,
    username: user.username,
    role: user.role,
  }

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

  await Session.create({
    userId: user._id,
    refreshToken,
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
  })

  return {
    userInfo,
    accessToken,
    refreshToken,
    displayName: user.displayName,
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

  // Generate 6-digit token
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

export const authService = {
  signUp,
  signIn,
  signOut,
  refreshToken,
  forgotPassword,
  verifyResetToken,
  resetPassword,
  changePassword,
}
