import { StatusCodes } from 'http-status-codes'
import { equipmentService } from '../services/equipmentService.js'
import { asyncHandler } from '../middlewares/asyncHandler.js'

export const createEquipment = asyncHandler(async (req, res) => {
  console.log('💻 create equipment')
  const result = await equipmentService.createEquipment(req.body)
  res.status(StatusCodes.CREATED).json(result)
})

export const getAllEquipment = asyncHandler(async (req, res) => {
  const result = await equipmentService.getAllEquipment()
  res.status(StatusCodes.OK).json(result)
})

export const getEquipmentById = asyncHandler(async (req, res) => {
  const result = await equipmentService.getEquipmentById(req.params.id)
  res.status(StatusCodes.OK).json(result)
})

export const updateEquipment = asyncHandler(async (req, res) => {
  const result = await equipmentService.updateEquipment(req.params.id, req.body)
  res.status(StatusCodes.OK).json(result)
})

export const deleteEquipment = asyncHandler(async (req, res) => {
  const result = await equipmentService.deleteEquipment(req.params.id)
  res.status(StatusCodes.OK).json(result)
})

export const getEquipmentByCode = asyncHandler(async (req, res) => {
  const result = await equipmentService.getEquipmentByCode(req.params.code)
  res.status(StatusCodes.OK).json(result)
})

export const getEquipmentInventory = asyncHandler(async (req, res) => {
  const result = await equipmentService.getEquipmentInventory(req.query)
  res.status(StatusCodes.OK).json(result)
})
