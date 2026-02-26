import mongoose from 'mongoose'

const assetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
    },

    available: {
      type: Boolean,
      default: true,
    },

    status: {
      type: String,
      enum: ['good', 'broken', 'maintenance'],
      required: true,
      default: 'good',
    },

    room_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      default: null,
    },

    qr_code: {
      type: String,
      unique: true,
      sparse: true,
      default: null,
    },
  },
  {
    timestamps: true,
  },
)

const Equipment = mongoose.model('Equipment', assetSchema)
export default Equipment
