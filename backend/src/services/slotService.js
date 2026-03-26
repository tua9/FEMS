import { StatusCodes } from 'http-status-codes'
import Slot from '../models/Slot.js'
import ApiError from '../utils/ApiError.js'

const getAllSlots = async () => {
  return await Slot.find({ isActive: true }).sort({ order: 1 })
}

const getSlotById = async (id) => {
  const slot = await Slot.findById(id)
  if (!slot) throw new ApiError(StatusCodes.NOT_FOUND, 'Slot not found')
  return slot
}

const createSlot = async (body) => {
  return await Slot.create(body)
}

import Schedule from '../models/Schedule.js'
import { buildVNDateTime } from '../utils/dateVN.js'

const updateSlot = async (id, body) => {
  const slot = await Slot.findByIdAndUpdate(id, body, { new: true, runValidators: true })
  if (!slot) throw new ApiError(StatusCodes.NOT_FOUND, 'Slot not found')

  if (body.startTime || body.endTime) {
    const schedulesToUpdate = await Schedule.find({
      slotId: id,
      status: { $in: ['scheduled', 'ongoing'] }
    })

    for (const sch of schedulesToUpdate) {
      const datePart = typeof sch.date === 'string'
        ? sch.date.slice(0, 10)
        : new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' }).format(new Date(sch.date))

      const newStartAt = buildVNDateTime(datePart, slot.startTime)
      const newEndAt = buildVNDateTime(datePart, slot.endTime)

      if (sch.startAt.getTime() !== newStartAt.getTime() || sch.endAt.getTime() !== newEndAt.getTime()) {
        sch.startAt = newStartAt
        sch.endAt = newEndAt
        await sch.save()
      }
    }
  }

  return slot
}

const deleteSlot = async (id) => {
  const slot = await Slot.findByIdAndUpdate(id, { isActive: false }, { new: true })
  if (!slot) throw new ApiError(StatusCodes.NOT_FOUND, 'Slot not found')
  return { message: 'Slot deactivated' }
}

export const slotService = {
  getAllSlots,
  getSlotById,
  createSlot,
  updateSlot,
  deleteSlot,
}
