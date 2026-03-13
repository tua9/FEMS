import { StatusCodes } from 'http-status-codes'
import Room from '../models/Room.js'
import ApiError from '../utils/ApiError.js'

const createRoom = async (body) => {
  const { name, type, status, building_id } = body

  if (!name || name.trim() === '') {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Name is required')
  }

  const isExistRoom = await Room.findOne({ name, building_id })
  if (isExistRoom) {
    throw new ApiError(
      StatusCodes.CONFLICT,
      'Room already exists in this building',
    )
  }

  const newRoom = await Room.create({
    name: name.trim(),
    type,
    status,
    building_id,
  })

  return {
    message: 'Create room success',
    room_id: newRoom._id,
  }
}

const getAllRooms = async () => {
  return await Room.find().populate('building_id')
}

const getRoomById = async (id) => {
  const room = await Room.findById(id).populate('building_id')
  if (!room) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Room not found')
  }
  return room
}

const updateRoom = async (id, body) => {
  const { name, type, status, building_id } = body
  const room = await Room.findByIdAndUpdate(
    id,
    { name, type, status, building_id },
    { new: true, runValidators: true },
  )
  if (!room) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Room not found')
  }
  return { message: 'Update success', room }
}

const deleteRoom = async (id) => {
  const room = await Room.findByIdAndDelete(id)
  if (!room) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Room not found')
  }
  return { message: 'Delete success' }
}

const getRoomsByBuilding = async (buildingId) => {
  return await Room.find({ building_id: buildingId }).populate('building_id')
}

export const roomService = {
  createRoom,
  getAllRooms,
  getRoomsByBuilding,
  getRoomById,
  updateRoom,
  deleteRoom,
}
