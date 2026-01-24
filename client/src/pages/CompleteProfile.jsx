import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const CompleteProfile = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState("");
  const [phone, setPhone] = useState("");
  const [hostelName, setHostelName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const tempToken = localStorage.getItem("tempToken");
    if (!tempToken) {
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const tempToken = localStorage.getItem("tempToken");
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/complete-profile`,
        { role, phone, hostelName },
        { headers: { Authorization: `Bearer ${tempToken}` } }
      );

      // Clean up and log in
      localStorage.removeItem("tempToken");
      localStorage.removeItem("tempUser");
      login(res.data.user, res.data.token);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to complete profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-700 dark:text-white">
          Complete Your Profile
        </h2>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 text-sm rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selection */}
          <div className="flex justify-center gap-4 mb-6">
            {["student", "owner"].map((r) => (
              <button
                type="button"
                key={r}
                onClick={() => setRole(r)}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition ${
                  role === r
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
                }`}
              >
                {r === "student" ? "Student" : "Hostel Owner"}
              </button>
            ))}
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-100 dark:bg-gray-700 dark:text-white"
              placeholder="10-digit mobile number"
              required
            />
          </div>

          {role === "owner" && (
            <div>
              <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">
                Hostel Name
              </label>
              <input
                type="text"
                value={hostelName}
                onChange={(e) => setHostelName(e.target.value)}
                className="w-full px-4 py-2 rounded bg-gray-100 dark:bg-gray-700 dark:text-white"
                placeholder="Enter your hostel name"
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !role || phone.length < 10}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded disabled:opacity-50"
          >
            {loading ? "Saving..." : "Finish Registration"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;
