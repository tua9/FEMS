import express from 'express'
import {
  getAllSlots,
  getSlotById,
  createSlot,
  updateSlot,
  deleteSlot,
} from '../controllers/slotController.js'
import { restrictTo, protectedRoute } from '../middlewares/authMiddlewares.js'

const router = express.Router()

router.use(protectedRoute)

// All authenticated users can read slots
router.get('/', getAllSlots)
router.get('/:id', getSlotById)

// Admin only for mutations
router.post('/', restrictTo('admin'), createSlot)
router.patch('/:id', restrictTo('admin'), updateSlot)
router.delete('/:id', restrictTo('admin'), deleteSlot)

export default router
