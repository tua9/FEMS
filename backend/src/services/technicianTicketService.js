import Report from '../models/Report.js'

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
  if (outcome) update.outcome = outcome
  if (decisionNote) update.decision_note = decisionNote

  return Report.findByIdAndUpdate(id, { $set: update }, { new: true })
    .populate('user_id', 'displayName username')
    .populate('equipment_id', 'name category')
    .populate('room_id', 'name')
}

export const technicianTicketService = {
  getStats,
  getTickets,
  updateTicket,
}
