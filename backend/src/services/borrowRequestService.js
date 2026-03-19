import { StatusCodes } from 'http-status-codes'
import BorrowRequest from '../models/BorrowRequest.js'
import User from '../models/User.js'
import Equipment from '../models/Equipment.js'
import Room from '../models/Room.js'
import ApiError from '../utils/ApiError.js'

const autoCancelExpiredRequests = async () => {
  const approvedRequests = await BorrowRequest.find({ status: 'approved' })
  const now = new Date()

  for (const req of approvedRequests) {
    // Lấy ngày hẹn mượn
    const borrowDate = new Date(req.borrow_date)
    
    // Deadline auto-cancel: kết thúc giờ hành chính 17:00:00 của đúng ngày handover (borrow_date)
    const deadline = new Date(borrowDate)
    deadline.setHours(17, 0, 0, 0)
    
    if (now > deadline) {
      req.status = 'cancelled'
      req.decision_note = 'Yêu cầu đã bị hệ thống tự động hủy do người mượn không đến nhận thiết bị trễ nhất vào lúc 17:00:00 của ngày handover hẹn trước.'
      req.cancelled_at = new Date()
      await req.save()
    }
  }
}

const createBorrowRequest = async (body) => {
  const {
    user_id,
    equipment_id,
    room_id,
    type,
    borrow_date,
    return_date,
    note,
  } = body

  if (!user_id) {
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'user_id is required')
  }

  if (!equipment_id && !room_id) {
    throw new ApiError(
      StatusCodes.UNPROCESSABLE_ENTITY,
      'Must provide at least equipment_id or room_id',
    )
  }

  if (equipment_id) {
    const equipment = await Equipment.findById(equipment_id)
    if (!equipment) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Equipment not found')
    }
    if (equipment.status === 'broken' || equipment.status === 'maintenance') {
      throw new ApiError(StatusCodes.BAD_REQUEST, `Equipment is currently ${equipment.status}`)
    }
  }

  if (room_id) {
    const room = await Room.findById(room_id)
    if (!room) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Room not found')
    }
    if (room.status === 'maintenance') {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Room is currently under maintenance')
    }
  }

  // 2. Validate Dates
  const now = new Date()
  const borrowDate = new Date(borrow_date)
  const returnDate = new Date(return_date)

  if (isNaN(borrowDate.getTime()) || isNaN(returnDate.getTime())) {
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'Invalid dates provided')
  }

  if (equipment_id) {
    const conflictingRequests = await BorrowRequest.find({
      equipment_id,
      status: { $in: ['approved', 'handed_over', 'borrowing'] },
      borrow_date: { $lt: returnDate }, // Existing start < New end
      return_date: { $gt: borrowDate }  // Existing end > New start
    })

    if (conflictingRequests.length > 0) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Thiết bị đã có người đặt trước trong hệ thống với khoảng thời gian này. Vui lòng chọn thiết bị hoặc thời gian khác.')
    }
  }

  if (borrowDate >= returnDate) {
    throw new ApiError(
      StatusCodes.UNPROCESSABLE_ENTITY,
      'Borrow date must be before return date',
    )
  }

  if (borrowDate < new Date(now.getTime() - 5 * 60 * 1000)) {
    throw new ApiError(
      StatusCodes.UNPROCESSABLE_ENTITY,
      'Borrow date cannot be in the past',
    )
  }

  // 3. Create Pending Request
  const newBorrowRequest = await BorrowRequest.create({
    user_id,
    equipment_id: equipment_id || null,
    room_id: room_id || null,
    type: type || 'other',
    borrow_date: borrowDate,
    return_date: returnDate,
    note,
    status: 'pending',
  })

  const populatedRequest = await BorrowRequest.findById(newBorrowRequest._id)
    .populate('equipment_id', 'name category qr_code')
    .populate({
      path: 'room_id',
      select: 'name type building_id',
      populate: { path: 'building_id', select: 'name' }
    })

  return {
    message: 'Create borrow request success',
    borrowRequest: populatedRequest,
  }
}

const getAllBorrowRequests = async () => {
  await autoCancelExpiredRequests()
  return await BorrowRequest.find()
    .populate('user_id', 'username displayName email')
    .populate('equipment_id')
    .populate('room_id')
    .populate('processed_by', 'username displayName')
}

const getBorrowRequestById = async (id) => {
  const borrowRequest = await BorrowRequest.findById(id)
    .populate('user_id', 'username displayName email')
    .populate('equipment_id')
    .populate('room_id')
    .populate('processed_by', 'username displayName')

  if (!borrowRequest) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Borrow request not found')
  }
  return borrowRequest
}

const updateBorrowRequest = async (id, body) => {
  const { status, processed_by, note, return_date } = body
  const borrowRequest = await BorrowRequest.findByIdAndUpdate(
    id,
    { status, processed_by, note, return_date },
    { new: true, runValidators: true },
  )

  if (!borrowRequest) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Borrow request not found')
  }
  return { message: 'Update success', borrowRequest }
}

const getPersonalBorrowRequests = async (userId) => {
  await autoCancelExpiredRequests()
  return await BorrowRequest.find({ user_id: userId })
    .populate('equipment_id', '_id name category status available')
    .populate('room_id', 'name type')
    .populate('processed_by', 'displayName')
}

const cancelBorrowRequest = async (id, userId, decisionNote) => {
  if (!decisionNote || !decisionNote.trim()) {
    throw new ApiError(
      StatusCodes.UNPROCESSABLE_ENTITY,
      'Lý do hủy (decision_note) là bắt buộc',
    )
  }

  const request = await BorrowRequest.findById(id?.trim())
  if (!request) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Borrow request not found')
  }

  if (request.user_id.toString() !== userId.toString()) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'You can only cancel your own requests')
  }

  if (request.status !== 'pending') {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Only pending requests can be cancelled',
    )
  }

  request.status = 'cancelled'
  request.decision_note = decisionNote.trim()
  request.cancelled_at = new Date()
  request.cancelled_by = userId
  await request.save()
  return { message: 'Borrow request cancelled', request }
}

const approveBorrowRequest = async (id, approverId, decisionNote) => {
  const request = await BorrowRequest.findById(id)
  if (!request) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Borrow request not found')
  }
  if (request.status !== 'pending') {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Request is not pending')
  }

  if (request.equipment_id) {
    const conflictingRequests = await BorrowRequest.find({
      _id: { $ne: id },
      equipment_id: request.equipment_id,
      status: { $in: ['approved', 'handed_over', 'borrowing'] },
      borrow_date: { $lt: request.return_date },
      return_date: { $gt: request.borrow_date }
    })
    if (conflictingRequests.length > 0) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Không thể duyệt vì thiết bị đã được xếp lịch cho một đơn khác bị trùng thời gian.')
    }
    // Không gán borrowed_by ở đây nữa để tránh khóa chết available = false. 
    // Người khác vẫn có thể đặt trước được vào ngày khác.
  } else if (request.room_id) {
    const room = await Room.findById(request.room_id)
    if (room) {
      room.status = 'occupied'
      await room.save()
    }
  }

  request.status = 'approved'
  request.processed_at = new Date()
  request.processed_by = approverId
  if (decisionNote) request.decision_note = decisionNote.trim()
  await request.save()

  return { message: 'Borrow request approved and asset locked', request }
}

const handoverBorrowRequest = async (id) => {
  const request = await BorrowRequest.findById(id)
  if (!request) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Borrow request not found')
  }
  if (request.status !== 'approved') {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Request must be approved first',
    )
  }

  if (request.type === 'equipment' && request.equipment_id) {
    const equipment = await Equipment.findById(request.equipment_id)
    if (!equipment) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Equipment not found')
    }

    // Handover triggers request status change to 'handed_over' (which UI maps to Borrowing)
    equipment.available = false
    equipment.borrowed_by = request.user_id
    await equipment.save()
  }

  request.status = 'handed_over'
  await request.save()
  return { message: 'Equipment handed over', request }
}

const returnBorrowRequest = async (id) => {
  const request = await BorrowRequest.findById(id)
  if (!request) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Borrow request not found')
  }
  if (!['handed_over', 'approved'].includes(request.status)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid status to return')
  }

  if (request.equipment_id) {
    const equipment = await Equipment.findById(request.equipment_id)
    if (equipment) {
      equipment.borrowed_by = null
      await equipment.save()
    }
  } else if (request.room_id) {
    const room = await Room.findById(request.room_id)
    if (room) {
      room.status = 'available'
      await room.save()
    }
  }

  request.status = 'returned'
  await request.save()

  return { message: 'Equipment returned and asset released', request }
}

const directAllocateEquipment = async (body, allocatorId) => {
  const { user_id, equipment_id, borrow_date, return_date, note } = body

  if (!user_id) {
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'user_id is required')
  }
  if (!equipment_id) {
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'equipment_id is required')
  }

  const borrower = await User.findById(user_id)
  if (!borrower) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
  }

  const equipment = await Equipment.findById(equipment_id)
  if (!equipment) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Equipment not found')
  }
  if (equipment.status === 'broken' || equipment.status === 'maintenance') {
    throw new ApiError(StatusCodes.BAD_REQUEST, `Equipment is currently ${equipment.status}`)
  }
  if (equipment.available === false) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Equipment is not available')
  }

  const borrowDate = new Date(borrow_date)
  const returnDate = new Date(return_date)
  if (isNaN(borrowDate.getTime()) || isNaN(returnDate.getTime())) {
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'Invalid dates provided')
  }
  if (borrowDate >= returnDate) {
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'Borrow date must be before return date')
  }

  // Avoid allocating if already scheduled/active in that window
  const conflictingRequests = await BorrowRequest.find({
    equipment_id,
    status: { $in: ['approved', 'handed_over', 'borrowing'] },
    borrow_date: { $lt: returnDate }, // Existing start < New end
    return_date: { $gt: borrowDate }, // Existing end > New start
  })
  if (conflictingRequests.length > 0) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Thiết bị đã có người đặt trước trong hệ thống với khoảng thời gian này. Vui lòng chọn thiết bị hoặc thời gian khác.',
    )
  }

  // Create request already handed over (direct allocation)
  const request = await BorrowRequest.create({
    user_id,
    equipment_id,
    room_id: null,
    type: 'equipment',
    borrow_date: borrowDate,
    return_date: returnDate,
    note: note || null,
    status: 'handed_over',
    processed_at: new Date(),
    processed_by: allocatorId,
    decision_note: 'Direct allocation',
  })

  equipment.available = false
  equipment.borrowed_by = borrower._id
  await equipment.save()

  const populatedRequest = await BorrowRequest.findById(request._id)
    .populate('user_id', 'username displayName email')
    .populate('equipment_id')
    .populate('processed_by', 'username displayName')

  return { message: 'Direct allocation created', borrowRequest: populatedRequest }
}

const rejectBorrowRequest = async (id, approverId, reason) => {
  const request = await BorrowRequest.findById(id)
  if (!request) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Borrow request not found')
  }
  if (request.status !== 'pending') {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Request is not pending')
  }

  request.status = 'rejected'
  request.processed_by = approverId
  request.processed_at = new Date()
  if (reason) {
    request.note = `${request.note || ''} | Rejection Reason: ${reason}`.trim()
  }
  await request.save()
  return { message: 'Borrow request rejected', request }
}

const getPendingBorrowRequests = async () => {
  await autoCancelExpiredRequests()
  return await BorrowRequest.find({ status: 'pending' })
    .populate('user_id', 'username displayName email')
    .populate('equipment_id', 'name category qr_code status available')
    .populate({
      path: 'room_id',
      select: 'name type building_id',
      populate: { path: 'building_id', select: 'name' },
    })
}

const getApprovedByMe = async (approverId) => {
  await autoCancelExpiredRequests()
  return await BorrowRequest.find({ processed_by: approverId, status: 'approved' })
    .populate('user_id', 'displayName username')
    .populate('equipment_id', 'name category')
    .populate('room_id', 'name type')
}

const remindBorrowRequest = async (id) => {
  const request = await BorrowRequest.findById(id).populate('user_id', 'displayName email')
  if (!request) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Borrow request not found')
  }

  if (!request.user_id) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Borrower information not found')
  }

  console.log(`🔔 Reminder sent to ${request.user_id.displayName} (${request.user_id.email}) for request ${id}`)

  return { message: 'Reminder sent successfully' }
}

export const borrowRequestService = {
  createBorrowRequest,
  getAllBorrowRequests,
  getPersonalBorrowRequests,
  getBorrowRequestById,
  updateBorrowRequest,
  cancelBorrowRequest,
  approveBorrowRequest,
  rejectBorrowRequest,
  directAllocateEquipment,
  handoverBorrowRequest,
  returnBorrowRequest,
  remindBorrowRequest,
  getPendingBorrowRequests,
  getApprovedByMe,
}
