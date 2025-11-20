import { useEffect, useState } from "react";
import api from "../lib/api";
import LessonCard from "../components/LessonCard";

export default function Lessons() {
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    api.get("/lessons").then((res) => setLessons(res.data));
  }, []);

  return (
    <div className="p-6 grid md:grid-cols-2 gap-4">
      {lessons.map((lesson) => (
        <LessonCard key={lesson._id} lesson={lesson} />
      ))}
    </div>
  );
}
