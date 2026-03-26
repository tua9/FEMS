import { StatusCodes } from 'http-status-codes'
import { classService } from '../services/classService.js'
import { asyncHandler } from '../middlewares/asyncHandler.js'

export const getAllClasses = asyncHandler(async (req, res) => {
  const result = await classService.getAllClasses()
  res.status(StatusCodes.OK).json(result)
})

export const getClassById = asyncHandler(async (req, res) => {
  const result = await classService.getClassById(req.params.id)
  res.status(StatusCodes.OK).json(result)
})

export const createClass = asyncHandler(async (req, res) => {
  const result = await classService.createClass(req.body)
  res.status(StatusCodes.CREATED).json(result)
})

export const updateClass = asyncHandler(async (req, res) => {
  const result = await classService.updateClass(req.params.id, req.body)
  res.status(StatusCodes.OK).json(result)
})

export const deleteClass = asyncHandler(async (req, res) => {
  const result = await classService.deleteClass(req.params.id)
  res.status(StatusCodes.OK).json(result)
})
