import mongoose from 'mongoose'

const { ObjectId } = mongoose.Schema.Types

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    hashedPassword: {
      type: String,
      default: null,
    },
    googleId: {
      type: String,
      default: null,
    },
    displayName: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ['admin', 'student', 'lecturer', 'technician'],
      trim: true,
      required: true,
    },
    avatarUrl: {
      //CDN link
      type: String,
      trim: true,
    },
    avatarId: {
      //Cloudinary public_id
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    dob: {
      type: String,
      trim: true,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Only relevant for students — links to their academic class
    classId: {
      type: ObjectId,
      ref: 'Class',
      default: null,
    },
  },
  { timestamps: true },
)

// Default sort by newest first
userSchema.pre('find', function () {
  this.sort({ createdAt: -1 })
})

const User = mongoose.model('User', userSchema)
export default User
