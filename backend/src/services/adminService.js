import Equipment from '../models/Equipment.js'
import Report from '../models/Report.js'
import BorrowRequest from '../models/BorrowRequest.js'

const getDashboardStats = async () => {
  const totalEquipment = await Equipment.countDocuments()
  const brokenEquipment = await Equipment.countDocuments({ status: 'broken' })
  const maintenanceEquipment = await Equipment.countDocuments({
    status: 'maintenance',
  })
  const inUseEquipment = await Equipment.countDocuments({ status: 'in_use' })
  const pendingRequests = await BorrowRequest.countDocuments({
    status: 'pending',
  })
  const pendingTickets = await Report.countDocuments({ status: 'pending' })

  // % of fleet currently borrowed (in_use / total)
  const borrowRate =
    totalEquipment > 0
      ? Math.round((inUseEquipment / totalEquipment) * 100)
      : 0

  // % of fleet broken or under maintenance (damage / maintenance burden)
  const damageRate =
    totalEquipment > 0
      ? Math.round(
          ((brokenEquipment + maintenanceEquipment) / totalEquipment) * 100,
        )
      : 0

  return {
    totalEquipment,
    brokenEquipment,
    pendingRequests,
    pendingTickets,
    borrowRate,
    damageRate,
    inUseEquipment,
    maintenanceEquipment,
    // Add missing metrics for frontend
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
    { $match: { equipment_id: { $ne: null } } },
    { $group: { _id: '$equipment_id', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: 'equipment',
        localField: '_id',
        foreignField: '_id',
        as: 'equipment',
      },
    },
    { $unwind: '$equipment' },
    { $project: { name: '$equipment.name', count: 1 } },
  ])

  return {
    reportStatus,
    topBorrowedEquipment,
  }
}

const getHealthStatus = async () => {
  const total = await Equipment.countDocuments()
  if (total === 0) {
    return { healthy: 100, available: 0, maintenance: 0, broken: 0 }
  }

  const available = await Equipment.countDocuments({ status: 'good' })
  const maintenance = await Equipment.countDocuments({ status: 'maintenance' })
  const broken = await Equipment.countDocuments({ status: 'broken' })

  const healthy = Math.round((available / total) * 100)

  return {
    healthy,
    available,
    maintenance,
    broken,
  }
}

const getRecentBorrowRequests = async () => {
  const requests = await BorrowRequest.find({ status: 'pending' })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('user_id', 'displayName avatarUrl username')
    .populate('equipment_id', 'name')
    .lean()

  return requests.map((req) => ({
    ...req,
    user_id: req.user_id
      ? {
          ...req.user_id,
          name: req.user_id.displayName || req.user_id.username,
          avatar: req.user_id.avatarUrl,
        }
      : null,
  }))
}

const getRecentDamageReports = async () => {
  return await Report.aggregate([
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
        as: 'user_id',
      },
    },
    { $unwind: { path: '$user_id', preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: 'equipment',
        localField: 'equipment_id',
        foreignField: '_id',
        as: 'equipment_id',
      },
    },
    { $unwind: { path: '$equipment_id', preserveNullAndEmptyArrays: true } },
    {
      $project: {
        'user_id.name': { $ifNull: ['$user_id.displayName', '$user_id.username'] },
        'user_id.avatar': '$user_id.avatarUrl',
        'equipment_id.name': 1,
        description: 1,
        priority: 1,
        status: 1,
        createdAt: 1,
      },
    },
  ])
}

// ─── Equipment Analytics ──────────────────────────────────────────────────────

const getEquipmentAnalytics = async () => {
  // 1. Status distribution
  const statusGroups = await Equipment.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ])
  const statusMap = Object.fromEntries(statusGroups.map((g) => [g._id, g.count]))
  // Lifecycle view for dashboard pie: Available, Borrowed, Under Maintenance, Pending Disposal
  const availableCount =
    (statusMap.good || 0) + (statusMap.reserved || 0)
  const borrowedCount = statusMap.in_use || 0
  const maintenanceCount = statusMap.maintenance || 0
  const pendingDisposalCount = statusMap.broken || 0
  const statusDistribution = [
    { status: 'available', label: 'Available', count: availableCount },
    { status: 'borrowed', label: 'Borrowed', count: borrowedCount },
    { status: 'under_maintenance', label: 'Under Maintenance', count: maintenanceCount },
    { status: 'pending_disposal', label: 'Pending Disposal', count: pendingDisposalCount },
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
    { $match: { status: { $in: ['handed_over', 'returned'] }, updatedAt: { $gte: sixMonthsAgo } } },
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
    { $match: { equipment_id: { $ne: null } } },
    { $group: { _id: '$equipment_id', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
    { $lookup: { from: 'equipment', localField: '_id', foreignField: '_id', as: 'equipment' } },
    { $unwind: '$equipment' },
    { $project: { name: '$equipment.name', category: '$equipment.category', count: 1 } },
  ])

  // 4b. Top borrowed by model (fallback to equipment name when model is empty)
  const topBorrowedModels = await BorrowRequest.aggregate([
    { $match: { equipment_id: { $ne: null } } },
    { $lookup: { from: 'equipment', localField: 'equipment_id', foreignField: '_id', as: 'equipment' } },
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

  // 6. Maintenance attention: top equipment by (reportCount desc, borrowCount desc)
  const maintenanceAttention = await BorrowRequest.aggregate([
    { $match: { equipment_id: { $ne: null } } },
    { $group: { _id: '$equipment_id', borrowCount: { $sum: 1 } } },
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

// ─── Report Analytics ─────────────────────────────────────────────────────────

const getReportAnalytics = async () => {
  // 1. MTTR
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

  // 2. Cause distribution
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

  // 3. Top most broken equipment
  const topBrokenEquipment = await Report.aggregate([
    { $match: { equipment_id: { $ne: null }, type: 'equipment' } },
    { $group: { _id: '$equipment_id', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
    { $lookup: { from: 'equipment', localField: '_id', foreignField: '_id', as: 'equipment' } },
    { $unwind: '$equipment' },
    {
      $project: {
        name: '$equipment.name',
        model: '$equipment.model',
        status: '$equipment.status',
        count: 1,
      },
    },
  ])

  // 4. Repair outcomes
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

  // 5. Equipment damage rate: equipment reports / total reports
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
