import { StatusCodes } from 'http-status-codes'
import Report from '../models/Report.js'
import ApiError from '../utils/ApiError.js'

const populateReport = (query) => {
  return query
    .populate('user_id', 'displayName email username')
    .populate('equipment_id', 'name category')
    .populate('room_id', 'name type')
    .populate('room_id', 'name type')
    .populate('processed_by', 'displayName username')
    .populate('assigned_to', 'displayName username')
}

const createReport = async (body) => {
  const { user_id, equipment_id, room_id, type, severity, description, img, priority } = body

  const newReport = await Report.create({
    user_id: user_id || null,
    equipment_id: equipment_id || null,
    room_id: room_id || null,
    type: type || 'other',
    severity: severity || 'medium',
    priority: priority || severity || 'medium',
    description: description || null,
    img: img || null,
  })

  const populated = await populateReport(Report.findById(newReport._id))

  return {
    message: 'Create report success',
    report_id: newReport._id,
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

const cancelReport = async (id, userId) => {
  const report = await Report.findOne({ _id: id, user_id: userId })
  if (!report) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Report not found')
  }
  if (report.status !== 'pending') {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Only pending reports can be cancelled',
    )
  }
  report.status = 'cancelled'
  await report.save()
  return { message: 'Report cancelled successfully', report }
}

const updateReportStatus = async (id, status, approverId, technicianId) => {
  const allowedStatuses = [
    'pending',
    'approved',
    'rejected',
    'processing',
    'fixed',
    'cancelled'
  ]
  if (!allowedStatuses.includes(status)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid status')
  }

  const report = await Report.findById(id)
  if (!report) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Report not found')
  }

  report.status = status
  if (status === 'processing' && technicianId) {
    report.assigned_to = technicianId
  }

  if (approverId) {
    report.processed_by = approverId
    report.processed_at = new Date()
  }

  await report.save()

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
  cancelReport,
  updateReportStatus,
}
