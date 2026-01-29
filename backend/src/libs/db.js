import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
        console.log('😊 Connect to MongooseDB successful.');
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}