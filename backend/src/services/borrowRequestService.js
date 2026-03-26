import { StatusCodes } from 'http-status-codes'
import BorrowRequest from '../models/BorrowRequest.js'
import Equipment from '../models/Equipment.js'
import User from '../models/User.js'
import ApiError from '../utils/ApiError.js'
import { notificationService } from './notificationService.js'
import { availabilityService } from './availabilityService.js'
import { scheduleService } from './scheduleService.js'
import { attendanceService } from './attendanceService.js'

// ── Helpers ───────────────────────────────────────────────────────────────────

const BORROW_POPULATE = [
  { path: 'borrowerId', select: 'username displayName email role' },
  { path: 'equipmentId', select: 'name category code status roomId' },
  { path: 'roomId', select: 'name type' },
  { path: 'approvedBy', select: 'username displayName' },
  { path: 'handedOverBy', select: 'username displayName' },
  { path: 'returnedConfirmedBy', select: 'username displayName' },
  { path: 'scheduleId', select: 'title date startAt endAt slotId roomId' },
]

const generateBorrowRequestCode = () => {
  const now = new Date()
  const year = String(now.getFullYear()).slice(-2)
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const random = Array.from({ length: 3 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join('')
  return `BR${year}${month}${random}`
}

const generateUniqueCode = async () => {
  let code
  let exists = true
  while (exists) {
    code = generateBorrowRequestCode()
    exists = !!(await BorrowRequest.findOne({ code }))
  }
  return code
}

const populateRequest = (query) => query.populate(BORROW_POPULATE)

// ── Auto-cancel logic ─────────────────────────────────────────────────────────

/**
 * Auto-cancel approved requests that were never picked up by 17:00 on borrowDate.
 */
const autoCancelExpiredRequests = async () => {
  const approvedRequests = await BorrowRequest.find({ status: 'approved' })
  const now = new Date()

  for (const req of approvedRequests) {
    const deadline = new Date(req.borrowDate)
    deadline.setHours(17, 0, 0, 0)

    if (now > deadline) {
      req.status = 'cancelled'
      req.decisionNote = 'Yêu cầu đã bị hệ thống tự động hủy do người mượn không đến nhận thiết bị trễ nhất vào lúc 17:00:00 của ngày hẹn trước.'
      req.cancelledAt = new Date()
      req.cancelledBy = null // system cancel
      await req.save()

      await notificationService.createNotification({
        userId: req.borrowerId,
        type: 'borrow',
        title: 'Yêu cầu mượn tự động hủy',
        message: `Yêu cầu mượn #${req.code || req._id.toString().slice(-6).toUpperCase()} đã bị hệ thống tự động hủy do không đến nhận trước 17:00.`,
        action: {
          type: 'open_detail',
          resource: 'borrow',
          resourceId: req._id,
        },
      }).catch(err => console.error('Failed to send auto-cancel notification:', err))
    }
  }
}

// ── Student / Lecturer request creation ───────────────────────────────────────

/**
 * Create a borrow request on behalf of a student.
 * Validates:
 *   1. Equipment borrowability
 *   2. Student has an active session in the equipment's room
 *   3. Lecturer of that session has checked in
 *
 * @param {object} user   — authenticated user (student)
 * @param {object} body   — { equipmentId, purpose, note }
 */
const createStudentRequest = async (user, body) => {
  const { equipmentId, purpose, note } = body

  const equipment = await Equipment.findById(equipmentId)
  if (!equipment) throw new ApiError(StatusCodes.NOT_FOUND, 'Equipment not found')

  // 1. Technical availability
  await availabilityService.assertEquipmentBorrowable(equipmentId)

  // 2. User must be in a valid session in the equipment's room
  const session = await scheduleService.assertUserInSession(user, equipment.roomId)

  // 3. Lecturer of the session must have checked in
  await attendanceService.assertTeacherCheckedIn(session._id, session.lecturerId)

  const code = await generateUniqueCode()

  const request = await BorrowRequest.create({
    code,
    borrowerId: user._id,
    borrowerRole: 'student',
    equipmentId,
    roomId: equipment.roomId,
    scheduleId: session._id,
    classSlotId: session.slotId,
    borrowDate: new Date(),
    expectedReturnDate: session.endAt,
    purpose: purpose || null,
    note: note || null,
    status: 'pending',
  })

  // Notify admins
  await notificationService.notifyAdmins({
    type: 'borrow',
    title: 'Yêu cầu mượn mới',
    message: `${user.displayName || user.username} (sinh viên) đã tạo yêu cầu mượn thiết bị ${equipment.name} (#${code}).`,
    action: { type: 'open_detail', resource: 'borrow', resourceId: request._id },
  }).catch(err => console.error('Notify admins failed:', err))

  return { message: 'Borrow request created', borrowRequest: await populateRequest(BorrowRequest.findById(request._id)) }
}

/**
 * Create a borrow request on behalf of a lecturer.
 * Validates:
 *   1. Equipment borrowability
 *   2. Lecturer has an active session in the equipment's room
 *   (No check-in gate for lecturer — lecturer creating for themselves)
 *
 * @param {object} user   — authenticated user (lecturer)
 * @param {object} body   — { equipmentId, purpose, note }
 */
const createLecturerRequest = async (user, body) => {
  const { equipmentId, purpose, note } = body

  const equipment = await Equipment.findById(equipmentId)
  if (!equipment) throw new ApiError(StatusCodes.NOT_FOUND, 'Equipment not found')

  // 1. Technical availability
  await availabilityService.assertEquipmentBorrowable(equipmentId)

  // 2. Lecturer must be teaching in the equipment's room right now
  const session = await scheduleService.assertUserInSession(user, equipment.roomId)

  const code = await generateUniqueCode()

  const request = await BorrowRequest.create({
    code,
    borrowerId: user._id,
    borrowerRole: 'lecturer',
    equipmentId,
    roomId: equipment.roomId,
    scheduleId: session._id,
    classSlotId: session.slotId,
    borrowDate: new Date(),
    expectedReturnDate: session.endAt,
    purpose: purpose || null,
    note: note || null,
    status: 'pending',
  })

  await notificationService.notifyAdmins({
    type: 'borrow',
    title: 'Yêu cầu mượn mới',
    message: `${user.displayName || user.username} (giảng viên) đã tạo yêu cầu mượn thiết bị ${equipment.name} (#${code}).`,
    action: { type: 'open_detail', resource: 'borrow', resourceId: request._id },
  }).catch(err => console.error('Notify admins failed:', err))

  return { message: 'Borrow request created', borrowRequest: await populateRequest(BorrowRequest.findById(request._id)) }
}

// ── Admin workflow actions ────────────────────────────────────────────────────

const approveRequest = async (id, approverId, decisionNote) => {
  const request = await BorrowRequest.findById(id)
  if (!request) throw new ApiError(StatusCodes.NOT_FOUND, 'Borrow request not found')
  if (request.status !== 'pending') throw new ApiError(StatusCodes.BAD_REQUEST, 'Request is not pending')

  // Re-check availability at approval time
  await availabilityService.assertEquipmentBorrowable(request.equipmentId, {
    borrowDate: request.borrowDate,
    expectedReturnDate: request.expectedReturnDate,
  })

  request.status = 'approved'
  request.approvedBy = approverId
  request.approvedAt = new Date()
  if (decisionNote) request.decisionNote = decisionNote.trim()
  await request.save()

  const startDate = request.borrowDate.toISOString().split('T')[0]
  const baseMsg = `Yêu cầu mượn #${request.code} đã được duyệt. Vui lòng đến nhận thiết bị trước 17:00 ngày ${startDate}.`
  await notificationService.createNotification({
    userId: request.borrowerId,
    type: 'approval',
    title: 'Yêu cầu mượn được duyệt',
    message: decisionNote ? `${baseMsg} Tin nhắn từ giảng viên: "${decisionNote.trim()}"` : baseMsg,
    action: { type: 'open_detail', resource: 'borrow', resourceId: request._id },
  }).catch(err => console.error('Notify borrower failed:', err))

  return { message: 'Borrow request approved', request }
}

const rejectRequest = async (id, approverId, decisionNote) => {
  const request = await BorrowRequest.findById(id)
  if (!request) throw new ApiError(StatusCodes.NOT_FOUND, 'Borrow request not found')
  if (request.status !== 'pending') throw new ApiError(StatusCodes.BAD_REQUEST, 'Request is not pending')

  request.status = 'rejected'
  request.approvedBy = approverId
  request.approvedAt = new Date()
  if (decisionNote) request.decisionNote = decisionNote.trim()
  await request.save()

  await notificationService.createNotification({
    userId: request.borrowerId,
    type: 'approval',
    title: 'Yêu cầu mượn bị từ chối',
    message: `Yêu cầu mượn #${request.code} đã bị từ chối. Lý do: ${decisionNote || 'Không có lý do'}.`,
    action: { type: 'open_detail', resource: 'borrow', resourceId: request._id },
  }).catch(err => console.error('Notify borrower failed:', err))

  return { message: 'Borrow request rejected', request }
}

const handoverToStudent = async (id, handedOverBy) => {
  const request = await BorrowRequest.findById(id)
  if (!request) throw new ApiError(StatusCodes.NOT_FOUND, 'Borrow request not found')
  if (request.status !== 'approved') throw new ApiError(StatusCodes.BAD_REQUEST, 'Request must be approved first')

  request.status = 'handed_over'
  request.handedOverBy = handedOverBy
  request.handedOverAt = new Date()
  await request.save()

  const equipment = await Equipment.findById(request.equipmentId).select('name code').lean()
  await notificationService.createNotification({
    userId: request.borrowerId,
    type: 'borrow',
    title: 'Thiết bị đã được bàn giao',
    message: `Thiết bị ${equipment?.name || ''} (#${request.code}) đã được bàn giao cho bạn. Vui lòng trả đúng hạn.`,
    action: { type: 'open_detail', resource: 'borrow', resourceId: request._id },
  }).catch(err => console.error('Notify borrower failed:', err))

  return { message: 'Equipment handed over', request }
}

const confirmReturn = async (id, confirmedBy) => {
  const request = await BorrowRequest.findById(id).populate('borrowerId', 'displayName username')
  if (!request) throw new ApiError(StatusCodes.NOT_FOUND, 'Borrow request not found')
  if (request.status !== 'handed_over') throw new ApiError(StatusCodes.BAD_REQUEST, 'Equipment has not been handed over yet')

  request.status = 'returned'
  request.returnedConfirmedBy = confirmedBy
  request.returnedAt = new Date()
  request.actualReturnDate = new Date()
  await request.save()

  // Notify admins and technicians
  try {
    const staff = await User.find({ role: { $in: ['admin', 'technician'] } }).select('_id role').lean()
    const borrowerName = request.borrowerId?.displayName || request.borrowerId?.username || 'Unknown'
    await Promise.allSettled(
      staff.map(s =>
        notificationService.createNotification({
          userId: s._id,
          type: 'return',
          title: 'Thiết bị đã được trả',
          message: `${borrowerName} đã trả thiết bị (Yêu cầu #${request.code}).`,
          action: { type: 'open_detail', resource: 'borrow', resourceId: request._id },
        }),
      ),
    )
  } catch (err) {
    console.error('Failed to notify staff about return:', err)
  }

  return { message: 'Equipment returned', request }
}

const cancelRequest = async (id, userId, decisionNote) => {
  if (!decisionNote?.trim()) {
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'Lý do hủy là bắt buộc')
  }

  const request = await BorrowRequest.findById(id?.trim())
  if (!request) throw new ApiError(StatusCodes.NOT_FOUND, 'Borrow request not found')

  if (request.borrowerId.toString() !== userId.toString()) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'You can only cancel your own requests')
  }

  if (!['pending', 'approved'].includes(request.status)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Only pending or approved requests can be cancelled')
  }

  request.status = 'cancelled'
  request.decisionNote = decisionNote.trim()
  request.cancelledAt = new Date()
  request.cancelledBy = userId
  await request.save()

  return { message: 'Borrow request cancelled', request }
}

/**
 * Admin direct allocation — bypasses session/attendance checks.
 * Creates a request already in handed_over state.
 */
const adminDirectAllocate = async (body, allocatorId) => {
  const { borrowerId, equipmentId, borrowDate, expectedReturnDate, purpose, note } = body

  if (!borrowerId) throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'borrowerId is required')
  if (!equipmentId) throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'equipmentId is required')

  const borrower = await User.findById(borrowerId)
  if (!borrower) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')

  const equipment = await Equipment.findById(equipmentId)
  if (!equipment) throw new ApiError(StatusCodes.NOT_FOUND, 'Equipment not found')

  const bDate = new Date(borrowDate)
  const rDate = new Date(expectedReturnDate)
  if (isNaN(bDate.getTime()) || isNaN(rDate.getTime())) {
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'Invalid dates provided')
  }
  if (bDate >= rDate) {
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'Borrow date must be before return date')
  }

  await availabilityService.assertEquipmentBorrowable(equipmentId, {
    borrowDate: bDate,
    expectedReturnDate: rDate,
  })

  const code = await generateUniqueCode()

  const request = await BorrowRequest.create({
    code,
    borrowerId,
    borrowerRole: borrower.role === 'lecturer' ? 'lecturer' : 'student',
    equipmentId,
    roomId: equipment.roomId,
    borrowDate: bDate,
    expectedReturnDate: rDate,
    purpose: purpose || null,
    note: note || null,
    status: 'handed_over',
    approvedBy: allocatorId,
    approvedAt: new Date(),
    handedOverBy: allocatorId,
    handedOverAt: new Date(),
    decisionNote: 'Direct allocation by admin',
  })

  return {
    message: 'Direct allocation created',
    borrowRequest: await populateRequest(BorrowRequest.findById(request._id)),
  }
}

// ── Read queries ──────────────────────────────────────────────────────────────

const getAllBorrowRequests = async () => {
  await autoCancelExpiredRequests()
  return populateRequest(BorrowRequest.find())
}

const getBorrowRequestById = async (id) => {
  const request = await populateRequest(BorrowRequest.findById(id))
  if (!request) throw new ApiError(StatusCodes.NOT_FOUND, 'Borrow request not found')
  return request
}

const getPersonalBorrowRequests = async (userId) => {
  await autoCancelExpiredRequests()
  return populateRequest(BorrowRequest.find({ borrowerId: userId }))
}

const getPendingBorrowRequests = async () => {
  await autoCancelExpiredRequests()
  return populateRequest(BorrowRequest.find({ status: 'pending' }))
}

const getApprovedByMe = async (approverId) => {
  await autoCancelExpiredRequests()
  return populateRequest(
    BorrowRequest.find({
      approvedBy: approverId,
      status: { $in: ['approved', 'rejected', 'handed_over', 'returned', 'cancelled'] },
    }).sort({ updatedAt: -1 }),
  )
}

const checkOverdueHandedOverRequests = async () => {
  const now = new Date()
  const overdueRequests = await BorrowRequest.find({
    status: 'handed_over',
    expectedReturnDate: { $lt: now },
  }).populate('borrowerId', 'displayName').lean()

  if (overdueRequests.length > 0) {
    await notificationService.notifyAdmins({
      type: 'borrow',
      title: 'Cảnh báo trả trễ',
      message: `Có ${overdueRequests.length} thiết bị đang bị mượn quá hạn. Vui lòng kiểm tra.`,
      action: { type: 'open_list', resource: 'borrow' },
    }).catch(err => console.error('Failed to notify admins about overdue borrows:', err))
  }
}

const remindBorrowRequest = async (id) => {
  const request = await BorrowRequest.findById(id).populate('borrowerId', 'displayName email')
  if (!request) throw new ApiError(StatusCodes.NOT_FOUND, 'Borrow request not found')

  console.log(`Reminder sent to ${request.borrowerId?.displayName} for request ${id}`)
  return { message: 'Reminder sent successfully' }
}

export const borrowRequestService = {
  createStudentRequest,
  createLecturerRequest,
  approveRequest,
  rejectRequest,
  handoverToStudent,
  confirmReturn,
  cancelRequest,
  adminDirectAllocate,
  getAllBorrowRequests,
  getBorrowRequestById,
  getPersonalBorrowRequests,
  getPendingBorrowRequests,
  getApprovedByMe,
  autoCancelExpiredRequests,
  checkOverdueHandedOverRequests,
  remindBorrowRequest,
}
