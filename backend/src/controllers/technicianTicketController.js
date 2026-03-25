import { StatusCodes } from 'http-status-codes'
import { asyncHandler } from '../middlewares/asyncHandler.js'
import { technicianTicketService } from '../services/technicianTicketService.js'

// GET /api/technician/stats
export const getTechnicianTicketStats = asyncHandler(async (req, res) => {
  const data = await technicianTicketService.getStats({ user: req.user })
  res.status(StatusCodes.OK).json(data)
})

// GET /api/technician/tickets?status=
export const getTechnicianTickets = asyncHandler(async (req, res) => {
  const data = await technicianTicketService.getTickets({
    user: req.user,
    status: req.query?.status,
  })
  res.status(StatusCodes.OK).json(data)
})

// PATCH /api/technician/tickets/:id
export const updateTechnicianTicket = asyncHandler(async (req, res) => {
  const { status, cause, outcome, decision_note: decisionNote } = req.body
  const data = await technicianTicketService.updateTicket({
    id: req.params.id,
    status,
    cause,
    outcome,
    decisionNote,
    technicianId: req.user._id,
  })
  res.status(StatusCodes.OK).json(data)
})
