import { StatusCodes } from 'http-status-codes'
import mongoose from 'mongoose'
import Equipment from '../models/Equipment.js'
import ApiError from '../utils/ApiError.js'

// ─── Code Generation ──────────────────────────────────────────────────────────

/**
 * Build one candidate code from a category string.
 * Format: <2-char prefix><2-digit year><2-digit month><3 random uppercase letters>
 * Example: "Laptop" in March 2026 → "LA2603XYZ"
 *
 * @param {string} category - Equipment category (e.g. "Laptop", "Monitor")
 * @returns {string} A candidate code string (9 chars)
 */
const generateEquipmentCode = (category) => {
  // Prefix: first 2 chars of category, uppercased (pad with 'X' if category is 1 char)
  const prefix = (category || 'XX').trim().toUpperCase().padEnd(2, 'X').slice(0, 2)

  // Date parts
  const now   = new Date()
  const year  = String(now.getFullYear()).slice(-2)          // e.g. "26"
  const month = String(now.getMonth() + 1).padStart(2, '0') // e.g. "03"

  // 3 random uppercase letters (A–Z)
  const CHARS  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const random = Array.from({ length: 3 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join('')

  return `${prefix}${year}${month}${random}` // e.g. "LA2603ABC"
}

/**
 * Generate a code that does not yet exist in the database.
 * Retries until a unique code is found (very rare collision in practice).
 *
 * @param {string} category
 * @returns {Promise<string>} A unique equipment code
 */
const generateUniqueCode = async (category) => {
  let code
  let exists = true

  while (exists) {
    code   = generateEquipmentCode(category)
    exists = !!(await Equipment.findOne({ code }))
  }

  return code
}

// ─── CRUD ─────────────────────────────────────────────────────────────────────

const createEquipment = async (body) => {
  // Destructure body — `code` from frontend is intentionally ignored
  const { name, category, available, status, room_id, img } = body

  if (!name) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Name is required')
  }

  // Always auto-generate a unique code based on category
  const code = await generateUniqueCode(category)

  const newEquipment = await Equipment.create({
    name,
    category,
    available,
    status,
    room_id,
    code,
    img,
  })

  return {
    message: 'Create equipment success',
    equipment_id: newEquipment._id,
    equipment: newEquipment,
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
  const { name, category, available, status, room_id, code, img } = body
  const equipment = await Equipment.findByIdAndUpdate(
    id,
    { name, category, available, status, room_id, code, img },
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

  if (status && status !== 'all-statuses') {
    if (status === 'available') {
       matchQuery.status = 'good';
       matchQuery.borrowed_by = null;
    }
    else if (status === 'unavailable') {
       matchQuery.borrowed_by = { $ne: null };
    }
    else if (status === 'broken') {
       matchQuery.status = 'broken';
    }
    else if (status === 'maintenance') {
       matchQuery.status = 'maintenance';
    }
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
    {
      $addFields: {
        sortWeight: {
          $cond: {
            if: { 
              $and: [
                { $eq: ["$status", "good"] },
                { $eq: ["$available", true] },
                { $eq: [{ $ifNull: ["$borrowed_by", null] }, null] }
              ]
            },
            then: 0,
            else: 1
          }
        }
      }
    },
    { $sort: { sortWeight: 1, createdAt: -1 } },
    { $skip: skip },
    { $limit: Number(limit) },
    {
      $project: {
        _id: 1,
        name: 1,
        category: 1,
        available: 1,
        status: 1,
        code: 1,
        img: 1,
        borrowed_by: 1,
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
