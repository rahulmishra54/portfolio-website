import "dotenv/config";
import app from "./app.js";
import connectDatabase from "./config/db.js";

const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === "production";
const isVercel = process.env.VERCEL === "1";

// Connect to database for all environments
connectDatabase().catch((error) => {
  console.error("❌ Failed to connect to MongoDB:", error.message);
  if (!isVercel) {
    process.exit(1);
  }
});

// Only start listening server in traditional environments (not serverless)
if (!isVercel) {
  const startServer = async () => {
    try {
      console.log("🚀 Starting Express server...");
      console.log("Environment: Development");

      const server = app.listen(PORT, "0.0.0.0", () => {
        console.log(`✅ Server running on port ${PORT}`);
      });

      // Graceful shutdown
      process.on("SIGTERM", () => {
        console.log("SIGTERM received, shutting down gracefully");
        server.close(() => {
          console.log("Server closed");
          process.exit(0);
        });
      });
    } catch (error) {
      console.error("❌ Server failed to start:", error.message);
      process.exit(1);
    }
  };

  startServer();
}

// Export app for Vercel serverless handler
export default app;