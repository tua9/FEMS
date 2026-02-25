// controllers/authController.js
import ms from 'ms'
import {
  signInService,
  refreshTokenService,
  signOutService,
} from '../services/authService.js'

export const signIn = async (req, res) => {
  try {
    const result = await signInService(req.body)

    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days'),
    })

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days'),
    })

    return res.status(200).json({
      message: `Sign in successful: User[${result.user.displayName}]`,
      userInfo: result.userInfo,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    })
  } catch (error) {
    if (error.message === 'MISSING_FIELDS')
      return res.status(400).json({ message: 'Missing fields' })

    if (error.message === 'INVALID_USERNAME')
      return res.status(404).json({ message: 'Invalid username' })

    if (error.message === 'INVALID_PASSWORD')
      return res.status(401).json({ message: 'Invalid password' })

    if (error.message === 'INVALID_ROLE')
      return res.status(403).json({ message: 'Invalid role' })

    console.error('Sign in error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken
    const result = await refreshTokenService(token)

    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days'),
    })

    return res.status(200).json({
      accessToken: result.accessToken,
    })
  } catch (error) {
    if (error.message === 'NO_REFRESH_TOKEN')
      return res.status(401).json({ message: 'Refresh token required' })

    if (error.message === 'INVALID_SESSION')
      return res.status(401).json({ message: 'Invalid session' })

    if (
      error.message === 'TOKEN_EXPIRED' ||
      error.message === 'TOKEN_EXPIRED_DB'
    )
      return res.status(401).json({ message: 'Refresh token expired' })

    if (error.message === 'INVALID_TOKEN')
      return res.status(401).json({ message: 'Invalid refresh token' })

    console.error('Refresh token error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const signOut = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken
    await signOutService(refreshToken)

    res.clearCookie('refreshToken')
    res.clearCookie('accessToken')

    return res.status(204).json({ message: 'Sign out successful' })
  } catch (error) {
    console.error('Sign out error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const googleLogin = async (req, res) => {
  try {
    const { idToken, role } = req.body

    const result = await googleLoginService({ idToken, role })

    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days'),
    })

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days'),
    })

    return res.status(200).json({
      message: `Google login success: ${result.user.email}`,
      userInfo: result.userInfo,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    })
  } catch (error) {
    if (error.message === 'INVALID_GOOGLE_TOKEN')
      return res.status(401).json({ message: 'Invalid Google token' })

    if (error.message === 'EMAIL_NOT_REGISTERED')
      return res.status(403).json({ message: 'Account not allowed' })

    if (error.message === 'INVALID_ROLE')
      return res.status(403).json({ message: 'Invalid role' })

    console.error('Google login error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}