
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function LessonDetails() {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLesson() {
      try {
        const res = await fetch(`/api/lessons/${id}`);
        const data = await res.json();
        setLesson(data);
      } catch (err) {
        console.error("Error loading lesson:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchLesson();
  }, [id]);

  if (loading) return <div className="text-center mt-10">Loading lesson...</div>;
  if (!lesson) return <div className="text-center mt-10 text-red-500">Lesson not found.</div>;

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">{lesson.title}</h1>
      <p className="text-gray-700 mb-6">{lesson.description}</p>

      <div className="prose max-w-none">
        {lesson.content}
      </div>
    </div>
  );
}
