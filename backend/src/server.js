// ============================================================
//  AI-Powered Learning Companion - Main Server Entry Point
// ============================================================

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Force dotenv to load ONLY backend/.env
dotenv.config({
  path: path.join(__dirname, "../.env"),
});

console.log("ENV KEY IN SERVER:", process.env.OPENAI_API_KEY);

// ------------------------------
import http from "http";
import mongoose from "mongoose";
import { Server } from "socket.io";
import * as Sentry from "@sentry/node";
import app from "./app.js";
import aiRoutes from "./routes/ai.routes.js";


// ------------------------------
// SENTRY INITIALIZATION (if configured)
// ------------------------------
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || "development",
  });

  // Sentry request tracking middleware
  app.use(Sentry.Handlers.requestHandler());
}

// ------------------------------
// REGISTER ROUTES
// ------------------------------
app.use("/api/v1/ai", aiRoutes);

// ------------------------------
// SENTRY ERROR HANDLER (must come after routes)
// ------------------------------
if (process.env.SENTRY_DSN) {
  app.use(Sentry.Handlers.errorHandler());
}

// ------------------------------
// MONGO CONNECTION
// ------------------------------
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/ai_learning_companion";

mongoose
  .connect(MONGO_URI, {
    autoIndex: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

// ------------------------------
// HTTP SERVER INITIALIZATION
// ------------------------------
const server = http.createServer(app);

// ------------------------------
// SOCKET.IO SETUP
// ------------------------------
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST"],
  },
});

// Socket event handlers
io.on("connection", (socket) => {
  console.log(`🟢 Socket connected: ${socket.id}`);

  // User joins their private room
  socket.on("join_room", ({ userId }) => {
    if (userId) {
      const room = `user_${userId}`;
      socket.join(room);
      console.log(`🔵 User ${userId} joined room ${room}`);
    }
  });

  // AI messages broadcast to user room
  socket.on("ai_message", ({ userId, message }) => {
    if (userId) {
      const room = `user_${userId}`;
      io.to(room).emit("ai_response", message);
    }
  });

  socket.on("disconnect", () => {
    console.log(`🔴 Socket disconnected: ${socket.id}`);
  });
});

// Make Socket.IO accessible app-wide
app.set("io", io);

// ------------------------------
// START SERVER
// ------------------------------
const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);

// ------------------------------
// GRACEFUL SHUTDOWN
// ------------------------------
process.on("SIGINT", async () => {
  console.log("🛑 Gracefully shutting down...");

  try {
    await mongoose.connection.close();
    console.log("🟡 MongoDB connection closed.");
  } catch (err) {
    console.error("❌ Error closing MongoDB:", err.message);
  }

  server.close(() => {
    console.log("🟡 HTTP server closed.");
    process.exit(0);
  });
});
