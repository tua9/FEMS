import jwt from 'jsonwebtoken';
import { JwtProvider } from '../providers/JwtProvider.js'; // Nếu bạn có provider để tạo token
import { env } from '../config/environment.js';
import Session from '../models/Session.js';
import ms from 'ms';

// Hàm tạo AccessToken mới từ refresh token
export const refreshTokenService = async (refreshToken) => {
  try {
    // Kiểm tra refresh token trong cơ sở dữ liệu
    const session = await Session.findOne({ refreshToken });
    
    if (!session) {
      throw new Error('Session not found');
    }

    // Kiểm tra thời gian hết hạn của refresh token
    if (session.expiresAt < new Date()) {
      await Session.deleteOne({ _id: session._id }); // Dọn rác nếu token đã hết hạn
      throw new Error('Refresh token expired');
    }

    // Giải mã refresh token để lấy thông tin người dùng
    const decoded = jwt.decode(refreshToken);
    const { userInfo } = decoded;

    // Tạo mới AccessToken từ thông tin người dùng
    const newAccessToken = await JwtProvider.generateToken(
      { userInfo },
      env.ACCESS_TOKEN_SECRET,
      '15m' // 15 phút
    );

    return { accessToken: newAccessToken };
  } catch (error) {
    throw new Error('Error refreshing token');
  }
};