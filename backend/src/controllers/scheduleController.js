import { StatusCodes } from 'http-status-codes'
import { scheduleService } from '../services/scheduleService.js'
import { asyncHandler } from '../middlewares/asyncHandler.js'

export const createSchedule = asyncHandler(async (req, res) => {
    const result = await scheduleService.createSchedule({
        ...req.body,
        user_id: req.user._id,
    })
    res.status(StatusCodes.CREATED).json(result)
})

export const getMySchedules = asyncHandler(async (req, res) => {
    const { date } = req.query
    const result = await scheduleService.getMySchedules(req.user._id, date)
    res.status(StatusCodes.OK).json(result)
})

export const getScheduleById = asyncHandler(async (req, res) => {
    const result = await scheduleService.getScheduleById(req.params.id, req.user._id)
    res.status(StatusCodes.OK).json(result)
})

export const updateSchedule = asyncHandler(async (req, res) => {
    const result = await scheduleService.updateSchedule(req.params.id, req.user._id, req.body)
    res.status(StatusCodes.OK).json(result)
})

export const deleteSchedule = asyncHandler(async (req, res) => {
    const result = await scheduleService.deleteSchedule(req.params.id, req.user._id)
    res.status(StatusCodes.OK).json(result)
})
