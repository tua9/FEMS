import express from 'express'
import {
  checkIn,
  checkOut,
  getAttendanceForSchedule,
  myCheckInStatus,
} from '../controllers/attendanceController.js'
import { restrictTo, protectedRoute } from '../middlewares/authMiddlewares.js'

const router = express.Router()

router.use(protectedRoute)

// Lecturer check-in / check-out
router.post('/check-in', restrictTo('lecturer'), checkIn)
router.post('/check-out', restrictTo('lecturer'), checkOut)

// Query
router.get('/:scheduleId/status', restrictTo('lecturer', 'admin'), myCheckInStatus)
router.get('/:scheduleId', restrictTo('admin', 'lecturer'), getAttendanceForSchedule)

export default router
