import { Link } from "react-router-dom";

export default function LessonCard({ lesson }) {
  return (
    <Link
      to={`/lessons/${lesson._id}`}
      className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-md transition"
    >
      <h2 className="text-xl font-semibold">{lesson.title}</h2>
      <p className="mt-2 text-gray-600 dark:text-gray-300 line-clamp-2">
        {lesson.content}
      </p>
    </Link>
  );
}
