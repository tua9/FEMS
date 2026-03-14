import express from 'express'
import {
  createReport,
  getAllReports,
  getPersonalReports,
  updateReportStatus,
} from '../controllers/reportController.js'
import {
  protectedRoute,
  restrictTo,
  optionalAuth,
} from '../middlewares/authMiddlewares.js'

const router = express.Router()

router.post('/report', optionalAuth, createReport)
router.get('/history', protectedRoute, getPersonalReports)

router.get('/', protectedRoute, restrictTo('admin', 'technician'), getAllReports)
router.patch(
  '/:id/status',
  protectedRoute,
  restrictTo('technician', 'admin'),
  updateReportStatus,
)

export default router
