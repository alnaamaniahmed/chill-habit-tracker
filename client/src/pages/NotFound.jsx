import React from "react";
import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import chtLogo from "../assets/chtLogo.png";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
      <div className="text-center max-w-md w-full">
        <div className="flex justify-center mb-8">
          <img
            src={chtLogo}
            alt="Chill Habit Tracker"
            className="h-20 w-auto opacity-75"
          />
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-stone-200 mb-6">
          <div className="mb-6">
            <h1 className="text-6xl font-bold text-stone-300 mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-stone-900 mb-2">
              Page not found
            </h2>
            <p className="text-stone-600">
              Sorry, we couldn't find the page you're looking for. It might have
              been moved or doesn't exist.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center gap-2 px-6 py-3 border border-stone-300 text-stone-700 rounded-2xl hover:bg-stone-50 transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
            <button
              onClick={() => navigate("/habits")}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-2xl hover:bg-amber-700 transition-colors font-medium"
            >
              <Home className="w-4 h-4" />
              Go Home
            </button>
          </div>
        </div>

        <p className="text-stone-500 text-xs">
          Continue building better habits
        </p>
      </div>
    </div>
  );
};

export default NotFound;
