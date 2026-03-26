import { StatusCodes } from 'http-status-codes'
import Report from '../models/Report.js'
import Equipment from '../models/Equipment.js'
import ApiError from '../utils/ApiError.js'
import { notificationService } from './notificationService.js'

// ─── Code Generation ─────────────────────────────────────────────────────────────────────

/**
 * Build one candidate code for a report.
 * Format: RP + 2-digit year + 2-digit month + 3 random uppercase letters
 * Example: RP2603ABC
 */
const generateReportCode = () => {
  const now   = new Date()
  const year  = String(now.getFullYear()).slice(-2)
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const CHARS  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const random = Array.from({ length: 3 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join('')
  return `RP${year}${month}${random}`
}

/**
 * Generate a unique report code.
 */
const generateUniqueCode = async () => {
  let code
  let exists = true
  while (exists) {
    code   = generateReportCode()
    exists = !!(await Report.findOne({ code }))
  }
  return code
}

// ─── Service Functions ─────────────────────────────────────────────────────────────────

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
  const { user_id, equipment_id, room_id, type, severity, description, img, priority, images } = body

  const code = await generateUniqueCode()

  const newReport = await Report.create({
    user_id: user_id || null,
    equipment_id: equipment_id || null,
    room_id: room_id || null,
    type: type || 'other',
    severity: severity || 'medium',
    priority: priority || severity || 'medium',
    description: description || null,
    img: img || (images && images.length > 0 ? images[0] : null),
    images: images || [],
    code,
  })

  const populated = await populateReport(Report.findById(newReport._id))

  // Notify Admins for High/Critical Severity
  if (severity === 'high' || severity === 'critical') {
    await notificationService.notifyAdmins({
      type: 'report',
      title: `Priority Alert: ${severity.toUpperCase()} Report`,
      message: `A new ${severity} report #${code} has been submitted by ${populated.user_id?.displayName || 'a user'}.`,
      to: '/admin/reports',
      state: { type: 'report', id: newReport._id, tab: 'report' }
    }).catch(err => console.error('Failed to notify admins:', err))
  }

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

const cancelReport = async (id, userId, decisionNote) => {
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
  report.decision_note = decisionNote || null
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

  const report = await Report.findById(id).populate('equipment_id', 'code')
  if (!report) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Report not found')
  }

  report.status = status
  if (status === 'processing' && technicianId) {
    report.assigned_to = technicianId
    
    // Notify Technician
    const eqCode = report.equipment_id?.code || report.equipment_id?.toString()?.slice(-6).toUpperCase()
    await notificationService.createNotification({
      user_id: technicianId,
      type: 'report',
      title: 'New Maintenance Task Assigned',
      message: `Equipment ${eqCode} has been assigned to you for repair. Please check it now.`,
      to: '/admin/reports', // As requested by user
      state: { type: 'report', id: report._id, tab: 'report' }
    }).catch(err => console.error('Failed to notify technician:', err))
  }

  if (approverId) {
    report.processed_by = approverId
    report.processed_at = new Date()
  }

  await report.save()

  // Sync Equipment Status based on report status
  if (report.equipment_id) {
    let eqStatus = null
    if (status === 'approved') eqStatus = 'broken'
    else if (status === 'processing') eqStatus = 'maintenance'
    else if (status === 'fixed') eqStatus = 'good'

    if (eqStatus) {
      await Equipment.findByIdAndUpdate(report.equipment_id, { status: eqStatus })
    }
  }

  // Notify User
  let notificationTitle = 'Report Update'
  const reportCode = report.code || report._id.toString().slice(-6).toUpperCase()
  let notificationMessage = `Your report #${reportCode} status has been updated to ${status}.`
  
  if (status === 'approved' || status === 'processing') {
    notificationTitle = 'Report Processing'
    notificationMessage = `Your report ${reportCode} is being processed. Thank you for your report.`
  } else if (status === 'fixed') {
    notificationTitle = 'Issue Resolved'
    notificationMessage = `Your reported issue #${reportCode} has been resolved. Thank you for your patience.`
  } else if (status === 'rejected') {
    notificationTitle = 'Report Rejected'
    notificationMessage = `Your report #${reportCode} was rejected. Please contact the administrator for more details.`
  }

  await notificationService.createNotification({
    user_id: report.user_id,
    type: 'report',
    title: notificationTitle,
    message: notificationMessage,
    to: '/student/notifications',
    state: { type: 'report', id: report._id, tab: 'report' }
  }).catch(err => console.error('Failed to create notification:', err))

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
