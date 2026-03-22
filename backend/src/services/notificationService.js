import { StatusCodes } from 'http-status-codes'
import Notification from '../models/Notification.js'
import ApiError from '../utils/ApiError.js'

const getUserNotifications = async (userId) => {
  return await Notification.find({ user_id: userId })
}

const markAsRead = async (id, userId) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: id, user_id: userId },
    { read: true },
    { new: true },
  )
  if (!notification) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Notification not found')
  }
  return notification
}

const markAllAsRead = async (userId) => {
  await Notification.updateMany({ user_id: userId, read: false }, { read: true })
  return { message: 'All notifications marked as read' }
}

const deleteNotification = async (id, userId) => {
  const result = await Notification.findOneAndDelete({ _id: id, user_id: userId })
  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Notification not found')
  }
  return { message: 'Notification deleted' }
}

const clearAllNotifications = async (userId) => {
  await Notification.deleteMany({ user_id: userId })
  return { message: 'All notifications cleared' }
}

const createNotification = async (data) => {
  const { user_id, type, title, message, to, state } = data
  if (!user_id || !title || !message) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Missing required notification fields')
  }
  return await Notification.create({
    user_id,
    type,
    title,
    message,
    to,
    state,
  })
}

export const notificationService = {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
  createNotification,
}
