import mongoose from 'mongoose'

const reportSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    equipment_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Equipment',
      default: null,
    },

    room_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      default: null,
    },

    type: {
      type: String,
      enum: ['equipment', 'infrastructure', 'other'],
      default: 'other',
    },

    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },

    approved_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    img: {
      type: String,
      default: null,
    },

    description: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
)

const Report = mongoose.model('Report', reportSchema)

export default Report
