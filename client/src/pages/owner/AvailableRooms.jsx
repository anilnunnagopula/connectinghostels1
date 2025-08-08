import React, { useState, useEffect } from "react";
import { BedDouble, Home } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AvailableRooms = () => {
  const navigate = useNavigate();
  const [hostels, setHostels] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
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
        `${process.env.REACT_APP_API_URL}/api/students/mine`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAllStudents(studentsRes.data.students);
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
  const studentsInSelectedHostel = allStudents.filter(
    (student) => student.hostel._id === selectedHostel
  );

  // Group students by room number to determine occupancy
  const occupiedRooms = studentsInSelectedHostel.reduce((acc, student) => {
    acc.add(`${student.room}`);
    return acc;
  }, new Set());

  // Generate a list of available rooms
  const getAvailableRooms = () => {
    if (!selectedHostel) return [];

    const selectedHostelData = hostels.find((h) => h._id === selectedHostel);
    const totalRooms = selectedHostelData ? selectedHostelData.rooms : 0;

    const available = [];
    for (let i = 1; i <= totalRooms; i++) {
      if (!occupiedRooms.has(`${i}`)) {
        available.push({
          roomNo: i,
          category: selectedHostelData?.type || "N/A",
        });
      }
    }
    return available;
  };

  const availableRooms = getAvailableRooms();

  return (
    <div className="min-h-screen bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white p-6 font-inter">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Available Rooms</h1>

        {/* Hostel Filter Dropdown */}
        {hostels.length > 0 && (
          <div className="flex items-center gap-2">
            <Home className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <select
              value={selectedHostel}
              onChange={(e) => setSelectedHostel(e.target.value)}
              className="px-3 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
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
          Loading available rooms...
        </p>
      ) : hostels.length === 0 ? (
        <div className="text-center mt-10">
          <p className="text-gray-500 dark:text-gray-400">
            You need to add a hostel before you can see available rooms.
          </p>
          <button
            onClick={() => navigate("/owner/add-hostel")}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
          >
            Add Your First Hostel
          </button>
        </div>
      ) : availableRooms.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableRooms.map((room, index) => (
            <motion.div
              key={room.roomNo}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 flex items-center gap-4 border border-green-500 dark:border-green-700"
            >
              <div className="text-green-600 dark:text-green-400">
                <BedDouble size={28} />
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  Room <span className="text-green-500">{room.roomNo}</span>
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Category: <strong>{room.category}</strong>
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  ✅ Available
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400 col-span-full mt-4">
          😔 No available rooms in this hostel.
        </p>
      )}
    </div>
  );
};

export default AvailableRooms;
