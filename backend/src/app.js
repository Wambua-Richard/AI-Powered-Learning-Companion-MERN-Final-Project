
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

// Middleware
import errorHandler from "./middleware/errorHandler.js";

// Routes
import authRoutes from "./routes/auth.routes.js";
import lessonRoutes from "./routes/lesson.routes.js";
import quizRoutes from "./routes/quiz.routes.js";
import aiRoutes from "./routes/ai.routes.js";

const app = express();

// -----------------------------------------------------
// GLOBAL MIDDLEWARE
// -----------------------------------------------------

// CORS — In production, restrict to frontend domain
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Parse JSON & form data
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: false, // prevents blocking images when using CDN
  })
);

// HTTP request logging (dev only)
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// -----------------------------------------------------
// API ROUTES
// -----------------------------------------------------
app.use("/api/auth", authRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/ai", aiRoutes);

// Health check (Useful for cloud deployments)
app.get("/api/health", (req, res) =>
  res.status(200).json({
    status: "OK",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  })
);

// -----------------------------------------------------
// GLOBAL ERROR HANDLER
// -----------------------------------------------------
app.use(errorHandler);

export default app;
