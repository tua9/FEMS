import { StatusCodes } from 'http-status-codes'
import { borrowRequestService } from '../services/borrowRequestService.js'
import { asyncHandler } from '../middlewares/asyncHandler.js'

export const createBorrowRequest = asyncHandler(async (req, res) => {
  console.log('📕 create borrow request')
  const result = await borrowRequestService.createBorrowRequest({
    ...req.body,
    user_id: req.user._id,
  })
  res.status(StatusCodes.CREATED).json(result)
})

export const getAllBorrowRequests = asyncHandler(async (req, res) => {
  const result = await borrowRequestService.getAllBorrowRequests()
  res.status(StatusCodes.OK).json(result)
})

export const getBorrowRequestById = asyncHandler(async (req, res) => {
  const result = await borrowRequestService.getBorrowRequestById(req.params.id)
  res.status(StatusCodes.OK).json(result)
})

export const updateBorrowRequest = asyncHandler(async (req, res) => {
  const result = await borrowRequestService.updateBorrowRequest(
    req.params.id,
    req.body,
  )
  res.status(StatusCodes.OK).json(result)
})

export const getPersonalBorrowRequests = asyncHandler(async (req, res) => {
  console.log('📚 get personal borrow requests for user:', req.user._id)
  const result = await borrowRequestService.getPersonalBorrowRequests(
    req.user._id,
  )
  res.status(StatusCodes.OK).json(result)
})

export const cancelBorrowRequest = asyncHandler(async (req, res) => {
  const { decision_note } = req.body
  console.log('🚫 [CANCEL] id:', req.params.id)
  console.log('🚫 [CANCEL] userId:', req.user._id, '| type:', typeof req.user._id)
  console.log('🚫 [CANCEL] decision_note:', decision_note)
  const result = await borrowRequestService.cancelBorrowRequest(
    req.params.id,
    req.user._id,
    decision_note,
  )
  res.status(StatusCodes.OK).json(result)
})

export const approveBorrowRequest = asyncHandler(async (req, res) => {
  const result = await borrowRequestService.approveBorrowRequest(
    req.params.id,
    req.user._id,
  )
  res.status(StatusCodes.OK).json(result)
})

export const rejectBorrowRequest = asyncHandler(async (req, res) => {
  const { reason } = req.body
  const result = await borrowRequestService.rejectBorrowRequest(
    req.params.id,
    req.user._id,
    reason,
  )
  res.status(StatusCodes.OK).json(result)
})

export const directAllocateEquipment = asyncHandler(async (req, res) => {
  const result = await borrowRequestService.directAllocateEquipment(req.body, req.user._id)
  res.status(StatusCodes.CREATED).json(result)
})

export const handoverBorrowRequest = asyncHandler(async (req, res) => {
  const result = await borrowRequestService.handoverBorrowRequest(req.params.id)
  res.status(StatusCodes.OK).json(result)
})

export const returnBorrowRequest = asyncHandler(async (req, res) => {
  const result = await borrowRequestService.returnBorrowRequest(req.params.id)
  res.status(StatusCodes.OK).json(result)
})

export const remindBorrowRequest = asyncHandler(async (req, res) => {
  const result = await borrowRequestService.remindBorrowRequest(req.params.id)
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
