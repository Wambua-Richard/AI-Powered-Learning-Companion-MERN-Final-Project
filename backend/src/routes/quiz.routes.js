import { Router } from "express";
import {
  createQuiz,
  getQuizzes,
  getQuizById,
  submitQuiz,
} from "../controllers/quiz.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

// Public quiz browsing
router.get("/", getQuizzes);
router.get("/:id", getQuizById);

// Protected: create & submit
router.post("/", authMiddleware, createQuiz);
router.post("/:id/submit", authMiddleware, submitQuiz);

export default router;
