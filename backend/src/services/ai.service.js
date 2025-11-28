// src/services/ai.service.js
// ============================================================
// AI Service Layer
// - Uses OpenAI client (ESM)
// - Assumes dotenv already loaded in server.js (entrypoint)
// - Validates OPENAI_API_KEY safely
// - Provides explainTopic() and generateQuiz() helpers
// ============================================================

import OpenAI from "openai";

// ------------------------------------------------------------
// Validate API key AFTER dotenv loaded in server.js
// (We do not import dotenv here — server.js already initialized it.)
// ------------------------------------------------------------
const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey || typeof apiKey !== "string" || apiKey.trim().length < 20) {
  throw new Error(
    "❌ OPENAI_API_KEY is missing or invalid. Check your backend/.env file before starting the server."
  );
}

// ------------------------------------------------------------
// Initialize OpenAI client
// ------------------------------------------------------------
const client = new OpenAI({
  apiKey,
});

// ------------------------------------------------------------
// 1. Explain Topic
// ------------------------------------------------------------
/**
 * Generate a simplified explanation of a topic for a learner.
 * @param {string} prompt - Topic or concept to explain.
 * @param {object} options - Configuration (e.g., learner level).
 * @returns {Promise<string>} AI-generated explanation.
 */
export const explainTopic = async (prompt, options = {}) => {
  try {
    if (!prompt || typeof prompt !== "string") {
      throw new Error("Invalid prompt. Must be a non-empty string.");
    }

    const userLevel = options.level || "student";

    const input = `
Explain the following topic to a ${userLevel} using simple, clear, structured and educational language:

${prompt}
    `;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: input }],
      max_tokens: 800,
      temperature: 0.5,
    });

    return response?.choices?.[0]?.message?.content?.trim() || "";
  } catch (err) {
    console.error("❌ Error in explainTopic:", err);
    throw new Error("Unable to generate topic explanation at this time.");
  }
};

// ------------------------------------------------------------
// 2. Generate Quiz
// ------------------------------------------------------------
/**
 * Generate a structured multiple-choice quiz in JSON format.
 * @param {string} topic - Subject of the quiz.
 * @param {number} numQuestions - Question count.
 * @returns {Promise<Object>} Quiz object.
 */
export const generateQuiz = async (topic, numQuestions = 5) => {
  try {
    if (!topic || typeof topic !== "string") {
      throw new Error("Invalid topic. Must be a non-empty string.");
    }

    if (Number.isNaN(numQuestions) || numQuestions < 1) {
      numQuestions = 5;
    }

    const input = `
You are a professional educator.

Create ${numQuestions} multiple-choice questions about "${topic}" in STRICT, VALID JSON format:

{
  "title": "Quiz Title",
  "questions": [
    {
      "question": "",
      "options": ["", "", "", ""],
      "correctIndex": 0,
      "explanation": ""
    }
  ]
}

Rules:
- ABSOLUTELY NO markdown.
- NO commentary.
- NO backticks.
- ONLY return valid JSON.
    `;

    const res = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: input }],
      max_tokens: 1000,
      temperature: 0.5,
    });

    const raw = res?.choices?.[0]?.message?.content || "{}";

    // Parse the JSON strictly
    let parsed;

    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      console.error("❌ Failed to parse JSON output from AI:");
      console.error("Raw output:", raw);
      throw new Error("Invalid AI JSON response — parsing failed.");
    }

    if (!parsed.questions || !Array.isArray(parsed.questions)) {
      throw new Error("AI returned malformed quiz structure.");
    }

    // Normalize structure (safer for frontend)
    parsed.questions = parsed.questions.map((q) => ({
      question: q.question || "Untitled question",
      explanation: q.explanation || "",
      options: Array.isArray(q.options)
        ? q.options.map((opt, idx) => ({
            text: opt || "",
            isCorrect: idx === q.correctIndex,
          }))
        : [],
    }));

    return parsed;
  } catch (err) {
    console.error("❌ Error in generateQuiz:", err);
    throw new Error("Unable to generate quiz at this time.");
  }
};
