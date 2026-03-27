import { StatusCodes } from 'http-status-codes'
import { equipmentService } from '../services/equipmentService.js'
import { asyncHandler } from '../middlewares/asyncHandler.js'
import Equipment from '../models/Equipment.js'

export const createEquipment = asyncHandler(async (req, res) => {
  console.log('💻 create equipment | body fields:', Object.keys(req.body))
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

export const getEquipmentCategories = asyncHandler(async (req, res) => {
  const categories = await Equipment.distinct('category')
  res.status(StatusCodes.OK).json((categories || []).filter(Boolean))
})

export const markEquipmentBroken = asyncHandler(async (req, res) => {
  try {
    const result = await equipmentService.markBroken(req.params.id, req.user._id)
    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    // 409 Conflict: existing open repair — surface the existing report to frontend
    if (err.statusCode === 409 && err.existingReport) {
      return res.status(StatusCodes.CONFLICT).json({
        message: err.message,
        existingReport: err.existingReport,
      })
    }
    throw err
  }
})
