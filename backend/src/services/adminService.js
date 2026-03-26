import Equipment from '../models/Equipment.js'
import Report from '../models/Report.js'
import BorrowRequest from '../models/BorrowRequest.js'

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

  const available = await Equipment.countDocuments({ status: 'available' })
  const maintenance = await Equipment.countDocuments({ status: 'maintenance' })
  const broken = await Equipment.countDocuments({ status: 'broken' })
  const healthy = Math.round((available / total) * 100)

  return { healthy, available, maintenance, broken }
}

// ── Recent dashboard lists ────────────────────────────────────────────────────

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
  const reports = await Report.find({ type: 'equipment' })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('reporterId', 'displayName avatarUrl username')
    .populate('equipment_id', 'name')
    .lean()

  return reports.map((r) => ({
    ...r,
    reporterId: r.reporterId
      ? {
          ...r.reporterId,
          name: r.reporterId.displayName || r.reporterId.username,
          avatar: r.reporterId.avatarUrl,
        }
      : null,
  }))
}

// ── Equipment Analytics ───────────────────────────────────────────────────────

const getEquipmentAnalytics = async () => {
  // 1. Status distribution (technical statuses only)
  const statusGroups = await Equipment.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ])
  const statusMap = Object.fromEntries(statusGroups.map((g) => [g._id, g.count]))

  const inUseCount = await BorrowRequest.countDocuments({ status: 'handed_over' })
  const reservedCount = await BorrowRequest.countDocuments({ status: 'approved' })

  const availableCount = Math.max((statusMap.good || 0) - inUseCount - reservedCount, 0)
  const statusDistribution = [
    { status: 'available', label: 'Available', count: statusMap.available || 0 },
    { status: 'maintenance', label: 'Maintenance', count: statusMap.maintenance || 0 },
    { status: 'broken', label: 'Broken', count: statusMap.broken || 0 },
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

export const adminService = {
  getDashboardStats,
  getDashboardChart,
  getHealthStatus,
  getRecentBorrowRequests,
  getRecentDamageReports,
  getEquipmentAnalytics,
  getReportAnalytics,
}
