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
router.post('/', restrictTo('Admin'), createUser)
router.get('/', restrictTo('Admin'), getAllUsers)
router.get('/:id', restrictTo('Admin'), getUserById)
router.patch('/:id', restrictTo('Admin'), updateUser)
router.delete('/:id', restrictTo('Admin'), deleteUser)

export default router
