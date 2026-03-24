import Equipment from '../models/Equipment.js'
import Report from '../models/Report.js'
import BorrowRequest from '../models/BorrowRequest.js'

const getDashboardStats = async () => {
  const totalEquipment = await Equipment.countDocuments()
  const brokenEquipment = await Equipment.countDocuments({ status: 'broken' })
  const pendingRequests = await BorrowRequest.countDocuments({
    status: 'pending',
  })
  const pendingTickets = await Report.countDocuments({ status: 'pending' })

  return {
    totalEquipment,
    brokenEquipment,
    pendingRequests,
    pendingTickets,
    // Add missing metrics for frontend
    equipmentTrend: 0,
    criticalRepairs: brokenEquipment,
    avgResponseTimeHours: 0,
    efficiencyRate: 100
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
  return await BorrowRequest.find({ status: 'pending' })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('user_id', 'name avatar department')
    .populate('equipment_id', 'name')
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
        'user_id.name': 1,
        'user_id.avatar': 1,
        'equipment_id.name': 1,
        description: 1,
        priority: 1,
        status: 1,
        createdAt: 1,
      },
    },
  ])
}

export const adminService = {
  getDashboardStats,
  getDashboardChart,
  getHealthStatus,
  getRecentBorrowRequests,
  getRecentDamageReports,
}
