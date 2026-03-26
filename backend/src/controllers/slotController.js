import { StatusCodes } from 'http-status-codes'
import Slot from '../models/Slot.js'
import ApiError from '../utils/ApiError.js'
import { asyncHandler } from '../middlewares/asyncHandler.js'

export const getAllSlots = asyncHandler(async (req, res) => {
  const slots = await Slot.find({ isActive: true }).sort({ order: 1 })
  res.status(StatusCodes.OK).json(slots)
})

export const getSlotById = asyncHandler(async (req, res) => {
  const slot = await Slot.findById(req.params.id)
  if (!slot) throw new ApiError(StatusCodes.NOT_FOUND, 'Slot not found')
  res.status(StatusCodes.OK).json(slot)
})

export const createSlot = asyncHandler(async (req, res) => {
  const slot = await Slot.create(req.body)
  res.status(StatusCodes.CREATED).json(slot)
})

export const updateSlot = asyncHandler(async (req, res) => {
  const slot = await Slot.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
  if (!slot) throw new ApiError(StatusCodes.NOT_FOUND, 'Slot not found')
  res.status(StatusCodes.OK).json(slot)
})

export const deleteSlot = asyncHandler(async (req, res) => {
  const slot = await Slot.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true })
  if (!slot) throw new ApiError(StatusCodes.NOT_FOUND, 'Slot not found')
  res.status(StatusCodes.OK).json({ message: 'Slot deactivated' })
})
