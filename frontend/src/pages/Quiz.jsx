import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../lib/api";

export default function Quiz() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    api.get(`/quiz/${id}`).then((res) => setQuiz(res.data));
  }, [id]);

  if (!quiz) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">{quiz.title}</h1>

      {quiz.questions.map((q, i) => (
        <div key={i} className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <p className="font-semibold">{q.question}</p>
          <ul className="mt-3 space-y-2">
            {q.options.map((o, j) => (
              <li
                key={j}
                className="p-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {o}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
