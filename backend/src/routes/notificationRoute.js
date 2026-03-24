import express from 'express'
import {
  getNotifications,
  markRead,
  markAllRead,
  deleteNotification,
  clearAll,
  broadcastNotification,
} from '../controllers/notificationController.js'
import { protectedRoute, restrictTo } from '../middlewares/authMiddlewares.js'

const router = express.Router()

router.use(protectedRoute)

router.get('/', getNotifications)
router.patch('/mark-all-read', markAllRead)
router.patch('/:id/read', markRead)
router.delete('/clear-all', clearAll)
router.delete('/:id', deleteNotification)

// Broadcast (Admin only)
router.post('/broadcast', restrictTo('admin'), broadcastNotification)

export default router
