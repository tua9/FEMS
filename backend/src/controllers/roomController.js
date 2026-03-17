import { StatusCodes } from 'http-status-codes'
import { roomService } from '../services/roomService.js'
import { asyncHandler } from '../middlewares/asyncHandler.js'

export const createRoom = asyncHandler(async (req, res) => {
  console.log('🚪 create room')
  const result = await roomService.createRoom(req.body)
  res.status(StatusCodes.CREATED).json(result)
})

export const getAllRooms = asyncHandler(async (req, res) => {
  const result = await roomService.getAllRooms()
  res.status(StatusCodes.OK).json(result)
})

export const getRoomById = asyncHandler(async (req, res) => {
  const result = await roomService.getRoomById(req.params.id)
  res.status(StatusCodes.OK).json(result)
})

export const getRoomsByBuilding = asyncHandler(async (req, res) => {
  const result = await roomService.getRoomsByBuilding(req.params.buildingId)
  res.status(StatusCodes.OK).json(result)
})

export const updateRoom = asyncHandler(async (req, res) => {
  const result = await roomService.updateRoom(req.params.id, req.body)
  res.status(StatusCodes.OK).json(result)
})

export const deleteRoom = asyncHandler(async (req, res) => {
  const result = await roomService.deleteRoom(req.params.id)
  res.status(StatusCodes.OK).json(result)
})

export const getRoomStatusCenter = asyncHandler(async (req, res) => {
  const result = await roomService.getRoomStatusCenter(req.query)
  res.status(StatusCodes.OK).json(result)
})
