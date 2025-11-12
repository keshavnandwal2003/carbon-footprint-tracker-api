import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000 // timeout after 10s
        });
        console.log("✅ MongoDB connected", conn);
    } catch (err) {
        console.error("❌ DB Connection Error:", err.message);
        process.exit(1);
    }
};

export default connectDB;
