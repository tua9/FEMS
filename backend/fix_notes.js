import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const borrowRequestSchema = new mongoose.Schema({
  decision_note: String
}, { strict: false });

const BorrowRequest = mongoose.model('BorrowRequest', borrowRequestSchema);

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
    
    const targetNote = 'Yêu cầu đã bị hệ thống tự động hủy do người mượn không đến nhận thiết bị trễ nhất vào lúc 17:00:00 của ngày handover hẹn trước.';
    const legacyNotes = [
      // Legacy variants we have seen historically
      'Hệ thống tự động hủy do người mượn không đến nhận thiết bị quá 8 tiếng.',
      'Yêu cầu đã bị hệ thống tự động hủy do người mượn không đến nhận thiết bị trong vòng 12 giờ kể từ khi kết thúc giờ hành chính của ngày bàn giao.',
      // The old "16:00 next working day" variants (with/without trailing dot)
      'Yêu cầu đã bị hệ thống tự động hủy do người mượn không đến nhận thiết bị trễ nhất vào lúc 16:00 của ngày làm việc tiếp theo.',
      'Yêu cầu đã bị hệ thống tự động hủy do người mượn không đến nhận thiết bị trễ nhất vào lúc 16:00 của ngày làm việc tiếp theo',
      // The new target text might have been saved without trailing dot in earlier builds
      'Yêu cầu đã bị hệ thống tự động hủy do người mượn không đến nhận thiết bị trễ nhất vào lúc 17:00:00 của ngày handover hẹn trước',
    ];

    const result = await BorrowRequest.updateMany(
      { decision_note: { $in: legacyNotes } },
      { $set: { decision_note: targetNote } }
    );

    console.log('Updated ' + result.modifiedCount + ' old records.');
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
}

run();
