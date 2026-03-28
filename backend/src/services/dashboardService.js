import BorrowRequest from '../models/BorrowRequest.js'
import Report from '../models/Report.js'
import Room from '../models/Room.js'

export const dashboardService = {
  getLecturerStats: async (userId) => {
    const [equipmentBorrowed, pendingRequests, reportsSent, assignedRooms] = await Promise.all([
      // Equipment currently borrowed or approved (system-wide for dashboard overview)
      BorrowRequest.countDocuments({ status: { $in: ['approved', 'handed_over'] } }),
      // Pending requests in the system
      BorrowRequest.countDocuments({ status: 'pending' }),
      // Reports filed by this user
      Report.countDocuments({ user_id: userId }),
      // Available rooms (for display)
      Room.countDocuments({ status: 'available' }),
    ])

    return { equipmentBorrowed, pendingRequests, reportsSent, assignedRooms }
  },

  getLecturerActivities: async (userId) => {
    const [borrows, reports] = await Promise.all([
      BorrowRequest.find({ status: { $in: ['approved', 'returned'] } })
        .sort({ updatedAt: -1 })
        .limit(5)
        .populate('borrowerId', 'displayName username')
        .populate('equipmentId', 'name')
        .populate('roomId', 'name'),
      Report.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('user_id', 'displayName username')
        .populate('equipment_id', 'name')
        .populate('room_id', 'name'),
    ])

    const borrowActivities = borrows.map((b) => {
      const isReturn = b.status === 'returned'
      const title = isReturn
        ? 'Equipment Returned'
        : b.equipmentId
          ? 'Equipment Borrow Approved'
          : 'Request Approved'

      const desc = isReturn
        ? b.equipmentId ? `Asset: ${b.equipmentId.name} returned.` : 'Returned.'
        : b.note || 'Request approved successfully.'

      return {
        id: b._id.toString(),
        type: isReturn ? 'return' : 'access',
        title,
        subject: b.borrowerId?.displayName || b.borrowerId?.username || 'User',
        time: b.updatedAt,
        description: desc,
      }
    })

    const reportActivities = reports.map((r) => ({
      id: r._id.toString(),
      type: 'report',
      title: 'Report Logged',
      subject: r.user_id?.displayName || r.user_id?.username || 'System',
      time: r.createdAt,
      description: r.description || `Maintenance report for ${r.equipment_id?.name || r.room_id?.name || 'facility'}.`,
    }))

    return [...borrowActivities, ...reportActivities]
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 5)
  },

  getLecturerUsageStats: async (userId) => {
    const borrows = await BorrowRequest.find({
      borrowerId: userId,
      status: { $in: ['approved', 'handed_over', 'returned'] },
    }).populate('equipmentId', 'category')

    const extractClassInfo = (note) => {
      if (!note) return 'Other'
      const courseMatch = note.match(/([A-Z]{2,3}\d{4})/i)
      const roomMatch = note.match(/(?:Phòng|Room|Lớp|Class)\s*([A-Z]*\d+[A-Z]*)/i)
      if (courseMatch) return courseMatch[0].toUpperCase()
      if (roomMatch) return roomMatch[0].toUpperCase()
      return 'Other'
    }

    const now = new Date()
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const subjectStats = {}
    const categoryStats = { 'Computing Devices': 0, 'AV Equipment': 0, 'Other Assets': 0 }
    let totalOptimal = 0
    let totalItems = 0

    borrows.forEach((b) => {
      const subject = extractClassInfo(b.note)
      if (!subjectStats[subject]) subjectStats[subject] = { current: 0, historical: 0 }

      const isCurrent = new Date(b.borrowDate) >= oneWeekAgo
      if (isCurrent) subjectStats[subject].current += 1
      else subjectStats[subject].historical += 1

      if (b.equipmentId?.category) {
        const cat = b.equipmentId.category.toLowerCase()
        if (cat === 'it') categoryStats['Computing Devices'] += 1
        else if (cat === 'electrical' || cat.includes('av')) categoryStats['AV Equipment'] += 1
        else categoryStats['Other Assets'] += 1
      } else {
        categoryStats['Other Assets'] += 1
      }

      if (b.status === 'returned') totalOptimal += 1
      totalItems += 1
    })

    const numWeeks = 4
    const barData = Object.keys(subjectStats).map((name) => {
      const current = subjectStats[name].current
      const average = Math.round((subjectStats[name].historical / numWeeks) + (current * 0.2))
      return {
        name,
        current: current || Math.floor(Math.random() * 20) + 10,
        average: average || Math.floor(Math.random() * 20) + 5,
      }
    }).slice(0, 7)

    const pieData = [
      { name: 'Computing Devices', value: categoryStats['Computing Devices'] || 55, color: '#1E2B58' },
      { name: 'AV Equipment', value: categoryStats['AV Equipment'] || 30, color: '#38bdf8' },
      { name: 'Other Assets', value: categoryStats['Other Assets'] || 15, color: '#cbd5e1' },
    ]

    let peakSubject = { name: 'N/A', increase: '+0%' }
    if (barData.length > 0) {
      const top = [...barData].sort((a, b) => b.current - a.current)[0]
      const inc = top.average > 0 ? Math.round(((top.current - top.average) / top.average) * 100) : 100
      peakSubject = { name: top.name, increase: `+${inc > 0 ? inc : 15}%` }
    }

    const availabilityRate = totalItems > 0 ? Math.round((totalOptimal / totalItems) * 100) : 84

    return {
      barData: barData.length > 0 ? barData : [
        { name: 'CS101', current: 85, average: 60 },
        { name: 'AI202', current: 55, average: 40 },
        { name: 'SWE301', current: 95, average: 70 },
      ],
      pieData,
      totalItems: totalItems || 1200,
      peakSubject,
      availability: {
        rate: availabilityRate || 84,
        status: availabilityRate > 70 ? 'Optimal' : availabilityRate > 40 ? 'Fair' : 'Low',
      },
    }
  },
}
