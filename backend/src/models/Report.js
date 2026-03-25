import mongoose from 'mongoose'

const reportSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // Null means it's a guest report from an unauthenticated user
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
      enum: ['pending', 'approved', 'rejected', 'processing', 'fixed', 'cancelled'],
      default: 'pending',
    },

    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },


    // Timestamps + actor for admin approve/reject/fix
    processed_at: { type: Date, default: null },
    processed_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

    assigned_to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },


    img: {
      type: String,
      default: null,
    },
    images: {
      type: [String],
      default: [],
    },

    description: {
      type: String,
      default: null,
    },

    decision_note: {
      type: String,
      default: null,
    },

    // Root cause of the damage (set by technician when resolving)
    cause: {
      type: String,
      enum: ['user_error', 'hardware', 'software', 'environment', 'unknown'],
      default: null,
    },

    // Repair outcome (set by technician when closing the report)
    outcome: {
      type: String,
      enum: ['fixed_internally', 'external_warranty', 'beyond_repair'],
      default: null,
    },

    // Auto-generated business code, e.g. RP2603ABC
    code: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
  },
  { timestamps: true },
)

// Default sort by newest first
reportSchema.pre('find', function () {
  this.sort({ createdAt: -1 })
})

const Report = mongoose.model('Report', reportSchema)

export default Report
