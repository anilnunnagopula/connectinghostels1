// ManageRooms.jsx - Enhanced Enterprise Version
import React, { useEffect, useState, useCallback } from "react";
import {
  CheckCircle,
  XCircle,
  Home,
  BedDouble,
  Pencil,
  Eye,
  AlertCircle,
  Search,
  Filter,
  Plus,
  Loader2,
  Wrench,
  Users,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ownerService, { handleServiceError } from "../../services/ownerService";

// Import reusable components
import EmptyState from "../../components/dashboard/EmptyState";

const ManageRooms = () => {
  const navigate = useNavigate();

  // State management
  const [hostels, setHostels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [selectedHostel, setSelectedHostel] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // UI state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all, available, occupied, maintenance
  const [showModal, setShowModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [modalMode, setModalMode] = useState("view"); // view, edit, assign

  // Fetch all data
  const fetchData = useCallback(
    async (showLoader = true) => {
      if (showLoader) setLoading(true);
      else setRefreshing(true);

      setError(null);

      try {
        // Fetch hostels
        const hostelsData = await ownerService.getMyHostels();
        setHostels(hostelsData);

        // Set first hostel as default
        if (hostelsData.length > 0 && !selectedHostel) {
          setSelectedHostel(hostelsData[0]._id);
        }

        // Fetch students
        const studentsData = await ownerService.getMyStudents();
        setAllStudents(studentsData);

        // Fetch rooms if hostel is selected
        if (selectedHostel || hostelsData[0]?._id) {
          const hostelId = selectedHostel || hostelsData[0]._id;
          await fetchRoomsForHostel(hostelId);
        }
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

  // Fetch rooms for specific hostel
  const fetchRoomsForHostel = async (hostelId) => {
    try {
      const roomsData = await ownerService.getRooms(hostelId);
      setRooms(roomsData);
    } catch (err) {
      console.error("❌ Error fetching rooms:", err);
      // Fallback: Generate rooms from hostel.rooms count if Room model not used
      const hostel = hostels.find((h) => h._id === hostelId);
      if (hostel && hostel.rooms) {
        generateFallbackRooms(hostel);
      }
    }
  };

  // Fallback: Generate rooms from student data (backward compatibility)
  const generateFallbackRooms = (hostel) => {
    const studentsInHostel = allStudents.filter(
      (s) => s.hostel._id === hostel._id,
    );

    const roomsMap = {};
    studentsInHostel.forEach((student) => {
      const roomKey = student.room;
      if (!roomsMap[roomKey]) {
        roomsMap[roomKey] = {
          _id: `fallback-${hostel._id}-${roomKey}`,
          hostelId: hostel._id,
          roomNumber: roomKey,
          capacity: 2, // Default capacity
          isAvailable: false,
          status: "Occupied",
          assignedStudents: [],
        };
      }
      roomsMap[roomKey].assignedStudents.push(student);
    });

    // Add vacant rooms
    const totalRooms = hostel.rooms || 0;
    for (let i = 1; i <= totalRooms; i++) {
      if (!roomsMap[i]) {
        roomsMap[i] = {
          _id: `fallback-${hostel._id}-${i}`,
          hostelId: hostel._id,
          roomNumber: i.toString(),
          capacity: 2,
          isAvailable: true,
          status: "Available",
          assignedStudents: [],
        };
      }
    }

    setRooms(Object.values(roomsMap));
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Refetch rooms when hostel changes
  useEffect(() => {
    if (selectedHostel) {
      fetchRoomsForHostel(selectedHostel);
    }
  }, [selectedHostel]);

  // Filter and search logic
  const filteredRooms = rooms.filter((room) => {
    // Search filter
    const matchesSearch =
      searchQuery === "" ||
      room.roomNumber
        ?.toString()
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    // Status filter
    let matchesStatus = true;
    if (statusFilter !== "all") {
      if (statusFilter === "available") {
        matchesStatus =
          room.isAvailable === true || room.status === "Available";
      } else if (statusFilter === "occupied") {
        matchesStatus =
          room.isAvailable === false || room.status === "Occupied";
      } else if (statusFilter === "maintenance") {
        matchesStatus = room.status === "Maintenance";
      }
    }

    return matchesSearch && matchesStatus;
  });

  // Handle room status toggle
  const handleToggleStatus = async (room, newStatus) => {
    try {
      await ownerService.toggleRoomStatus(room._id, newStatus);

      // Update local state
      setRooms((prevRooms) =>
        prevRooms.map((r) =>
          r._id === room._id
            ? {
                ...r,
                status: newStatus,
                isAvailable: newStatus === "Available",
              }
            : r,
        ),
      );

      alert(`✅ Room ${room.roomNumber} status updated to ${newStatus}`);
      setShowModal(false);
    } catch (err) {
      console.error("Error toggling status:", err);
      alert(
        "❌ Failed to update room status. This feature may not be implemented yet.",
      );
    }
  };

  // Modal handlers
  const openModal = (room, mode = "view") => {
    setSelectedRoom(room);
    setModalMode(mode);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRoom(null);
    setModalMode("view");
  };

  // Refresh data
  const handleRefresh = () => {
    fetchData(false);
  };

  // Get status color
  const getStatusColor = (room) => {
    if (room.status === "Maintenance") return "border-orange-500";
    if (room.isAvailable || room.status === "Available")
      return "border-red-500";
    return "border-green-500";
  };

  // Get status badge
  const getStatusBadge = (room) => {
    if (room.status === "Maintenance") {
      return (
        <span className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
          <Wrench className="w-4 h-4" /> Maintenance
        </span>
      );
    }
    if (room.isAvailable || room.status === "Available") {
      return (
        <span className="flex items-center gap-1 text-red-500 dark:text-red-400">
          <XCircle className="w-4 h-4" /> Vacant
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
        <CheckCircle className="w-4 h-4" /> Occupied
      </span>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-lg text-slate-700 dark:text-slate-300">
            Loading rooms...
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
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
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
          message="You need to add a hostel before you can manage rooms."
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
            Manage Rooms
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            View and manage room availability
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Refresh button */}
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

          {/* Add Room button */}
          <button
            onClick={() => alert("Add Room feature coming soon!")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Add Room</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow border border-slate-200 dark:border-slate-700 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Hostel Selector */}
          <div className="flex items-center gap-2">
            <Home className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            <select
              value={selectedHostel}
              onChange={(e) => setSelectedHostel(e.target.value)}
              className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
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

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
            >
              <option value="all">All Rooms</option>
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">
          Showing {filteredRooms.length} of {rooms.length} rooms
        </p>
      </div>

      {/* Rooms Grid */}
      {filteredRooms.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-12 text-center border border-slate-200 dark:border-slate-700">
          <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-lg text-slate-600 dark:text-slate-400">
            No rooms match your search criteria
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setStatusFilter("all");
            }}
            className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredRooms.map((room, index) => (
            <motion.div
              key={room._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-white dark:bg-slate-800 rounded-xl shadow hover:shadow-xl p-5 transition-all duration-300 border-l-4 ${getStatusColor(
                room,
              )}`}
            >
              {/* Room Header */}
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                  Room {room.roomNumber}
                </h2>
                {getStatusBadge(room)}
              </div>

              {/* Room Details */}
              <div className="space-y-2 mb-4">
                <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Capacity: {room.capacity || 2}
                </p>
                {room.assignedStudents && room.assignedStudents.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Occupants:
                    </p>
                    <ul className="text-sm text-slate-600 dark:text-slate-400 list-disc list-inside pl-2">
                      {room.assignedStudents.map((student, idx) => (
                        <li key={idx}>{student.name || student}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => openModal(room, "view")}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md transition flex items-center justify-center gap-1"
                  title="View Details"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => openModal(room, "edit")}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-md transition flex items-center justify-center gap-1"
                  title="Edit Room"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Room Details Modal */}
      <AnimatePresence>
        {showModal && selectedRoom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-lg w-full shadow-xl"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                  Room {selectedRoom.roomNumber} Details
                </h2>
                <button
                  onClick={closeModal}
                  className="text-slate-500 hover:text-slate-800 dark:hover:text-white transition"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="space-y-4">
                {/* Status Badge */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Status:
                  </span>
                  {getStatusBadge(selectedRoom)}
                </div>

                {/* Occupants */}
                {selectedRoom.assignedStudents &&
                selectedRoom.assignedStudents.length > 0 ? (
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Occupants:
                    </p>
                    <ul className="list-disc list-inside pl-4 space-y-1">
                      {selectedRoom.assignedStudents.map((student, idx) => (
                        <li
                          key={idx}
                          className="text-slate-600 dark:text-slate-400"
                        >
                          {student.name || student}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-slate-600 dark:text-slate-400">
                    This room is currently vacant.
                  </p>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 pt-4">
                  <button
                    onClick={() =>
                      handleToggleStatus(
                        selectedRoom,
                        selectedRoom.isAvailable ? "Occupied" : "Available",
                      )
                    }
                    className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md transition ${
                      selectedRoom.isAvailable
                        ? "bg-green-500 hover:bg-green-600 text-white"
                        : "bg-red-500 hover:bg-red-600 text-white"
                    }`}
                  >
                    {selectedRoom.isAvailable ? (
                      <>
                        <CheckCircle className="w-5 h-5" /> Mark as Occupied
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5" /> Mark as Vacant
                      </>
                    )}
                  </button>

                  <button
                    onClick={() =>
                      handleToggleStatus(selectedRoom, "Maintenance")
                    }
                    className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition"
                  >
                    <Wrench className="w-5 h-5" /> Mark as Maintenance
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageRooms;
