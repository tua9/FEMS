import { StatusCodes } from 'http-status-codes'
import Class from '../models/Class.js'
import ApiError from '../utils/ApiError.js'

const getAllClasses = async () => {
  return Class.find({ isActive: true }).sort({ code: 1 })
}

const getClassById = async (id) => {
  const cls = await Class.findById(id)
  if (!cls) throw new ApiError(StatusCodes.NOT_FOUND, 'Class not found')
  return cls
}

const createClass = async (body) => {
  const { code, name, major } = body
  if (!code?.trim()) throw new ApiError(StatusCodes.BAD_REQUEST, 'Code is required')
  if (!name?.trim()) throw new ApiError(StatusCodes.BAD_REQUEST, 'Name is required')

  const existing = await Class.findOne({ code: code.trim().toUpperCase() })
  if (existing) throw new ApiError(StatusCodes.CONFLICT, 'Class code already exists')

  return Class.create({ code: code.trim(), name: name.trim(), major: major?.trim() || '' })
}

const updateClass = async (id, body) => {
  const cls = await Class.findByIdAndUpdate(id, body, { new: true, runValidators: true })
  if (!cls) throw new ApiError(StatusCodes.NOT_FOUND, 'Class not found')
  return cls
}

const deleteClass = async (id) => {
  const cls = await Class.findByIdAndUpdate(id, { isActive: false }, { new: true })
  if (!cls) throw new ApiError(StatusCodes.NOT_FOUND, 'Class not found')
  return { message: 'Class deactivated' }
}

export const classService = {
  getAllClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
}
