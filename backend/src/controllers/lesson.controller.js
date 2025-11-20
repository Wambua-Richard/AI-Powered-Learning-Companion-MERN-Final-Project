import Lesson from "../models/Lesson.js";

export const createLesson = async (req, res, next) => {
  try {
    const { title, content, difficulty } = req.body;

    const lesson = await Lesson.create({
      title,
      content,
      difficulty,
      createdBy: req.user.id,
    });

    res.status(201).json({ message: "Lesson created", lesson });
  } catch (err) {
    next(err);
  }
};

export const getLessons = async (req, res, next) => {
  try {
    const lessons = await Lesson.find().sort({ createdAt: -1 });
    res.json({ lessons });
  } catch (err) {
    next(err);
  }
};

export const getLessonById = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson)
      return res.status(404).json({ message: "Lesson not found" });

    res.json({ lesson });
  } catch (err) {
    next(err);
  }
};

export const updateLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!lesson)
      return res.status(404).json({ message: "Lesson not found" });

    res.json({ message: "Lesson updated", lesson });
  } catch (err) {
    next(err);
  }
};

export const deleteLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.findByIdAndDelete(req.params.id);

    if (!lesson)
      return res.status(404).json({ message: "Lesson not found" });

    res.json({ message: "Lesson deleted" });
  } catch (err) {
    next(err);
  }
};
