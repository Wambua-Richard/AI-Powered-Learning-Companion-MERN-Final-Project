// backend/src/controllers/ai.controller.js
import * as aiService from "../services/ai.service.js";

/**
 * Generic AI chat handler
 * POST /api/ai/ask
 */
export const askAI = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: "Message text is required." });
    }

    const reply = await aiService.generateAIResponse(message);

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("AI Controller Error (askAI):", err.message);
    next(err);
  }
};


/**
 * Tutor conversation endpoint
 * Similar to askAI but reserved for multi-turn tutoring in future
 */
export const aiChat = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: "Message text is required." });
    }

    const response = await aiService.generateAIResponse(message);

    return res.status(200).json({ response });
  } catch (err) {
    console.error("AI Controller Error (aiChat):", err.message);
    next(err);
  }
};


/**
 * Summarize study notes or long text
 * POST /api/ai/summarize
 */
export const summarizeNotes = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: "Input text is required." });
    }

    const summary = await aiService.summarizeText(text);

    return res.status(200).json({ summary });
  } catch (err) {
    console.error("AI Controller Error (summarizeNotes):", err.message);
    next(err);
  }
};


/**
 * Generate quiz questions from input content
 * POST /api/ai/generate-quiz
 */
export const generateQuizFromText = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: "Input text is required." });
    }

    const quiz = await aiService.createQuizFromContent(text);

    return res.status(200).json({ quiz });
  } catch (err) {
    console.error("AI Controller Error (generateQuizFromText):", err.message);
    next(err);
  }
};
