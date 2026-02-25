import {
  signUpService,
  signInService,
  signOutService,
  refreshTokenService,
} from '../services/authService.js'
import { REFRESH_TOKEN_TTL } from '../services/tokenService.js'

export const signUp = async (req, res) => {
  try {
    await signUpService(req.body)
    res.status(201).json({ message: 'User created successfully' })
  } catch (e) {
    res.status(400).json({ message: e.message })
  }
}

export const signIn = async (req, res) => {
  try {
    const { accessToken, refreshToken, user } = await signInService(req.body)

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: REFRESH_TOKEN_TTL,
    })

    res.status(200).json({
      message: `Sign in successful: ${user.displayName}`,
      accessToken,
    })
  } catch (e) {
    res.status(401).json({ message: e.message })
  }
}

export const signOut = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken
    await signOutService(token)
    res.clearCookie('refreshToken')
    res.status(204).send()
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}

export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken
    if (!token) return res.status(401).json({ message: 'Missing refresh token' })

    const newAccessToken = await refreshTokenService(token)
    res.status(200).json({ accessToken: newAccessToken })
  } catch (e) {
    res.status(403).json({ message: e.message })
  }
}