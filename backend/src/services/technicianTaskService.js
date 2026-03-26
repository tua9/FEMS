import Report from '../models/Report.js'

const toTaskId6 = (mongoId) => {
  // Display-friendly 6 chars derived from Mongo ObjectId (24 hex)
  // "mã hoá ngược": take the last 6 hex chars and reverse them.
  const hex = String(mongoId || '')
  const last6 = hex.slice(-6)
  return last6.split('').reverse().join('').toUpperCase()
}

const mapPriority = (p) => {
  const v = String(p || 'medium').toLowerCase()
  if (v === 'critical') return 'Urgent'
  if (v === 'high') return 'High'
  if (v === 'low') return 'Low'
  return 'Medium'
}

const mapStatus = (s) => {
  const v = String(s || '').toLowerCase()
  if (v === 'pending') return 'pending'
  if (v === 'approved') return 'approved'
  if (v === 'processing') return 'processing'
  if (v === 'fixed') return 'fixed'
  if (v === 'rejected') return 'rejected'
  if (v === 'cancelled') return 'cancelled'
  return 'pending'
}

const getTasks = async () => {
  const reports = await Report.find()
    .populate({ path: 'equipment_id', select: 'name category' })
    .populate({ path: 'room_id', select: 'name floor buildingId' })
    .populate({ path: 'room_id', populate: { path: 'buildingId', select: 'name' } })
    .populate({ path: 'user_id', select: 'displayName email username' })

  return reports.map((r) => {
    const roomName = r.room_id?.name || 'N/A'
    const equipmentName = r.equipment_id?.name || null
    const equipmentCategory = r.equipment_id?.category || 'Other'

    const buildingName = r.room_id?.buildingId?.name || 'N/A'

    const reporterName = r.user_id?.displayName || r.user_id?.username || 'Unknown'

    // Title and category for the task
    const taskTitle = equipmentName || roomName || 'Untitled'
    const taskCategory = equipmentCategory

    return {
      id: toTaskId6(r._id),
      reportId: String(r._id),
      code: r.code,
      type: r.type,
      title: taskTitle,
      category: taskCategory,
      equipment: equipmentName || roomName,
      issue: r.description || '',
      description: r.description || '',
      priority: mapPriority(r.priority),
      status: mapStatus(r.status),
      location: {
        building: buildingName,
        room: roomName,
        floor: String(r.room_id?.floor ?? ''),
      },
      reportedBy: {
        id: String(r.user_id?._id || ''),
        name: reporterName,
        email: r.user_id?.email || '',
      },
      assignedTo: r.assigned_to ? String(r.assigned_to) : undefined,
      createdAt: r.createdAt?.toISOString?.() || new Date(r.createdAt).toISOString(),
      updatedAt: r.updatedAt?.toISOString?.() || new Date(r.updatedAt).toISOString(),
      images: r.img ? [r.img] : [],
      notes: r.decision_note || '',
    }
  })
}

export const technicianTaskService = {
  getTasks,
}
