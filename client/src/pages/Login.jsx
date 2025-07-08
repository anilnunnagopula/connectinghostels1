import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill all fields.");
      return;
    }

    try {
      // ✅ Test credentials shortcut
      if (
        (email === "student@gmail.com" && password === "student" && role === "student") ||
        (email === "owner@gmail.com" && password === "owner" && role === "owner")
      ) {
        alert(`Logged in as ${role} (test mode)`);
        localStorage.setItem(
          "user",
          JSON.stringify({ name: email.split("@")[0], email, role })
        );
        if (role === "student") navigate("/student-dashboard");
        else navigate("/owner-dashboard");
        return;
      }
    
      // 🌐 Real API call
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, role }),
        }
      );
    
      const data = await response.json();
    
      if (!response.ok) {
        setError(data.error || "Login failed.");
      } else {
        alert(`Logged in as ${data.role}`);
        localStorage.setItem(
          "user",
          JSON.stringify({
            name: data.name || email.split("@")[0],
            email,
            role: data.role,
          })
        );
        if (data.role === "student") navigate("/student-dashboard");
        else navigate("/owner-dashboard");
      }
    } catch (err) {
      setError("Something went wrong. Try again.");
    }
  }
    

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 py-5">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-700 dark:text-white">
          {role === "student" ? "Student Login" : "Hostel Owner Login"}
        </h2>

        {/* Toggle Buttons */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setRole("student")}
            className={`px-4 py-2 rounded-md text-sm font-semibold ${
              role === "student"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
            }`}
          >
            Student
          </button>
          <button
            onClick={() => setRole("owner")}
            className={`px-4 py-2 rounded-md text-sm font-semibold ${
              role === "owner"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
            }`}
          >
            Hostel Owner
          </button>
        </div>
        {/* Demo Credentials for Testing */}
        <div className="mb-4 text-sm text-gray-600 dark:text-gray-300 bg-yellow-100 dark:bg-yellow-800 p-3 rounded">
          <p className="font-semibold mb-1">🧪 Testing Credentials</p>
          <p>
            👤 <strong>Student:</strong> student@gmail.com & Password: student
          </p>
          <p>
            🏠 <strong>Owner:</strong> owner@gmail.com & Password: owner
          </p>
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
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

          {/* Password */}
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
                className="absolute right-3 top-3 cursor-pointer text-gray-500 text-sm"
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
            <div className="text-right mt-2 text-sm">
              <Link
                to="/forgot-password"
                className="text-blue-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded"
          >
            Login as {role}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
