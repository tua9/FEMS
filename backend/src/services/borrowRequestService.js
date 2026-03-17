import { StatusCodes } from 'http-status-codes'
import BorrowRequest from '../models/BorrowRequest.js'
import User from '../models/User.js'
import Equipment from '../models/Equipment.js'
import Room from '../models/Room.js'
import ApiError from '../utils/ApiError.js'

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

  // Must have at least equipment_id or room_id (or both, for fixed-location equipment)
  if (!equipment_id && !room_id) {
    throw new ApiError(
      StatusCodes.UNPROCESSABLE_ENTITY,
      'Must provide at least equipment_id or room_id',
    )
  }

  // 1. Validate Item Condition & Existence
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

  if (borrowDate >= returnDate) {
    throw new ApiError(
      StatusCodes.UNPROCESSABLE_ENTITY,
      'Borrow date must be before return date',
    )
  }

  // Allow requesting for today, but not in the very past (buffer of 5 mins)
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
    status: 'pending', // Explicitly set to pending
  })

  // Deep populate for immediate response if needed
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

  console.log(`🔍 [CANCEL SERVICE] Attempting findById with ID: "${id}" (length: ${id?.length})`)
  const request = await BorrowRequest.findById(id?.trim())
  console.log('🔍 [CANCEL SERVICE] findById result:', request ? `found _id=${request._id}` : 'NOT FOUND')
  if (!request) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Borrow request not found')
  }

  // Ownership check using string comparison to avoid ObjectId type mismatch
  console.log('🔍 [CANCEL SERVICE] request.user_id:', request.user_id?.toString(), '| incoming userId:', userId?.toString())
  console.log('🔍 [CANCEL SERVICE] match:', request.user_id?.toString() === userId?.toString())
  if (request.user_id.toString() !== userId.toString()) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'You can only cancel your own requests')
  }

  console.log('🔍 [CANCEL SERVICE] request.status:', request.status)
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

  // 1. Update Asset Status (Mark as occupied/borrowed)
  if (request.equipment_id) {
    const equipment = await Equipment.findById(request.equipment_id)
    if (equipment) {
      equipment.borrowed_by = request.user_id
      await equipment.save() // Triggers pre-save hook to set available = false
    }
  } else if (request.room_id) {
    const room = await Room.findById(request.room_id)
    if (room) {
      room.status = 'occupied'
      await room.save()
    }
  }

  // 2. Update Request Status
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

  // Handle equipment status if this is an equipment-type request
  if (request.type === 'equipment' && request.equipment_id) {
    const equipment = await Equipment.findById(request.equipment_id)
    if (!equipment) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Equipment not found')
    }
    if (!equipment.available) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Equipment is already borrowed or unavailable',
      )
    }

    // Update equipment availability
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

  // 1. Release Asset Status
  if (request.equipment_id) {
    const equipment = await Equipment.findById(request.equipment_id)
    if (equipment) {
      equipment.borrowed_by = null
      await equipment.save() // Triggers pre-save hook to set available = true
    }
  } else if (request.room_id) {
    const room = await Room.findById(request.room_id)
    if (room) {
      room.status = 'available'
      await room.save()
    }
  }

  // 2. Update Request Status
  request.status = 'returned'
  await request.save()

  return { message: 'Equipment returned and asset released', request }
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
  request.approved_by = approverId
  if (reason) {
    request.note = `${request.note || ''} | Rejection Reason: ${reason}`.trim()
  }
  await request.save()
  return { message: 'Borrow request rejected', request }
}

const getPendingBorrowRequests = async () => {
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
  return await BorrowRequest.find({ approved_by: approverId })
    .populate('user_id', 'displayName username')
    .populate('equipment_id', 'name category')
    .populate('room_id', 'name type')
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
  handoverBorrowRequest,
  returnBorrowRequest,
  getPendingBorrowRequests,
  getApprovedByMe,
}
