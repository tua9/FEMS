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
    
    const result1 = await BorrowRequest.updateMany(
      { decision_note: 'Hệ thống tự động hủy do người mượn không đến nhận thiết bị quá 8 tiếng.' },
      { $set: { decision_note: 'Yêu cầu đã bị hệ thống tự động hủy do người mượn không đến nhận thiết bị trễ nhất vào lúc 16:00 của ngày làm việc tiếp theo.' } }
    );
    
    const result2 = await BorrowRequest.updateMany(
      { decision_note: 'Yêu cầu đã bị hệ thống tự động hủy do người mượn không đến nhận thiết bị trong vòng 12 giờ kể từ khi kết thúc giờ hành chính của ngày bàn giao.' },
      { $set: { decision_note: 'Yêu cầu đã bị hệ thống tự động hủy do người mượn không đến nhận thiết bị trễ nhất vào lúc 16:00 của ngày làm việc tiếp theo.' } }
    );
    
    console.log('Updated ' + (result1.modifiedCount + result2.modifiedCount) + ' old records.');
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
}

run();
