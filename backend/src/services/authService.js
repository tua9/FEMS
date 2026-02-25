// services/authService.js
import bcrypt from 'bcrypt'
import User from '../models/User.js'
import Session from '../models/Session.js'
import { JwtProvider } from '../providers/JwtProvider.js'
import { env } from '../config/environment.js'

const ACCESS_TOKEN_TTL = '5s'
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000

export const signInService = async ({ username, password, role }) => {
  if (!username || !password || !role) throw new Error('MISSING_FIELDS')

  const user = await User.findOne({ username })
  if (!user) throw new Error('INVALID_USERNAME')

  const isPasswordValid = await bcrypt.compare(password, user.hashedPassword)
  if (!isPasswordValid) throw new Error('INVALID_PASSWORD')

  if (user.role !== role) throw new Error('INVALID_ROLE')

  const userInfo = { _id: user._id }

  const accessToken = await JwtProvider.generateToken(
    { userInfo },
    env.ACCESS_TOKEN_SECRET,
    ACCESS_TOKEN_TTL,
  )

  const refreshToken = await JwtProvider.generateToken(
    { userInfo },
    env.REFRESH_TOKEN_SECRET,
    REFRESH_TOKEN_TTL,
  )

  await Session.create({
    userId: user._id,
    refreshToken,
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
  })

  return { user, userInfo, accessToken, refreshToken }
}

export const refreshTokenService = async (refreshToken) => {
  if (!refreshToken) throw new Error('NO_REFRESH_TOKEN')

  const session = await Session.findOne({ refreshToken })
  if (!session) throw new Error('INVALID_SESSION')

  if (session.expiresAt < new Date()) {
    await Session.deleteOne({ _id: session._id })
    throw new Error('TOKEN_EXPIRED_DB')
  }

  let decoded
  try {
    decoded = await JwtProvider.verifyToken(
      refreshToken,
      env.REFRESH_TOKEN_SECRET,
    )
  } catch (err) {
    if (err.name === 'TokenExpiredError') throw new Error('TOKEN_EXPIRED')
    if (err.name === 'JsonWebTokenError') throw new Error('INVALID_TOKEN')
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

export const signOutService = async (refreshToken) => {
  if (refreshToken) {
    await Session.deleteOne({ refreshToken })
  }
}