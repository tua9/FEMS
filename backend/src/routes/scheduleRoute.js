import express from 'express'
import {
    createSchedule,
    getMySchedules,
    getScheduleById,
    updateSchedule,
    deleteSchedule,
} from '../controllers/scheduleController.js'
import { restrictTo, protectedRoute } from '../middlewares/authMiddlewares.js'

const router = express.Router()

router.use(protectedRoute)

// Schedules are primarily for Teachers (Lecturers) mapping their classes
router.post('/', restrictTo('lecturer'), createSchedule)
router.get('/', restrictTo('lecturer'), getMySchedules)
router.get('/:id', restrictTo('lecturer'), getScheduleById)
router.patch('/:id', restrictTo('lecturer'), updateSchedule)
router.delete('/:id', restrictTo('lecturer'), deleteSchedule)

export default router
