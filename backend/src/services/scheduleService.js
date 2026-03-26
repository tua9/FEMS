import Schedule from '../models/Schedule.js'
import Slot from '../models/Slot.js'
import User from '../models/User.js'
import ApiError from '../utils/ApiError.js'
import { StatusCodes } from 'http-status-codes'
import { buildVNDateTime, vnDayRange, vnRangeStart, vnRangeEnd } from '../utils/dateVN.js'

// ── CRUD (admin) ──────────────────────────────────────────────────────────────

/**
 * Create a schedule.
 * Automatically computes startAt / endAt from date + slot if not provided.
 */
const createSchedule = async (data) => {
  if (!data.startAt || !data.endAt) {
    const slot = await Slot.findById(data.slotId)
    if (!slot) throw new ApiError(StatusCodes.BAD_REQUEST, 'Slot not found')

    // Lấy phần YYYY-MM-DD từ date (có thể là string hoặc Date object)
    const datePart = typeof data.date === 'string'
      ? data.date.slice(0, 10)
      : new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' }).format(new Date(data.date))

    // Xây dựng startAt/endAt theo giờ Việt Nam (UTC+7) để đúng dù server ở timezone nào
    const startAt = buildVNDateTime(datePart, slot.startTime)
    const endAt   = buildVNDateTime(datePart, slot.endTime)

    data = { ...data, startAt, endAt }
  }
  return Schedule.create(data)
}

/**
 * Get all schedules.
 * Supports:
 *   - query.date        → single day filter
 *   - query.startDate + query.endDate → date range (for calendar month view)
 *   - query.lecturerId  → filter by lecturer
 *   - query.roomId      → filter by room
 *   - query.classId     → filter by class
 */
const getAllSchedules = async (query = {}) => {
  const filter = {}

  if (query.date) {
    filter.date = vnDayRange(query.date)
  } else if (query.startDate || query.endDate) {
    filter.date = {}
    if (query.startDate) filter.date.$gte = vnRangeStart(query.startDate)
    if (query.endDate)   filter.date.$lte = vnRangeEnd(query.endDate)
  }

  if (query.lecturerId) filter.lecturerId = query.lecturerId
  if (query.roomId) filter.roomId = query.roomId
  if (query.classId) filter.classId = query.classId

  return Schedule.find(filter)
    .populate('slotId', 'code name startTime endTime order')
    .populate('roomId', 'name type')
    .populate('lecturerId', 'displayName username')
    .populate('classId', 'code name')
}

const getScheduleById = async (id) => {
  const schedule = await Schedule.findById(id)
    .populate('slotId', 'code name startTime endTime order')
    .populate('roomId', 'name type buildingId')
    .populate('lecturerId', 'displayName username email')
    .populate('classId', 'code name major')
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

/**
 * Get schedules belonging to a specific user (lecturer or student).
 * For students, looks up their classId and filters schedules by class.
 * Supports:
 *   - filter.date       → single day
 *   - filter.startDate + filter.endDate → date range
 */
const getMySchedules = async (userId, filter = {}) => {
  const user = await User.findById(userId).select('role classId').lean()
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')

  let baseQuery
  if (user.role === 'student') {
    if (!user.classId) return []
    baseQuery = { classId: user.classId }
  } else {
    baseQuery = { lecturerId: userId }
  }

  const query = {
    ...baseQuery,
    status: { $ne: 'cancelled' },
  }

  const f = typeof filter === 'string' ? { date: filter } : filter

  if (f.date) {
    query.date = vnDayRange(f.date)
  } else if (f.startDate || f.endDate) {
    query.date = {}
    if (f.startDate) query.date.$gte = vnRangeStart(f.startDate)
    if (f.endDate)   query.date.$lte = vnRangeEnd(f.endDate)
  }

  return Schedule.find(query)
    .populate('slotId', 'code name startTime endTime order')
    .populate('roomId', 'name type')
    .populate('classId', 'code name')
}

// ── Borrow-permission helpers ─────────────────────────────────────────────────

/**
 * Find the currently active/valid session for a student in a specific room.
 * Resolves the student's classId, then finds a matching class schedule in that room.
 *
 * @param {string|ObjectId} studentId
 * @param {string|ObjectId} roomId
 * @returns {Promise<Schedule|null>}
 */
const getCurrentValidSessionForStudent = async (studentId, roomId) => {
  const user = await User.findById(studentId).select('classId').lean()
  if (!user?.classId) return null

  const now = new Date()
  return Schedule.findOne({
    classId: user.classId,
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
