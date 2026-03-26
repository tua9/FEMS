import Equipment from '../models/Equipment.js'
import Report from '../models/Report.js'
import BorrowRequest from '../models/BorrowRequest.js'
import Schedule from '../models/Schedule.js'
import Slot from '../models/Slot.js'
import User from '../models/User.js'

const getDashboardStats = async () => {
  const totalEquipment = await Equipment.countDocuments()
  const brokenEquipment = await Equipment.countDocuments({ status: 'broken' })
  const maintenanceEquipment = await Equipment.countDocuments({ status: 'maintenance' })
  const pendingRequests = await BorrowRequest.countDocuments({ status: 'pending' })

  // Derive "in use" count from BorrowRequest (source of truth)
  const inUseEquipment = await BorrowRequest.countDocuments({ status: 'handed_over' })

  const borrowRate =
    totalEquipment > 0 ? Math.round((inUseEquipment / totalEquipment) * 100) : 0

  const damageRate =
    totalEquipment > 0
      ? Math.round(((brokenEquipment + maintenanceEquipment) / totalEquipment) * 100)
      : 0

  return {
    totalEquipment,
    brokenEquipment,
    pendingRequests,
    borrowRate,
    damageRate,
    inUseEquipment,
    maintenanceEquipment,
    equipmentTrend: 0,
    criticalRepairs: brokenEquipment,
    avgResponseTimeHours: 0,
    efficiencyRate: 100,
  }
}

const getDashboardChart = async () => {
  const reportStatus = await Report.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ])

  const topBorrowedEquipment = await BorrowRequest.aggregate([
    { $match: { equipmentId: { $ne: null } } },
    { $group: { _id: '$equipmentId', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
    { $lookup: { from: 'equipment', localField: '_id', foreignField: '_id', as: 'equipment' } },
    { $unwind: '$equipment' },
    { $project: { name: '$equipment.name', count: 1 } },
  ])

  return { reportStatus, topBorrowedEquipment }
}

const getHealthStatus = async () => {
  const total = await Equipment.countDocuments()
  if (total === 0) return { healthy: 100, available: 0, maintenance: 0, broken: 0 }

  const available = await Equipment.countDocuments({ status: 'good' })
  const maintenance = await Equipment.countDocuments({ status: 'maintenance' })
  const broken = await Equipment.countDocuments({ status: 'broken' })
  const healthy = Math.round((available / total) * 100)

  return { healthy, available, maintenance, broken }
}

const getRecentBorrowRequests = async () => {
  const requests = await BorrowRequest.find({ status: 'pending' })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('borrowerId', 'displayName avatarUrl username')
    .populate('equipmentId', 'name')
    .lean()

  return requests.map((req) => ({
    ...req,
    borrowerId: req.borrowerId
      ? {
          ...req.borrowerId,
          name: req.borrowerId.displayName || req.borrowerId.username,
          avatar: req.borrowerId.avatarUrl,
        }
      : null,
  }))
}

const getRecentDamageReports = async () => {
  return Report.aggregate([
    { $match: { status: 'pending' } },
    {
      $addFields: {
        priorityOrder: {
          $switch: {
            branches: [
              { case: { $eq: ['$priority', 'critical'] }, then: 4 },
              { case: { $eq: ['$priority', 'high'] }, then: 3 },
              { case: { $eq: ['$priority', 'medium'] }, then: 2 },
              { case: { $eq: ['$priority', 'low'] }, then: 1 },
            ],
            default: 0,
          },
        },
      },
    },
    { $sort: { priorityOrder: -1, createdAt: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: 'users',
        localField: 'user_id',
        foreignField: '_id',
        as: 'reporter',
      },
    },
    { $unwind: { path: '$reporter', preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: 'equipment',
        localField: 'equipment_id',
        foreignField: '_id',
        as: 'equipment',
      },
    },
    { $unwind: { path: '$equipment', preserveNullAndEmptyArrays: true } },
    {
      $project: {
        reporter: {
          name: { $ifNull: ['$reporter.displayName', '$reporter.username'] },
          avatar: '$reporter.avatarUrl',
        },
        equipment: { name: '$equipment.name' },
        description: 1,
        priority: 1,
        status: 1,
        createdAt: 1,
      },
    },
  ])
}

// ── Equipment Analytics ───────────────────────────────────────────────────────

const getEquipmentAnalytics = async () => {
  // 1. Status distribution — derive "borrowed" from BorrowRequest
  const statusGroups = await Equipment.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ])
  const statusMap = Object.fromEntries(statusGroups.map((g) => [g._id, g.count]))

  const inUseCount = await BorrowRequest.countDocuments({ status: 'handed_over' })
  const reservedCount = await BorrowRequest.countDocuments({ status: 'approved' })

  const availableCount = Math.max((statusMap.good || 0) - inUseCount - reservedCount, 0)
  const statusDistribution = [
    { status: 'available', label: 'Available', count: availableCount },
    { status: 'in_use', label: 'Borrowed', count: inUseCount },
    { status: 'reserved', label: 'Reserved', count: reservedCount },
    { status: 'under_maintenance', label: 'Under Maintenance', count: statusMap.maintenance || 0 },
    { status: 'pending_disposal', label: 'Pending Disposal', count: statusMap.broken || 0 },
  ]

  // 2. Build last-6-months scaffold
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date()
    d.setDate(1)
    d.setHours(0, 0, 0, 0)
    d.setMonth(d.getMonth() - (5 - i))
    return {
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      label: d.toLocaleString('en', { month: 'short' }) + " '" + String(d.getFullYear()).slice(2),
    }
  })
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5)
  sixMonthsAgo.setDate(1)
  sixMonthsAgo.setHours(0, 0, 0, 0)

  // 3. Monthly borrow/return trend
  const borrowTrendRaw = await BorrowRequest.aggregate([
    {
      $match: {
        status: { $in: ['handed_over', 'returned'] },
        updatedAt: { $gte: sixMonthsAgo },
      },
    },
    {
      $group: {
        _id: { year: { $year: '$updatedAt' }, month: { $month: '$updatedAt' }, status: '$status' },
        count: { $sum: 1 },
      },
    },
  ])
  const borrowMap = {}
  borrowTrendRaw.forEach((r) => {
    const key = `${r._id.year}-${r._id.month}`
    if (!borrowMap[key]) borrowMap[key] = { borrowed: 0, returned: 0 }
    if (r._id.status === 'handed_over') borrowMap[key].borrowed = r.count
    if (r._id.status === 'returned') borrowMap[key].returned = r.count
  })
  const monthlyBorrowTrend = months.map((m) => ({
    label: m.label,
    borrowed: borrowMap[`${m.year}-${m.month}`]?.borrowed || 0,
    returned: borrowMap[`${m.year}-${m.month}`]?.returned || 0,
  }))

  // 4. Top borrowed equipment
  const topBorrowedEquipment = await BorrowRequest.aggregate([
    { $match: { equipmentId: { $ne: null } } },
    { $group: { _id: '$equipmentId', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
    { $lookup: { from: 'equipment', localField: '_id', foreignField: '_id', as: 'equipment' } },
    { $unwind: '$equipment' },
    { $project: { name: '$equipment.name', category: '$equipment.category', count: 1 } },
  ])

  // 4b. Top borrowed by model
  const topBorrowedModels = await BorrowRequest.aggregate([
    { $match: { equipmentId: { $ne: null } } },
    { $lookup: { from: 'equipment', localField: 'equipmentId', foreignField: '_id', as: 'equipment' } },
    { $unwind: '$equipment' },
    {
      $addFields: {
        modelLabel: {
          $cond: [
            { $gt: [{ $strLenCP: { $ifNull: ['$equipment.model', ''] } }, 0] },
            '$equipment.model',
            '$equipment.name',
          ],
        },
      },
    },
    { $group: { _id: '$modelLabel', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
    { $project: { name: '$_id', count: 1, _id: 0 } },
  ])

  // 5. Damage trend by month
  const damageTrendRaw = await Report.aggregate([
    { $match: { type: 'equipment', createdAt: { $gte: sixMonthsAgo } } },
    { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, count: { $sum: 1 } } },
  ])
  const damageMap = Object.fromEntries(
    damageTrendRaw.map((r) => [`${r._id.year}-${r._id.month}`, r.count])
  )
  const damageTrend = months.map((m) => ({
    label: m.label,
    count: damageMap[`${m.year}-${m.month}`] || 0,
  }))

  // 6. Maintenance attention list
  const maintenanceAttention = await BorrowRequest.aggregate([
    { $match: { equipmentId: { $ne: null } } },
    { $group: { _id: '$equipmentId', borrowCount: { $sum: 1 } } },
    { $sort: { borrowCount: -1 } },
    { $limit: 20 },
    { $lookup: { from: 'equipment', localField: '_id', foreignField: '_id', as: 'equipment' } },
    { $unwind: '$equipment' },
    {
      $lookup: {
        from: 'reports',
        let: { eqId: '$_id' },
        pipeline: [
          { $match: { $expr: { $eq: ['$equipment_id', '$$eqId'] } } },
          { $count: 'total' },
        ],
        as: 'reportStats',
      },
    },
    {
      $addFields: {
        reportCount: { $ifNull: [{ $arrayElemAt: ['$reportStats.total', 0] }, 0] },
      },
    },
    {
      $project: {
        name: '$equipment.name',
        status: '$equipment.status',
        borrowCount: 1,
        reportCount: 1,
      },
    },
    { $sort: { reportCount: -1, borrowCount: -1 } },
    { $limit: 5 },
  ])

  return {
    statusDistribution,
    monthlyBorrowTrend,
    topBorrowedEquipment,
    topBorrowedModels,
    damageTrend,
    maintenanceAttention,
  }
}

// ── Report Analytics ──────────────────────────────────────────────────────────

const getReportAnalytics = async () => {
  const fixedReports = await Report.find(
    { status: 'fixed', processed_at: { $ne: null } },
    { createdAt: 1, processed_at: 1 }
  ).lean()

  let mttrHours = 0
  if (fixedReports.length > 0) {
    const totalMs = fixedReports.reduce(
      (sum, r) => sum + (new Date(r.processed_at) - new Date(r.createdAt)),
      0
    )
    mttrHours = Math.round(totalMs / fixedReports.length / (1000 * 60 * 60))
  }

  const CAUSE_LABELS = {
    user_error: 'User damage',
    hardware: 'Hardware failure',
    software: 'Software issues',
    environment: 'Environmental',
    unknown: 'Unknown',
  }
  const causeGroups = await Report.aggregate([
    { $match: { type: 'equipment' } },
    { $group: { _id: { $ifNull: ['$cause', 'unknown'] }, count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ])
  const causeDistribution = causeGroups.map((g) => ({
    cause: g._id,
    label: CAUSE_LABELS[g._id] || g._id,
    count: g.count,
  }))

  const topBrokenEquipment = await Report.aggregate([
    { $match: { equipment_id: { $ne: null }, type: 'equipment' } },
    { $group: { _id: '$equipment_id', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
    { $lookup: { from: 'equipment', localField: '_id', foreignField: '_id', as: 'equipment' } },
    { $unwind: '$equipment' },
    { $project: { name: '$equipment.name', model: '$equipment.model', status: '$equipment.status', count: 1 } },
  ])

  const OUTCOME_LABELS = {
    fixed_internally: 'Repaired on-site',
    external_warranty: 'External warranty',
    beyond_repair: 'Beyond repair',
  }
  const outcomeGroups = await Report.aggregate([
    { $match: { status: 'fixed' } },
    { $group: { _id: { $ifNull: ['$outcome', 'fixed_internally'] }, count: { $sum: 1 } } },
  ])
  const repairOutcomes = outcomeGroups.map((g) => ({
    outcome: g._id,
    label: OUTCOME_LABELS[g._id] || g._id,
    count: g.count,
  }))

  const [totalReports, equipmentReports] = await Promise.all([
    Report.countDocuments(),
    Report.countDocuments({ type: 'equipment' }),
  ])
  const damageReportRate = totalReports > 0 ? Math.round((equipmentReports / totalReports) * 100) : 0

  return { mttrHours, fixedCount: fixedReports.length, causeDistribution, topBrokenEquipment, repairOutcomes, damageReportRate }
}

// ── Technician Performance ────────────────────────────────────────────────────

const getTechnicianPerformance = async () => {
  // Start of the current Monday (local week)
  const now = new Date()
  const day = now.getDay() // 0 = Sunday
  const diff = day === 0 ? -6 : 1 - day
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() + diff)
  startOfWeek.setHours(0, 0, 0, 0)
  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 7)

  // Reports touched/updated this week that have an assigned technician
  const reports = await Report.find({
    assigned_to: { $exists: true, $ne: null },
    updatedAt: { $gte: startOfWeek, $lt: endOfWeek },
  })
    .populate('assigned_to', 'displayName username avatarUrl role')
    .lean()

  const techMap = {}
  for (const r of reports) {
    if (!r.assigned_to) continue
    const tid = r.assigned_to._id.toString()
    if (!techMap[tid]) {
      techMap[tid] = { technician: r.assigned_to, total: 0, completed: 0 }
    }
    techMap[tid].total++
    if (r.status === 'fixed') techMap[tid].completed++
  }

  let technicians = Object.values(techMap).map((t) => ({
    ...t,
    percentage: t.total > 0 ? Math.round((t.completed / t.total) * 100) : 0,
  }))

  // If nothing assigned this week, show all active technicians with zero stats
  if (technicians.length === 0) {
    const allTechs = await User.find(
      { role: 'technician', isActive: true },
      'displayName username avatarUrl'
    ).lean()
    technicians = allTechs.map((t) => ({
      technician: t,
      total: 0,
      completed: 0,
      percentage: 0,
    }))
  }

  return { technicians, weekStart: startOfWeek, weekEnd: endOfWeek }
}

// ── Active Borrowing (current time slot) ─────────────────────────────────────

const SLOT_RANGES = [
  { order: 1, start: 7 * 60, end: 9 * 60 + 15 },        // 07:00 – 09:15
  { order: 2, start: 9 * 60 + 30, end: 11 * 60 + 45 },  // 09:30 – 11:45
  { order: 3, start: 12 * 60 + 30, end: 14 * 60 + 45 }, // 12:30 – 14:45
  { order: 4, start: 15 * 60, end: 17 * 60 + 15 },      // 15:00 – 17:15
]

const getActiveBorrowing = async () => {
  // Current time in Vietnam (UTC+7)
  const vnOffset = 7 * 60 * 60 * 1000
  const vnNow = new Date(Date.now() + vnOffset)
  const timeInMinutes = vnNow.getUTCHours() * 60 + vnNow.getUTCMinutes()

  const activeRange = SLOT_RANGES.find(
    (s) => timeInMinutes >= s.start && timeInMinutes <= s.end
  )

  // Today's date boundaries in UTC (compensate for VN offset)
  const todayStart = new Date(
    Date.UTC(vnNow.getUTCFullYear(), vnNow.getUTCMonth(), vnNow.getUTCDate()) - vnOffset
  )
  const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000)

  if (!activeRange) {
    return { active: false, sessions: [], currentSlot: null, currentTimeMinutes: timeInMinutes }
  }

  const dbSlot = await Slot.findOne({ order: activeRange.order }).lean()

  const scheduleQuery = {
    date: { $gte: todayStart, $lt: todayEnd },
    status: { $in: ['scheduled', 'ongoing'] },
  }
  if (dbSlot) scheduleQuery.slotId = dbSlot._id

  const schedules = await Schedule.find(scheduleQuery)
    .populate('roomId', 'name')
    .populate('lecturerId', 'displayName username avatarUrl')
    .populate('classId', 'code name')
    .populate('slotId', 'name startTime endTime order')
    .lean()

  const sessions = await Promise.all(
    schedules.map(async (schedule) => {
      const requests = await BorrowRequest.find({
        scheduleId: schedule._id,
        status: { $in: ['pending', 'approved', 'handed_over', 'returned'] },
      })
        .populate('borrowerId', 'displayName username avatarUrl')
        .populate('equipmentId', 'name code category status img')
        .lean()

      const equipment = requests.map((req) => ({
        requestId: req._id,
        requestCode: req.code,
        equipment: req.equipmentId,
        borrowedBy: req.borrowerId,
        startTime: req.borrowDate || schedule.startAt,
        requestStatus: req.status,
      }))

      return {
        scheduleId: schedule._id,
        course: schedule.title,
        class: schedule.classId,
        room: schedule.roomId,
        lecturer: schedule.lecturerId,
        slot: schedule.slotId || dbSlot,
        equipment,
      }
    })
  )

  return {
    active: true,
    currentSlot: dbSlot,
    slotRange: activeRange,
    currentTimeMinutes: timeInMinutes,
    sessions,
  }
}

export const adminService = {
  getDashboardStats,
  getDashboardChart,
  getHealthStatus,
  getRecentBorrowRequests,
  getRecentDamageReports,
  getEquipmentAnalytics,
  getReportAnalytics,
  getTechnicianPerformance,
  getActiveBorrowing,
}
