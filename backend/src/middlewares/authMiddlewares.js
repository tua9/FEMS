import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const protectedRoute = async (req, res, next) => {
  try {
    const accessToken = req.cookies?.accessToken

    if (!accessToken) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: 'Not authorized' })
    }

    jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, decodedUser) => {
        if (err) {
          if (err.name === 'TokenExpiredError') {
            return res
              .status(410)
              .json({ message: 'Need to refresh Access Token' })
          }
          return res
            .status(StatusCodes.FORBIDDEN)
            .json({ message: 'Invalid access token' })
        }

        const user = await User.findById(decodedUser.userInfo._id)
        if (!user) {
          return res
            .status(StatusCodes.NOT_FOUND)
            .json({ message: 'User not found' })
        }

        req.user = user
        next()
      },
    )
  } catch (error) {
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

    jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, decodedUser) => {
        if (err) {
          return next()
        }

        const user = await User.findById(decodedUser.userInfo._id)
        if (user) {
          req.user = user
        }
        next()
      },
    )
  } catch (error) {
    next()
  }
}
