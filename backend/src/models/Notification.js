import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['approval', 'borrow', 'return', 'equipment', 'report', 'general'],
      default: 'general',
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    to: {
      type: String,
      trim: true,
    },
    state: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  { timestamps: true },
)

// Default sort by newest first
notificationSchema.pre('find', function () {
  this.sort({ createdAt: -1 })
})

const Notification = mongoose.model('Notification', notificationSchema)
export default Notification
