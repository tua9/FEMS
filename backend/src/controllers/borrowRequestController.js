import { StatusCodes } from 'http-status-codes'
import { borrowRequestService } from '../services/borrowRequestService.js'
import { asyncHandler } from '../middlewares/asyncHandler.js'
import ApiError from '../utils/ApiError.js'

// ── Student / Lecturer create ─────────────────────────────────────────────────

export const createBorrowRequest = asyncHandler(async (req, res) => {
  const user = req.user
  let result

  if (user.role === 'lecturer') {
    result = await borrowRequestService.createLecturerRequest(user, req.body)
  } else {
    result = await borrowRequestService.createStudentRequest(user, req.body)
  }

  res.status(StatusCodes.CREATED).json(result)
})

// ── Admin direct allocation ───────────────────────────────────────────────────

export const directAllocateEquipment = asyncHandler(async (req, res) => {
  const result = await borrowRequestService.adminDirectAllocate(req.body, req.user._id)
  res.status(StatusCodes.CREATED).json(result)
})

// ── Read ──────────────────────────────────────────────────────────────────────

export const getAllBorrowRequests = asyncHandler(async (req, res) => {
  const result = await borrowRequestService.getAllBorrowRequests()
  res.status(StatusCodes.OK).json(result)
})

export const getBorrowRequestById = asyncHandler(async (req, res) => {
  const result = await borrowRequestService.getBorrowRequestById(req.params.id)

  // Students can only view their own requests
  if (req.user.role === 'student' && result.borrowerId?._id?.toString() !== req.user._id.toString()) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'You do not have permission to view this request.')
  }

  res.status(StatusCodes.OK).json(result)
})

export const getPersonalBorrowRequests = asyncHandler(async (req, res) => {
  const result = await borrowRequestService.getPersonalBorrowRequests(req.user._id)
  res.status(StatusCodes.OK).json(result)
})

export const getPendingBorrowRequests = asyncHandler(async (req, res) => {
  const result = await borrowRequestService.getPendingBorrowRequests()
  res.status(StatusCodes.OK).json(result)
})

export const getApprovedByMe = asyncHandler(async (req, res) => {
  const result = await borrowRequestService.getApprovedByMe(req.user._id)
  res.status(StatusCodes.OK).json(result)
})

// ── Workflow actions ──────────────────────────────────────────────────────────

export const approveBorrowRequest = asyncHandler(async (req, res) => {
  const { decisionNote } = req.body
  const result = await borrowRequestService.approveRequest(req.params.id, req.user._id, decisionNote)
  res.status(StatusCodes.OK).json(result)
})

export const rejectBorrowRequest = asyncHandler(async (req, res) => {
  const { decisionNote } = req.body
  const result = await borrowRequestService.rejectRequest(req.params.id, req.user._id, decisionNote)
  res.status(StatusCodes.OK).json(result)
})

/**
 * Student confirms they received the equipment.
 * Body: { checklist: { appearance, functioning, accessories }, notes, images[] }
 * Status: approved → handed_over
 */
export const confirmReceivedBorrowRequest = asyncHandler(async (req, res) => {
  const { checklist, notes, images } = req.body
  const result = await borrowRequestService.studentConfirmReceived(
    req.params.id, 
    req.user._id,
    { checklist, notes, images }
  )
  res.status(StatusCodes.OK).json(result)
})

/**
 * Student requests return. No body payload needed anymore.
 * Status: handed_over → returning
 */
export const submitReturnBorrowRequest = asyncHandler(async (req, res) => {
  const result = await borrowRequestService.studentSubmitReturn(
    req.params.id,
    req.user._id
  )
  res.status(StatusCodes.OK).json(result)
})

/**
 * Lecturer/Admin confirms return after inspecting equipment.
 * Body: { checklist: { appearance, functioning, accessories }, notes, images[] }
 * Status: returning → returned
 */
export const returnBorrowRequest = asyncHandler(async (req, res) => {
  const { checklist, notes, images } = req.body
  const result = await borrowRequestService.confirmReturn(
    req.params.id, 
    req.user._id,
    { checklist, notes, images }
  )
  res.status(StatusCodes.OK).json(result)
})

export const cancelBorrowRequest = asyncHandler(async (req, res) => {
  const { decisionNote } = req.body
  const result = await borrowRequestService.cancelRequest(req.params.id, req.user._id, decisionNote)
  res.status(StatusCodes.OK).json(result)
})

export const remindBorrowRequest = asyncHandler(async (req, res) => {
  const result = await borrowRequestService.remindBorrowRequest(req.params.id)
  res.status(StatusCodes.OK).json(result)
})
