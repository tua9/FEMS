import express from 'express'
import { authUser, test } from '../controllers/userController.js'

const router = express.Router()

router.get('/profile', authUser)

export default router
