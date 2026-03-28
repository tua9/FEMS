import mongoose from 'mongoose'

const { ObjectId } = mongoose.Schema.Types

/**
 * TeacherAttendance — records when a lecturer checks in/out for a scheduled session.
 *
 * Business rule: equipment borrowing for a session is only allowed after
 * the lecturer has checked in (status = 'present').
 */
const teacherAttendanceSchema = new mongoose.Schema(
  {
    scheduleId: {
      type: ObjectId,
      ref: 'Schedule',
      required: true,
    },

    lecturerId: {
      type: ObjectId,
      ref: 'User',
      required: true,
    },

    // How the check-in was recorded
    method: {
      type: String,
      enum: ['manual', 'qr_scan', 'system'],
      default: 'manual',
    },

    checkedInAt: {
      type: Date,
      default: null,
    },

    checkedOutAt: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ['present', 'absent', 'late'],
      default: 'present',
    },
  },
  { timestamps: true },
)

// One attendance record per lecturer per session
teacherAttendanceSchema.index({ scheduleId: 1, lecturerId: 1 }, { unique: true })

const TeacherAttendance = mongoose.model('TeacherAttendance', teacherAttendanceSchema)
export default TeacherAttendance
