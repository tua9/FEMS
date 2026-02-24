import bcrypt from 'bcrypt'
import User from '../models/User.js'
import Session from '../models/Session.js'
import { JwtProvider } from '../providers/JwtProvider.js'
import { env } from '../config/environment.js'
import ms from 'ms'

const ACCESS_TOKEN_TTL = '5s' // 15minutes
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000 // 7 days in milliseconds

// Unused function, just for testing
export const signUp = async (req, res) => {
  console.log('sign in')

  try {
    const { username, email, password, role, firstname, lastname } = req.body

    if (!username || !email || !password || !role || !firstname || !lastname) {
      return res.status(400).json({ message: 'All fields are required!' })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' })
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create a new user
    await User.create({
      username,
      email,
      hashedPassword,
      role,
      displayName: `${firstname} ${lastname}`,
    })

    res.status(204).json({ message: 'User created successfully' })
  } catch (error) {
    console.error('Error during sign up: ', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const signOut = async (req, res) => {
  console.log('Call: ⛳authController.js -> signOut()')

  try {
    const refreshToken = req.cookies?.refreshToken
    console.log('Signout delete Refresh Token: ', refreshToken)

    if (refreshToken) {
      await Session.deleteOne({ refreshToken })
      res.clearCookie('refreshToken')
      res.clearCookie('accessToken')
    }
    return res.status(204).json({ message: 'Sign out successful' })
  } catch (error) {
    console.error('Error during call sign out: ', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const signIn = async (req, res) => {
  console.log('Call: ⛳authController.js -> signIn()')

  try {
    const { username, password, role } = req.body

    if (!username || !password || !role) {
      return res
        .status(400)
        .json({ message: 'Username, password and role are required!' })
    }

    const user = await User.findOne({ username })
    if (!user) {
      return res.status(404).json({ message: 'Invalid username' })
    }

    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword)
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' })
    }

    if (user.role !== role) {
      return res
        .status(403)
        .json({ message: `User does not have the role: ${role}` })
    }

    // Tao Access Token

    const userInfo = { _id: user._id }

    const accessToken = await JwtProvider.generateToken(
      { userInfo },
      env.ACCESS_TOKEN_SECRET,
      ACCESS_TOKEN_TTL,
    )

    // Tao Refresh Token
    const refreshToken = await JwtProvider.generateToken(
      { userInfo },
      env.REFRESH_TOKEN_SECRET,
      REFRESH_TOKEN_TTL,
    )

    // tao session
    await Session.create({
      userId: user._id,
      refreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
    })

    // luu vao cookie
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days'),
    })

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days'),
    })

    return res.status(200).json({
      message: `Sign in successful: User[${user.displayName}]`,
      userInfo,
      accessToken,
      refreshToken,
    })
  } catch (error) {
    console.error('Error during sign in: ', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const refreshToken = async (req, res) => {
  console.log('>> Refresh Token called')

  try {
    const refreshToken = req.cookies?.refreshToken

    if (!refreshToken) {
      return res.status(401).json({
        message: 'Refresh token is required',
      })
    }

    const session = await Session.findOne({ refreshToken })

    if (!session) {
      return res.status(401).json({ message: 'Session not found' })
    }

    if (session.expiresAt < new Date()) {
      await Session.deleteOne({ _id: session._id }) // dọn rác
      return res.status(401).json({ message: 'Refresh token expired (DB)' })
    }

    let decoded
    try {
      decoded = await JwtProvider.verifyToken(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
      )
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          message: 'Refresh token expired',
        })
      }

      if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
          message: 'Invalid refresh token',
        })
      }

      throw err
    }

    const userInfo = { userInfo: decoded.userInfo }

    console.log('\n\nuserInfo = decoded: ', userInfo)

    const newAccessToken = await JwtProvider.generateToken(
      userInfo,
      process.env.ACCESS_TOKEN_SECRET,
      ACCESS_TOKEN_TTL,
    )

    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days'),
    })

    return res.status(200).json({
      accessToken: newAccessToken,
    })
  } catch (error) {
    console.error('Refresh token error:', error)
    return res.status(500).json({
      message: 'Internal server error',
    })
  }
}
