import express from 'express'
import {
  createBuilding,
  getAllBuildings,
  getBuildingById,
  updateBuilding,
  deleteBuilding,
} from '../controllers/buildingController.js'

import { protectedRoute, restrictTo } from '../middlewares/authMiddlewares.js'

const router = express.Router()

// Public Routes
router.get('/', getAllBuildings)
router.get('/:id', getBuildingById)

// Protected Routes (Admin only)
router.use(protectedRoute)
router.use(restrictTo('admin'))

router.post('/', createBuilding)
router.patch('/:id', updateBuilding)
router.delete('/:id', deleteBuilding)

export default router
