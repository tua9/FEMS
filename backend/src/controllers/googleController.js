import { googleLoginService } from '../services/google.service.js'
import { REFRESH_TOKEN_TTL } from '../services/token.service.js'

export const googleLogin = async (req, res) => {
  try {
    const { googleToken, role } = req.body

    if (!googleToken || !role) {
      return res.status(400).json({ message: 'Missing googleToken or role' })
    }

    const { user, accessToken, refreshToken } =
      await googleLoginService(googleToken, role)

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: REFRESH_TOKEN_TTL,
    })

    res.status(200).json({
      message: `Google login success: ${user.displayName}`,
      accessToken,
    })
  } catch (e) {
    console.error('Google login error:', e)
    res.status(401).json({ message: e.message })
  }
}