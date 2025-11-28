// ============================================================
// AI-Powered Learning Companion - Main Server Entry Point (ESM)
// - dotenv is loaded first (explicit backend/.env path)
// - Sentry optional
// - Secure defaults (helmet, compression)
// - Socket.IO with CORS from env
// - Graceful shutdown + process-level handlers
// ============================================================

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load dotenv as early as possible and force path to backend/.env
dotenv.config({ path: path.join(__dirname, "../.env") });

// ---------- Imports that depend on env ----------
import http from "http";
import mongoose from "mongoose";
import { Server } from "socket.io";
import * as Sentry from "@sentry/node";
import helmet from "helmet";
import compression from "compression";

import app from "./app.js";
import aiRoutes from "./routes/ai.routes.js";

// ---------- Basic sanity checks ----------
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = "development";
}

// ---------- Sentry setup (optional) ----------
if (process.env.SENTRY_DSN) {
  try {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV,
      tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE || 0.0),
    });

    // Attach Sentry request handler middleware early
    app.use(Sentry.Handlers.requestHandler());
    // Optionally attach tracing handler if using performance tracing
    if (Number(process.env.SENTRY_TRACES_SAMPLE_RATE || 0) > 0) {
      app.use(Sentry.Handlers.tracingHandler());
    }
    console.info("Sentry initialized.");
  } catch (err) {
    console.warn("Sentry initialization failed:", err.message);
  }
}

// ---------- Security & Performance middlewares (safe to reapply if also in app.js) ----------
app.use(helmet());
app.use(compression());

// ---------- Basic health & readiness endpoints ----------
app.get("/healthz", (_req, res) => res.status(200).json({ status: "ok", env: process.env.NODE_ENV }));
app.get("/ready", (_req, res) => res.status(200).send("ready"));

// ---------- Register API routes ----------
app.use("/api/v1/ai", aiRoutes);

// ---------- Sentry error handler (after routes) ----------
if (process.env.SENTRY_DSN) {
  app.use(Sentry.Handlers.errorHandler());
}

// ---------- Connect to MongoDB ----------
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/ai_learning_companion";

const mongooseOptions = {
  // Common recommended options. Some are defaults in modern mongoose, but explicitly declared for clarity.
  autoIndex: process.env.NODE_ENV !== "production", // avoid building indexes in production unless explicitly desired
  maxPoolSize: Number(process.env.MONGO_MAX_POOL_SIZE || 10),
  serverSelectionTimeoutMS: Number(process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS || 30000),
  socketTimeoutMS: Number(process.env.MONGO_SOCKET_TIMEOUT_MS || 45000),
  // useUnifiedTopology and useNewUrlParser are default in modern versions but harmless to keep for clarity
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose
  .connect(MONGO_URI, mongooseOptions)
  .then(() => {
    console.info("✅ MongoDB connected.");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    // If DB is critical, exit so process managers can restart or fail fast.
    // In some architectures you may want to continue and operate degraded — adjust as necessary.
    process.exit(1);
  });

// ---------- HTTP server + Socket.IO ----------
const server = http.createServer(app);

// Set server keep-alive / timeouts (optional / tuneable)
const SERVER_TIMEOUT_MS = Number(process.env.SERVER_TIMEOUT_MS || 120000); // 2 minutes default
server.setTimeout(SERVER_TIMEOUT_MS);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || (process.env.NODE_ENV === "production" ? false : "*"),
    methods: ["GET", "POST"],
    credentials: true,
  },
  // Additional Socket.IO options can be set here (pingTimeout, pingInterval, etc.)
});

// Minimal Socket.IO event handlers (kept lightweight)
io.on("connection", (socket) => {
  console.info(`Socket connected: ${socket.id}`);

  socket.on("join_room", ({ userId } = {}) => {
    if (!userId) return;
    const room = `user_${userId}`;
    socket.join(room);
    console.info(`User ${userId} joined room ${room}`);
  });

  socket.on("ai_message", ({ userId, message } = {}) => {
    if (!userId) return;
    const room = `user_${userId}`;
    io.to(room).emit("ai_response", message);
  });

  socket.on("disconnect", (reason) => {
    console.info(`Socket disconnected: ${socket.id} (${reason})`);
  });
});

// Make io accessible to other modules via app (if needed)
app.set("io", io);

// ---------- Start server ----------
const PORT = Number(process.env.PORT || 5000);
server.listen(PORT, () => {
  console.info(`🚀 Server running on port ${PORT} (env: ${process.env.NODE_ENV})`);
});

// ---------- Graceful shutdown ----------
let isShuttingDown = false;

async function gracefulShutdown(signal) {
  if (isShuttingDown) return;
  isShuttingDown = true;
  console.info(`🛑 Received ${signal}. Gracefully shutting down...`);

  // Stop accepting new connections
  try {
    server.close(() => {
      console.info("HTTP server closed.");
    });
  } catch (err) {
    console.warn("Error closing HTTP server:", err.message);
  }

  // Close socket.io (disconnect clients)
  try {
    io.close();
    console.info("Socket.IO server closed.");
  } catch (err) {
    console.warn("Error closing Socket.IO:", err.message);
  }

  // Close mongoose connection
  try {
    await mongoose.connection.close(false);
    console.info("MongoDB connection closed.");
  } catch (err) {
    console.error("Error closing MongoDB connection:", err.message);
  }

  // Give some time for cleanup then exit
  setTimeout(() => {
    console.info("Shutdown complete. Exiting.");
    process.exit(0);
  }, Number(process.env.SHUTDOWN_DELAY_MS || 3000));
}

// Handle signals
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

// ---------- Global error handlers ----------
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  // For production, optionally report to Sentry then exit
  if (process.env.NODE_ENV === "production") {
    if (process.env.SENTRY_DSN) Sentry.captureException(reason);
    // Allow some time for Sentry flush then exit
    setTimeout(() => process.exit(1), 2000);
  }
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception thrown:", err);
  if (process.env.SENTRY_DSN) {
    Sentry.captureException(err);
    // flush Sentry (if used) before exit
    Sentry.flush(2000).then(() => process.exit(1));
  } else {
    process.exit(1);
  }
});
