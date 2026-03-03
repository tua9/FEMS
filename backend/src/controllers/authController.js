import ms from 'ms';
import { signInService, signOutService, signUpService } from '../services/authService.js';
import { googleLoginService } from '../services/googleAuthService.js';


export const signUp = async (req, res) => {
  try {
    const { username, password, email, displayName, role } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!username || !password || !email || !displayName || !role) {
      return res.status(400).json({ message: 'All fields are required!' });
    }

    // Gọi service đăng ký
    const result = await signUpService({ username, password, email, displayName, role });

    // Lưu token vào cookie
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days'),
    });

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days'),
    });

    // Trả về thông tin người dùng
    return res.status(201).json({
      message: `Sign up successful: User[${result.newUser.displayName}]`,
      userInfo: result.userInfo,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (error) {
    if (error.message === 'MISSING_FIELDS') return res.status(400).json({ message: 'Missing fields' });
    if (error.message === 'USER_EXISTS') return res.status(400).json({ message: 'User already exists' });

    console.error('Sign up error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const signIn = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    
    if (!username || !password || !role) {
      return res.status(400).json({ message: 'Username, password and role are required!' });
    }

    const result = await signInService(req.body);

    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days'),
    });

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days'),
    });

    return res.status(200).json({
      message: `Sign in successful: User[${result.user.displayName}]`,
      userInfo: result.userInfo,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (error) {
    if (error.message === 'MISSING_FIELDS') return res.status(400).json({ message: 'Missing fields' });
    if (error.message === 'INVALID_USERNAME') return res.status(404).json({ message: 'Invalid username' });
    if (error.message === 'INVALID_PASSWORD') return res.status(401).json({ message: 'Invalid password' });
    if (error.message === 'INVALID_ROLE') return res.status(403).json({ message: 'Invalid role' });

    console.error('Sign in error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { idToken, role } = req.body;

    if (!idToken || !role) {
      return res.status(400).json({ message: 'ID token and role are required' });
    }

    // Gọi service đăng nhập Google
    const result = await googleLoginService(idToken, role);

    // Lưu các token vào cookie
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 15 * 60 * 1000, // 15 phút
    });

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 14 * 24 * 60 * 60 * 1000, // 14 ngày
    });

    return res.status(200).json({
      message: `Google login success: ${result.user.displayName}`,
      userInfo: {
        id: result.user._id,
        email: result.user.email,
        role: result.user.role,
      },
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (error) {
    console.error('Google login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const signOut = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    await signOutService(refreshToken);

    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');

    return res.status(204).json({ message: 'Sign out successful' });
  } catch (error) {
    console.error('Sign out error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};