import mongoose from 'mongoose'

const { ObjectId } = mongoose.Schema.Types

const actionSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['none', 'open_detail', 'open_list', 'open_external'], default: 'none' },
    resource: { type: String, default: null },
    resourceId: { type: ObjectId, default: null },
    payload: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  { _id: false }
)

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ['borrow', 'approval', 'return', 'equipment', 'report', 'general'],
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

    isRead: {
      type: Boolean,
      default: false,
    },

    action: {
      type: actionSchema,
      default: () => ({ type: 'none', resource: null, resourceId: null, payload: null }),
    },
  },
  { timestamps: true },
)

// Default sort newest first
notificationSchema.pre('find', function () {
  this.sort({ createdAt: -1 })
})

const Notification = mongoose.model('Notification', notificationSchema)
export default Notification
