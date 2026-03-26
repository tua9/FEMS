import { StatusCodes } from 'http-status-codes'
import mongoose from 'mongoose'
import Room from '../models/Room.js'
import ApiError from '../utils/ApiError.js'
import Equipment from '../models/Equipment.js'

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

const getRoomsByBuilding = async (buildingId) => {
  return await Room.find({ building_id: buildingId }).populate('building_id')
}

const deleteRoom = async (id) => {
  const room = await Room.findByIdAndDelete(id)
  if (!room) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Room not found')
  }
  return { message: 'Delete success' }
}

const getRoomStatusCenter = async (queries) => {
  const { building_id, floor, equipmentStatus } = queries

  const matchQuery = {}
  if (building_id) matchQuery.building_id = new mongoose.Types.ObjectId(building_id)
  if (floor) matchQuery.floor = Number(floor)

  const pipeline = [
    { $match: matchQuery },
    {
      $lookup: {
        from: 'buildings',
        localField: 'building_id',
        foreignField: '_id',
        as: 'building',
      },
    },
    { $unwind: '$building' },
    {
      $lookup: {
        from: 'equipment',
        localField: '_id',
        foreignField: 'room_id',
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
        // Get top 3 representative equipment for display on card
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

  // Apply equipment status filter if provided
  if (equipmentStatus) {
    if (equipmentStatus === 'faulty') {
      pipeline.push({ $match: { faultyEquipment: { $gt: 0 } } })
    } else if (equipmentStatus === 'maintenance') {
      pipeline.push({ $match: { maintenanceEquipment: { $gt: 0 } } })
    } else if (equipmentStatus === 'active') {
      pipeline.push({ $match: { faultyEquipment: 0, maintenanceEquipment: 0, totalEquipment: { $gt: 0 } } })
    }
  }

  // Final step: Group by building name
  pipeline.push({
    $group: {
      _id: '$building.name',
      buildingId: { $first: '$building_id' },
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

  return await Room.aggregate(pipeline)
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
