import User from '../models/User.js'
import { verifyGoogleToken } from '../utils/google.js'
import {
  generateAccessToken,
  generateRefreshToken,
} from './token.service.js'

export const googleLoginService = async (googleToken, role) => {
  // verify token với google
  const payload = await verifyGoogleToken(googleToken)

  const {
    email,
    name,
    picture,
    sub: googleId,
  } = payload

  if (!email) throw new Error('Google account has no email')

  // tìm user theo email
  let user = await User.findOne({ email })

  // nếu chưa tồn tại → tạo user mới
  if (!user) {
    user = await User.create({
      username: email.split('@')[0],
      email,
      hashedPassword: 'GOOGLE_AUTH', // dummy value
      displayName: name,
      role, // role do frontend chọn
      avatarUrl: picture,
    })
  }

  // tạo token giống login thường
  const accessToken = generateAccessToken(user._id)
  const refreshToken = await generateRefreshToken(user._id)

  return { user, accessToken, refreshToken }
}