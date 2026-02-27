import express from 'express'
import {
  signIn,
  signOut,
  refreshToken,
} from '../controllers/authController.js'

const router = express.Router()

router.post('/signin', signIn)
router.delete('/signout', signOut)
router.post('/refresh-token', refreshToken)

export default router