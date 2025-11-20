import OpenAI from 'openai';
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


export const explainTopic = async (prompt, options = {}) => {
const input = `Explain the following to a ${options.level || 'student'}: ${prompt}`;
const response = await client.chat.completions.create({
model: 'gpt-4o-mini',
messages: [{ role: 'user', content: input }],
max_tokens: 800
});
const content = response.choices?.[0]?.message?.content || '';
return content;
};

export const generateQuiz = async (topic, numQuestions = 5) => {
const prompt = `You are a teacher. Generate ${numQuestions} multiple-choice questions about ${topic} in valid JSON: { "title": "...", "questions": [ {"question":"","options":["..."],"correctIndex":0,"explanation":""} ] }`;
const res = await client.chat.completions.create({
model: 'gpt-4o-mini',
messages: [{ role: 'user', content: prompt }],
max_tokens: 800
});
const raw = res.choices?.[0]?.message?.content || '{}';
// defensive parsing
try {
const parsed = JSON.parse(raw);
// normalize options -> { text, isCorrect }
parsed.questions = parsed.questions.map((q) => ({
question: q.question,
options: q.options.map((opt, idx) => ({ text: opt, isCorrect: idx === q.correctIndex })),
explanation: q.explanation || ''
}));
return parsed;
} catch (err) {
console.error('Failed to parse AI output', raw);
throw new Error('Invalid AI response format');
}
};