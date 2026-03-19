import { StatusCodes } from 'http-status-codes'
import { userService } from '../services/userService.js'
import { asyncHandler } from '../middlewares/asyncHandler.js'

export const createUser = asyncHandler(async (req, res) => {
  const result = await userService.createUser(req.body)
  res.status(StatusCodes.CREATED).json(result)
})

export const getAllUsers = asyncHandler(async (req, res) => {
  const result = await userService.getAllUsers()
  res.status(StatusCodes.OK).json(result)
})

export const getUserById = asyncHandler(async (req, res) => {
  const result = await userService.getUserById(req.params.id)
  res.status(StatusCodes.OK).json(result)
})

export const updateUser = asyncHandler(async (req, res) => {
  const result = await userService.updateUser(req.params.id, req.body)
  res.status(StatusCodes.OK).json(result)
})

export const deleteUser = asyncHandler(async (req, res) => {
  const result = await userService.deleteUser(req.params.id)
  res.status(StatusCodes.OK).json(result)
})

export const getUserProfile = asyncHandler(async (req, res) => {
  const result = await userService.getUserProfile(req.user._id)
  res.status(StatusCodes.OK).json(result)
})

export const updateOwnProfile = asyncHandler(async (req, res) => {
  const { phone, email } = req.body
  const result = await userService.updateUser(req.user._id, { phone, email })
  res.status(StatusCodes.OK).json(result)
})
