import { StatusCodes } from 'http-status-codes'
import { reportService } from '../services/reportService.js'
import { asyncHandler } from '../middlewares/asyncHandler.js'

export const createReport = async (req, res) => {
  const data = { ...req.body }
  if (req.user) {
    data.user_id = req.user._id
  }

  const result = await reportService.createReport(data)
  res.status(StatusCodes.CREATED).json(result)
}

export const getAllReports = async (req, res) => {
  const result = await reportService.getAllReports()
  res.status(StatusCodes.OK).json(result)
}

export const getReportById = async (req, res) => {
  const result = await reportService.getReportById(req.params.id)
  res.status(StatusCodes.OK).json(result)
}

export const updateReport = async (req, res) => {
  const result = await reportService.updateReport(req.params.id, req.body)
  res.status(StatusCodes.OK).json(result)
}

export const deleteReport = async (req, res) => {
  const result = await reportService.deleteReport(req.params.id)
  res.status(StatusCodes.OK).json(result)
}

export const getPersonalReports = async (req, res) => {
  const result = await reportService.getPersonalReports(req.user._id)
  res.status(StatusCodes.OK).json(result)
}

export const updateReportStatus = async (req, res) => {
  const result = await reportService.updateReportStatus(
    req.params.id,
    req.body.status,
    req.user._id,
    req.body.technicianId
  )
  res.status(StatusCodes.OK).json(result)
}

export const cancelReport = asyncHandler(async (req, res) => {
  const { decision_note } = req.body
  const result = await reportService.cancelReport(
    req.params.id,
    req.user._id,
    decision_note,
  )
  res.status(StatusCodes.OK).json(result)
})

