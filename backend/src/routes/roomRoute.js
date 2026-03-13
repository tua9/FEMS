import express from 'express'
import {
  createRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
  getRoomsByBuilding,
} from '../controllers/roomController.js'

const router = express.Router()

router.post('/', createRoom)
router.get('/', getAllRooms)
router.get('/building/:buildingId', getRoomsByBuilding)
router.get('/:id', getRoomById)
router.patch('/:id', updateRoom)
router.delete('/:id', deleteRoom)

export default router
