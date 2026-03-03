import express from 'express'
import { createReport } from '../controllers/reportControllder.js'

const router = express.Router()

router.post('/', createReport)

export default router
