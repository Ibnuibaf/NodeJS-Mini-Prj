import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const DB_URI = process.env.DB_URI || "";

const connectDB = async () => {
  try {
    await mongoose.connect(DB_URI).then(() => {
      console.log("Database Connected Successfully");
    });
  } catch (error) {
    console.error(error);
    setTimeout(connectDB(), 5000);
  }
};

export default connectDB;
