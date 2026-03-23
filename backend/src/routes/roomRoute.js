import express from 'express'
import {
  createRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
  getRoomStatusCenter,
  getRoomsByBuilding,
} from '../controllers/roomController.js'
import { protectedRoute, restrictTo } from '../middlewares/authMiddlewares.js'

const router = express.Router()

// Public Routes (Accessible by guests for reporting)
router.get('/', getAllRooms)
router.get('/building/:buildingId', getRoomsByBuilding)
router.get('/:id', getRoomById)

// Protected Routes (Require login)
router.use(protectedRoute)

router.get(
  '/status-center',
  restrictTo('lecturer', 'technician', 'admin'),
  getRoomStatusCenter,
)

router.post('/', restrictTo('admin'), createRoom)
router.patch('/:id', restrictTo('admin'), updateRoom)
router.delete('/:id', restrictTo('admin'), deleteRoom)

export default router
