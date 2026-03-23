import Report from '../models/Report.js'
import Equipment from '../models/Equipment.js'
import { equipmentService } from './equipmentService.js'

const toDateRange = ({ from, to }) => {
  const createdAt = {}
  if (from) createdAt.$gte = new Date(from)
  if (to) createdAt.$lte = new Date(to)
  return Object.keys(createdAt).length ? { createdAt } : {}
}

const getTicketPipeline = async ({ user, from, to }) => {
  const range = toDateRange({ from, to })

  const [newReports, assigned, resolved] = await Promise.all([
    Report.countDocuments({ ...range }),
    Report.countDocuments({ ...range, status: { $ne: 'pending' } }),
    Report.countDocuments({ ...range, status: 'fixed' }),
  ])

  return {
    newReports,
    assigned,
    resolved,
  }
}

const getDeviceHealth = async ({ user }) => {
  // Reuse the same logic as equipmentController.getAllEquipment -> equipmentService.getAllEquipment
  // to ensure Device Health total matches the equipment list endpoint.
  const allEquipment = await equipmentService.getAllEquipment()
  const totalAssets = Array.isArray(allEquipment) ? allEquipment.length : 0

  // Count by model status
  const coll = Equipment.collection
  const [healthy, maintenance, faulty] = await Promise.all([
    coll.countDocuments({ status: 'good' }),
    coll.countDocuments({ status: 'maintenance' }),
    coll.countDocuments({ status: 'broken' }),
  ])

  const unknown = Math.max(0, totalAssets - (healthy + maintenance + faulty))

  return {
    totalAssets,
    healthy,
    maintenance,
    faulty,
    unknown,
  }
}

export const technicianDashboardService = {
  getTicketPipeline,
  getDeviceHealth,
}
