import { StatusCodes } from 'http-status-codes'
import Report from '../models/Report.js'
import Equipment from '../models/Equipment.js'
import ApiError from '../utils/ApiError.js'
import { notificationService } from './notificationService.js'

// ── Code Generation ───────────────────────────────────────────────────────────

const generateReportCode = () => {
  const now = new Date()
  const year = String(now.getFullYear()).slice(-2)
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const random = Array.from({ length: 3 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join('')
  return `RP${year}${month}${random}`
}

const generateUniqueCode = async () => {
  let code
  let exists = true
  while (exists) {
    code = generateReportCode()
    exists = !!(await Report.findOne({ code }))
  }
  return code
}

// ── Helpers ───────────────────────────────────────────────────────────────────

// Report model still uses snake_case (user_id, equipment_id, etc.)
// We only update the notification calls here to use the new Notification schema.
const populateReport = (query) =>
  query
    .populate('user_id', 'displayName email username')
    .populate('equipment_id', 'name category')
    .populate('room_id', 'name type')
    .populate('processed_by', 'displayName username')
    .populate('assigned_to', 'displayName username')

// ── Service Functions ─────────────────────────────────────────────────────────

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
    img: img || (images?.length > 0 ? images[0] : null),
    images: images || [],
    code,
  })

  const populated = await populateReport(Report.findById(newReport._id))

  if (severity === 'high' || severity === 'critical') {
    await notificationService.notifyAdmins({
      type: 'report',
      title: `Priority Alert: ${severity.toUpperCase()} Report`,
      message: `A new ${severity} report #${code} has been submitted by ${populated.user_id?.displayName || 'a user'}.`,
      action: { type: 'open_detail', resource: 'report', resourceId: newReport._id },
    }).catch(err => console.error('Failed to notify admins:', err))
  }

  return { message: 'Report created', report_id: newReport._id, report: populated }
}

const getAllReports = async () => populateReport(Report.find())

const getReportById = async (id) => {
  const report = await populateReport(Report.findById(id))
  if (!report) throw new ApiError(StatusCodes.NOT_FOUND, 'Report not found')
  return report
}

const updateReport = async (id, body) => {
  const report = await Report.findByIdAndUpdate(id, body, { new: true, runValidators: true })
  if (!report) throw new ApiError(StatusCodes.NOT_FOUND, 'Report not found')
  return { message: 'Report updated', report: await populateReport(Report.findById(report._id)) }
}

const deleteReport = async (id) => {
  const report = await Report.findByIdAndDelete(id)
  if (!report) throw new ApiError(StatusCodes.NOT_FOUND, 'Report not found')
  return { message: 'Report deleted' }
}

const getPersonalReports = async (userId) => populateReport(Report.find({ user_id: userId }))

const cancelReport = async (id, userId, decisionNote) => {
  const report = await Report.findOne({ _id: id, user_id: userId })
  if (!report) throw new ApiError(StatusCodes.NOT_FOUND, 'Report not found')
  if (report.status !== 'pending') {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Only pending reports can be cancelled')
  }
  report.status = 'cancelled'
  report.decision_note = decisionNote || null
  await report.save()
  return { message: 'Report cancelled', report }
}

const updateReportStatus = async (id, status, approverId, technicianId) => {
  const allowed = ['pending', 'approved', 'rejected', 'processing', 'fixed', 'cancelled']
  if (!allowed.includes(status)) throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid status')

  const report = await Report.findById(id).populate('equipment_id', 'code name')
  if (!report) throw new ApiError(StatusCodes.NOT_FOUND, 'Report not found')

  report.status = status

  if (status === 'processing' && technicianId) {
    report.assigned_to = technicianId
    const eqCode = report.equipment_id?.code || report.equipment_id?._id?.toString().slice(-6).toUpperCase()
    await notificationService.createNotification({
      userId: technicianId,
      type: 'report',
      title: 'New Maintenance Task Assigned',
      message: `Equipment ${eqCode} has been assigned to you for repair.`,
      action: { type: 'open_detail', resource: 'report', resourceId: report._id },
    }).catch(err => console.error('Failed to notify technician:', err))
  }

  if (approverId) {
    report.processed_by = approverId
    report.processed_at = new Date()
  }

  await report.save()

  // Sync Equipment technical status
  if (report.equipment_id) {
    let eqStatus = null
    if (status === 'approved') eqStatus = 'broken'
    else if (status === 'processing') eqStatus = 'maintenance'
    else if (status === 'fixed') eqStatus = 'available'
    
    if (eqStatus) await Equipment.findByIdAndUpdate(report.equipment_id, { status: eqStatus })
  }

  // Notify the reporter
  const reportCode = report.code || report._id.toString().slice(-6).toUpperCase()
  let notifTitle = 'Report Update'
  let notifMessage = `Your report #${reportCode} status has been updated to ${status}.`

  if (status === 'approved' || status === 'processing') {
    notifTitle = 'Report Being Processed'
    notifMessage = `Your report #${reportCode} is being processed.`
  } else if (status === 'fixed') {
    notifTitle = 'Issue Resolved'
    notifMessage = `Your reported issue #${reportCode} has been resolved.`
  } else if (status === 'rejected') {
    notifTitle = 'Report Rejected'
    notifMessage = `Your report #${reportCode} was rejected. Please contact the administrator.`
  }

  await notificationService.createNotification({
    userId: report.user_id,
    type: 'report',
    title: notifTitle,
    message: notifMessage,
    action: { type: 'open_detail', resource: 'report', resourceId: report._id },
  }).catch(err => console.error('Failed to notify reporter:', err))

  return { message: 'Status updated', report: await populateReport(Report.findById(id)) }
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
