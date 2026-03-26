import { StatusCodes } from 'http-status-codes'
import Slot from '../models/Slot.js'
import ApiError from '../utils/ApiError.js'

const getAllSlots = async () => {
  return await Slot.find({ isActive: true }).sort({ order: 1 })
}

const getSlotById = async (id) => {
  const slot = await Slot.findById(id)
  if (!slot) throw new ApiError(StatusCodes.NOT_FOUND, 'Slot not found')
  return slot
}

const createSlot = async (body) => {
  return await Slot.create(body)
}

const updateSlot = async (id, body) => {
  const slot = await Slot.findByIdAndUpdate(id, body, { new: true, runValidators: true })
  if (!slot) throw new ApiError(StatusCodes.NOT_FOUND, 'Slot not found')
  return slot
}

const deleteSlot = async (id) => {
  const slot = await Slot.findByIdAndUpdate(id, { isActive: false }, { new: true })
  if (!slot) throw new ApiError(StatusCodes.NOT_FOUND, 'Slot not found')
  return { message: 'Slot deactivated' }
}

export const slotService = {
  getAllSlots,
  getSlotById,
  createSlot,
  updateSlot,
  deleteSlot,
}
