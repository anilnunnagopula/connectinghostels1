import React, { useState, useEffect, useCallback } from "react";
import {
  BedDouble,
  Home,
  Search,
  RefreshCw,
  Loader2,
  Plus,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ownerService from "../../services/ownerService";
import EmptyState from "../../components/dashboard/EmptyState";

const AvailableRooms = () => {
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

  // Get occupied rooms as a Set
  const occupiedRooms = studentsInSelectedHostel.reduce((acc, student) => {
    acc.add(`${student.room}`);
    return acc;
  }, new Set());

  // Generate available rooms list
  const getAvailableRooms = () => {
    if (!selectedHostel) return [];

    const selectedHostelData = hostels.find((h) => h._id === selectedHostel);
    const totalRooms = selectedHostelData?.totalRooms || 0;

    const available = [];
    for (let i = 1; i <= totalRooms; i++) {
      if (!occupiedRooms.has(`${i}`)) {
        available.push({
          roomNo: i,
          hostelName: selectedHostelData?.name || "N/A",
          category: selectedHostelData?.type || "N/A",
        });
      }
    }
    return available;
  };

  const availableRooms = getAvailableRooms();

  // Search filter
  const filteredRooms = availableRooms.filter(
    (room) =>
      searchQuery === "" || room.roomNo.toString().includes(searchQuery),
  );

  // Get stats
  const selectedHostelData = hostels.find((h) => h._id === selectedHostel);
  const stats = {
    totalAvailable: availableRooms.length,
    totalRooms: selectedHostelData?.totalRooms || 0,
    occupancyRate: selectedHostelData?.totalRooms
      ? Math.round(
          ((selectedHostelData.totalRooms - availableRooms.length) /
            selectedHostelData.totalRooms) *
            100,
        )
      : 0,
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
            Loading available rooms...
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
          message="You need to add a hostel before you can view available rooms."
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
            <BedDouble className="text-blue-500" />
            Available Rooms
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            View vacant rooms ready for booking
          </p>
        </div>

        <div className="flex items-center gap-2">
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

          <button
            onClick={() => navigate("/owner/add-student")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Assign Student</span>
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow border border-slate-200 dark:border-slate-700">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Available
          </p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
            {stats.totalAvailable}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow border border-slate-200 dark:border-slate-700">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Total Rooms
          </p>
          <p className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
            {stats.totalRooms}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow border border-slate-200 dark:border-slate-700">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Occupancy
          </p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
            {stats.occupancyRate}%
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
              placeholder="Search by room number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
            />
          </div>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">
          Showing {filteredRooms.length} of {availableRooms.length} available
          rooms
        </p>
      </div>

      {/* Rooms Grid */}
      {filteredRooms.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-12 text-center border border-slate-200 dark:border-slate-700">
          {availableRooms.length === 0 ? (
            <>
              <BedDouble className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-lg text-slate-600 dark:text-slate-400">
                No available rooms
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
                All rooms in this hostel are currently occupied
              </p>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredRooms.map((room, index) => (
            <motion.div
              key={room.roomNo}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-slate-800 rounded-xl shadow hover:shadow-xl p-5 transition-all duration-300 border-l-4 border-blue-500"
            >
              {/* Room Header */}
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                  Room {room.roomNo}
                </h2>
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                  <BedDouble className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>

              {/* Room Details */}
              <div className="space-y-2 mb-4">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  <span className="font-medium">Category:</span> {room.category}
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                    Available
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => navigate("/owner/add-student")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Assign Student
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AvailableRooms;
