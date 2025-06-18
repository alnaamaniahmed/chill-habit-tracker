// components/EmailVerification.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api.js";
import chtLogo from "../assets/chtLogo.png";
import RouteTransition from "../components/RouteTransition";
import { CheckCircle, AlertCircle, Mail, Loader } from "lucide-react";

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const [error, setError] = useState("");
  const [isResending, setIsResending] = useState(false);
  const navigate = useNavigate();
  
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      verifyEmail();
    } else {
      setStatus("error");
      setError("Invalid verification link");
    }
  }, [token]);

  const verifyEmail = async () => {
    try {
      const response = await api.post("/auth/verify-email", { token });
      if (response.data.success) {
        setStatus("success");
      }
    } catch (err) {
      setStatus("error");
      setError(err.response?.data?.message || "Email verification failed");
    }
  };

  const handleResendVerification = async () => {
    const email = localStorage.getItem("pendingVerificationEmail");
    if (!email) {
      setError("Unable to resend verification. Please try registering again.");
      return;
    }

    setIsResending(true);
    try {
      await api.post("/auth/resend-verification", { email });
      setError("");
      // Show success message
      setStatus("resent");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend verification email");
    } finally {
      setIsResending(false);
    }
  };

  // Loading state
  if (status === "verifying") {
    return (
      <RouteTransition type="slideUp">
        <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-stone-200">
              <div className="text-center">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center">
                    <Loader className="w-10 h-10 text-amber-600 animate-spin" />
                  </div>
                </div>
                <h1 className="text-2xl font-semibold text-stone-900 mb-2">
                  Verifying Your Email
                </h1>
                <p className="text-stone-600 text-sm">
                  Please wait while we verify your email address...
                </p>
              </div>
            </div>
          </div>
        </div>
      </RouteTransition>
    );
  }

  // Success state
  if (status === "success") {
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
                  Email Verified Successfully!
                </h1>
                <p className="text-stone-600 text-sm mb-6">
                  Your email has been verified. You can now access all features of Chill Habit Tracker.
                </p>
                
                <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6">
                  <p className="text-green-800 text-sm">
                    🎉 Welcome to the community! You're all set to start building amazing habits.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => navigate("/habits")}
                  className="w-full bg-amber-600 text-white py-3 rounded-2xl hover:bg-amber-700 transition-colors font-medium"
                >
                  Start Building Habits
                </button>
                
                <button
                  onClick={() => navigate("/login")}
                  className="w-full bg-stone-100 text-stone-700 py-3 rounded-2xl hover:bg-stone-200 transition-colors font-medium"
                >
                  Sign In Again
                </button>
              </div>
            </div>
            
            <div className="text-center mt-6">
              <p className="text-stone-500 text-xs">
                Ready to transform your daily routine! 🌟
              </p>
            </div>
          </div>
        </div>
      </RouteTransition>
    );
  }

  // Resent state
  if (status === "resent") {
    return (
      <RouteTransition type="slideUp">
        <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-stone-200">
              <div className="text-center mb-8">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                    <Mail className="w-10 h-10 text-blue-600" />
                  </div>
                </div>
                <h1 className="text-2xl font-semibold text-stone-900 mb-2">
                  Verification Email Sent
                </h1>
                <p className="text-stone-600 text-sm mb-6">
                  We've sent a new verification email to your inbox. Please check your email and click the verification link.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleResendVerification}
                  disabled={isResending}
                  className="w-full bg-amber-600 text-white py-3 rounded-2xl hover:bg-amber-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isResending ? "Sending..." : "Send Again"}
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

  // Error state
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
                Verification Failed
              </h1>
              <p className="text-stone-600 text-sm mb-4">
                {error || "We couldn't verify your email address."}
              </p>
              
              {error.includes("expired") && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
                  <p className="text-amber-800 text-sm">
                    Your verification link has expired. We can send you a new one.
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <button
                onClick={handleResendVerification}
                disabled={isResending}
                className="w-full bg-amber-600 text-white py-3 rounded-2xl hover:bg-amber-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isResending ? "Sending..." : "Resend Verification Email"}
              </button>
              
              <button
                onClick={() => navigate("/register")}
                className="w-full bg-stone-100 text-stone-700 py-3 rounded-2xl hover:bg-stone-200 transition-colors font-medium"
              >
                Create New Account
              </button>
              
              <button
                onClick={() => navigate("/login")}
                className="w-full text-amber-600 hover:text-amber-700 py-2 transition-colors font-medium"
              >
                Back to Sign In
              </button>
            </div>
          </div>
          
          <div className="text-center mt-6">
            <p className="text-stone-500 text-xs">
              Need help? Contact our support team
            </p>
          </div>
        </div>
      </div>
    </RouteTransition>
  );
};

export default EmailVerification;