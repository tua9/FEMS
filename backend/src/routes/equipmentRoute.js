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
router.post('/', restrictTo('admin', 'technician'), createEquipment)
router.put('/:id', restrictTo('admin', 'technician'), updateEquipment)
router.patch('/:id', restrictTo('admin', 'technician'), updateEquipment)
router.delete('/:id', restrictTo('admin', 'technician'), deleteEquipment)

export default router
