import "dotenv/config";
import app from "./app.js";
import connectDatabase from "./config/db.js";

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDatabase();
    console.log("✅ MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
}

startServer();