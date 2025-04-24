import mongoose from "mongoose";

export const connectDb = async (uri) => {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};
