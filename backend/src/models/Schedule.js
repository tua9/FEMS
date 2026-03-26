import mongoose from 'mongoose'

const { ObjectId } = mongoose.Schema.Types

const scheduleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: Date,
      required: true,
    },

    slotId: {
      type: ObjectId,
      ref: 'Slot',
      required: true,
    },

    roomId: {
      type: ObjectId,
      ref: 'Room',
      required: true,
    },

    lecturerId: {
      type: ObjectId,
      ref: 'User',
      required: true,
    },

    studentIds: {
      type: [ObjectId],
      ref: 'User',
      default: [],
    },

    // Actual datetime stamps — derived from date + slot, stored for fast range queries
    startAt: {
      type: Date,
      required: true,
    },

    endAt: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
      default: 'scheduled',
    },
  },
  { timestamps: true },
)

scheduleSchema.index({ roomId: 1, startAt: 1, endAt: 1 })
scheduleSchema.index({ lecturerId: 1, date: 1 })
scheduleSchema.index({ studentIds: 1, date: 1 })

scheduleSchema.pre('find', function () {
  this.sort({ date: 1, startAt: 1 })
})

const Schedule = mongoose.model('Schedule', scheduleSchema)
export default Schedule
