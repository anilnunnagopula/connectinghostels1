// src/pages/auth/ResetPassword.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [tokenValid, setTokenValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");

  // Verify token on component mount
  useEffect(() => {
    verifyToken();
  }, [token]);

  const verifyToken = async () => {
    try {
      await axios.get(
        `${process.env.REACT_APP_API_URL}/api/auth/verify-reset-token/${token}`,
      );
      setTokenValid(true);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Invalid or expired reset link",
      });
      setTokenValid(false);
    } finally {
      setVerifying(false);
    }
  };

  const checkPasswordStrength = (password) => {
    if (password.length === 0) return "";
    if (password.length < 8) return "weak";

    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) return "weak";
    if (strength <= 3) return "medium";
    return "strong";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "password") {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    const { password, confirmPassword } = formData;

    // Validation
    if (!password || !confirmPassword) {
      setMessage({ type: "error", text: "Please fill in all fields" });
      return;
    }

    if (password.length < 8) {
      setMessage({
        type: "error",
        text: "Password must be at least 8 characters long",
      });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/reset-password/${token}`,
        { password, confirmPassword },
      );

      setMessage({
        type: "success",
        text: response.data.message,
      });

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login", {
          state: { message: "Password reset successful. Please log in." },
        });
      }, 2000);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to reset password",
      });
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying reset link...</p>
        </div>
      </div>
    );
  }

  // Invalid token
  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="text-6xl">❌</div>
          <h2 className="text-2xl font-bold text-gray-900">
            Invalid Reset Link
          </h2>
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
            {message.text}
          </div>
          <p className="text-gray-600">
            The password reset link is invalid or has expired. Please request a
            new one.
          </p>
          <Link
            to="/forgot-password"
            className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
          >
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  // Reset password form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your new password below
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

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter new password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    <div
                      className={`h-1 flex-1 rounded ${
                        passwordStrength === "weak"
                          ? "bg-red-500"
                          : passwordStrength === "medium"
                            ? "bg-yellow-500"
                            : passwordStrength === "strong"
                              ? "bg-green-500"
                              : "bg-gray-200"
                      }`}
                    ></div>
                    <div
                      className={`h-1 flex-1 rounded ${
                        passwordStrength === "medium" ||
                        passwordStrength === "strong"
                          ? passwordStrength === "medium"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                          : "bg-gray-200"
                      }`}
                    ></div>
                    <div
                      className={`h-1 flex-1 rounded ${
                        passwordStrength === "strong"
                          ? "bg-green-500"
                          : "bg-gray-200"
                      }`}
                    ></div>
                  </div>
                  <p
                    className={`text-xs ${
                      passwordStrength === "weak"
                        ? "text-red-600"
                        : passwordStrength === "medium"
                          ? "text-yellow-600"
                          : "text-green-600"
                    }`}
                  >
                    Password strength: {passwordStrength}
                  </p>
                </div>
              )}

              <p className="mt-2 text-xs text-gray-500">
                Must be at least 8 characters long
              </p>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Confirm new password"
                disabled={loading}
              />
              {formData.confirmPassword &&
                formData.password !== formData.confirmPassword && (
                  <p className="mt-1 text-xs text-red-600">
                    Passwords do not match
                  </p>
                )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={
                loading || !formData.password || !formData.confirmPassword
              }
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Resetting Password..." : "Reset Password"}
            </button>
          </div>
        </form>

        <div className="text-center">
          <Link
            to="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
