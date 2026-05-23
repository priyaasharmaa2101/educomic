import "dotenv/config";
import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) throw new Error("MONGO_URI not found in .env");

        await mongoose.connect(uri, {
            dbName: "express-data"
        });
        console.log("🚀 MongoDB Connected...");
    } catch (err) {
        console.error("❌ MongoDB Error:", err);
    }
};
export default connectDB;