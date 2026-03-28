import Report from '../models/Report.js'
import Equipment from '../models/Equipment.js'
import { notificationService } from './notificationService.js'

const TECH_STATUSES = {
  pending: 'pending',
  approved: 'approved',
  processing: 'processing',
  fixed: 'fixed',
}

const normalizeStatus = (status) => {
  if (!status) return undefined
  const s = String(status).trim().toLowerCase()
  const allowed = new Set(Object.values(TECH_STATUSES))
  return allowed.has(s) ? s : undefined
}

const getStats = async ({ user }) => {
  // Map to UI cards (do not change FE layout):
  // - Pending Approval -> pending
  // - Approved to Fix  -> approved
  // - In Progress      -> processing
  // - Completed        -> fixed
  const [pending, approved, processing, fixed] = await Promise.all([
    Report.countDocuments({ status: TECH_STATUSES.pending }),
    Report.countDocuments({ status: TECH_STATUSES.approved }),
    Report.countDocuments({ status: TECH_STATUSES.processing }),
    Report.countDocuments({ status: TECH_STATUSES.fixed }),
  ])

  return {
    pending,
    approved,
    inProgress: processing,
    completed: fixed,
  }
}

const getTickets = async ({ user, status }) => {
  const normalized = normalizeStatus(status)

  const filter = {}
  if (normalized) filter.status = normalized

  // Technician sees:
  // - approved tickets (unassigned or assigned to them)
  // - processing tickets assigned to them
  // - fixed tickets assigned to them
  // - pending tickets can be shown for overview (not assigned)
  // NOTE: keep permissive to match current UI expectations.
  // We do not hard-limit by assigned_to for pending/approved.
  const reports = await Report.find(filter)
    .populate('user_id', 'displayName username email')
    .populate('equipment_id', 'name category')
    .populate('room_id', 'name type')
    .populate('assigned_to', 'displayName username')
    .populate('processed_by', 'displayName username')

  return reports
}

const VALID_TRANSITIONS = {
  pending:    ['approved', 'rejected'],
  approved:   ['processing', 'rejected'],
  processing: ['fixed'],
}

const updateTicket = async ({ id, status, cause, outcome, decisionNote, assignedTo, technicianId }) => {
  const report = await Report.findById(id)
    .populate('user_id', 'role displayName username')
  if (!report) throw new Error('Ticket not found')

  const allowed = VALID_TRANSITIONS[report.status] ?? []
  if (status && !allowed.includes(status)) {
    throw new Error(`Cannot transition from "${report.status}" to "${status}"`)
  }

  const update = {}
  if (status) {
    update.status = status
    if (['approved', 'fixed', 'rejected'].includes(status)) {
      update.processed_at = new Date()
      update.processed_by = technicianId
    }
    if (status === 'processing') update.assigned_to = assignedTo ?? technicianId
  }
  if (cause) update.cause = cause
  if (typeof outcome === 'string') {
    const trimmed = outcome.trim()
    update.outcome = trimmed.length ? trimmed : null
  }
  if (decisionNote) update.decision_note = decisionNote

  const updatedReport = await Report.findByIdAndUpdate(id, { $set: update }, { new: true })
    .populate('user_id', 'displayName username role')
    .populate('equipment_id', 'name category')
    .populate('room_id', 'name')

  // Sync Equipment technical status
  if (status && updatedReport.equipment_id) {
    let eqStatus = null
    if (status === 'approved') eqStatus = 'broken'
    else if (status === 'processing') eqStatus = 'maintenance'
    else if (status === 'fixed') eqStatus = 'available'

    if (eqStatus) {
      await Equipment.findByIdAndUpdate(updatedReport.equipment_id._id, { status: eqStatus })
    }
  }

  // ── Notifications ─────────────────────────────────────────────────────────
  const reportCode = updatedReport.code || updatedReport._id.toString().slice(-6).toUpperCase()

  // Always notify admins
  await notificationService.notifyAdmins({
    type: 'report',
    title: 'Technician updated report status',
    message: `Report #${reportCode} was updated to ${updatedReport.status}${updatedReport.outcome ? ` (note: ${updatedReport.outcome})` : ''}.`,
    action: { type: 'open_detail', resource: 'report', resourceId: updatedReport._id },
  }).catch((err) => console.error('Failed to notify admins:', err))

  // Notify the reporter only if student/lecturer
  const reporterRole = updatedReport.user_id?.role
  const shouldNotifyReporter = reporterRole === 'student' || reporterRole === 'lecturer'

  if (shouldNotifyReporter && updatedReport.user_id?._id) {
    let notifTitle = 'Report Update'
    let notifMessage = `Your report #${reportCode} status has been updated to ${updatedReport.status}.`

    if (updatedReport.status === 'approved' || updatedReport.status === 'processing') {
      notifTitle = 'Report Being Processed'
      notifMessage = `Your report #${reportCode} is being processed.`
    } else if (updatedReport.status === 'fixed') {
      notifTitle = 'Issue Resolved'
      notifMessage = `Your reported issue #${reportCode} has been resolved.${updatedReport.outcome ? ` Note: ${updatedReport.outcome}` : ''}`
    } else if (updatedReport.status === 'rejected') {
      notifTitle = 'Report Rejected'
      notifMessage = `Your report #${reportCode} was rejected.${updatedReport.outcome ? ` Reason: ${updatedReport.outcome}` : ''}`
    }

    await notificationService.createNotification({
      userId: updatedReport.user_id._id,
      type: 'report',
      title: notifTitle,
      message: notifMessage,
      action: { type: 'open_detail', resource: 'report', resourceId: updatedReport._id },
    }).catch((err) => console.error('Failed to notify reporter:', err))
  }

  return updatedReport
}

export const technicianTicketService = {
  getStats,
  getTickets,
  updateTicket,
}
