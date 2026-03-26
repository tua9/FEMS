import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Schedule from './src/models/Schedule.js';
import Slot from './src/models/Slot.js';
import { buildVNDateTime } from './src/utils/dateVN.js';

dotenv.config();

const sync = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
    console.log('Connected to DB');

    const schedules = await Schedule.find({
      status: { $in: ['scheduled', 'ongoing'] }
    }).populate('slotId');

    let updatedCount = 0;

    for (const sch of schedules) {
      if (!sch.slotId) continue;
      
      const slot = sch.slotId;
      const datePart = typeof sch.date === 'string'
        ? sch.date.slice(0, 10)
        : new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' }).format(new Date(sch.date));

      const newStartAt = buildVNDateTime(datePart, slot.startTime);
      const newEndAt = buildVNDateTime(datePart, slot.endTime);

      if (sch.startAt.getTime() !== newStartAt.getTime() || sch.endAt.getTime() !== newEndAt.getTime()) {
        sch.startAt = newStartAt;
        sch.endAt = newEndAt;
        await sch.save();
        updatedCount++;
      }
    }

    console.log(`Successfully synced ${updatedCount} schedules.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

sync();
