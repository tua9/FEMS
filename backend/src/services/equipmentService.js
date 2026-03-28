import { StatusCodes } from 'http-status-codes'
import mongoose from 'mongoose'
import Equipment from '../models/Equipment.js'
import BorrowRequest from '../models/BorrowRequest.js'
import Report from '../models/Report.js'
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
    lastMaintenanceDate,
  } = body

  if (!name) throw new ApiError(StatusCodes.BAD_REQUEST, 'Name is required')
  if (!category) throw new ApiError(StatusCodes.BAD_REQUEST, 'Category is required')

  const code = await generateUniqueCode(category)

  const equipment = await Equipment.create({
    name,
    category,
    status: status || 'available',
    roomId: roomId || null,
    code,
    img: img || null,
    description: description || null,
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
  const allowed = ['name', 'category', 'status', 'roomId', 'img', 'description', 'lastMaintenanceDate']
  const patch = {}

  for (const key of allowed) {
    if (body[key] !== undefined) {
      if (key === 'lastMaintenanceDate' && body[key]) {
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
  const TECH_STATUSES = ['available', 'broken', 'maintenance']

  if (status && status !== 'all-statuses') {
    if (status === 'broken' || status === 'maintenance' || status === 'available') {
      matchQuery.status = status
    }
    // 'reserved', 'in_use' are derived (handled below)
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
  if (status === 'reserved' || status === 'in_use') {
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
        description: 1,
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

// ── Mark as Broken ─────────────────────────────────────────────────────────────
// Atomically updates equipment.status and creates a Report.
// Uses compensating transaction: if report creation fails, equipment status is rolled back.

const OPEN_REPAIR_STATUSES = ['pending', 'approved', 'processing']

const _generateReportCode = () => {
  const now = new Date()
  const year = String(now.getFullYear()).slice(-2)
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const random = Array.from({ length: 3 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join('')
  return `RP${year}${month}${random}`
}

const _generateUniqueReportCode = async () => {
  let code
  let exists = true
  while (exists) {
    code = _generateReportCode()
    exists = !!(await Report.findOne({ code }))
  }
  return code
}

const _populateReport = (query) =>
  query
    .populate('user_id', 'displayName email username')
    .populate('equipment_id', 'name category code img')
    .populate('room_id', 'name type')
    .populate('processed_by', 'displayName username')
    .populate('assigned_to', 'displayName username')

const markBroken = async (id, reportedBy) => {
  // 1. Validate equipment exists
  const equipment = await Equipment.findById(id).populate('roomId', 'name type floor')
  if (!equipment) throw new ApiError(StatusCodes.NOT_FOUND, 'Equipment not found')

  // 2. Check for existing open repair request — no duplicates
  const openReport = await _populateReport(
    Report.findOne({ equipment_id: id, status: { $in: OPEN_REPAIR_STATUSES } })
  )
  if (openReport) {
    // Return the existing open report so frontend can navigate to it
    const err = new ApiError(StatusCodes.CONFLICT, 'Equipment already has an open repair request')
    err.existingReport = openReport
    throw err
  }

  // 3. Update equipment status — save previous for rollback
  const previousStatus = equipment.status
  equipment.status = 'broken'
  await equipment.save()

  // 4. Create repair report (compensating rollback on failure)
  let report
  try {
    const code = await _generateUniqueReportCode()
    report = await Report.create({
      user_id: reportedBy ?? null,
      equipment_id: id,
      type: 'equipment',
      status: 'pending',
      priority: 'high',
      description: 'Marked as broken by technician from equipment list',
      code,
    })
  } catch (err) {
    // Rollback equipment status
    equipment.status = previousStatus
    await equipment.save()
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to create repair request. Equipment status rolled back.')
  }

  const populatedReport = await _populateReport(Report.findById(report._id))
  const updatedEquipment = await Equipment.findById(id).populate('roomId', 'name type floor')

  return {
    message: 'Equipment marked as broken and repair request created',
    equipment: updatedEquipment,
    report: populatedReport,
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
  markBroken,
}
