import { StatusCodes } from 'http-status-codes'
import Report from '../models/Report.js'
import ApiError from '../utils/ApiError.js'

const createReport = async (body) => {
  const { user_id, equipment_id, room_id, description, imageUrl, imageId } =
    body

  const newReport = await Report.create({
    user_id,
    equipment_id,
    room_id,
    description,
    imageUrl,
    imageId,
  })

  return {
    message: 'Create report success',
    report_id: newReport._id,
  }
}

const getAllReports = async () => {
  return await Report.find()
    .populate('user_id', 'displayName email')
    .populate('equipment_id', 'name category')
    .populate('room_id', 'name type')
    .populate('approved_by', 'displayName')
}

const getReportById = async (id) => {
  const report = await Report.findById(id)
    .populate('user_id', 'displayName email')
    .populate('equipment_id', 'name category')
    .populate('room_id', 'name type')
    .populate('approved_by', 'displayName')

  if (!report) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Report not found')
  }
  return report
}

const updateReport = async (id, body) => {
  const report = await Report.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  })

  if (!report) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Report not found')
  }
  return { message: 'Update success', report }
}

const deleteReport = async (id) => {
  const report = await Report.findByIdAndDelete(id)
  if (!report) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Report not found')
  }
  return { message: 'Delete success' }
}

const getPersonalReports = async (userId) => {
  return await Report.find({ user_id: userId })
    .populate('equipment_id', 'name category')
    .populate('room_id', 'name type')
    .populate('approved_by', 'displayName')
}

const updateReportStatus = async (id, status, approverId) => {
  const allowedStatuses = [
    'pending',
    'approved',
    'rejected',
    'processing',
    'fixed',
  ]
  if (!allowedStatuses.includes(status)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid status')
  }

  const report = await Report.findById(id)
  if (!report) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Report not found')
  }

  report.status = status
  if (approverId) {
    report.approved_by = approverId
  }

  await report.save()
  return { message: 'Status updated successfully', report }
}

export const reportService = {
  createReport,
  getAllReports,
  getReportById,
  updateReport,
  deleteReport,
  getPersonalReports,
  updateReportStatus,
}
