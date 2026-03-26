import Schedule from '../models/Schedule.js'
import ApiError from '../utils/ApiError.js'
import { StatusCodes } from 'http-status-codes'

// ── CRUD (admin) ──────────────────────────────────────────────────────────────

const createSchedule = async (data) => {
  return Schedule.create(data)
}

const getAllSchedules = async (filterDate) => {
  const query = {}
  if (filterDate) {
    const start = new Date(filterDate)
    start.setHours(0, 0, 0, 0)
    const end = new Date(filterDate)
    end.setHours(23, 59, 59, 999)
    query.date = { $gte: start, $lte: end }
  }
  return Schedule.find(query)
    .populate('slotId', 'code name startTime endTime order')
    .populate('roomId', 'name type')
    .populate('lecturerId', 'displayName username')
}

const getScheduleById = async (id) => {
  const schedule = await Schedule.findById(id)
    .populate('slotId', 'code name startTime endTime order')
    .populate('roomId', 'name type buildingId')
    .populate('lecturerId', 'displayName username email')
    .populate('studentIds', 'displayName username')
  if (!schedule) throw new ApiError(StatusCodes.NOT_FOUND, 'Schedule not found')
  return schedule
}

const updateSchedule = async (id, data) => {
  const schedule = await Schedule.findByIdAndUpdate(id, data, { new: true, runValidators: true })
  if (!schedule) throw new ApiError(StatusCodes.NOT_FOUND, 'Schedule not found')
  return schedule
}

const deleteSchedule = async (id) => {
  const schedule = await Schedule.findByIdAndDelete(id)
  if (!schedule) throw new ApiError(StatusCodes.NOT_FOUND, 'Schedule not found')
  return { message: 'Schedule deleted' }
}

// ── Personal schedule queries ─────────────────────────────────────────────────

const getMySchedules = async (userId, filterDate) => {
  const query = {
    $or: [{ lecturerId: userId }, { studentIds: userId }],
    status: { $ne: 'cancelled' },
  }
  if (filterDate) {
    const start = new Date(filterDate)
    start.setHours(0, 0, 0, 0)
    const end = new Date(filterDate)
    end.setHours(23, 59, 59, 999)
    query.date = { $gte: start, $lte: end }
  }
  return Schedule.find(query)
    .populate('slotId', 'code name startTime endTime order')
    .populate('roomId', 'name type')
}

// ── Borrow-permission helpers ─────────────────────────────────────────────────

/**
 * Find the currently active/valid session for a student in a specific room.
 *
 * A session is "valid for borrowing" when:
 *   - status is 'scheduled' or 'ongoing'
 *   - now is within [startAt, endAt]
 *   - student is in studentIds
 *   - roomId matches the equipment's room
 *
 * @param {string|ObjectId} studentId
 * @param {string|ObjectId} roomId
 * @returns {Promise<Schedule|null>}
 */
const getCurrentValidSessionForStudent = async (studentId, roomId) => {
  const now = new Date()
  return Schedule.findOne({
    studentIds: studentId,
    roomId,
    status: { $in: ['scheduled', 'ongoing'] },
    startAt: { $lte: now },
    endAt: { $gte: now },
  })
    .populate('slotId', 'code name startTime endTime order')
    .lean()
}

/**
 * Find the currently active/valid session for a lecturer in a specific room.
 *
 * @param {string|ObjectId} lecturerId
 * @param {string|ObjectId} roomId
 * @returns {Promise<Schedule|null>}
 */
const getCurrentValidSessionForLecturer = async (lecturerId, roomId) => {
  const now = new Date()
  return Schedule.findOne({
    lecturerId,
    roomId,
    status: { $in: ['scheduled', 'ongoing'] },
    startAt: { $lte: now },
    endAt: { $gte: now },
  })
    .populate('slotId', 'code name startTime endTime order')
    .lean()
}

/**
 * Assert that a user (student or lecturer) has a valid session in the room
 * where the target equipment is located.
 *
 * Throws 403 if no valid session is found.
 *
 * @param {object} user  — mongoose User doc or plain object with _id and role
 * @param {string|ObjectId} roomId
 * @returns {Promise<Schedule>} The matching session
 */
const assertUserInSession = async (user, roomId) => {
  let session = null

  if (user.role === 'lecturer') {
    session = await getCurrentValidSessionForLecturer(user._id, roomId)
  } else if (user.role === 'student') {
    session = await getCurrentValidSessionForStudent(user._id, roomId)
  }

  if (!session) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      'Bạn không có buổi học hợp lệ trong phòng này tại thời điểm hiện tại.',
    )
  }

  return session
}

export const scheduleService = {
  createSchedule,
  getAllSchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
  getMySchedules,
  getCurrentValidSessionForStudent,
  getCurrentValidSessionForLecturer,
  assertUserInSession,
}
