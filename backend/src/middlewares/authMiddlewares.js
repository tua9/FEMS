import { StatusCodes } from 'http-status-codes'
import User from '../models/User.js'
import { JwtProvider } from '../providers/JwtProvider.js'
import { env } from '../config/environment.js'

export const protectedRoute = async (req, res, next) => {
  try {
    const accessToken = req.cookies?.accessToken

    if (!accessToken) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: 'No access token provided',
      })
    }

    try {
      const decodedUser = await JwtProvider.verifyToken(
        accessToken,
        env.ACCESS_TOKEN_SECRET,
      )

      const user = await User.findById(decodedUser.userInfo._id)
      if (!user) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          message: 'User not found',
        })
      }

      req.user = user
      next()
    } catch (err) {
      console.error('>> [protectedRoute] JWT Error:', err.message)
      if (err.name === 'TokenExpiredError' || err.message.includes('expired')) {
        return res
          .status(410)
          .json({ message: 'Need to refresh Access Token' })
      }
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: 'Invalid access token' })
    }
  } catch (error) {
    console.error('>> [protectedRoute] 500 Error:', error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Internal server error' })
  }
}

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: 'You do not have permission to perform this action',
      })
    }
    next()
  }
}

export const optionalAuth = async (req, res, next) => {
  try {
    const accessToken = req.cookies?.accessToken
    if (!accessToken) {
      return next()
    }

    const decodedUser = await JwtProvider.verifyToken(
      accessToken,
      env.ACCESS_TOKEN_SECRET,
    )

    const user = await User.findById(decodedUser.userInfo._id)
    if (user) {
      req.user = user
    }
    next()
  } catch (error) {
    next()
  }
}
