import mongoose from 'mongoose'

const resetPasswordRateLimitSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    firstAttemptAt: {
      type: Date,
      default: Date.now,
    },
    blockedUntil: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
)

const ResetPasswordRateLimit = mongoose.model(
  'ResetPasswordRateLimit',
  resetPasswordRateLimitSchema
)

export default ResetPasswordRateLimit
