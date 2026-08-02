import mongoose from "mongoose";

const connectDatabase = async () => {
  try {
    console.log("🔌 Connecting to MongoDB...");

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB Connected");
  } catch (error) {
    console.error( "MongoDB Connection Error");
    console.error(error.message);

    process.exit(1);
  }
};

export default connectDatabase;