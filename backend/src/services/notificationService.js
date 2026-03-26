import { StatusCodes } from 'http-status-codes'
import Notification from '../models/Notification.js'
import User from '../models/User.js'
import ApiError from '../utils/ApiError.js'

const getUserNotifications = async (userId) => {
  return Notification.find({ userId })
}

const markAsRead = async (id, userId) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: id, userId },
    { isRead: true },
    { new: true },
  )
  if (!notification) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Notification not found')
  }
  return notification
}

const markAllAsRead = async (userId) => {
  await Notification.updateMany({ userId, isRead: false }, { isRead: true })
  return { message: 'All notifications marked as read' }
}

const deleteNotification = async (id, userId) => {
  const result = await Notification.findOneAndDelete({ _id: id, userId })
  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Notification not found')
  }
  return { message: 'Notification deleted' }
}

const clearAllNotifications = async (userId) => {
  await Notification.deleteMany({ userId })
  return { message: 'All notifications cleared' }
}

/**
 * Create a single notification.
 *
 * @param {object} data
 * @param {ObjectId|string} data.userId
 * @param {string} data.type
 * @param {string} data.title
 * @param {string} data.message
 * @param {object} [data.action]  — { type, resource, resourceId, payload }
 */
const createNotification = async (data) => {
  const { userId, type, title, message, action } = data
  if (!userId || !title || !message) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Missing required notification fields')
  }
  return Notification.create({ userId, type, title, message, action })
}

/**
 * Notify all active admins.
 *
 * @param {object} data — { type, title, message, action }
 */
const notifyAdmins = async (data) => {
  const admins = await User.find({ role: 'admin', isActive: true }).select('_id').lean()
  if (!admins.length) return
  const docs = admins.map(admin => ({
    userId: admin._id,
    type: data.type || 'general',
    title: data.title,
    message: data.message,
    action: data.action || { type: 'none' },
  }))
  return Notification.insertMany(docs)
}

/**
 * Broadcast a notification to a set of users (by role or specific user).
 *
 * @param {object} data
 * @param {'role'|'user'} data.targetType
 * @param {string}        data.targetId  — role name or user _id
 */
const broadcastNotification = async (data) => {
  const { targetType, targetId, type, title, message, action } = data
  const query = { isActive: true }

  if (targetType === 'role') {
    query.role = targetId
  } else if (targetType === 'user') {
    query._id = targetId
  }

  const users = await User.find(query).select('_id').lean()
  const docs = users.map(user => ({
    userId: user._id,
    type: type || 'general',
    title,
    message,
    action: action || { type: 'none' },
  }))

  return Notification.insertMany(docs)
}

export const notificationService = {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
  createNotification,
  notifyAdmins,
  broadcastNotification,
}
