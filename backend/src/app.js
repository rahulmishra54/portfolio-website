import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

app.use(cors({
  origin: [
    "https://portfolio-website-d3ba.vercel.app",
    "http://localhost:5173"
  ],
  credentials: true,
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running...");
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", routes);
app.use(notFound);
app.use(errorHandler);

export default app;