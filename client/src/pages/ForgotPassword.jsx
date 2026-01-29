// src/pages/ForgotPassword.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [emailSent, setEmailSent] = useState(false);

  // 🔍 Component lifecycle log
  useEffect(() => {
    console.log("[ForgotPassword] Component mounted");
  }, []);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("[ForgotPassword] Form submitted");
    console.log("[ForgotPassword] Email entered:", email);

    setMessage({ type: "", text: "" });

    // ❌ Validation logs
    if (!email) {
      console.warn("[ForgotPassword] Validation failed: Email is empty");
      setMessage({ type: "error", text: "Please enter your email address" });
      return;
    }

    if (!validateEmail(email)) {
      console.warn("[ForgotPassword] Validation failed: Invalid email format");
      setMessage({ type: "error", text: "Please enter a valid email address" });
      return;
    }

    setLoading(true);
    console.log("[ForgotPassword] Sending forgot-password request...");

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/forgot-password`,
        { email },
      );

      console.log("[ForgotPassword] API success response:", response.data);

      setMessage({
        type: "success",
        text: response.data.message,
      });
      setEmailSent(true);
    } catch (error) {
      console.error("[ForgotPassword] API error:", error);
      console.error("[ForgotPassword] Error response:", error.response);

      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
      console.log("[ForgotPassword] Request completed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Forgot your password?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>
        </div>

        {message.text && (
          <div
            className={`p-4 rounded-md ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        {!emailSent ? (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  console.log(
                    "[ForgotPassword] Email updated:",
                    e.target.value,
                  );
                }}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Email address"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 rounded-md text-white bg-indigo-600 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <div className="text-6xl">📧</div>
            <p className="text-gray-600">
              Check your email for the reset link. It will expire in 10 minutes.
            </p>
            <button
              onClick={() => {
                console.log("[ForgotPassword] Resending email triggered");
                setEmailSent(false);
                setEmail("");
                setMessage({ type: "", text: "" });
              }}
              className="text-indigo-600 font-medium"
            >
              Send another email
            </button>
          </div>
        )}

        <div className="text-center">
          <Link to="/login" className="text-indigo-600 font-medium">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
