import { StatusCodes } from 'http-status-codes'
import { dashboardService } from '../services/dashboardService.js'
import { asyncHandler } from '../middlewares/asyncHandler.js'

export const getLecturerStats = asyncHandler(async (req, res) => {
    const result = await dashboardService.getLecturerStats(req.user._id)
    res.status(StatusCodes.OK).json(result)
})

export const getLecturerActivities = asyncHandler(async (req, res) => {
    const result = await dashboardService.getLecturerActivities(req.user._id)
    res.status(StatusCodes.OK).json(result)
})

export const getLecturerUsageStats = asyncHandler(async (req, res) => {
    const result = await dashboardService.getLecturerUsageStats(req.user._id)
    res.status(StatusCodes.OK).json(result)
})
