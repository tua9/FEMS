import express from 'express'
import {
  getNotifications,
  markRead,
  markAllRead,
  deleteNotification,
  clearAll,
} from '../controllers/notificationController.js'
import { protectedRoute } from '../middlewares/authMiddlewares.js'

const router = express.Router()

router.use(protectedRoute)

router.get('/', getNotifications)
router.patch('/mark-all-read', markAllRead)
router.patch('/:id/read', markRead)
router.delete('/clear-all', clearAll)
router.delete('/:id', deleteNotification)

export default router
