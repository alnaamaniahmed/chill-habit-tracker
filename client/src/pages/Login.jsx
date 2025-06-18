import React, { useState } from "react";
import api from "../services/api.js";
import { useNavigate } from "react-router-dom";
import chtLogo from "../assets/chtLogo.png";
import RouteTransition from "../components/RouteTransition";
import GoogleSignIn from "../components/GoogleSignIn";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      window.dispatchEvent(new Event("authChange"));

      setTimeout(() => {
        navigate("/habits", { replace: true });
      }, 100);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login Failed";

      // Handle specific error cases
      if (err.response?.status === 423) {
        setError(
          "Account temporarily locked due to too many failed attempts. Please try again later or reset your password."
        );
      } else if (errorMessage.includes("Invalid credentials")) {
        setError(
          "Invalid email or password. Please check your credentials and try again."
        );
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credential) => {
    setIsGoogleLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/google", { credential });
      localStorage.setItem("token", res.data.token);
      window.dispatchEvent(new Event("authChange"));

      setTimeout(() => {
        navigate("/habits", { replace: true });
      }, 100);
    } catch (err) {
      setError(err.response?.data?.message || "Google Sign In Failed");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGoogleError = (error) => {
    console.error("Google Sign In Error:", error);
    setError("Google Sign In Failed. Please try again.");
    setIsGoogleLoading(false);
  };

  const isAnyLoading = isLoading || isGoogleLoading;

  return (
    <RouteTransition type="slideUp">
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-stone-200">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <img
                  src={chtLogo}
                  alt="Chill Habit Tracker"
                  className="h-24 w-auto"
                />
              </div>

              <h1 className="text-2xl font-semibold text-stone-900 mb-2">
                Welcome back
              </h1>
              <p className="text-stone-600 text-sm">
                Sign in to continue your habit journey
              </p>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-2xl">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

            <div className="mb-6">
              <GoogleSignIn
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                disabled={isAnyLoading}
              />
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stone-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-stone-500 font-medium">
                  or continue with email
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-stone-700 mb-2"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-stone-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent bg-white text-stone-900 placeholder-stone-500"
                  required
                  disabled={isAnyLoading}
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-stone-700 mb-2"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border border-stone-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent bg-white text-stone-900 placeholder-stone-500"
                  required
                  disabled={isAnyLoading}
                />
              </div>

              {/* NEW: Forgot Password Link */}
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-sm text-amber-600 hover:text-amber-700 font-medium transition-colors"
                  disabled={isAnyLoading}
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isAnyLoading}
                className="w-full bg-amber-600 text-white py-3 rounded-2xl hover:bg-amber-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-stone-600 text-sm">
                Don't have an account?{" "}
                <button
                  onClick={() => navigate("/register")}
                  className="text-amber-600 hover:text-amber-700 font-medium transition-colors"
                  disabled={isAnyLoading}
                >
                  Create one here
                </button>
              </p>
            </div>
          </div>

          <div className="text-center mt-6">
            <p className="text-stone-500 text-xs">
              Build better habits, one day at a time
            </p>
          </div>
        </div>
      </div>
    </RouteTransition>
  );
};

export default Login;
