import Quiz from "../models/Quiz.js";

export const getQuizById = async (req, res) => {
    res.json({ message: "getQuizById working" });
  };
  

export const createQuiz = async (req, res, next) => {
  try {
    const { title, questions } = req.body;

    const quiz = await Quiz.create({
      title,
      questions,
      createdBy: req.user.id,
    });

    res.status(201).json({ message: "Quiz created", quiz });
  } catch (err) {
    next(err);
  }
};

export const getQuizzes = async (req, res, next) => {
  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 });
    res.json({ quizzes });
  } catch (err) {
    next(err);
  }
};

export const submitQuiz = async (req, res, next) => {
  try {
    const { answers } = req.body;
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    let score = 0;
    quiz.questions.forEach((q, index) => {
      if (q.correctAnswer === answers[index]) score += 1;
    });

    res.json({
      message: "Quiz submitted",
      totalQuestions: quiz.questions.length,
      score,
    });
  } catch (err) {
    next(err);
  }
};
