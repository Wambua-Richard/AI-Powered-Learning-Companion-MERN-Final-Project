import mongoose from "mongoose";

const OptionSchema = new mongoose.Schema({ text: String, isCorrect: Boolean });
const QuestionSchema = new mongoose.Schema({
question: String,
options: [OptionSchema],
explanation: String
});
const QuizSchema = new mongoose.Schema({
    lessonId: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
title: String,
generatedFrom: String,
questions: [
    {
        question: String,
        options: [String],
        correctAnswer: String,
      },
    ],
    score: Number,
createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
analytics: {
timesTaken: { type: Number, default: 0 },
avgScore: { type: Number, default: 0 }
},
createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Quiz", QuizSchema);