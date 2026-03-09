import crypto from 'crypto'
import { StatusCodes } from 'http-status-codes'
import Equipment from '../models/Equipment.js'
import ApiError from '../utils/ApiError.js'

const createEquipment = async (body) => {
  const { name, category, available, status, room_id, qr_code } = body

  if (!name) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Name is required')
  }

  const newEquipment = await Equipment.create({
    name,
    category,
    available,
    status,
    room_id,
    qr_code: qr_code || crypto.randomUUID(),
  })

  return {
    message: 'Create equipment success',
    equipment_id: newEquipment._id,
  }
}

const getAllEquipment = async () => {
  return await Equipment.find().populate('room_id')
}

const getEquipmentById = async (id) => {
  const equipment = await Equipment.findById(id).populate('room_id')
  if (!equipment) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Equipment not found')
  }
  return equipment
}

const updateEquipment = async (id, body) => {
  const { name, category, available, status, room_id, qr_code } = body
  const equipment = await Equipment.findByIdAndUpdate(
    id,
    { name, category, available, status, room_id, qr_code },
    { new: true, runValidators: true },
  )
  if (!equipment) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Equipment not found')
  }
  return { message: 'Update success', equipment }
}

const deleteEquipment = async (id) => {
  const equipment = await Equipment.findByIdAndDelete(id)
  if (!equipment) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Equipment not found')
  }
  return { message: 'Delete success' }
}

const getEquipmentByQrCode = async (qrCode) => {
  const equipment = await Equipment.findOne({ qr_code: qrCode }).populate(
    'room_id',
  )
  if (!equipment) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Equipment not found')
  }
  return equipment
}

export const equipmentService = {
  createEquipment,
  getAllEquipment,
  getEquipmentById,
  getEquipmentByQrCode,
  updateEquipment,
  deleteEquipment,
}
