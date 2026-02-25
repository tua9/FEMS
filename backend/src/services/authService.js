import User from '../models/User.js'
import { hashPassword, comparePassword } from '../utils/password.js'
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  removeRefreshToken,
} from './tokenService.js'

export const signUpService = async (data) => {
  const { username, email, password, role, firstname, lastname } = data

  if (!username || !email || !password || !role || !firstname || !lastname) {
    throw new Error('All fields are required')
  }

  const existingUser = await User.findOne({ email })
  if (existingUser) throw new Error('User already exists')

  const hashedPassword = await hashPassword(password)

  await User.create({
    username,
    email,
    hashedPassword,
    role,
    displayName: `${firstname} ${lastname}`,
  })
}

export const signInService = async ({ username, password, role }) => {
  const user = await User.findOne({ username })
  if (!user) throw new Error('Invalid username')

  const valid = await comparePassword(password, user.hashedPassword)
  if (!valid) throw new Error('Invalid password')

  if (user.role !== role) {
    throw new Error(`User does not have role: ${role}`)
  }

  const accessToken = generateAccessToken(user._id)
  const refreshToken = await generateRefreshToken(user._id)

  return { user, accessToken, refreshToken }
}

export const signOutService = async (refreshToken) => {
  if (refreshToken) {
    await removeRefreshToken(refreshToken)
  }
}

export const refreshTokenService = async (refreshToken) => {
  const session = await verifyRefreshToken(refreshToken)
  if (!session) throw new Error('Invalid or expired refresh token')

  const newAccessToken = generateAccessToken(session.userId)
  return newAccessToken
}