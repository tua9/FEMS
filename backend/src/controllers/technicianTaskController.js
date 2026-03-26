import { StatusCodes } from 'http-status-codes'
import { asyncHandler } from '../middlewares/asyncHandler.js'
import { technicianTaskService } from '../services/technicianTaskService.js'

// GET /api/technician/tasks
export const getTechnicianTasks = asyncHandler(async (req, res) => {
  const tasks = await technicianTaskService.getTasks({ user: req.user })
  res.status(StatusCodes.OK).json(tasks)
})
