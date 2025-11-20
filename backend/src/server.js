// Main entry point for the AI-Powered Learning Companion backend

import http from "http";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Server } from "socket.io";
import app from "./app.js";   // <-- Uses your updated app.js
import * as Sentry from '@sentry/node';
import aiRoutes from "./routes/ai.routes.js";
// ------------------------------
app.use("/api/v1/ai", aiRoutes);

// ------------------------------

Sentry.init({ dsn: process.env.SENTRY_DSN, environment: process.env.NODE_ENV });
app.use(Sentry.Handlers.requestHandler());
// define routes...
app.use(Sentry.Handlers.errorHandler());

dotenv.config();

// ------------------------------
// MONGO CONNECTION
// ------------------------------
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/ai_learning_companion";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

// ------------------------------
// CREATE HTTP SERVER
// ------------------------------
const server = http.createServer(app);

// ------------------------------
// SOCKET.IO SETUP
// ------------------------------
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Real-time events
io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  // Join user-specific room
  socket.on("join_room", ({ userId }) => {
    if (userId) {
      socket.join(`user_${userId}`);
      console.log(`User ${userId} joined room user_${userId}`);
    }
  });

  // For AI responses streaming or notifications later
  socket.on("ai_message", (data) => {
    io.to(`user_${data.userId}`).emit("ai_response", data.message);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected:", socket.id);
  });
});

// Make Socket.IO available across controllers (optional)
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

  await mongoose.connection.close();
  server.close(() => {
    console.log("🟡 Server closed.");
    process.exit(0);
  });
});
