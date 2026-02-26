import mongoose from 'mongoose'

const buildingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tên tòa nhà là bắt buộc'],
      trim: true,
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'maintenance'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  },
)

const Building = mongoose.model('Building', buildingSchema)
export default Building
