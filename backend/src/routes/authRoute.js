import express from 'express'
import {
  signIn,
  signOut,
  refreshToken,
  googleLogin
  ,signUp
} from '../controllers/authController.js'

const router = express.Router()


router.post('/google-login', googleLogin)
router.post('/signup', signUp)
router.post('/signin', signIn)
router.delete('/signout', signOut)
router.post('/refresh-token', refreshToken)

export default router