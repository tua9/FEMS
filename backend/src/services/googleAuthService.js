import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import { JwtProvider } from '../providers/JwtProvider.js';
import { env } from '../config/environment.js';
import Session from '../models/Session.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const verifyGoogleToken = async (idToken) => {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID, // Đảm bảo token được gửi từ đúng ứng dụng của bạn
  });
  const payload = ticket.getPayload();
  return payload; // Trả về thông tin người dùng từ token
};

export const googleLoginService = async (idToken, role) => {
  if (!idToken || !role) throw new Error('MISSING_FIELDS'); // Kiểm tra các trường bắt buộc

  let payload;
  try {
    payload = await verifyGoogleToken(idToken); // Xác minh token Google
  } catch (e) {
    throw new Error('INVALID_GOOGLE_TOKEN');
  }

  const { email, name } = payload; // Lấy email và tên người dùng từ payload

  // Kiểm tra xem người dùng có trong hệ thống không
  let user = await User.findOne({ email });

  // Nếu người dùng chưa có, tạo tài khoản mới
  if (!user) {
    user = new User({
      email,
      displayName: name,
      role: 'user', // Vai trò mặc định là user
    });
    await user.save();
  }

  // Tạo JWT token cho người dùng đã đăng nhập
  const userPayload = {
    id: user._id,
    role: user.role,
    email: user.email,
  };

  const accessToken = await JwtProvider.generateToken(
    { userInfo: userPayload },
    env.ACCESS_TOKEN_SECRET,
    '15m' // Token sẽ hết hạn sau 15 phút
  );

  const refreshToken = await JwtProvider.generateToken(
    { userInfo: userPayload },
    env.REFRESH_TOKEN_SECRET,
    '14d' // Refresh token sẽ hết hạn sau 14 ngày
  );

  // Tạo session cho người dùng
  await Session.create({
    userId: user._id,
    refreshToken,
    expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // Session hết hạn sau 14 ngày
  });

  return {
    user,
    accessToken,
    refreshToken,
  };
};