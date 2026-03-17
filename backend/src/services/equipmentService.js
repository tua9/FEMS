import crypto from 'crypto'
import { StatusCodes } from 'http-status-codes'
import Equipment from '../models/Equipment.js'
import ApiError from '../utils/ApiError.js'

const createEquipment = async (body) => {
  const { name, category, available, status, room_id, code } = body

  if (!name) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Name is required')
  }

  const newEquipment = await Equipment.create({
    name,
    category,
    available,
    status,
    room_id,
    code: code || crypto.randomUUID(),
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
  const { name, category, available, status, room_id, code } = body
  const equipment = await Equipment.findByIdAndUpdate(
    id,
    { name, category, available, status, room_id, code },
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

const getEquipmentByCode = async (code) => {
  const equipment = await Equipment.findOne({ code: code }).populate(
    'room_id',
  )
  if (!equipment) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Equipment not found')
  }
  return equipment
}

const getEquipmentInventory = async (queries) => {
  const { search, category, building_id, status, page = 1, limit = 12 } = queries

  const skip = (Number(page) - 1) * Number(limit)
  const matchQuery = {}

  if (search) {
    matchQuery.$or = [
      { name: { $regex: search, $options: 'i' } },
      { qr_code: { $regex: search, $options: 'i' } },
    ]
  }

  if (category && category !== 'all' && category !== 'all-types') {
    matchQuery.category = { $regex: new RegExp(`^${category}$`, 'i') }
  }

  if (status && status !== 'all-status') {
    if (status === 'Available') matchQuery.status = 'good'
    if (status === 'Maintenance') matchQuery.status = { $in: ['broken', 'maintenance'] }
  }

  const pipeline = [
    { $match: matchQuery },
    {
      $lookup: {
        from: 'rooms',
        localField: 'room_id',
        foreignField: '_id',
        as: 'room',
      },
    },
    { $unwind: { path: '$room', preserveNullAndEmptyArrays: true } },
  ]

  // Filter by building if provided
  if (building_id) {
    pipeline.push({
      $match: { 'room.building_id': new mongoose.Types.ObjectId(building_id) },
    })
  }

  // Count total for pagination
  const countPipeline = [...pipeline, { $count: 'total' }]
  const countResult = await Equipment.aggregate(countPipeline)
  const totalItems = countResult.length > 0 ? countResult[0].total : 0

  // Finish pipeline with projection, sort, skip, limit
  pipeline.push(
    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: Number(limit) },
    {
      $project: {
        _id: 1,
        name: 1,
        category: 1,
        available: 1,
        status: 1,
        qr_code: 1,
        room_id: {
          _id: '$room._id',
          name: '$room.name',
          floor: '$room.floor',
        },
      },
    }
  )

  const items = await Equipment.aggregate(pipeline)

  return {
    items,
    pagination: {
      totalItems,
      currentPage: Number(page),
      totalPages: Math.ceil(totalItems / Number(limit)),
      limit: Number(limit),
    },
  }
}

export const equipmentService = {
  createEquipment,
  getAllEquipment,
  getEquipmentById,
  getEquipmentByCode,
  updateEquipment,
  deleteEquipment,
  getEquipmentInventory,
}
