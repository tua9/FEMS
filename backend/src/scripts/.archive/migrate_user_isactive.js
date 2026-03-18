import { env } from '../config/environment.js';
import { connectDB } from '../libs/db.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

const migrate = async () => {
    try {
        await connectDB();
        console.log('Connected to database for migration...');

        // Update all users that don't have isActive field or where isActive is undefined
        const result = await User.updateMany(
            { isActive: { $exists: false } },
            { $set: { isActive: true } }
        );

        console.log(`Migration completed! ${result.modifiedCount} users updated.`);
        
        // Also ensure anyone who had the 'Inactive' avatarId hack gets isActive: false
        const inactiveResult = await User.updateMany(
            { avatarId: 'Inactive' },
            { $set: { isActive: false } }
        );
        console.log(`Updated ${inactiveResult.modifiedCount} inactive users based on legacy avatarId.`);

        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrate();
