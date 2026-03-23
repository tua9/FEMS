import { StatusCodes } from 'http-status-codes'
import { asyncHandler } from '../middlewares/asyncHandler.js'
import { technicianDashboardService } from '../services/technicianDashboardService.js'

// GET /api/technician/dashboard/ticket-pipeline
export const getTicketPipeline = asyncHandler(async (req, res) => {
  const { from, to } = req.query
  const data = await technicianDashboardService.getTicketPipeline({ user: req.user, from, to })
  res.status(StatusCodes.OK).json(data)
})

// GET /api/technician/dashboard/device-health
export const getDeviceHealth = asyncHandler(async (req, res) => {
  const data = await technicianDashboardService.getDeviceHealth({ user: req.user })
  res.status(StatusCodes.OK).json(data)
})
