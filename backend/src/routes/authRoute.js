import express from 'express'
import {
  signIn,
  signOut,
  signUp,
  refreshToken,
  forgotPassword,
  verifyResetToken,
  resetPassword,
  changePassword,
} from '../controllers/authController.js'
import { getUserProfile, updateOwnProfile } from '../controllers/userController.js'
import { protectedRoute } from '../middlewares/authMiddlewares.js'

const router = express.Router()

router.post('/signup', signUp)
router.post('/signin', signIn)
router.post('/logout', signOut)
router.post('/refresh-token', refreshToken)
router.post('/forgot-password', forgotPassword)
router.post('/verify-reset-token', verifyResetToken)
router.post('/reset-password', resetPassword)
router.post('/change-password', protectedRoute, changePassword)
router.get('/me', protectedRoute, getUserProfile)
router.patch('/profile', protectedRoute, updateOwnProfile)

export default router
