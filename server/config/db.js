import mongoose from "mongoose";

const connectDB = async () => {
    const uri =
        process.env.NODE_ENV === "production"
            ? process.env.MONGO_URI_PROD
            : process.env.MONGO_URI_DEV;

    console.log("NODE_ENV", uri);
    try {
        await mongoose.connect(uri);
        console.log(`MongoDB connected to ${process.env.NODE_ENV} database`);
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
    }
};

export default connectDB;
