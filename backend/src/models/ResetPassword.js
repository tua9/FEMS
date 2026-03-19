import mongoose from 'mongoose'

const resetPasswordSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    token: {
      type: String,
      required: true,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
    expiresAt: {
      type: Date,
      required: true,
      expires: 0, // This tells MongoDB to automatically delete the document when expiresAt is reached
    },
  },
  { timestamps: true },
)

const ResetPassword = mongoose.model('ResetPassword', resetPasswordSchema)
export default ResetPassword
