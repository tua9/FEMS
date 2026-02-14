import bcrypt from 'bcrypt'
import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import Session from '../models/Session.js'

const ACCESS_TOKEN_TTL = '30m' // 15minutes
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

export const signIn = async (req, res) => {
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
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL },
    )

    // Tao Refresh Token
    const refreshToken = crypto.randomBytes(64).toString('hex')

    // tao session
    await Session.create({
      userId: user._id,
      refreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
    })

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: REFRESH_TOKEN_TTL,
    })

    return res.status(200).json({
      message: `Sign in successful: User[${user.displayName}]`,
      accessToken,
    })
  } catch (error) {
    console.error('Error during sign in: ', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const signOut = async (req, res) => {
  console.log('signout')

  try {
    const token = req.cookies?.refreshToken
    console.log('Refresh Token: ', token)

    if (token) {
      await Session.deleteOne({ refreshToken: token })
      res.clearCookie('refreshToken')
    }
    return res.status(204).json({ message: 'Sign out successful' })
  } catch (error) {
    console.error('Error during call sign out: ', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
