import mongoose from 'mongoose'

const borrowRequestSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
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
      enum: ['equipment', 'infrastructure'],
      default: 'other',
    },

    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'handed_over', 'returned', 'cancelled'],
      default: 'pending',
    },


    borrow_date: {
      type: Date,
      required: true,
    },

    return_date: {
      type: Date,
      required: true,
    },

    note: {
      type: String,
      default: null,
    },

    // ── Decision / Audit fields ──────────────────────────────────────────────
    // Shared field for: user's cancel reason, admin's approve/reject note
    decision_note: {
      type: String,
      default: null,
    },

    // Timestamps + actor for cancel
    cancelled_at: { type: Date, default: null },
    cancelled_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

    // Timestamps + actor for admin approve/reject
    processed_at: { type: Date, default: null },
    processed_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true },
)

// Default sort by newest first
borrowRequestSchema.pre('find', function () {
  this.sort({ createdAt: -1 })
})

const BorrowRequest = mongoose.model('BorrowRequest', borrowRequestSchema)

export default BorrowRequest
