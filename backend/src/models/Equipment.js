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

    borrowed_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    code: {
      type: String,
      unique: true,
      sparse: true, // allows existing docs without code; new ones always get one
      trim: true,
    },
    img: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
)

// Equipment availability logic: only depends on condition status and borrow status
assetSchema.pre('save', function () {
  if (this.status === 'broken' || this.status === 'maintenance') {
    this.available = false
  } else if (this.status === 'good') {
    this.available = !this.borrowed_by
  }
})

// Default sort by newest first
assetSchema.pre('find', function () {
  this.sort({ createdAt: -1 })

})

const Equipment = mongoose.model('Equipment', assetSchema, 'equipment')
export default Equipment
