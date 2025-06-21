import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.mongo_uri as string);
    console.log('mongoDB connected');
  } catch (err) {
    console.error('db connection failed:', err);
    process.exit(1);
  }
};
