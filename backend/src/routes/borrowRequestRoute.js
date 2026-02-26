import express from 'express'
import { createBorrowRequest } from '../controllers/borrowRequestController.js'

const router = express.Router()

router.post('/', createBorrowRequest)

export default router
