import mongoose from 'mongoose'

const { ObjectId } = mongoose.Schema.Types

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    type: {
      type: String,
      enum: ['classroom', 'lab', 'office', 'meeting', 'other'],
      default: 'classroom',
    },
    status: {
      type: String,
      enum: ['available', 'occupied', 'maintenance'],
      default: 'available',
    },
    buildingId: {
      type: ObjectId,
      ref: 'Building',
      default: null,
    },
    floor: {
      type: Number,
      default: 1,
    },
    labels: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
)

// Default sort newest first
roomSchema.pre('find', function () {
  this.sort({ createdAt: -1 })
})

const Room = mongoose.model('Room', roomSchema)
export default Room
