import { StatusCodes } from 'http-status-codes'
import { buildingService } from '../services/buildingService.js'
import { asyncHandler } from '../middlewares/asyncHandler.js'

export const createBuilding = asyncHandler(async (req, res) => {
  console.log('🏢 create building')
  const result = await buildingService.createBuilding(req.body)
  res.status(StatusCodes.CREATED).json(result)
})

export const getAllBuildings = asyncHandler(async (req, res) => {
  const result = await buildingService.getAllBuildings()
  res.status(StatusCodes.OK).json(result)
})

export const getBuildingById = asyncHandler(async (req, res) => {
  const result = await buildingService.getBuildingById(req.params.id)
  res.status(StatusCodes.OK).json(result)
})

export const updateBuilding = asyncHandler(async (req, res) => {
  const result = await buildingService.updateBuilding(req.params.id, req.body)
  res.status(StatusCodes.OK).json(result)
})

export const deleteBuilding = asyncHandler(async (req, res) => {
  const result = await buildingService.deleteBuilding(req.params.id)
  res.status(StatusCodes.OK).json(result)
})
