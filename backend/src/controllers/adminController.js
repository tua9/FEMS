import { StatusCodes } from 'http-status-codes'
import { adminService } from '../services/adminService.js'
import { asyncHandler } from '../middlewares/asyncHandler.js'

export const getDashboardStats = asyncHandler(async (req, res) => {
  const result = await adminService.getDashboardStats()
  res.status(StatusCodes.OK).json(result)
})

export const getDashboardChart = asyncHandler(async (req, res) => {
  const result = await adminService.getDashboardChart()
  res.status(StatusCodes.OK).json(result)
})
