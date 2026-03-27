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
  { path: 'equipmentId', select: 'name category code status roomId img' },
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

// ── Auto-handle concluded sessions ───────────────

/**
 * Auto-cancel pending/approved requests and mark handed_over/returning as unreturned
 * when a session slot has already ended (either time passed or checked out).
 *
 * @param {string|ObjectId} [specificScheduleId] Optional. If provided, checks only this schedule.
 */
const autoHandleEndedSessions = async (specificScheduleId = null) => {
  const now = new Date()

  const query = {
    status: { $in: ['pending', 'approved', 'handed_over', 'returning'] },
    scheduleId: { $ne: null },
  }

  if (specificScheduleId) {
    query.scheduleId = specificScheduleId
  }

  const requests = await BorrowRequest.find(query)
    .populate('scheduleId', 'endAt status')
    .populate('equipmentId', 'name')
    .populate('roomId', 'name')
    .populate('classSlotId', 'name')

  for (const req of requests) {
    if (!req.scheduleId) continue

    // A session is considered ended if it was manually finished (checked out)
    // or if the current time has passed the anticipated end check
    const isEnded = req.scheduleId.status === 'completed' || (req.scheduleId.endAt && now > new Date(req.scheduleId.endAt))

    if (!isEnded) continue

    if (['pending', 'approved'].includes(req.status)) {
      req.status = 'cancelled'
      req.decisionNote = 'Yêu cầu đã bị hủy tự động do ca học đã kết thúc mà chưa được xử lý hoàn tất.'
      req.cancelledAt = new Date()
      req.cancelledBy = null // system cancellation
      await req.save()

      await notificationService.createNotification({
        userId: req.borrowerId,
        type: 'borrow',
        title: 'Yêu cầu mượn bị hủy',
        message: `Yêu cầu mượn #${req.code || req._id.toString().slice(-6).toUpperCase()} đã bị hủy tự động do ca học đã kết thúc.`,
        action: {
          type: 'open_detail',
          resource: 'borrow',
          resourceId: req._id,
        },
      }).catch(err => console.error('Failed to send slot-ended auto-cancel notification:', err))
    } else if (['handed_over', 'returning'].includes(req.status)) {
      req.status = 'unreturned'
      await req.save()

      const equipName = req.equipmentId?.name || 'Unknown'
      const roomName = req.roomId?.name || 'Unknown'
      const slotName = req.classSlotId?.name || 'slot'
      const msg = `Unreturned equipment ${equipName} in room ${roomName} for slot ${slotName}`

      // Notify Student
      await notificationService.createNotification({
        userId: req.borrowerId,
        type: 'borrow',
        title: 'Unreturned Equipment',
        message: msg,
        action: { type: 'open_detail', resource: 'borrow', resourceId: req._id },
      }).catch(err => console.error('Failed to notify student about unreturned equipment:', err))

      // Notify Lecturer
      const lecturerToNotify = req.handedOverBy || req.approvedBy || null
      if (lecturerToNotify) {
        await notificationService.createNotification({
          userId: lecturerToNotify,
          type: 'borrow',
          title: 'Unreturned Equipment',
          message: msg,
          action: { type: 'open_detail', resource: 'borrow', resourceId: req._id },
        }).catch(err => console.error('Failed to notify lecturer about unreturned equipment:', err))
      }
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
 */
const createStudentRequest = async (user, body) => {
  const { equipmentId, purpose, note } = body

  // Check if student has any outstanding unreturned equipment
  const unreturnedRequest = await BorrowRequest.findOne({
    borrowerId: user._id,
    status: 'unreturned'
  }).lean()

  if (unreturnedRequest) {
    throw new ApiError(StatusCodes.FORBIDDEN, `Bạn đang có thiết bị chưa hoàn trả (Mã đơn: ${unreturnedRequest.code || 'không xác định'}). Vui lòng trả thiết bị trước khi sử dụng tiếp.`)
  }

  const equipment = await Equipment.findById(equipmentId)
  if (!equipment) throw new ApiError(StatusCodes.NOT_FOUND, 'Equipment not found')

  await availabilityService.assertEquipmentBorrowable(equipmentId)

  const session = await scheduleService.assertUserInSession(user, equipment.roomId)

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
 */
const createLecturerRequest = async (user, body) => {
  const { equipmentId, purpose, note } = body

  const equipment = await Equipment.findById(equipmentId)
  if (!equipment) throw new ApiError(StatusCodes.NOT_FOUND, 'Equipment not found')

  await availabilityService.assertEquipmentBorrowable(equipmentId)

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

// ── Lecturer workflow actions ──────────────────────────────────────────────────

const approveRequest = async (id, approverId, decisionNote) => {
  const request = await BorrowRequest.findById(id)
  if (!request) throw new ApiError(StatusCodes.NOT_FOUND, 'Borrow request not found')
  if (request.status !== 'pending') throw new ApiError(StatusCodes.BAD_REQUEST, 'Request is not pending')

  await availabilityService.assertEquipmentBorrowable(request.equipmentId, {
    borrowDate: request.borrowDate,
    expectedReturnDate: request.expectedReturnDate,
  })

  request.status = 'approved'
  request.approvedBy = approverId
  request.approvedAt = new Date()
  if (decisionNote) request.decisionNote = decisionNote.trim()
  await request.save()

  const baseMsg = `Yêu cầu mượn #${request.code} đã được duyệt. Giảng viên sẽ sớm bàn giao thiết bị cho bạn.`
  await notificationService.createNotification({
    userId: request.borrowerId,
    type: 'approval',
    title: 'Yêu cầu mượn được duyệt',
    message: decisionNote ? `${baseMsg} Ghi chú: "${decisionNote.trim()}"` : baseMsg,
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
    message: `Yêu cầu mượn #${request.code} đã bị từ chối. Lý do: ${decisionNote?.trim() || 'Không có lý do'}.`,
    action: { type: 'open_detail', resource: 'borrow', resourceId: request._id },
  }).catch(err => console.error('Notify borrower failed:', err))

  return { message: 'Borrow request rejected', request }
}

/**
 * Student confirms they have received the equipment and submits handover checklist/images.
 * Transitions: approved → handed_over.
 *
 * @param {string} id           — BorrowRequest id
 * @param {string} studentId    — User id of the student
 * @param {object} handoverForm — { checklist: {appearance, functioning, accessories}, notes, images[] }
 */
const studentConfirmReceived = async (id, studentId, handoverForm) => {
  const request = await BorrowRequest.findById(id)
  if (!request) throw new ApiError(StatusCodes.NOT_FOUND, 'Borrow request not found')
  if (request.status !== 'approved') throw new ApiError(StatusCodes.BAD_REQUEST, 'Request phải ở trạng thái đã duyệt')
  if (request.borrowerId.toString() !== studentId.toString()) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Chỉ người mượn mới có thể xác nhận nhận thiết bị')
  }

  const { checklist = {}, notes = null, images = [] } = handoverForm || {}
  const isAllChecked = checklist.appearance && checklist.functioning && checklist.accessories

  if (!isAllChecked && (!Array.isArray(images) || images.length === 0)) {
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'Vui lòng cung cấp ảnh minh chứng nếu có mục không đạt yêu cầu')
  }

  request.status = 'handed_over'
  request.handedOverAt = new Date() // Set when student confirms
  request.studentConfirmedAt = new Date()
  request.handoverInfo = {
    checklist: {
      appearance:  !!checklist.appearance,
      functioning: !!checklist.functioning,
      accessories: !!checklist.accessories,
    },
    notes:       notes || null,
    images,
    submittedAt: new Date(),
  }
  await request.save()

  const equipment = await Equipment.findById(request.equipmentId).select('name').lean()
  await notificationService.createNotification({
    userId: request.approvedBy,
    type: 'borrow',
    title: 'Sinh viên đã xác nhận nhận thiết bị',
    message: `Sinh viên đã xác nhận nhận thiết bị ${equipment?.name || ''} (#${request.code}).`,
    action: { type: 'open_detail', resource: 'borrow', resourceId: request._id },
  }).catch(err => console.error('Notify lecturer failed:', err))

  return { message: 'Equipment confirmed received', request: await populateRequest(BorrowRequest.findById(request._id)) }
}

/**
 * Student submits return request (status only, no form data).
 * Transitions: handed_over → returning.
 *
 * @param {string} id         — BorrowRequest id
 * @param {string} studentId  — User id of the student
 */
const studentSubmitReturn = async (id, studentId) => {
  const request = await BorrowRequest.findById(id)
  if (!request) throw new ApiError(StatusCodes.NOT_FOUND, 'Borrow request not found')
  if (request.status !== 'handed_over') throw new ApiError(StatusCodes.BAD_REQUEST, 'Thiết bị chưa được bàn giao')
  if (request.borrowerId.toString() !== studentId.toString()) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Chỉ người mượn mới có thể gửi yêu cầu trả')
  }

  request.status = 'returning'
  await request.save()

  // Notify the lecturer who approved it (or handed it over), otherwise notify admins
  const notifyTarget = request.handedOverBy || request.approvedBy || null
  if (notifyTarget) {
    await notificationService.createNotification({
      userId: notifyTarget,
      type: 'return',
      title: 'Sinh viên gửi yêu cầu trả thiết bị',
      message: `Sinh viên đã gửi yêu cầu trả thiết bị (Yêu cầu #${request.code}). Vui lòng kiểm tra và xác nhận.`,
      action: { type: 'open_detail', resource: 'borrow', resourceId: request._id },
    }).catch(err => console.error('Notify lecturer failed:', err))
  } else {
    await notificationService.notifyAdmins({
      type: 'return',
      title: 'Yêu cầu trả thiết bị mới',
      message: `Sinh viên đã gửi yêu cầu trả thiết bị (Yêu cầu #${request.code}).`,
      action: { type: 'open_detail', resource: 'borrow', resourceId: request._id },
    }).catch(err => console.error('Notify admins failed:', err))
  }

  return { message: 'Return request submitted', request: await populateRequest(BorrowRequest.findById(request._id)) }
}

/**
 * Lecturer/Admin confirms return after inspecting the equipment.
 * Transitions: returning → returned.
 * DB status 'returned' maps to UI label 'Hoàn tất'.
 *
 * @param {string} id          — BorrowRequest id
 * @param {string} confirmedBy — User id of lecturer confirming
 * @param {object} returnForm  — { checklist: {appearance, functioning, accessories}, notes, images[] }
 */
const confirmReturn = async (id, confirmedBy, returnForm) => {
  const request = await BorrowRequest.findById(id).populate('borrowerId', 'displayName username')
  if (!request) throw new ApiError(StatusCodes.NOT_FOUND, 'Borrow request not found')
  if (request.status !== 'returning') {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Sinh viên chưa gửi yêu cầu trả thiết bị')
  }

  const { checklist = {}, notes = null, images = [] } = returnForm || {}
  const isAllChecked = checklist.appearance && checklist.functioning && checklist.accessories

  if (!isAllChecked && (!Array.isArray(images) || images.length === 0)) {
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'Vui lòng cung cấp ảnh minh chứng nếu có mục không đạt yêu cầu')
  }

  request.status = 'returned'
  request.returnedConfirmedBy = confirmedBy
  request.returnedAt = new Date()
  request.actualReturnDate = new Date()
  request.returnRequest = {
    checklist: {
      appearance:  !!checklist.appearance,
      functioning: !!checklist.functioning,
      accessories: !!checklist.accessories,
    },
    notes:       notes || null,
    images,
    submittedAt: new Date(),
  }
  await request.save()

  const borrowerName = request.borrowerId?.displayName || request.borrowerId?.username || 'Unknown'

  // Notify borrower that return is confirmed
  await notificationService.createNotification({
    userId: request.borrowerId._id || request.borrowerId,
    type: 'return',
    title: 'Thiết bị đã được xác nhận trả',
    message: `Giảng viên đã xác nhận bạn trả thiết bị thành công (Yêu cầu #${request.code}). Cảm ơn bạn!`,
    action: { type: 'open_detail', resource: 'borrow', resourceId: request._id },
  }).catch(err => console.error('Notify borrower failed:', err))

  // Notify admins/technicians
  try {
    const staff = await User.find({ role: { $in: ['admin', 'technician'] } }).select('_id').lean()
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

  return { message: 'Equipment returned confirmed', request }
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
    studentConfirmedAt: new Date(),
    decisionNote: 'Direct allocation by admin',
  })

  return {
    message: 'Direct allocation created',
    borrowRequest: await populateRequest(BorrowRequest.findById(request._id)),
  }
}

// ── Read queries ──────────────────────────────────────────────────────────────

const getAllBorrowRequests = async () => {
  return populateRequest(BorrowRequest.find())
}

const getBorrowRequestById = async (id) => {
  const request = await populateRequest(BorrowRequest.findById(id))
  if (!request) throw new ApiError(StatusCodes.NOT_FOUND, 'Borrow request not found')
  return request
}

const getPersonalBorrowRequests = async (userId) => {
  return populateRequest(BorrowRequest.find({ borrowerId: userId }))
}

const getPendingBorrowRequests = async () => {
  return populateRequest(BorrowRequest.find({ status: 'pending' }))
}

const getApprovedByMe = async (approverId) => {
  return populateRequest(
    BorrowRequest.find({
      approvedBy: approverId,
      status: { $in: ['approved', 'rejected', 'handed_over', 'returning', 'returned', 'cancelled'] },
    }).sort({ updatedAt: -1 }),
  )
}

const checkOverdueHandedOverRequests = async () => {
  const now = new Date()
  const overdueRequests = await BorrowRequest.find({
    status: { $in: ['handed_over', 'returning'] },
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
  studentConfirmReceived,
  studentSubmitReturn,
  confirmReturn,
  cancelRequest,
  adminDirectAllocate,
  getAllBorrowRequests,
  getBorrowRequestById,
  getPersonalBorrowRequests,
  getPendingBorrowRequests,
  getApprovedByMe,
  autoHandleEndedSessions,
  checkOverdueHandedOverRequests,
  remindBorrowRequest,
}
