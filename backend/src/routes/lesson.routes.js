import { Router } from "express";
import {
  createLesson,
  getLessons,
  getLessonById,
  updateLesson,
  deleteLesson,
} from "../controllers/lesson.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

// Public routes
router.get("/", getLessons);
router.get("/:id", getLessonById);

// Protected routes
router.post("/", authMiddleware, createLesson);
router.put("/:id", authMiddleware, updateLesson);
router.delete("/:id", authMiddleware, deleteLesson);

export default router;
