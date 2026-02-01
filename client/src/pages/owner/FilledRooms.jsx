import React, { useEffect, useState, useCallback } from "react";
import {
  CheckCircle,
  Home,
  BedDouble,
  Search,
  RefreshCw,
  Loader2,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ownerService from "../../services/ownerService";
import EmptyState from "../../components/dashboard/EmptyState";

const FilledRooms = () => {
  const navigate = useNavigate();
  const [hostels, setHostels] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [selectedHostel, setSelectedHostel] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);

  // Fetch all hostels and students
  const fetchData = useCallback(
    async (showLoader = true) => {
      if (showLoader) setLoading(true);
      else setRefreshing(true);

      setError(null);

      try {
        // Use service layer
        const hostelsData = await ownerService.getMyHostels();
        setHostels(hostelsData);

        // Set first hostel as default
        if (hostelsData.length > 0 && !selectedHostel) {
          setSelectedHostel(hostelsData[0]._id);
        }

        // Fetch students
        const studentsData = await ownerService.getMyStudents();
        setAllStudents(studentsData);
      } catch (err) {
        console.error("❌ Error fetching data:", err);
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [selectedHostel],
  );

  useEffect(() => {
    fetchData();
  }, []);

  // Filter students based on the selected hostel
  const studentsInSelectedHostel = allStudents.filter(
    (student) => student.hostel?._id === selectedHostel,
  );

  // Group students by room number
  const roomsOccupancy = studentsInSelectedHostel.reduce((acc, student) => {
    const roomKey = `${student.room}`;
    if (!acc[roomKey]) {
      acc[roomKey] = {
        roomNo: student.room,
        students: [],
      };
    }
    acc[roomKey].students.push({
      name: student.name,
      id: student._id,
    });
    return acc;
  }, {});

  // Generate filled rooms list
  const generateFilledRoomsList = () => {
    const rooms = [];

    for (const roomKey in roomsOccupancy) {
      rooms.push({
        roomNo: roomKey,
        students: roomsOccupancy[roomKey].students,
        occupancy: roomsOccupancy[roomKey].students.length,
      });
    }

    // Sort by room number
    return rooms.sort((a, b) => parseInt(a.roomNo) - parseInt(b.roomNo));
  };

  const filledRooms = generateFilledRoomsList();

  // Search filter
  const filteredRooms = filledRooms.filter(
    (room) =>
      searchQuery === "" ||
      room.roomNo.toString().includes(searchQuery) ||
      room.students.some((s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
  );

  // Get stats
  const stats = {
    totalFilled: filledRooms.length,
    totalStudents: studentsInSelectedHostel.length,
  };

  // Refresh handler
  const handleRefresh = () => {
    fetchData(false);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-lg text-slate-700 dark:text-slate-300">
            Loading filled rooms...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <p className="text-xl text-red-500 mb-4">{error}</p>
          <button
            onClick={() => fetchData()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty state - No hostels
  if (hostels.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 sm:p-6">
        <EmptyState
          icon={<Home className="w-16 h-16 text-slate-400" />}
          title="No Hostels Yet"
          message="You need to add a hostel before you can view filled rooms."
          actionLabel="Add Your First Hostel"
          onAction={() => navigate("/owner/add-hostel")}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <BedDouble className="text-green-500" />
            Filled Rooms
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            View occupied rooms and their occupants
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="p-2 bg-slate-200 dark:bg-slate-700 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          title="Refresh"
        >
          <RefreshCw
            className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`}
          />
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow border border-slate-200 dark:border-slate-700">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Filled Rooms
          </p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
            {stats.totalFilled}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow border border-slate-200 dark:border-slate-700">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Total Students
          </p>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
            {stats.totalStudents}
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow border border-slate-200 dark:border-slate-700 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Hostel Selector */}
          <div className="flex items-center gap-2">
            <Home className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            <select
              value={selectedHostel}
              onChange={(e) => setSelectedHostel(e.target.value)}
              className="flex-1 sm:w-auto px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
            >
              {hostels.map((hostel) => (
                <option key={hostel._id} value={hostel._id}>
                  {hostel.name}
                </option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by room number or student name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
            />
          </div>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">
          Showing {filteredRooms.length} of {filledRooms.length} filled rooms
        </p>
      </div>

      {/* Rooms Grid */}
      {filteredRooms.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-12 text-center border border-slate-200 dark:border-slate-700">
          {filledRooms.length === 0 ? (
            <>
              <BedDouble className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-lg text-slate-600 dark:text-slate-400">
                No filled rooms yet
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
                Add students to see occupied rooms
              </p>
              <button
                onClick={() => navigate("/owner/add-student")}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
              >
                Add Student
              </button>
            </>
          ) : (
            <>
              <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-lg text-slate-600 dark:text-slate-400">
                No rooms match your search
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear Search
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredRooms.map((room, index) => (
            <motion.div
              key={`${selectedHostel}-${room.roomNo}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-slate-800 rounded-xl shadow hover:shadow-xl p-5 transition-all duration-300 border-l-4 border-green-500"
            >
              {/* Room Header */}
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                  Room {room.roomNo}
                </h2>
                <span className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  Occupied
                </span>
              </div>

              {/* Occupancy Info */}
              <div className="flex items-center gap-2 mb-3 text-sm text-slate-600 dark:text-slate-400">
                <Users className="w-4 h-4" />
                <span>
                  {room.occupancy}{" "}
                  {room.occupancy === 1 ? "Student" : "Students"}
                </span>
              </div>

              {/* Students List */}
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Occupants:
                </p>
                <ul className="space-y-1">
                  {room.students.map((student, idx) => (
                    <li
                      key={student.id}
                      className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2"
                    >
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      {student.name}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilledRooms;
