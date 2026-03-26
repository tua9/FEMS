import express from 'express'
import {
  createEquipment,
  getAllEquipment,
  getEquipmentById,
  getEquipmentByCode,
  updateEquipment,
  deleteEquipment,
  getEquipmentInventory,
  getEquipmentCategories,
} from '../controllers/equipmentController.js'
import { restrictTo, protectedRoute } from '../middlewares/authMiddlewares.js'

const router = express.Router()

// Guest / All routes
router.get('/code/:code', getEquipmentByCode)
router.get('/categories', getEquipmentCategories)
router.get('/inventory', getEquipmentInventory)
router.get('/', getAllEquipment)
router.get('/:id', getEquipmentById)

// Role protected routes
router.use(protectedRoute)
router.post('/', restrictTo('admin', 'technician'), createEquipment)
router.put('/:id', restrictTo('admin', 'technician'), updateEquipment)
router.patch('/:id', restrictTo('admin', 'technician'), updateEquipment)
router.delete('/:id', restrictTo('admin', 'technician'), deleteEquipment)

export default router
