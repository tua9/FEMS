import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from './src/models/User.js';

mongoose.connect('mongodb://127.0.0.1:27017/fems').then(async () => {
  const user = await User.findOne({});
  if (!user) return console.log('No user');
  console.log('Target user:', user.username);
  console.log('Original hash:', user.hashedPassword);
  
  const newHash = await bcrypt.hash('newSecurePassword123!', 10);
  console.log('New hash generated:', newHash);
  
  const result = await User.updateOne({ _id: user._id }, { $set: { hashedPassword: newHash } });
  console.log('Update result:', result);
  
  const userAfter = await User.findOne({ _id: user._id });
  console.log('Hash in DB after update:', userAfter.hashedPassword);
  
  process.exit();
}).catch(console.error);
