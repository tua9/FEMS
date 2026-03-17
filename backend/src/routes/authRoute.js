import express from 'express'
import {
  signIn,
  signOut,
  signUp,
  refreshToken,
} from '../controllers/authController.js'
import { getUserProfile, updateOwnProfile } from '../controllers/userController.js'
import { protectedRoute } from '../middlewares/authMiddlewares.js'

const router = express.Router()

router.post('/signup', signUp)
router.post('/signin', signIn)
router.post('/logout', signOut)
router.post('/refresh-token', refreshToken)
router.get('/me', protectedRoute, getUserProfile)
router.patch('/profile', protectedRoute, updateOwnProfile)

export default router
