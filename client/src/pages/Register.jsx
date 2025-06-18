import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";
import chtLogo from "../assets/chtLogo.png";
import PasswordInput from "../components/PasswordInput";
import RouteTransition from "../components/RouteTransition";
import { Mail, CheckCircle } from "lucide-react";
import {
  validatePassword,
  checkWeakPatterns,
} from "../utils/passwordValidation";

const Register = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword(form.password)) {
      setError("Password does not meet security requirements");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (checkWeakPatterns(form.password, form.username, form.email)) {
      setError("Password is too common or contains personal information");
      return;
    }

    setIsLoading(true);

    try {
      const res = await api.post("/auth/register", {
        username: form.username,
        email: form.email,
        password: form.password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("pendingVerificationEmail", form.email);
      window.dispatchEvent(new Event("authChange"));

      setRegistrationSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      await api.post("/auth/resend-verification", { email: form.email });
      // Show success feedback
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to resend verification email"
      );
    }
  };

  const isPasswordValid = validatePassword(form.password);
  const passwordsMatch =
    form.password === form.confirmPassword && form.confirmPassword !== "";

  // Success state - show email verification message
  if (registrationSuccess) {
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
                  Account Created Successfully!
                </h1>
                <p className="text-stone-600 text-sm mb-6">
                  Welcome to Chill Habit Tracker! We've sent a verification
                  email to <strong>{form.email}</strong>
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-left">
                      <p className="text-blue-800 text-sm font-medium mb-1">
                        Please check your email
                      </p>
                      <p className="text-blue-700 text-xs">
                        Click the verification link in your email to activate
                        your account. Don't forget to check your spam folder!
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => navigate("/habits")}
                  className="w-full bg-amber-600 text-white py-3 rounded-2xl hover:bg-amber-700 transition-colors font-medium"
                >
                  Start Building Habits
                </button>

                <button
                  onClick={handleResendVerification}
                  className="w-full bg-stone-100 text-stone-700 py-3 rounded-2xl hover:bg-stone-200 transition-colors font-medium"
                >
                  Resend Verification Email
                </button>

                <div className="text-center">
                  <button
                    onClick={() => navigate("/login")}
                    className="text-amber-600 hover:text-amber-700 font-medium transition-colors text-sm"
                  >
                    Already verified? Sign in here
                  </button>
                </div>
              </div>
            </div>

            <div className="text-center mt-6">
              <p className="text-stone-500 text-xs">
                🎉 You're on your way to building amazing habits!
              </p>
            </div>
          </div>
        </div>
      </RouteTransition>
    );
  }

  // Registration form
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
                Create your account
              </h1>
              <p className="text-stone-600 text-sm">
                Start building better habits today
              </p>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-2xl">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-stone-700 mb-2"
                >
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                  className="w-full px-4 py-3 border border-stone-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent bg-white text-stone-900 placeholder-stone-500"
                  required
                  disabled={isLoading}
                />
              </div>

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
                  disabled={isLoading}
                />
              </div>

              <PasswordInput
                label="Password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                showRequirements={true}
                required={true}
              />

              <PasswordInput
                label="Confirm Password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
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
                {isLoading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-stone-600 text-sm">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="text-amber-600 hover:text-amber-700 font-medium transition-colors"
                  disabled={isLoading}
                >
                  Sign in here
                </button>
              </p>
            </div>
          </div>

          <div className="text-center mt-6">
            <p className="text-stone-500 text-xs">
              Join thousands building better habits
            </p>
          </div>
        </div>
      </div>
    </RouteTransition>
  );
};

export default Register;
