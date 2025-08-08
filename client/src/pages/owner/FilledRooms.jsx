import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, Home, BedDouble } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FilledRooms = () => {
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

      // ✅ CORRECTED: Use the full backend URL for hostels
      const hostelsRes = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/owner/hostels/my-hostels`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHostels(hostelsRes.data.hostels);

      // Set the first hostel as the default selected filter
      if (hostelsRes.data.hostels.length > 0) {
        setSelectedHostel(hostelsRes.data.hostels[0]._id);
      }

      // ✅ CORRECTED: Use the full backend URL for students
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
  const roomsOccupancy = studentsInSelectedHostel.reduce((acc, student) => {
    const roomKey = `${student.room}`;
    if (!acc[roomKey]) {
      acc[roomKey] = {
        roomNo: student.room,
        floor: student.floor,
        students: [],
      };
    }
    acc[roomKey].students.push(student.name);
    return acc;
  }, {});

  // Generate a list of room objects with occupancy status
  const generateRoomList = () => {
    const rooms = [];
    if (!selectedHostel) return rooms;

    // Dynamically fetch the total number of rooms from the selected hostel
    const selectedHostelData = hostels.find((h) => h._id === selectedHostel);
    const totalRooms = selectedHostelData ? selectedHostelData.rooms : 0;

    for (let i = 1; i <= totalRooms; i++) {
      const roomKey = `${i}`;
      const occupancy = roomsOccupancy[roomKey];
      rooms.push({
        roomNo: roomKey,
        isFilled: !!occupancy,
        students: occupancy ? occupancy.students : [],
      });
    }

    return rooms;
  };

  const roomList = generateRoomList();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white p-6 font-inter">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BedDouble className="text-blue-500" /> Room Occupancy
        </h1>

        {/* Dropdown filter for hostels */}
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
          Loading room data...
        </p>
      ) : hostels.length === 0 ? (
        <div className="text-center mt-10">
          <p className="text-gray-500 dark:text-gray-400">
            You need to add a hostel before you can manage rooms.
          </p>
          <button
            onClick={() => navigate("/owner/add-hostel")}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
          >
            Add Your First Hostel
          </button>
        </div>
      ) : roomList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {roomList.map((room, index) => (
            <motion.div
              key={`${selectedHostel}-${room.roomNo}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`rounded-xl shadow p-5 transition-all duration-300
                ${
                  room.isFilled
                    ? "bg-white dark:bg-gray-800 border-l-4 border-green-500 hover:shadow-xl"
                    : "bg-gray-50 dark:bg-gray-700 border-l-4 border-red-500 hover:shadow-lg"
                }`}
            >
              <h2 className="text-lg font-semibold mb-2">Room {room.roomNo}</h2>
              {room.isFilled ? (
                <>
                  <p className="text-green-600 dark:text-green-400 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" /> Filled by:
                  </p>
                  <ul className="mt-1 list-disc list-inside pl-2 text-gray-700 dark:text-gray-300">
                    {room.students.map((studentName, studentIndex) => (
                      <li key={studentIndex}>{studentName}</li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="text-red-500 dark:text-red-400 flex items-center gap-2">
                  <XCircle className="w-5 h-5" /> Vacant
                </p>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400 mt-10">
          No rooms found. Please add students to a hostel to see room statuses.
        </p>
      )}
    </div>
  );
};

export default FilledRooms;
