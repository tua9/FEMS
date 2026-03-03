import bcrypt from 'bcrypt';
import User from '../models/User.js';
import Session from '../models/Session.js';
import { JwtProvider } from '../providers/JwtProvider.js';
import { env } from '../config/environment.js';


const ACCESS_TOKEN_TTL = '5s';
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000;


export const signUpService = async ({ username, password, email, displayName, role }) => {
  if (!username || !password || !email || !displayName || !role) {
    throw new Error('MISSING_FIELDS');
  }

  // Kiểm tra xem người dùng đã tồn tại chưa
  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) throw new Error('USER_EXISTS');

  // Mã hóa mật khẩu
  const hashedPassword = await bcrypt.hash(password, 10);

  // Tạo người dùng mới
  const newUser = new User({
    username,
    email,
    hashedPassword,
    displayName,
    role,
  });

  await newUser.save();

  const userInfo = { _id: newUser._id };

  const accessToken = await JwtProvider.generateToken(
    { userInfo },
    env.ACCESS_TOKEN_SECRET,
    ACCESS_TOKEN_TTL
  );

  const refreshToken = await JwtProvider.generateToken(
    { userInfo },
    env.REFRESH_TOKEN_SECRET,
    REFRESH_TOKEN_TTL
  );

  await Session.create({
    userId: newUser._id,
    refreshToken,
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
  });

  return { newUser, userInfo, accessToken, refreshToken };
};

export const signInService = async ({ username, password, role }) => {
  if (!username || !password || !role) throw new Error('MISSING_FIELDS');

  const user = await User.findOne({ username });
  if (!user) throw new Error('INVALID_USERNAME');

  const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
  if (!isPasswordValid) throw new Error('INVALID_PASSWORD');

  if (user.role !== role) throw new Error('INVALID_ROLE');

  const userInfo = { _id: user._id };

  const accessToken = await JwtProvider.generateToken(
    { userInfo },
    env.ACCESS_TOKEN_SECRET,
    ACCESS_TOKEN_TTL
  );

  const refreshToken = await JwtProvider.generateToken(
    { userInfo },
    env.REFRESH_TOKEN_SECRET,
    REFRESH_TOKEN_TTL
  );

  await Session.create({
    userId: user._id,
    refreshToken,
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
  });

  return { user, userInfo, accessToken, refreshToken };
};



export const signOutService = async (refreshToken) => {
  if (refreshToken) {
    await Session.deleteOne({ refreshToken });
  }
};