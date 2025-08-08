import React, { useEffect, useState } from "react";
import { UserRound, Phone, GraduationCap, Home } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MyStudents = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [selectedHostel, setSelectedHostel] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch all hostels and all students for the logged-in owner
  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        throw new Error("Authentication token not found");
      }

      // Fetch hostels for the dropdown filter
      const hostelsRes = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/owner/hostels/my-hostels`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHostels(hostelsRes.data.hostels);

      // Set the first hostel as the default selected filter
      if (hostelsRes.data.hostels.length > 0) {
        setSelectedHostel(hostelsRes.data.hostels[0]._id);
      }

      // Fetch all students for the owner
      const studentsRes = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/students/mine`, // New endpoint
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStudents(studentsRes.data.students);
    } catch (err) {
      console.error("❌ Error fetching data:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter students based on the selected hostel
  const filteredStudents = selectedHostel
    ? students.filter((student) => student.hostel._id === selectedHostel)
    : students;

  return (
    <div className="min-h-screen bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white p-6 font-inter">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          🎓 My Hostel Students
        </h1>

        {/* Dropdown filter for hostels */}
        {hostels.length > 1 && (
          <div className="flex items-center gap-2">
            <label
              htmlFor="hostel-filter"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Filter by Hostel:
            </label>
            <select
              id="hostel-filter"
              value={selectedHostel}
              onChange={(e) => setSelectedHostel(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            >
              {hostels.map((hostel) => (
                <option key={hostel._id} value={hostel._id}>
                  {hostel.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {loading ? (
        <p className="text-center text-gray-600 dark:text-gray-400">
          Loading students...
        </p>
      ) : filteredStudents.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student, index) => (
            <motion.div
              key={student._id} // Use MongoDB's _id for unique key
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 border-l-4 border-blue-500"
            >
              <div className="flex items-center gap-4 mb-3">
                <UserRound
                  className="text-blue-600 dark:text-cyan-400"
                  size={28}
                />
                <h2 className="text-xl font-semibold">{student.name}</h2>
              </div>
              <p className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Home size={16} /> Hostel: {student.hostel.name}
              </p>
              <p className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <GraduationCap size={16} /> Room: {student.room}
              </p>
              <p className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mt-1">
                <Phone size={16} /> {student.phone}
              </p>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400 mt-6">
          No students found for this hostel.
        </p>
      )}
    </div>
  );
};

export default MyStudents;
