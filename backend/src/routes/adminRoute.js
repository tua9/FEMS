import express from 'express'
import {
  getDashboardStats,
  getDashboardChart,
} from '../controllers/adminController.js'
import { protectedRoute, restrictTo } from '../middlewares/authMiddlewares.js'

const router = express.Router()

router.use(protectedRoute, restrictTo('Admin'))
router.get('/dashboard/stats', getDashboardStats)
router.get('/dashboard/chart', getDashboardChart)

export default router
