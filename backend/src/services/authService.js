import bcrypt from 'bcrypt'
import ms from 'ms'
import { StatusCodes } from 'http-status-codes'
import User from '../models/User.js'
import Session from '../models/Session.js'
import { JwtProvider } from '../providers/JwtProvider.js'
import { env } from '../config/environment.js'
import ApiError from '../utils/ApiError.js'

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

  const user = await User.findOne({ username })
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Invalid username')
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

export const authService = {
  signUp,
  signIn,
  signOut,
  refreshToken,
}
