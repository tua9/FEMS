import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// authorization
export const protectedRoute = async (req, res, next) => {
  console.log('Call: authMiddlewares.js -> protectedRoute()')

  try {
    // Verify Accress Token
    const accessToken = req.cookies?.accessToken

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

          return res.status(403).json({ message: 'Invalid access token' })
        }

        const user = await User.findById(decodedUser.userInfo._id)
        if (!user) {
          return res.status(404).json({ message: 'User not found' })
        }
        // return user info to req.user
        req.user = user
        next()
      },
    )
  } catch (error) {
    console.error('Error during authentication JWT in middleware: ', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
