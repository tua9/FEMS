import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import Session from '../models/Session.js'

const ACCESS_TOKEN_TTL = '15m'
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000 // 14 days

export const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_TTL,
  })
}

export const generateRefreshToken = async (userId) => {
  const refreshToken = crypto.randomBytes(64).toString('hex')

  await Session.create({
    userId,
    refreshToken,
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
  })

  return refreshToken
}

export const verifyRefreshToken = async (token) => {
  const session = await Session.findOne({ refreshToken: token })
  if (!session) return null
  if (session.expiresAt < new Date()) return null
  return session
}

export const removeRefreshToken = async (token) => {
  await Session.deleteOne({ refreshToken: token })
}

export { REFRESH_TOKEN_TTL }