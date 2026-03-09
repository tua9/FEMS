import { StatusCodes } from 'http-status-codes'
import Building from '../models/Building.js'
import ApiError from '../utils/ApiError.js'

const createBuilding = async (body) => {
  const { name, status } = body

  if (!name || name.trim() === '') {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Name is required')
  }

  const isExistBuilding = await Building.findOne({ name })
  if (isExistBuilding) {
    throw new ApiError(StatusCodes.CONFLICT, 'Building already exists')
  }

  const newBuilding = await Building.create({
    name: name.trim(),
    status,
  })

  return {
    message: 'Create building success',
    building_id: newBuilding._id,
  }
}

const getAllBuildings = async () => {
  return await Building.find()
}

const getBuildingById = async (id) => {
  const building = await Building.findById(id)
  if (!building) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Building not found')
  }
  return building
}

const updateBuilding = async (id, body) => {
  const { name, status } = body
  const building = await Building.findByIdAndUpdate(
    id,
    { name, status },
    { new: true, runValidators: true },
  )
  if (!building) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Building not found')
  }
  return { message: 'Update success', building }
}

const deleteBuilding = async (id) => {
  const building = await Building.findByIdAndDelete(id)
  if (!building) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Building not found')
  }
  return { message: 'Delete success' }
}

export const buildingService = {
  createBuilding,
  getAllBuildings,
  getBuildingById,
  updateBuilding,
  deleteBuilding,
}
