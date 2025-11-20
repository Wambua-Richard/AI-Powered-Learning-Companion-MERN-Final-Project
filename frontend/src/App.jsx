// src/App.jsx
import React from "react";
import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import AppRouter from "./routes/AppRouter";
import { AuthProvider } from "./context/AuthContext";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">

      <BrowserRouter>
        <AuthProvider>

          {/* GLOBAL NAVBAR */}
          <header className="shadow-sm bg-white dark:bg-gray-800">
            <Navbar />

            {/* Clerk Authentication Buttons */}
            <div className="flex justify-end p-4">
              <SignedOut>
                <SignInButton />
              </SignedOut>

              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </header>

          {/* MAIN ROUTES */}
          <main className="container mx-auto px-4 py-6">
            <AppRouter />
          </main>

        </AuthProvider>
      </BrowserRouter>

    </div>
  );
}
