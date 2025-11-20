// ProtectedRoute.jsx (Clerk Only – Correct Version)

import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

export default function ProtectedRoute() {
  const { isSignedIn, isLoaded } = useUser();

  // While Clerk is loading user data
  if (!isLoaded) {
    return <div className="text-center text-white p-6">Loading...</div>;
  }

  // If not signed in → redirect to login
  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise allow access
  return <Outlet />;
}
