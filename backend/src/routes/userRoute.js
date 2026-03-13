import express from 'express'
import {
  createUser,
  getUserProfile,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/userController.js'
import { restrictTo } from '../middlewares/authMiddlewares.js'

const router = express.Router()

// Admin only routes
router.post('/', restrictTo('admin'), createUser)
router.get('/', restrictTo('admin'), getAllUsers)
router.get('/:id', restrictTo('admin'), getUserById)
router.patch('/:id', restrictTo('admin'), updateUser)
router.delete('/:id', restrictTo('admin'), deleteUser)

export default router
