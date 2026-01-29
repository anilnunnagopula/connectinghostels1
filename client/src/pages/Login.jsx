import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

  const API_URL = `${process.env.REACT_APP_API_URL}/api/auth/login`;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill all fields.");
      return;
    }

    // Test mode for quick dashboard access
    const testCredentials = {
      student: { email: "student@gmail.com", password: "student" },
      owner: { email: "owner@gmail.com", password: "owner" },
    };
    if (
      email === testCredentials[role].email &&
      password === testCredentials[role].password
    ) {
      const testUser = {
        _id: `test_${Date.now()}`,
        name: email.split("@")[0],
        email,
        role,
      };
      const testToken = `dummy_test_token_${Date.now()}`;
      alert(`🔐 Logged in as ${role} (TEST MODE)`);
      login(testUser, testToken);
      return;
    }

    // Real API login logic
    setLoading(true);
    try {
      const response = await axios.post(API_URL, { email, password, role });
      const { token, user } = response.data;

      if (token && user) {
        login(user, token);
      } else {
        throw new Error("Invalid response format from server.");
      }
    } catch (err) {
      console.error("Login error:", err);
      const errorMsg =
        err.response?.data?.message ||
        "Login failed. Invalid credentials or server error.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 py-5">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-700 dark:text-white">
          Sign in to ConnectingHostels
        </h2>

        <div className="flex justify-center gap-4 mb-6 ">
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

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 text-sm rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-100 dark:bg-gray-700 dark:text-white"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded bg-gray-100 dark:bg-gray-700 dark:text-white"
                placeholder="Enter password"
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 cursor-pointer text-sm text-gray-500"
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 hover:underline block text-right mt-1"
            >
              Forgot password?
            </Link>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
            } text-white font-semibold py-2 rounded`}
          >
            {loading ? "Logging in..." : `Login as ${role}`}
          </button>

          <p className="text-center text-sm mt-3 text-gray-600 dark:text-gray-300">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 hover:underline font-medium"
            >
              Register here
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

        {/* Updated Bottom Text */}
        <p className="text-center text-sm mt-3 text-gray-600 dark:text-gray-300">
          By continuing, you agree to our Terms and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Login;
