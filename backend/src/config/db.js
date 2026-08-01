import mongoose from "mongoose";

let cachedConnection = null;

const connectDatabase = async () => {
  if (cachedConnection) {
    console.log("Using cached MongoDB connection");
    return cachedConnection;
  }

  try {
    console.log("Connecting to MongoDB...");

    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      retryWrites: true,
      w: "majority",
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      family: 4,
    });

    cachedConnection = connection;
    console.log("✅ MongoDB Connected");
    return connection;
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    throw error;
  }
};

export default connectDatabase;