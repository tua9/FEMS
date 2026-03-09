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

router.get('/', protectedRoute, restrictTo('Admin', 'Tech'), getAllReports)
router.patch(
  '/:id/status',
  protectedRoute,
  restrictTo('Tech', 'Admin'),
  updateReportStatus,
)

export default router
