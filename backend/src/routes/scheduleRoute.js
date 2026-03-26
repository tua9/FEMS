import express from 'express'
import {
  createSchedule,
  getAllSchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
  getMySchedules,
} from '../controllers/scheduleController.js'
import { restrictTo, protectedRoute } from '../middlewares/authMiddlewares.js'

const router = express.Router()

router.use(protectedRoute)

// ── Personal view (lecturer + student) ───────────────────────────────────────
router.get('/me', restrictTo('lecturer', 'student'), getMySchedules)

// ── Admin / lecturer CRUD ─────────────────────────────────────────────────────
router.get('/', restrictTo('admin', 'lecturer', 'technician'), getAllSchedules)
router.post('/', restrictTo('admin', 'lecturer'), createSchedule)
router.get('/:id', restrictTo('admin', 'lecturer', 'student', 'technician'), getScheduleById)
router.patch('/:id', restrictTo('admin', 'lecturer'), updateSchedule)
router.delete('/:id', restrictTo('admin'), deleteSchedule)

export default router
