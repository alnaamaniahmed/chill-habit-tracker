// components/ForgotPassword.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";
import chtLogo from "../assets/chtLogo.png";
import RouteTransition from "../components/RouteTransition";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await api.post("/auth/forgot-password", { email });
      setIsSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset email");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (error) setError("");
  };

  if (isSuccess) {
    return (
      <RouteTransition type="slideUp">
        <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-stone-200">
              <div className="text-center mb-8">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                </div>
                <h1 className="text-2xl font-semibold text-stone-900 mb-2">
                  Check Your Email
                </h1>
                <p className="text-stone-600 text-sm mb-6">
                  We've sent a password reset link to <strong>{email}</strong>
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-left">
                      <p className="text-blue-800 text-sm font-medium mb-1">
                        Check your inbox
                      </p>
                      <p className="text-blue-700 text-xs">
                        The reset link will expire in 1 hour. Don't forget to check your spam folder if you don't see it.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => handleSubmit({ preventDefault: () => {} })}
                  disabled={isLoading}
                  className="w-full bg-amber-600 text-white py-3 rounded-2xl hover:bg-amber-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Sending..." : "Resend Email"}
                </button>
                
                <button
                  onClick={() => navigate("/login")}
                  className="w-full bg-stone-100 text-stone-700 py-3 rounded-2xl hover:bg-stone-200 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Sign In
                </button>
              </div>
            </div>
            
            <div className="text-center mt-6">
              <p className="text-stone-500 text-xs">
                Still having trouble? Contact our support team
              </p>
            </div>
          </div>
        </div>
      </RouteTransition>
    );
  }

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
                Forgot Password?
              </h1>
              <p className="text-stone-600 text-sm">
                No worries! Enter your email and we'll send you a reset link
              </p>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-2xl">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-stone-700 mb-2"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 border border-stone-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent bg-white text-stone-900 placeholder-stone-500"
                  required
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !email.trim()}
                className="w-full bg-amber-600 text-white py-3 rounded-2xl hover:bg-amber-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Sending Reset Link..." : "Send Reset Link"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => navigate("/login")}
                className="text-amber-600 hover:text-amber-700 font-medium transition-colors flex items-center justify-center gap-2 mx-auto"
                disabled={isLoading}
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Sign In
              </button>
            </div>
          </div>

          <div className="text-center mt-6">
            <p className="text-stone-500 text-xs">
              Remember your password? 
              <button
                onClick={() => navigate("/login")}
                className="text-amber-600 hover:text-amber-700 font-medium transition-colors ml-1"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </div>
    </RouteTransition>
  );
};

export default ForgotPassword;