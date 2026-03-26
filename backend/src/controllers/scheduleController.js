import { StatusCodes } from 'http-status-codes'
import { scheduleService } from '../services/scheduleService.js'
import { asyncHandler } from '../middlewares/asyncHandler.js'

// ── Admin CRUD ────────────────────────────────────────────────────────────────

export const createSchedule = asyncHandler(async (req, res) => {
  const result = await scheduleService.createSchedule(req.body)
  res.status(StatusCodes.CREATED).json(result)
})

export const getAllSchedules = asyncHandler(async (req, res) => {
  const { date } = req.query
  const result = await scheduleService.getAllSchedules(date)
  res.status(StatusCodes.OK).json(result)
})

export const getScheduleById = asyncHandler(async (req, res) => {
  const result = await scheduleService.getScheduleById(req.params.id)
  res.status(StatusCodes.OK).json(result)
})

export const updateSchedule = asyncHandler(async (req, res) => {
  const result = await scheduleService.updateSchedule(req.params.id, req.body)
  res.status(StatusCodes.OK).json(result)
})

export const deleteSchedule = asyncHandler(async (req, res) => {
  const result = await scheduleService.deleteSchedule(req.params.id)
  res.status(StatusCodes.OK).json(result)
})

// ── Personal schedules (lecturer + student) ───────────────────────────────────

export const getMySchedules = asyncHandler(async (req, res) => {
  const { date } = req.query
  const result = await scheduleService.getMySchedules(req.user._id, date)
  res.status(StatusCodes.OK).json(result)
})
