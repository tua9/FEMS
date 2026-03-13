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
  const result = await borrowRequestService.cancelBorrowRequest(
    req.params.id,
    req.user._id,
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

export const handoverBorrowRequest = asyncHandler(async (req, res) => {
  const result = await borrowRequestService.handoverBorrowRequest(req.params.id)
  res.status(StatusCodes.OK).json(result)
})

export const returnBorrowRequest = asyncHandler(async (req, res) => {
  const result = await borrowRequestService.returnBorrowRequest(req.params.id)
  res.status(StatusCodes.OK).json(result)
})
