import Schedule from '../models/Schedule.js'
import ApiError from '../utils/ApiError.js'
import { StatusCodes } from 'http-status-codes'

const createSchedule = async (data) => {
    return await Schedule.create(data)
}

const getMySchedules = async (userId, filterDate) => {
    const query = { user_id: userId }
    if (filterDate) {
        const start = new Date(filterDate)
        start.setHours(0, 0, 0, 0)
        const end = new Date(filterDate)
        end.setHours(23, 59, 59, 999)
        query.date = { $gte: start, $lte: end }
    }
    return await Schedule.find(query)
}

const getScheduleById = async (id, userId) => {
    const schedule = await Schedule.findOne({ _id: id, user_id: userId })
    if (!schedule) throw new ApiError(StatusCodes.NOT_FOUND, 'Schedule not found')
    return schedule
}

const updateSchedule = async (id, userId, data) => {
    const schedule = await Schedule.findOneAndUpdate(
        { _id: id, user_id: userId },
        data,
        { new: true, runValidators: true }
    )
    if (!schedule) throw new ApiError(StatusCodes.NOT_FOUND, 'Schedule not found')
    return schedule
}

const deleteSchedule = async (id, userId) => {
    const schedule = await Schedule.findOneAndDelete({ _id: id, user_id: userId })
    if (!schedule) throw new ApiError(StatusCodes.NOT_FOUND, 'Schedule not found')
    return { message: 'Schedule deleted gracefully' }
}

export const scheduleService = {
    createSchedule,
    getMySchedules,
    getScheduleById,
    updateSchedule,
    deleteSchedule,
}
