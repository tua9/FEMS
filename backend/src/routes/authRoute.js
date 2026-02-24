import express from 'express'
import {
  refreshToken,
  signIn,
  signOut,
  signUp,
} from '../controllers/authController.js'

const router = express.Router()

router.post('/signup', signUp)
router.post('/signin', signIn)
router.delete('/signout', signOut)
router.post('/refresh-token', refreshToken)

export default router
