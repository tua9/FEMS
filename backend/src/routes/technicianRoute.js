import express from 'express'
import { protectedRoute, restrictTo } from '../middlewares/authMiddlewares.js'
import {
  getTechnicianTickets,
  getTechnicianTicketStats,
} from '../controllers/technicianTicketController.js'
import {
  getTicketPipeline,
  getDeviceHealth,
} from '../controllers/technicianDashboardController.js'
import { getTechnicianTasks } from '../controllers/technicianTaskController.js'

const router = express.Router()

router.use(protectedRoute, restrictTo('technician', 'admin'))

// Dashboard stats cards
router.get('/stats', getTechnicianTicketStats)

// Ticket Center list (by status via query)
router.get('/tickets', getTechnicianTickets)

// Dashboard widgets
router.get('/dashboard/ticket-pipeline', getTicketPipeline)
router.get('/dashboard/device-health', getDeviceHealth)

// Active Work Orders (tasks)
router.get('/tasks', getTechnicianTasks)

export default router
