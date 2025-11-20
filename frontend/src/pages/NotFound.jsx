
import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
      <p className="text-xl mb-6">Oops! The page you're looking for doesn't exist.</p>

      <Link
        to="/"
        className="text-white bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-lg shadow">
        Back to Home
      </Link>
    </div>
  );
}
