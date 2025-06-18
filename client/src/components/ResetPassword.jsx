// components/ResetPassword.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api.js";
import chtLogo from "../assets/chtLogo.png";
import PasswordInput from "../components/PasswordInput";
import RouteTransition from "../components/RouteTransition";
import { CheckCircle, AlertCircle } from "lucide-react";
import {
  validatePassword,
  checkWeakPatterns,
} from "../utils/passwordValidation";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [tokenValid, setTokenValid] = useState(null);
  const navigate = useNavigate();
  
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      setError("Invalid reset link");
    } else {
      setTokenValid(true);
    }
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validate password
    if (!validatePassword(form.password)) {
      setError("Password does not meet security requirements");
      setIsLoading(false);
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (checkWeakPatterns(form.password)) {
      setError("Password is too common. Please choose a stronger password");
      setIsLoading(false);
      return;
    }

    try {
      await api.post("/auth/reset-password", {
        token,
        password: form.password,
      });
      setIsSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  const isPasswordValid = validatePassword(form.password);
  const passwordsMatch = form.password === form.confirmPassword && form.confirmPassword !== "";

  // Invalid token state
  if (tokenValid === false) {
    return (
      <RouteTransition type="slideUp">
        <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-stone-200">
              <div className="text-center mb-8">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-10 h-10 text-red-600" />
                  </div>
                </div>
                <h1 className="text-2xl font-semibold text-stone-900 mb-2">
                  Invalid Reset Link
                </h1>
                <p className="text-stone-600 text-sm mb-6">
                  This password reset link is invalid or has expired.
                </p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => navigate("/forgot-password")}
                  className="w-full bg-amber-600 text-white py-3 rounded-2xl hover:bg-amber-700 transition-colors font-medium"
                >
                  Request New Reset Link
                </button>
                
                <button
                  onClick={() => navigate("/login")}
                  className="w-full bg-stone-100 text-stone-700 py-3 rounded-2xl hover:bg-stone-200 transition-colors font-medium"
                >
                  Back to Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      </RouteTransition>
    );
  }

  // Success state
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
                  Password Reset Successfully!
                </h1>
                <p className="text-stone-600 text-sm mb-6">
                  Your password has been updated. You can now sign in with your new password.
                </p>
              </div>

              <button
                onClick={() => navigate("/login")}
                className="w-full bg-amber-600 text-white py-3 rounded-2xl hover:bg-amber-700 transition-colors font-medium"
              >
                Continue to Sign In
              </button>
            </div>
            
            <div className="text-center mt-6">
              <p className="text-stone-500 text-xs">
                Ready to build better habits! 🌟
              </p>
            </div>
          </div>
        </div>
      </RouteTransition>
    );
  }

  // Reset form state
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
                Create New Password
              </h1>
              <p className="text-stone-600 text-sm">
                Choose a strong password for your account
              </p>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-2xl">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <PasswordInput
                label="New Password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                showRequirements={true}
                required={true}
              />

              <PasswordInput
                label="Confirm New Password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your new password"
                showMatchIndicator={true}
                matchValue={form.password}
                required={true}
              />

              <button
                type="submit"
                disabled={isLoading || !isPasswordValid || !passwordsMatch}
                className={`w-full py-3 rounded-2xl transition-colors font-medium ${
                  isPasswordValid && passwordsMatch && !isLoading
                    ? "bg-amber-600 hover:bg-amber-700 text-white"
                    : "bg-stone-300 text-stone-500 cursor-not-allowed"
                }`}
              >
                {isLoading ? "Updating Password..." : "Update Password"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => navigate("/login")}
                className="text-amber-600 hover:text-amber-700 font-medium transition-colors"
                disabled={isLoading}
              >
                Back to Sign In
              </button>
            </div>
          </div>

          <div className="text-center mt-6">
            <p className="text-stone-500 text-xs">
              Your security is our priority
            </p>
          </div>
        </div>
      </div>
    </RouteTransition>
  );
};

export default ResetPassword;