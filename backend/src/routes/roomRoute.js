import express from 'express'
import {
  createRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
  getRoomStatusCenter,
} from '../controllers/roomController.js'
import { protectedRoute, restrictTo } from '../middlewares/authMiddlewares.js'

const router = express.Router()

router.use(protectedRoute)

router.get(
  '/status-center',
  restrictTo('lecturer', 'technician', 'admin'),
  getRoomStatusCenter,
)

router.post('/', restrictTo('admin'), createRoom)
router.get('/', getAllRooms)
router.get('/:id', getRoomById)
router.patch('/:id', restrictTo('admin'), updateRoom)
router.delete('/:id', restrictTo('admin'), deleteRoom)

export default router
