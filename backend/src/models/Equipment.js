import mongoose from 'mongoose'

const { ObjectId } = mongoose.Schema.Types

const equipmentSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
    },

    // Technical condition only — NOT borrow status
    // Borrow status is derived from BorrowRequest (see availabilityService)
    status: {
      type: String,
      enum: ['available', 'maintenance', 'broken'],
      required: true,
      default: 'available',
    },

    roomId: {
      type: ObjectId,
      ref: 'Room',
      default: null,
    },

    img: {
      type: String,
      default: null,
    },

    description: {
      type: String,
      default: null,
      trim: true,
    },

    lastMaintenanceDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
)

equipmentSchema.index({ roomId: 1 })
equipmentSchema.index({ status: 1 })

// Default sort newest first
equipmentSchema.pre('find', function () {
  this.sort({ createdAt: -1 })
})

const Equipment = mongoose.model('Equipment', equipmentSchema, 'equipment')
export default Equipment
