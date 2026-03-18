import mongoose from 'mongoose'

const scheduleSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        type: {
            type: String,
            enum: ['class', 'meeting', 'lab_session'],
            default: 'class',
        },
        date: {
            type: Date,
            required: true,
        },
        startTime: {
            type: String,
            required: true,
        },
        endTime: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        status: {
            type: String,
            enum: ['active', 'upcoming', 'completed'],
            default: 'upcoming',
        },
    },
    { timestamps: true },
)

scheduleSchema.pre('find', function () {
    this.sort({ date: 1, startTime: 1 })
})

const Schedule = mongoose.model('Schedule', scheduleSchema)
export default Schedule
