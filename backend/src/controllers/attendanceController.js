import { StatusCodes } from 'http-status-codes'
import { attendanceService } from '../services/attendanceService.js'
import { asyncHandler } from '../middlewares/asyncHandler.js'

/**
 * POST /attendance/check-in
 * Body: { scheduleId, method? }
 * Lecturer checks in to a session.
 */
export const checkIn = asyncHandler(async (req, res) => {
  const { scheduleId, method } = req.body
  const result = await attendanceService.teacherCheckIn(scheduleId, req.user._id, method)
  res.status(StatusCodes.OK).json({ message: 'Checked in successfully', attendance: result })
})

/**
 * POST /attendance/check-out
 * Body: { scheduleId }
 * Lecturer checks out from a session.
 */
export const checkOut = asyncHandler(async (req, res) => {
  const { scheduleId } = req.body
  const result = await attendanceService.teacherCheckOut(scheduleId, req.user._id)
  res.status(StatusCodes.OK).json({ message: 'Checked out successfully', attendance: result })
})

/**
 * GET /attendance/:scheduleId
 * Get all attendance records for a session (admin / lecturer view).
 */
export const getAttendanceForSchedule = asyncHandler(async (req, res) => {
  const result = await attendanceService.getAttendanceForSchedule(req.params.scheduleId)
  res.status(StatusCodes.OK).json(result)
})

/**
 * GET /attendance/:scheduleId/status
 * Quick check: is the current user checked in for this session?
 */
export const myCheckInStatus = asyncHandler(async (req, res) => {
  const checkedIn = await attendanceService.isTeacherCheckedIn(req.params.scheduleId, req.user._id)
  res.status(StatusCodes.OK).json({ checkedIn })
})
