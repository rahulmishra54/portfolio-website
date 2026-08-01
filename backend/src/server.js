import "dotenv/config";
import app from "./app.js";
import connectDatabase from "./config/db.js";

const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === "production";

const startServer = async () => {
  try {
    console.log("🚀 Starting server...");
    console.log("Environment:", isProduction ? "Production (Vercel)" : "Development");
    
    await connectDatabase();

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

// Only start server in non-serverless environments
if (!isProduction || process.env.VERCEL !== "1") {
  startServer();
}

export default app;