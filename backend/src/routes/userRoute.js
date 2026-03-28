import express from 'express'
import {
  createUser,
  getUserProfile,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/userController.js'
import { restrictTo, protectedRoute } from '../middlewares/authMiddlewares.js'

const router = express.Router()

// Protected routes requiring authentication
router.use(protectedRoute)

// Admin + Technician can read users (for equipment allocation/assignment)
router.get('/', restrictTo('admin', 'technician'), getAllUsers)

// Admin only routes for write operations
router.post('/', restrictTo('admin'), createUser)
router.get('/:id', restrictTo('admin'), getUserById)
router.patch('/:id', restrictTo('admin'), updateUser)
router.delete('/:id', restrictTo('admin'), deleteUser)

export default router
