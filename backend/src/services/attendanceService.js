import { StatusCodes } from 'http-status-codes'
import TeacherAttendance from '../models/TeacherAttendance.js'
import Schedule from '../models/Schedule.js'
import ApiError from '../utils/ApiError.js'

/**
 * Check if a lecturer has checked in for a given schedule session.
 *
 * @param {string|ObjectId} scheduleId
 * @param {string|ObjectId} lecturerId
 * @returns {Promise<boolean>}
 */
const isTeacherCheckedIn = async (scheduleId, lecturerId) => {
  const record = await TeacherAttendance.findOne({ scheduleId, lecturerId }).lean()
  return !!(record && record.checkedInAt && record.status === 'present')
}

/**
 * Assert that a lecturer is checked in — throws 403 if not.
 * Used as a guard inside borrowRequestService.
 *
 * @param {string|ObjectId} scheduleId
 * @param {string|ObjectId} lecturerId
 */
const assertTeacherCheckedIn = async (scheduleId, lecturerId) => {
  const checkedIn = await isTeacherCheckedIn(scheduleId, lecturerId)
  if (!checkedIn) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      'Giảng viên chưa điểm danh vào ca học này. Vui lòng điểm danh trước khi cho phép mượn thiết bị.',
    )
  }
}

/**
 * Record a teacher check-in for a session.
 *
 * @param {string|ObjectId} scheduleId
 * @param {string|ObjectId} lecturerId
 * @param {'manual'|'qr_scan'|'system'} method
 * @returns {Promise<TeacherAttendance>}
 */
const teacherCheckIn = async (scheduleId, lecturerId, method = 'manual') => {
  const schedule = await Schedule.findById(scheduleId)
  if (!schedule) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Schedule not found')
  }
  if (schedule.status === 'cancelled') {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Cannot check in for a cancelled session')
  }

  // Upsert: create if not exists, update if already exists
  const record = await TeacherAttendance.findOneAndUpdate(
    { scheduleId, lecturerId },
    {
      $set: {
        method,
        checkedInAt: new Date(),
        status: 'present',
      },
    },
    { upsert: true, new: true, runValidators: true },
  )

  return record
}

/**
 * Record a teacher check-out for a session.
 *
 * @param {string|ObjectId} scheduleId
 * @param {string|ObjectId} lecturerId
 * @returns {Promise<TeacherAttendance>}
 */
const teacherCheckOut = async (scheduleId, lecturerId) => {
  const record = await TeacherAttendance.findOneAndUpdate(
    { scheduleId, lecturerId },
    { $set: { checkedOutAt: new Date() } },
    { new: true },
  )
  if (!record) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Attendance record not found')
  }

  // Update schedule status to completed so no new device borrows can happen
  await Schedule.findByIdAndUpdate(scheduleId, { status: 'completed' })

  // Trigger early slot end logic to gracefully cancel/mark unreturned
  try {
    const { borrowRequestService } = await import('./borrowRequestService.js')
    await borrowRequestService.autoHandleEndedSessions(scheduleId)
  } catch (err) {
    console.error('Failed to trigger autoHandleEndedSessions on checkout:', err)
  }

  return record
}

/**
 * Get all attendance records for a session.
 *
 * @param {string|ObjectId} scheduleId
 * @returns {Promise<TeacherAttendance[]>}
 */
const getAttendanceForSchedule = async (scheduleId) => {
  return TeacherAttendance.find({ scheduleId })
    .populate('lecturerId', 'displayName username email')
    .lean()
}

export const attendanceService = {
  isTeacherCheckedIn,
  assertTeacherCheckedIn,
  teacherCheckIn,
  teacherCheckOut,
  getAttendanceForSchedule,
}
