import { StatusCodes } from 'http-status-codes'
import { slotService } from '../services/slotService.js'
import { asyncHandler } from '../middlewares/asyncHandler.js'

export const getAllSlots = asyncHandler(async (req, res) => {
  const result = await slotService.getAllSlots()
  res.status(StatusCodes.OK).json(result)
})

export const getSlotById = asyncHandler(async (req, res) => {
  const result = await slotService.getSlotById(req.params.id)
  res.status(StatusCodes.OK).json(result)
})

export const createSlot = asyncHandler(async (req, res) => {
  const result = await slotService.createSlot(req.body)
  res.status(StatusCodes.CREATED).json(result)
})

export const updateSlot = asyncHandler(async (req, res) => {
  const result = await slotService.updateSlot(req.params.id, req.body)
  res.status(StatusCodes.OK).json(result)
})

export const deleteSlot = asyncHandler(async (req, res) => {
  const result = await slotService.deleteSlot(req.params.id)
  res.status(StatusCodes.OK).json(result)
})
