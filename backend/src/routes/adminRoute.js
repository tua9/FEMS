import express from 'express'
import {
  getDashboardStats,
  getDashboardChart,
  getHealthStatus,
  getRecentBorrowRequests,
  getRecentDamageReports,
  getEquipmentAnalytics,
  getReportAnalytics,
  getTechnicianPerformance,
  getActiveBorrowing,
} from '../controllers/adminController.js'
import { protectedRoute, restrictTo } from '../middlewares/authMiddlewares.js'

const router = express.Router()

router.use(protectedRoute, restrictTo('admin'))
router.get('/dashboard/stats', getDashboardStats)
router.get('/dashboard/chart', getDashboardChart)
router.get('/dashboard/health', getHealthStatus)
router.get('/dashboard/borrow-requests', getRecentBorrowRequests)
router.get('/dashboard/damage-reports', getRecentDamageReports)
router.get('/dashboard/equipment-analytics', getEquipmentAnalytics)
router.get('/dashboard/report-analytics', getReportAnalytics)
router.get('/dashboard/technician-performance', getTechnicianPerformance)
router.get('/borrowing/active', getActiveBorrowing)

export default router
