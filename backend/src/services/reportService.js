import { StatusCodes } from 'http-status-codes'
import Report from '../models/Report.js'
import ApiError from '../utils/ApiError.js'

const populateReport = (query) => {
  return query
    .populate('user_id', 'displayName email username')
    .populate('equipment_id', 'name category')
    .populate('room_id', 'name type')
    .populate('approved_by', 'displayName username')
}

const createReport = async (body) => {
  const { user_id, equipment_id, room_id, description, imageUrl, imageId, priority } =
    body

  const newReport = await Report.create({
    user_id,
    equipment_id,
    room_id,
    description,
    imageUrl,
    imageId,
    priority: priority || 'medium'
  })

  // Return full report populated
  const populated = await populateReport(Report.findById(newReport._id))

  return {
    message: 'Create report success',
    report: populated,
  }
}

const getAllReports = async () => {
  return await populateReport(Report.find())
}

const getReportById = async (id) => {
  const report = await populateReport(Report.findById(id))

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

  const populated = await populateReport(Report.findById(report._id))

  return { message: 'Update success', report: populated }
}

const deleteReport = async (id) => {
  const report = await Report.findByIdAndDelete(id)
  if (!report) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Report not found')
  }
  return { message: 'Delete success' }
}

const getPersonalReports = async (userId) => {
  return await populateReport(Report.find({ user_id: userId }))
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

  // Re-fetch populated
  const populated = await populateReport(Report.findById(id))

  return { message: 'Status updated successfully', report: populated }
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
