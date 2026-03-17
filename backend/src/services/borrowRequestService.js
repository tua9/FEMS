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

  if ((equipment_id && room_id) || (!equipment_id && !room_id)) {
    throw new ApiError(
      StatusCodes.UNPROCESSABLE_ENTITY,
      'Must provide either equipment_id or room_id (not both, not neither)',
    )
  }

  if (
    (type === 'infrastructure' && !room_id) ||
    (type === 'equipment' && !equipment_id)
  ) {
    throw new ApiError(
      StatusCodes.UNPROCESSABLE_ENTITY,
      'Type or id is not correct',
    )
  }

  const user = await User.findById(user_id).select('_id').lean()
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
  }

  if (equipment_id) {
    const equipment = await Equipment.findById(equipment_id)
      .select('_id')
      .lean()
    if (!equipment) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Equipment not found')
    }
  }

  if (room_id) {
    const room = await Room.findById(room_id).select('_id').lean()
    if (!room) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Room not found')
    }
  }

  const now = new Date()
  const borrowDate = new Date(borrow_date)
  const returnDate = new Date(return_date)

  if (borrowDate >= returnDate) {
    throw new ApiError(
      StatusCodes.UNPROCESSABLE_ENTITY,
      'Borrow date must be before return date',
    )
  }

  if (borrowDate < now) {
    throw new ApiError(
      StatusCodes.UNPROCESSABLE_ENTITY,
      'Borrow date cannot be in the past',
    )
  }

  const newBorrowRequest = await BorrowRequest.create({
    user_id,
    equipment_id: equipment_id || null,
    room_id: room_id || null,
    type: type || 'other',
    borrow_date: borrowDate,
    return_date: returnDate,
    note,
  })

  return {
    message: 'Create borrow request success',
    borrowRequest: newBorrowRequest,
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

  request.status = 'approved'
  request.processed_at = new Date()
  request.processed_by = approverId
  if (decisionNote) request.decision_note = decisionNote.trim()
  await request.save()
  return { message: 'Borrow request approved', request }
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

  request.status = 'returned'
  await request.save()
  return { message: 'Equipment returned', request }
}

export const borrowRequestService = {
  createBorrowRequest,
  getAllBorrowRequests,
  getPersonalBorrowRequests,
  getBorrowRequestById,
  updateBorrowRequest,
  cancelBorrowRequest,
  approveBorrowRequest,
  handoverBorrowRequest,
  returnBorrowRequest,
}
