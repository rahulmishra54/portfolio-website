import "dotenv/config";
import app from "./app.js";
import connectDatabase from "./config/db.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log(process.env.MONGODB_URI);
    await connectDatabase();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server failed to start:", error);
    process.exit(1);
  }
};

startServer();