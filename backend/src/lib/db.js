import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
  const MONGODB_URL =
    process.env.DATABASE_URL || "mongodb://127.0.0.1:27017/chat-app"; // Adjust the URL as necessary

  try {
    const conn = await mongoose.connect(MONGODB_URL);
    console.log(`MongoDB connected succesfully: ${conn.connection.host}`);
  } catch (error) {
    console.error("mongoDB connection failed:", error.message);
  }
};
