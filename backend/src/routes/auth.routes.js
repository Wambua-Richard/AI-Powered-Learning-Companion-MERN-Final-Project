import { Router } from "express";
import {
  registerUser,
  loginUser,
  getProfile,
} from "../controllers/auth.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

// Register user
router.post("/register", registerUser);

// Login user
router.post("/login", loginUser);

// Get logged-in user's profile
router.get("/profile", authMiddleware, getProfile);

export default router;
