import express from 'express'
import {
  createBuilding,
  getAllBuildings,
  getBuildingById,
  updateBuilding,
  deleteBuilding,
} from '../controllers/buildingController.js'

const router = express.Router()

router.post('/', createBuilding)
router.get('/', getAllBuildings)
router.get('/:id', getBuildingById)
router.patch('/:id', updateBuilding)
router.delete('/:id', deleteBuilding)

export default router
