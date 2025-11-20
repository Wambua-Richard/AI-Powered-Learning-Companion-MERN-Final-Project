import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import errorHandler from "./middleware/errorHandler.js";

import authRoutes from "./routes/auth.routes.js";
import lessonRoutes from "./routes/lesson.routes.js";
import quizRoutes from "./routes/quiz.routes.js";
import aiRoutes from "./routes/ai.routes.js";

const app = express();

// ---------- Global Middlewares ----------
app.use(
  cors({
    origin: "*", // you can restrict later for production
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security headers
app.use(helmet());

// HTTP request logging
app.use(morgan("dev"));

// ---------- API Routes ----------
app.use("/api/auth", authRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/quizzes", quizRoutes); // plural is best practice
app.use("/api/ai", aiRoutes);

// Health check endpoint (useful for monitoring)
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// ---------- Global Error Handler ----------
app.use(errorHandler);

export default app;

