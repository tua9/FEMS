import express from 'express'
import {
  createEquipment,
  getAllEquipment,
  getEquipmentById,
  getEquipmentByQrCode,
  updateEquipment,
  deleteEquipment,
} from '../controllers/equipmentController.js'
import { restrictTo, protectedRoute } from '../middlewares/authMiddlewares.js'

const router = express.Router()

// Guest / All routes
router.get('/qr/:qrCode', getEquipmentByQrCode)
router.get('/', getAllEquipment)
router.get('/:id', getEquipmentById)

// Admin/Tech routes
router.use(protectedRoute)
router.post('/', restrictTo('admin', 'Tech'), createEquipment)
router.put('/:id', restrictTo('admin', 'Tech'), updateEquipment)
router.patch('/:id', restrictTo('admin', 'Tech'), updateEquipment)
router.delete('/:id', restrictTo('admin', 'Tech'), deleteEquipment)

export default router
