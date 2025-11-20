/**
 * AI Routes
 * --------------------------------------
 * Handles requests for:
 *  - Chat-based tutoring
 *  - Topic explanations
 *  - AI-generated quizzes
 *  - General AI interactions
 *
 * All OpenAI logic is inside:
 *   - ai.controller.js
 *   - ai.service.js
 *
 * No API keys or SDK instances are exposed here.
 */

import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  askAI,
  aiChat,
  summarizeNotes,
  generateQuizFromText,
} from "../controllers/ai.controller.js";

const router = Router();

/**
 * ---------------------------------------------------------
 * @route   POST /api/ai/ask
 * @desc    One-off AI tutoring question
 * @access  Private (uses authMiddleware)
 * ---------------------------------------------------------
 */
router.post("/ask", authMiddleware, askAI);

/**
 * ---------------------------------------------------------
 * @route   POST /api/ai/chat
 * @desc    Free-form AI conversation
 * @access  Private (can remove middleware if desired)
 * ---------------------------------------------------------
 */
router.post("/chat", authMiddleware, aiChat);

/**
 * ---------------------------------------------------------
 * @route   POST /api/ai/summarize
 * @desc    Summarize user notes or text
 * @access  Public / Private (your choice)
 * ---------------------------------------------------------
 */
router.post("/summarize", summarizeNotes);

/**
 * ---------------------------------------------------------
 * @route   POST /api/ai/generate-quiz
 * @desc    Generate quiz questions based on provided text
 * @access  Public / Private (your choice)
 * ---------------------------------------------------------
 */
router.post("/generate-quiz", generateQuizFromText);

export default router;
