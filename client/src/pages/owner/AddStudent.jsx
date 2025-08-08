import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const AddStudent = () => {
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    hostel: "", // This will hold the hostel _id
    floor: "",
    room: "",
  });

  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  // Function to fetch the hostels owned by the current user
  const fetchOwnerHostels = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found.");
      }

      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/owner/hostels/my-hostels`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setHostels(res.data.hostels);
      // Set the first hostel as the default selection if available
      if (res.data.hostels.length > 0) {
        setStudentData((prev) => ({
          ...prev,
          hostel: res.data.hostels[0]._id,
        }));
      }
    } catch (err) {
      console.error("⚠️ Failed to fetch hostels:", err);
      toast.error("Failed to load your hostels. Please try again.");
      navigate("/owner-dashboard"); // Redirect on error
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchOwnerHostels();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudentData({ ...studentData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication token not found. Please log in again.");
        return;
      }

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/students/add`,
        studentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("🎉 Student added successfully!");
      setStudentData({
        name: "",
        email: "",
        phone: "",
        address: "",
        hostel: hostels.length > 0 ? hostels[0]._id : "", // Reset to default hostel
        floor: "",
        room: "",
      });
      console.log(res.data);
    } catch (error) {
      console.error("Add student error:", error.response?.data);
      toast.error(error.response?.data?.message || "❌ Failed to add student");
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while fetching hostels
  if (fetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-xl text-gray-700 dark:text-gray-300">
          Loading your hostels...
        </p>
      </div>
    );
  }

  // Handle case where owner has no hostels
  if (hostels.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <h2 className="text-2xl font-bold mb-4 text-gray-700 dark:text-gray-300">
          No Hostels Found
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          You need to add a hostel before you can add students.
        </p>
        <button
          onClick={() => navigate("/owner/add-hostel")}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
        >
          Add Your First Hostel
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-2 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white">
      <h2 className="text-2xl font-bold mb-6">🧑‍🎓 Add New Student</h2>

      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto space-y-3 bg-white dark:bg-gray-800 p-6 rounded-xl shadow"
      >
        <div>
          <label className="block text-sm font-medium">Full Name*</label>
          <input
            type="text"
            name="name"
            value={studentData.name}
            onChange={handleChange}
            className="input"
            placeholder="e.g. Anil Rebel"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={studentData.email}
            onChange={handleChange}
            className="input"
            placeholder="e.g. anilnunnagopula@email.com"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Phone Number</label>
          <input
            type="number"
            name="phone"
            value={studentData.phone}
            onChange={handleChange}
            className="input"
            placeholder="10-digit number"
            minLength={10}
            required
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Address</label>
          <input
            type="text"
            name="address"
            value={studentData.address}
            onChange={handleChange}
            className="input"
            placeholder="Enter the student address(optional)"
            disabled={loading}
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium">Hostel Name</label>
          <select
            name="hostel"
            value={studentData.hostel}
            onChange={handleChange}
            className="input"
            required
            disabled={loading}
          >
            {/* The first option is now dynamic */}
            {hostels.map((h) => (
              <option key={h._id} value={h._id}>
                {h.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium">Floor Number</label>
            <input
              type="number"
              name="floor"
              value={studentData.floor}
              onChange={handleChange}
              className="input"
              placeholder="Enter floor number you want"
              required
              disabled={loading}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium">Room Number</label>
            <input
              type="number"
              name="room"
              value={studentData.room}
              onChange={handleChange}
              className="input"
              placeholder="e.g. 101"
              required
              disabled={loading}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || fetchLoading}
          className={`w-full ${
            loading ? "bg-gray-400" : "bg-blue-600"
          } text-white py-2 rounded transition flex items-center justify-center`}
        >
          {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : null}
          {loading ? "Adding..." : "Add Student"}
        </button>
      </form>
    </div>
  );
};

export default AddStudent;
