import { StatusCodes } from 'http-status-codes'
import { notificationService } from '../services/notificationService.js'
import { asyncHandler } from '../middlewares/asyncHandler.js'

export const getNotifications = asyncHandler(async (req, res) => {
  const result = await notificationService.getUserNotifications(req.user._id)
  res.status(StatusCodes.OK).json(result)
})

export const markRead = asyncHandler(async (req, res) => {
  const result = await notificationService.markAsRead(req.params.id, req.user._id)
  res.status(StatusCodes.OK).json(result)
})

export const markAllRead = asyncHandler(async (req, res) => {
  const result = await notificationService.markAllAsRead(req.user._id)
  res.status(StatusCodes.OK).json(result)
})

export const deleteNotification = asyncHandler(async (req, res) => {
  const result = await notificationService.deleteNotification(req.params.id, req.user._id)
  res.status(StatusCodes.OK).json(result)
})

export const clearAll = asyncHandler(async (req, res) => {
  const result = await notificationService.clearAllNotifications(req.user._id)
  res.status(StatusCodes.OK).json(result)
})

export const broadcastNotification = asyncHandler(async (req, res) => {
  const result = await notificationService.broadcastNotification(req.body)
  res.status(StatusCodes.OK).json(result)
})
