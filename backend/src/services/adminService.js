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
  }
}

const getDashboardChart = async () => {
  const reportStatus = await Report.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ])

  const topBrokenEquipment = await Report.aggregate([
    { $match: { equipment_id: { $ne: null } } },
    { $group: { _id: '$equipment_id', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: 'equipments',
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
    topBrokenEquipment,
  }
}

export const adminService = {
  getDashboardStats,
  getDashboardChart,
}
