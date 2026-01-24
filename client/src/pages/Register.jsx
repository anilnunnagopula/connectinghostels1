import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; // 1. Import useAuth

import { useGoogleLogin } from "@react-oauth/google";
const Register = () => {
  const { login } = useAuth(); // 2. Get the login function from context

  const [role, setRole] = useState("student");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    // otp: "", // Deactivated for now
    password: "",
    confirmPassword: "",
    hostelName: "",
  });
  // const [otpSent, setOtpSent] = useState(false); // Deactivated for now
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  // Google OAuth Handler
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      setError("");

      try {
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/auth/google`,
          {
            credential: tokenResponse.access_token,
          }
        );

        const { token, user, requiresProfileCompletion } = res.data;

        if (requiresProfileCompletion) {
          localStorage.setItem("tempToken", token);
          localStorage.setItem("tempUser", JSON.stringify(user));
          navigate("/complete-profile");
        } else {
          login(user, token);
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Google sign-in failed. Please try again."
        );
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      setError("Google sign-in failed. Please try again.");
    },
  });
  /*
  // --- OTP Sending Logic (for future use) ---
  const sendOtp = async () => {
    setError("");
    if (!form.phone || form.phone.length !== 10) {
      return setError("Please enter a valid 10-digit phone number first.");
    }
    try {
      await axios.post(`${API_URL}/auth/send-otp`, { phone: form.phone });
      setOtpSent(true);
      setError(`✅ OTP sent to ${form.phone}.`); 
    } catch (err) {
      setError(err.response?.data?.message || "❌ Error sending OTP. Please try again.");
    }
  };
  */

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword)
      return setError("Passwords do not match!");
    if (form.password.length < 6)
      return setError("Password must be at least 6 characters long.");
    if (form.phone.length !== 10)
      return setError("Please enter a valid 10-digit phone number.");
    if (role === "owner" && !form.hostelName.trim())
      return setError("Hostel name is required for owners.");
    // if (otpSent && !form.otp) return setError("Please enter the OTP you received."); // Deactivated

    setLoading(true);

    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      password: form.password,
      role,
      // otp: form.otp, // Deactivated
      hostelName: role === "owner" ? form.hostelName : undefined,
    };

    try {
      const res = await axios.post(`${API_URL}/api/auth/register`, payload);
      const { token, user } = res.data;

      login(user, token); // 3. Use context's login to sign in and redirect
    } catch (err) {
      const message =
        err.response?.data?.message || "Registration failed. Please try again.";
      setError(message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 py-5">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-700 dark:text-white">
          {role === "owner"
            ? "Hostel Owner Registration"
            : "Student Registration"}
        </h2>

        {/* Role Toggle */}
        <div className="flex justify-center gap-4 mb-6">
          {["student", "owner"].map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`px-4 py-2 rounded-md text-sm font-semibold ${
                role === r
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
              }`}
            >
              {r === "student" ? "Student" : "Hostel Owner"}
            </button>
          ))}
        </div>

        {/* Error/Message Display Area */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded bg-gray-100 dark:bg-gray-700 dark:text-white"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded bg-gray-100 dark:bg-gray-700 dark:text-white"
          />

          {/* Phone - Just the input for now */}
          <input
            type="tel"
            name="phone"
            placeholder="10-digit Phone Number"
            value={form.phone}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded bg-gray-100 dark:bg-gray-700 dark:text-white"
          />

          {/* // --- OTP Button (for future use) ---
          <div className="flex gap-2">
            <input ... />
            <button type="button" onClick={sendOtp}>Send OTP</button>
          </div>
          */}

          {/*
          // --- OTP Input (for future use) ---
          {otpSent && (
            <input type="number" name="otp" ... />
          )}
          */}

          {/* Hostel Name (Conditional) */}
          {role === "owner" && (
            <input
              type="text"
              name="hostelName"
              placeholder="Hostel Name"
              value={form.hostelName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded bg-gray-100 dark:bg-gray-700 dark:text-white"
            />
          )}

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded bg-gray-100 dark:bg-gray-700 dark:text-white"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 text-sm"
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          {/* Confirm Password */}
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded bg-gray-100 dark:bg-gray-700 dark:text-white"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full font-semibold py-2 rounded transition-colors ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {loading ? "Registering..." : `Register as ${role}`}
          </button>

          <p className="text-center text-sm mt-3 text-gray-600 dark:text-gray-300">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:underline font-medium"
            >
              Login here
            </Link>
          </p>
          {/* Google Sign-In Button */}
          <button
            onClick={() => handleGoogleLogin()}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 text-gray-700 dark:text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 mb-6"
          >
            {loading ? (
              "Signing in..."
            ) : (
              <>
                <img
                  src="https://www.google.com/favicon.ico"
                  alt="Google"
                  className="w-5 h-5"
                />
                Continue with Google
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
