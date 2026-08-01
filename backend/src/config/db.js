import mongoose from "mongoose";

let cachedConnection = null;

const connectDatabase = async () => {
  if (cachedConnection) {
    console.log("✅ Using cached MongoDB connection");
    return cachedConnection;
  }

  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      console.error("❌ MONGODB_URI environment variable is not set");
      throw new Error("MONGODB_URI is not configured");
    }

    console.log("🔌 Connecting to MongoDB...");
    console.log("URI (first 50 chars):", mongoUri.substring(0, 50) + "...");

    const connection = await mongoose.connect(mongoUri, {
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
    console.log("✅ MongoDB Connected successfully");
    console.log("Database:", connection.connection.db.databaseName);
    return connection;
  } catch (error) {
    console.error("❌ MongoDB Connection Error:");
    console.error("Code:", error.code);
    console.error("Message:", error.message);
    throw error;
  }
};

export default connectDatabase;