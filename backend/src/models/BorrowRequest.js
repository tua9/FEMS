import mongoose from 'mongoose'

const { ObjectId } = mongoose.Schema.Types

const borrowRequestSchema = new mongoose.Schema(
  {
    // Auto-generated business code, e.g. BR2603ABC
    code: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    // ── Borrower ──────────────────────────────────────────────────────────────
    borrowerId: {
      type: ObjectId,
      ref: 'User',
      required: true,
    },

    // Role at the time the request was created
    borrowerRole: {
      type: String,
      enum: ['student', 'lecturer'],
      required: true,
    },

    // ── Target asset ──────────────────────────────────────────────────────────
    equipmentId: {
      type: ObjectId,
      ref: 'Equipment',
      required: true,
    },

    // Room the equipment belongs to at time of request (for audit)
    roomId: {
      type: ObjectId,
      ref: 'Room',
      default: null,
    },

    // ── Session context ───────────────────────────────────────────────────────
    // The schedule session that grants the right to borrow
    scheduleId: {
      type: ObjectId,
      ref: 'Schedule',
      default: null,
    },

    // The slot (Ca 1 / Ca 2 …) the request belongs to
    classSlotId: {
      type: ObjectId,
      ref: 'Slot',
      default: null,
    },

    // ── Dates ─────────────────────────────────────────────────────────────────
    borrowDate: {
      type: Date,
      required: true,
    },

    expectedReturnDate: {
      type: Date,
      required: true,
    },

    actualReturnDate: {
      type: Date,
      default: null,
    },

    // ── Purpose / Notes ───────────────────────────────────────────────────────
    purpose: {
      type: String,
      default: null,
    },

    note: {
      type: String,
      default: null,
    },

    // ── Workflow status ───────────────────────────────────────────────────────
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'handed_over', 'returned', 'cancelled'],
      default: 'pending',
    },

    decisionNote: {
      type: String,
      default: null,
    },

    // ── Approval ──────────────────────────────────────────────────────────────
    approvedBy: {
      type: ObjectId,
      ref: 'User',
      default: null,
    },

    approvedAt: {
      type: Date,
      default: null,
    },

    // ── Handover ──────────────────────────────────────────────────────────────
    handedOverBy: {
      type: ObjectId,
      ref: 'User',
      default: null,
    },

    handedOverAt: {
      type: Date,
      default: null,
    },

    // ── Return confirmation ────────────────────────────────────────────────────
    returnedConfirmedBy: {
      type: ObjectId,
      ref: 'User',
      default: null,
    },

    returnedAt: {
      type: Date,
      default: null,
    },

    // ── Cancellation ──────────────────────────────────────────────────────────
    cancelledBy: {
      type: ObjectId,
      ref: 'User',
      default: null,
    },

    cancelledAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
)

// ── Indexes ───────────────────────────────────────────────────────────────────
borrowRequestSchema.index({ borrowerId: 1, status: 1 })
borrowRequestSchema.index({ equipmentId: 1, status: 1 })
borrowRequestSchema.index({ scheduleId: 1 })

// Default sort newest first
borrowRequestSchema.pre('find', function () {
  this.sort({ createdAt: -1 })
})

const BorrowRequest = mongoose.model('BorrowRequest', borrowRequestSchema)
export default BorrowRequest
