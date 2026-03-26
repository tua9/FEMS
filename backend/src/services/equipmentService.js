import { StatusCodes } from 'http-status-codes'
import mongoose from 'mongoose'
import Equipment from '../models/Equipment.js'
import BorrowRequest from '../models/BorrowRequest.js'
import ApiError from '../utils/ApiError.js'

// ── Code Generation ────────────────────────────────────────────────────────────

const generateEquipmentCode = (category) => {
  const prefix = (category || 'XX').trim().toUpperCase().padEnd(2, 'X').slice(0, 2)
  const now = new Date()
  const year = String(now.getFullYear()).slice(-2)
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const random = Array.from({ length: 3 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join('')
  return `${prefix}${year}${month}${random}`
}

const generateUniqueCode = async (category) => {
  let code
  let exists = true
  while (exists) {
    code = generateEquipmentCode(category)
    exists = !!(await Equipment.findOne({ code }))
  }
  return code
}

// ── CRUD ───────────────────────────────────────────────────────────────────────

const createEquipment = async (body) => {
  const {
    name,
    category,
    status,
    roomId,
    img,
    description,
    brand,
    model,
    serialNumber,
    purchaseDate,
    lastMaintenanceDate,
  } = body

  if (!name) throw new ApiError(StatusCodes.BAD_REQUEST, 'Name is required')
  if (!category) throw new ApiError(StatusCodes.BAD_REQUEST, 'Category is required')

  const code = await generateUniqueCode(category)

  const equipment = await Equipment.create({
    name,
    category,
    status: status || 'good',
    roomId: roomId || null,
    code,
    img: img || null,
    description: description || null,
    brand: brand ?? '',
    model: model ?? '',
    serialNumber: serialNumber ?? '',
    purchaseDate: purchaseDate ? new Date(purchaseDate) : null,
    lastMaintenanceDate: lastMaintenanceDate ? new Date(lastMaintenanceDate) : null,
  })

  return { message: 'Equipment created', equipment }
}

const getAllEquipment = async () => {
  return Equipment.find().populate('roomId', 'name type floor')
}

const getEquipmentById = async (id) => {
  const equipment = await Equipment.findById(id).populate('roomId', 'name type floor buildingId')
  if (!equipment) throw new ApiError(StatusCodes.NOT_FOUND, 'Equipment not found')
  return equipment
}

const updateEquipment = async (id, body) => {
  const allowed = ['name', 'category', 'status', 'roomId', 'img', 'description', 'brand', 'model', 'serialNumber', 'purchaseDate', 'lastMaintenanceDate']
  const patch = {}

  for (const key of allowed) {
    if (body[key] !== undefined) {
      if ((key === 'purchaseDate' || key === 'lastMaintenanceDate') && body[key]) {
        patch[key] = new Date(body[key])
      } else {
        patch[key] = body[key]
      }
    }
  }

  if (Object.keys(patch).length === 0) {
    const existing = await Equipment.findById(id)
    if (!existing) throw new ApiError(StatusCodes.NOT_FOUND, 'Equipment not found')
    return existing
  }

  const equipment = await Equipment.findByIdAndUpdate(id, patch, { new: true, runValidators: true })
  if (!equipment) throw new ApiError(StatusCodes.NOT_FOUND, 'Equipment not found')
  return { message: 'Equipment updated', equipment }
}

const deleteEquipment = async (id) => {
  const equipment = await Equipment.findByIdAndDelete(id)
  if (!equipment) throw new ApiError(StatusCodes.NOT_FOUND, 'Equipment not found')
  return { message: 'Equipment deleted' }
}

const getEquipmentByCode = async (code) => {
  const equipment = await Equipment.findOne({ code }).populate('roomId', 'name type floor')
  if (!equipment) throw new ApiError(StatusCodes.NOT_FOUND, 'Equipment not found')
  return equipment
}

/**
 * Paginated equipment inventory with borrow-status derived from BorrowRequest.
 * Status filter: available | reserved | in_use | broken | maintenance
 */
const getEquipmentInventory = async (queries) => {
  const { search, category, buildingId, roomId, status, page = 1, limit = 12 } = queries

  const skip = (Number(page) - 1) * Number(limit)
  const matchQuery = {}

  if (roomId) {
    matchQuery.roomId = new mongoose.Types.ObjectId(roomId)
  }

  if (search) {
    matchQuery.$or = [
      { name: { $regex: search, $options: 'i' } },
      { code: { $regex: search, $options: 'i' } },
    ]
  }

  if (category && category !== 'all' && category !== 'all-types') {
    matchQuery.category = { $regex: new RegExp(`^${category}$`, 'i') }
  }

  // Technical status filters map directly; availability filters need a join with BorrowRequest
  const TECH_STATUSES = ['good', 'broken', 'maintenance']
  const borrowStatusFilter = null

  if (status && status !== 'all-statuses') {
    if (status === 'broken' || status === 'maintenance') {
      matchQuery.status = status
    } else if (status === 'good') {
      matchQuery.status = 'good'
    }
    // 'available', 'reserved', 'in_use' require cross-collection join — handled below
  }

  const pipeline = [
    { $match: matchQuery },
    {
      $lookup: {
        from: 'rooms',
        localField: 'roomId',
        foreignField: '_id',
        as: 'room',
      },
    },
    { $unwind: { path: '$room', preserveNullAndEmptyArrays: true } },
  ]

  // Filter by building
  if (buildingId) {
    pipeline.push({
      $match: { 'room.buildingId': new mongoose.Types.ObjectId(buildingId) },
    })
  }

  // Join active borrow request to derive borrow status
  pipeline.push(
    {
      $lookup: {
        from: 'borrowrequests',
        let: { eqId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$equipmentId', '$$eqId'] },
              status: { $in: ['approved', 'handed_over'] },
            },
          },
          { $limit: 1 },
          { $project: { status: 1, borrowerId: 1 } },
        ],
        as: 'activeRequest',
      },
    },
    {
      $addFields: {
        activeRequest: { $arrayElemAt: ['$activeRequest', 0] },
      },
    },
    {
      $addFields: {
        borrowStatus: {
          $cond: [
            { $or: [{ $eq: ['$status', 'broken'] }, { $eq: ['$status', 'maintenance'] }] },
            '$status',
            {
              $cond: [
                { $eq: [{ $ifNull: ['$activeRequest', null] }, null] },
                'available',
                {
                  $cond: [
                    { $eq: ['$activeRequest.status', 'handed_over'] },
                    'in_use',
                    'reserved',
                  ],
                },
              ],
            },
          ],
        },
      },
    },
  )

  // Apply borrow-status filter
  if (status === 'available' || status === 'reserved' || status === 'in_use') {
    pipeline.push({ $match: { borrowStatus: status } })
  }

  // Sort: available first, then by createdAt desc
  pipeline.push(
    {
      $addFields: {
        sortWeight: { $cond: [{ $eq: ['$borrowStatus', 'available'] }, 0, 1] },
      },
    },
    { $sort: { sortWeight: 1, createdAt: -1 } },
  )

  // Count for pagination
  const countPipeline = [...pipeline, { $count: 'total' }]
  const countResult = await Equipment.aggregate(countPipeline)
  const totalItems = countResult[0]?.total ?? 0

  pipeline.push(
    { $skip: skip },
    { $limit: Number(limit) },
    {
      $project: {
        _id: 1,
        name: 1,
        category: 1,
        status: 1,
        borrowStatus: 1,
        code: 1,
        img: 1,
        brand: 1,
        model: 1,
        roomId: {
          $cond: {
            if: '$room._id',
            then: { _id: '$room._id', name: '$room.name', floor: '$room.floor' },
            else: null,
          },
        },
      },
    },
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
