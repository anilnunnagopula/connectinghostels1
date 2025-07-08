import React, { useState } from "react";

const Register = () => {
  const [role, setRole] = useState("student");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    otp: "",
    password: "",
    confirmPassword: "",
    hostelName: "",
  });

  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendOtp = async () => {
    if (!form.phone) return alert("📱 Enter phone number first");

    try {
      const res = await fetch("http://localhost:5000/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: form.phone }),
      });

      const data = await res.json();
      if (!res.ok) return alert(data.error || "Failed to send OTP");

      setOtpSent(true);
      alert(`✅ OTP sent to ${form.phone}`);
    } catch (err) {
      alert("❌ Error sending OTP. Try again.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!form.email || !form.phone)
      return alert("Email and phone are required!");
    if (form.password !== form.confirmPassword)
      return alert("Passwords don't match!");
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" });
    }
    alert(`Registered as ${role}`);

    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      password: form.password,
      role,
      hostelName: role === "owner" ? form.hostelName : null,
    };

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) return alert(data.message);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Registered successfully ✅");
      if (role === "student") {
        window.location.href = "/student-dashboard";
      } else {
        window.location.href = "/supplier-dashboard";
      }
    } catch (err) {
      alert("Registration failed ❌");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 py-5">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-700 dark:text-white">
          {role === "owner" ? "Hostel Owner Register" : "Student Register"}
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

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name..."
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded bg-gray-100 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your mail..."
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded bg-gray-100 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Phone + OTP */}
          <div>
            <label className="block mt-1 mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Number
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                placeholder="Phone Number"
                className="w-full px-2 py-2 rounded bg-gray-100 dark:bg-gray-700 dark:text-white"
              />
              <button
                type="button"
                onClick={sendOtp}
                className="bg-blue-600 text-white px-2 rounded hover:bg-blue-700"
              >
                Send OTP
              </button>
            </div>
          </div>

          {/* OTP Input */}
          {otpSent && (
            <input
              type="text"
              name="otp"
              placeholder="Enter OTP"
              value={form.otp}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded bg-gray-100 dark:bg-gray-700 dark:text-white"
            />
          )}

          {/* Hostel Name for Owner */}
          {role === "owner" && (
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Hostel Name
              </label>
              <input
                type="text"
                name="hostelName"
                placeholder="Enter Hostel name..."
                value={form.hostelName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded bg-gray-100 dark:bg-gray-700 dark:text-white"
              />
            </div>
          )}

          {/* Password */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded bg-gray-100 dark:bg-gray-700 dark:text-white"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 cursor-pointer text-gray-500 text-sm"
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded bg-gray-100 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
          >
            Register as {role}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
