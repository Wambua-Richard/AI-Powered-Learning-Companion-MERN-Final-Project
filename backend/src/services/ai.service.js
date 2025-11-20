
import OpenAI from "openai";
// Ensure API key exists
if (!process.env.OPENAI_API_KEY) {
  throw new Error(
    "❌ Missing OPENAI_API_KEY in environment variables (.env). Server cannot start."
  );
}

// Initialize OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate a simplified explanation of a topic for a learner.
 * @param {string} prompt - Topic to explain.
 * @param {object} options - Optional settings (e.g., education level).
 * @returns {Promise<string>} AI-generated explanation.
 */
export const explainTopic = async (prompt, options = {}) => {
  try {
    const userLevel = options.level || "student";
    const input = `Explain the following to a ${userLevel} in simple, educational and structured language:\n\n${prompt}`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: input }],
      max_tokens: 800,
      temperature: 0.5,
    });

    return response.choices?.[0]?.message?.content || "";
  } catch (err) {
    console.error("❌ Error in explainTopic:", err);
    throw new Error("Unable to generate explanation at this time.");
  }
};

/**
 * Generate a JSON-based multiple-choice quiz using AI.
 * @param {string} topic - Subject of the quiz.
 * @param {number} numQuestions - Number of questions required.
 * @returns {Promise<Object>} Quiz JSON structure.
 */
export const generateQuiz = async (topic, numQuestions = 5) => {
  try {
    const prompt = `
You are a professional educator.

Create ${numQuestions} multiple-choice questions about "${topic}" in strictly valid JSON:

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

Do NOT include any surrounding markdown, commentary, or code blocks.
`;

    const res = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000,
      temperature: 0.5,
    });

    const raw = res.choices?.[0]?.message?.content || "{}";

    let parsed;

    try {
      parsed = JSON.parse(raw);
    } catch (parseErr) {
      console.error("❌ Failed to parse AI JSON output:", raw);
      throw new Error("Invalid AI response format — JSON parsing failed.");
    }

    // Safety validation
    if (!parsed.questions || !Array.isArray(parsed.questions)) {
      throw new Error("AI returned malformed quiz data.");
    }

    // Normalize quiz structure
    parsed.questions = parsed.questions.map((q) => ({
      question: q.question || "Untitled question",
      options: Array.isArray(q.options)
        ? q.options.map((opt, idx) => ({
            text: opt,
            isCorrect: idx === q.correctIndex,
          }))
        : [],
      explanation: q.explanation || "",
    }));

    return parsed;
  } catch (err) {
    console.error("❌ Error in generateQuiz:", err);
    throw new Error("Unable to generate quiz at this time.");
  }
};
