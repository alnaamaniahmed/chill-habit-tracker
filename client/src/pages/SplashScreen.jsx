import React, { useState, useEffect } from "react";
import chtLogo from "../assets/chtLogo.png";

const SplashScreen = ({ progress = 0, onComplete }) => {
  const [fadeOut, setFadeOut] = useState(false);
  const [loadingText, setLoadingText] = useState("Initializing...");

  useEffect(() => {
    if (progress >= 100) {
      setLoadingText("Ready!");
    } else if (progress >= 75) {
      setLoadingText("Validating session...");
    } else if (progress >= 50) {
      setLoadingText("Checking authentication...");
    } else if (progress >= 25) {
      setLoadingText("Loading fonts...");
    } else {
      setLoadingText("Initializing...");
    }

    if (progress >= 100) {
      setTimeout(() => {
        setFadeOut(true);
        setTimeout(onComplete, 300);
      }, 100);
    }
  }, [progress, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 bg-gradient-to-br from-stone-50 via-amber-50/30 to-stone-100 flex items-center justify-center transition-opacity duration-300 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-96 h-96 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-stone-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative flex flex-col items-center">
        <div className="mb-8">
          <div className="relative">
            <img
              src={chtLogo}
              alt="Chill Habit Tracker"
              className="h-32 w-auto drop-shadow-lg"
            />
            <div className="absolute inset-0 bg-amber-400/20 rounded-full filter blur-xl -z-10 animate-pulse"></div>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-dune text-stone-800 mb-2 tracking-wider">
            CHILL HABIT TRACKER
          </h1>
          <p className="text-stone-600 text-lg font-medium">
            Build better habits, one day at a time
          </p>
        </div>

        <div className="w-80 mb-4">
          <div className="bg-stone-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 to-amber-600 h-full rounded-full transition-all duration-200 ease-out shadow-lg"
              style={{ width: `${progress}%` }}
            >
              <div className="h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
            </div>
          </div>

          <div className="flex justify-between mt-2 text-xs text-stone-500">
            <span>{loadingText}</span>
            <span>{progress}%</span>
          </div>
        </div>

        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce animation-delay-200"></div>
          <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce animation-delay-400"></div>
        </div>
      </div>

      <div className="absolute bottom-8 text-center">
        <p className="text-stone-400 text-xs">Version 1.0.0 • Built with ❤️</p>
      </div>
    </div>
  );
};

export default SplashScreen;
