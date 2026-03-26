import { StatusCodes } from 'http-status-codes'
import BorrowRequest from '../models/BorrowRequest.js'
import Equipment from '../models/Equipment.js'
import ApiError from '../utils/ApiError.js'

/**
 * Derive the borrow status of an equipment piece from active BorrowRequests.
 *
 * Returns one of:
 *   'available'   — no active request; equipment is good
 *   'reserved'    — approved but not yet handed over
 *   'in_use'      — currently handed over to a borrower
 *   'unavailable' — equipment is broken or under maintenance (technical)
 *
 * @param {string|ObjectId} equipmentId
 * @returns {Promise<{ borrowStatus: string, activeRequest: object|null }>}
 */
const getEquipmentBorrowStatus = async (equipmentId) => {
  const equipment = await Equipment.findById(equipmentId)
  if (!equipment) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Equipment not found')
  }

  // Technical condition overrides everything
  if (equipment.status === 'broken' || equipment.status === 'maintenance') {
    return { borrowStatus: 'unavailable', activeRequest: null }
  }

  // Check for active borrow requests
  const activeRequest = await BorrowRequest.findOne({
    equipmentId,
    status: { $in: ['approved', 'handed_over', 'returning'] },
  })
    .populate('borrowerId', 'displayName username')
    .lean()

  if (!activeRequest) {
    return { borrowStatus: 'available', activeRequest: null }
  }

  if (activeRequest.status === 'handed_over' || activeRequest.status === 'returning') {
    return { borrowStatus: 'in_use', activeRequest }
  }

  // status === 'approved'
  return { borrowStatus: 'reserved', activeRequest }
}

/**
 * Check whether equipment can be borrowed right now.
 * Does NOT throw — returns a plain result object.
 *
 * @param {string|ObjectId} equipmentId
 * @param {{ borrowDate: Date, expectedReturnDate: Date }} [dateRange]
 * @returns {Promise<{ canBorrow: boolean, reason: string|null }>}
 */
const checkEquipmentBorrowability = async (equipmentId, dateRange = null) => {
  const equipment = await Equipment.findById(equipmentId)
  if (!equipment) {
    return { canBorrow: false, reason: 'Equipment not found' }
  }

  if (equipment.status === 'broken') {
    return { canBorrow: false, reason: 'Equipment is broken' }
  }
  if (equipment.status === 'maintenance') {
    return { canBorrow: false, reason: 'Equipment is under maintenance' }
  }

  // Check for any conflicting active requests in the requested time window
  const conflictQuery = {
    equipmentId,
    status: { $in: ['approved', 'handed_over', 'returning'] },
  }

  if (dateRange) {
    conflictQuery.borrowDate = { $lt: dateRange.expectedReturnDate }
    conflictQuery.expectedReturnDate = { $gt: dateRange.borrowDate }
  }

  const conflict = await BorrowRequest.findOne(conflictQuery).lean()
  if (conflict) {
    return { canBorrow: false, reason: 'Equipment is already reserved or in use for this period' }
  }

  return { canBorrow: true, reason: null }
}

/**
 * Same as checkEquipmentBorrowability but throws ApiError when not borrowable.
 * Use this in service functions where you want to fail fast.
 *
 * @param {string|ObjectId} equipmentId
 * @param {{ borrowDate: Date, expectedReturnDate: Date }} [dateRange]
 */
const assertEquipmentBorrowable = async (equipmentId, dateRange = null) => {
  const { canBorrow, reason } = await checkEquipmentBorrowability(equipmentId, dateRange)
  if (!canBorrow) {
    throw new ApiError(StatusCodes.BAD_REQUEST, reason)
  }
}

export const availabilityService = {
  getEquipmentBorrowStatus,
  checkEquipmentBorrowability,
  assertEquipmentBorrowable,
}
