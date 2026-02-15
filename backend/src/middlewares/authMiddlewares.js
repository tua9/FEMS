import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// authorization
export const protectedRoute = async (req, res, next) => {
  console.log('Call: authMiddlewares.js -> protectedRoute()')

  try {
    // Get Access Token from cookies
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) {
      return res.status(401).json({ message: 'Access token is missing' })
    }

    // Verify Accress Token
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, decodedUser) => {
        if (err) {
          console.error('Error Verify Accress Token: ' + err)

          return res.status(403).json({ message: 'Invalid access token' })
        }

        // Find user by Id
        const user = await User.findById(decodedUser.userId).select(
          '-hashedPassword',
        )

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
