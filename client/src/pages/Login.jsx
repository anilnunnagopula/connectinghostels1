import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; // 1. Import useAuth

const Login = () => {
  const { login } = useAuth(); // 2. Get the login function from context

  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = `${process.env.REACT_APP_API_URL}/auth/login`;

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
      login(testUser, testToken); // 3. Use context's login function
      return;
    }

    // Real API login logic
    setLoading(true);
    try {
      const response = await axios.post(API_URL, { email, password, role });
      const { token, user } = response.data;

      if (token && user) {
        login(user, token); // 4. Use context's login function
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
          {role === "student" ? "Student Login" : "Hostel Owner Login"}
        </h2>
        {/* Role Toggle Buttons */}
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
        {/* Test Credentials Banner */}
        <div className="mb-4 p-3 bg-yellow-100 dark:bg-yellow-800 rounded-lg text-sm text-gray-700 dark:text-white">
          <p className="font-bold">
            Want to Explore dashboards? Use these credentials:
          </p>
          <p>
            👤 <b>Student:</b> student@gmail.com / student
          </p>
          <p>
            🏠 <b>Owner:</b> owner@gmail.com / owner
          </p>
        </div>
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 text-sm rounded">
            {error}
          </div>
        )}
        {/* Login Form */}
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
        </form>
      </div>
    </div>
  );
};

export default Login;
