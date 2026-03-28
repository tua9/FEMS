import express from 'express'
import {
  getAllClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
} from '../controllers/classController.js'
import { restrictTo, protectedRoute } from '../middlewares/authMiddlewares.js'

const router = express.Router()

router.use(protectedRoute)

router.get('/', restrictTo('admin', 'lecturer', 'student', 'technician'), getAllClasses)
router.get('/:id', restrictTo('admin', 'lecturer'), getClassById)
router.post('/', restrictTo('admin'), createClass)
router.patch('/:id', restrictTo('admin'), updateClass)
router.delete('/:id', restrictTo('admin'), deleteClass)

export default router
