import express from 'express'


const router = express.Router()

router.post('/google-login', authController.googleLogin)

export default router