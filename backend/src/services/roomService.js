import { StatusCodes } from 'http-status-codes'
import mongoose from 'mongoose'
import Room from '../models/Room.js'
import ApiError from '../utils/ApiError.js'

const createRoom = async (body) => {
  const { name, type, status, buildingId, floor, labels } = body

  if (!name || name.trim() === '') {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Name is required')
  }

  const isExistRoom = await Room.findOne({ name: name.trim(), buildingId })
  if (isExistRoom) {
    throw new ApiError(StatusCodes.CONFLICT, 'Room already exists in this building')
  }

  const newRoom = await Room.create({
    name: name.trim(),
    type,
    status,
    buildingId: buildingId || null,
    floor: floor ?? 1,
    labels: labels || [],
  })

  return { message: 'Room created', roomId: newRoom._id }
}

const getAllRooms = async () => {
  return Room.find().populate('buildingId', 'name')
}

const getRoomById = async (id) => {
  const room = await Room.findById(id).populate('buildingId', 'name')
  if (!room) throw new ApiError(StatusCodes.NOT_FOUND, 'Room not found')
  return room
}

const updateRoom = async (id, body) => {
  const { name, type, status, buildingId, floor, labels } = body
  const patch = {}
  if (name !== undefined) patch.name = name
  if (type !== undefined) patch.type = type
  if (status !== undefined) patch.status = status
  if (buildingId !== undefined) patch.buildingId = buildingId
  if (floor !== undefined) patch.floor = floor
  if (labels !== undefined) patch.labels = labels

  const room = await Room.findByIdAndUpdate(id, patch, { new: true, runValidators: true })
  if (!room) throw new ApiError(StatusCodes.NOT_FOUND, 'Room not found')
  return { message: 'Room updated', room }
}

const getRoomsByBuilding = async (buildingId) => {
  // Primary (current model): buildingId
  let rooms = await Room.find({ buildingId }).populate('buildingId', 'name')

  // Backward-compatibility: some databases store the building reference as `building_id` (snake_case).
  // Since `building_id` is stored as an ObjectId, cast the incoming string to ObjectId.
  if (!rooms || rooms.length === 0) {
    const oid = mongoose.Types.ObjectId.isValid(buildingId)
      ? new mongoose.Types.ObjectId(buildingId)
      : buildingId

    rooms = await Room.find({ building_id: oid }).populate('buildingId', 'name')
  }

  return rooms
}

const deleteRoom = async (id) => {
  const room = await Room.findByIdAndDelete(id)
  if (!room) throw new ApiError(StatusCodes.NOT_FOUND, 'Room not found')
  return { message: 'Room deleted' }
}

/**
 * Room status center — groups rooms by building with equipment health summary.
 * Equipment join uses the new roomId field.
 */
const getRoomStatusCenter = async (queries) => {
  const { buildingId, floor, equipmentStatus } = queries

  const matchQuery = {}
  if (buildingId) matchQuery.buildingId = new mongoose.Types.ObjectId(buildingId)
  if (floor) matchQuery.floor = Number(floor)

  const pipeline = [
    { $match: matchQuery },
    {
      $lookup: {
        from: 'buildings',
        localField: 'buildingId',
        foreignField: '_id',
        as: 'building',
      },
    },
    { $unwind: { path: '$building', preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: 'equipment',
        localField: '_id',
        foreignField: 'roomId',
        as: 'equipmentItems',
      },
    },
    {
      $addFields: {
        totalEquipment: { $size: '$equipmentItems' },
        faultyEquipment: {
          $size: {
            $filter: {
              input: '$equipmentItems',
              as: 'd',
              cond: { $eq: ['$$d.status', 'broken'] },
            },
          },
        },
        maintenanceEquipment: {
          $size: {
            $filter: {
              input: '$equipmentItems',
              as: 'd',
              cond: { $eq: ['$$d.status', 'maintenance'] },
            },
          },
        },
        goodEquipment: {
          $size: {
            $filter: {
              input: '$equipmentItems',
              as: 'd',
              cond: { $eq: ['$$d.status', 'good'] },
            },
          },
        },
      },
    },
    {
      $addFields: {
        operationalSummary: {
          $concat: [
            { $toString: '$goodEquipment' },
            '/',
            { $toString: '$totalEquipment' },
            ' PCS OPERATIONAL',
          ],
        },
        displayEquipment: {
          $map: {
            input: { $slice: ['$equipmentItems', 3] },
            as: 'd',
            in: {
              name: '$$d.name',
              status: {
                $switch: {
                  branches: [
                    { case: { $eq: ['$$d.status', 'good'] }, then: 'ACTIVE' },
                    { case: { $eq: ['$$d.status', 'broken'] }, then: 'FAULTY' },
                    { case: { $eq: ['$$d.status', 'maintenance'] }, then: 'MAINTENANCE' },
                  ],
                  default: 'UNKNOWN',
                },
              },
            },
          },
        },
      },
    },
  ]

  if (equipmentStatus) {
    if (equipmentStatus === 'faulty') {
      pipeline.push({ $match: { faultyEquipment: { $gt: 0 } } })
    } else if (equipmentStatus === 'maintenance') {
      pipeline.push({ $match: { maintenanceEquipment: { $gt: 0 } } })
    } else if (equipmentStatus === 'active') {
      pipeline.push({ $match: { faultyEquipment: 0, maintenanceEquipment: 0, totalEquipment: { $gt: 0 } } })
    }
  }

  pipeline.push({
    $group: {
      _id: '$building.name',
      buildingId: { $first: '$buildingId' },
      buildingName: { $first: '$building.name' },
      rooms: {
        $push: {
          _id: '$_id',
          name: '$name',
          type: '$type',
          status: '$status',
          floor: '$floor',
          operationalSummary: '$operationalSummary',
          displayEquipment: '$displayEquipment',
          totalEquipment: '$totalEquipment',
          faultyEquipment: '$faultyEquipment',
        },
      },
    },
  })

  return Room.aggregate(pipeline)
}

export const roomService = {
  createRoom,
  getAllRooms,
  getRoomsByBuilding,
  getRoomById,
  updateRoom,
  deleteRoom,
  getRoomStatusCenter,
}
