import express from 'express'
import {
    getLecturerStats,
    getLecturerActivities,
    getLecturerUsageStats,
} from '../controllers/dashboardController.js'
import { restrictTo, protectedRoute } from '../middlewares/authMiddlewares.js'

const router = express.Router()

router.use(protectedRoute)

router.get('/lecturer/stats', restrictTo('lecturer'), getLecturerStats)
router.get('/lecturer/activities', restrictTo('lecturer'), getLecturerActivities)
router.get('/lecturer/usage-stats', restrictTo('lecturer'), getLecturerUsageStats)

export default router
