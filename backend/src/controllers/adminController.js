import { StatusCodes } from 'http-status-codes'
import { adminService } from '../services/adminService.js'
import { asyncHandler } from '../middlewares/asyncHandler.js'

export const getEquipmentAnalytics = asyncHandler(async (req, res) => {
  const result = await adminService.getEquipmentAnalytics()
  res.status(StatusCodes.OK).json(result)
})

export const getReportAnalytics = asyncHandler(async (req, res) => {
  const result = await adminService.getReportAnalytics()
  res.status(StatusCodes.OK).json(result)
})

export const getDashboardStats = asyncHandler(async (req, res) => {
  const result = await adminService.getDashboardStats()
  res.status(StatusCodes.OK).json(result)
})

export const getDashboardChart = asyncHandler(async (req, res) => {
  const result = await adminService.getDashboardChart()
  res.status(StatusCodes.OK).json(result)
})

export const getHealthStatus = asyncHandler(async (req, res) => {
  const result = await adminService.getHealthStatus()
  res.status(StatusCodes.OK).json(result)
})

export const getRecentBorrowRequests = asyncHandler(async (req, res) => {
  const result = await adminService.getRecentBorrowRequests()
  res.status(StatusCodes.OK).json(result)
})

export const getRecentDamageReports = asyncHandler(async (req, res) => {
  const result = await adminService.getRecentDamageReports()
  res.status(StatusCodes.OK).json(result)
})
