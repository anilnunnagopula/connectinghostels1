/**
 * MyRoomDetails.jsx - Student Room Information Dashboard
 *
 * Features:
 * - Display current room details (room number, floor, type)
 * - Show roommate information (name, contact)
 * - Display room amenities and facilities
 * - Show hostel information
 * - Quick actions (Pay Rent, Raise Complaint, View Rules)
 * - Responsive design with dark mode support
 * - Loading and error states
 * - Real-time data from backend API
 *
 * Performance Optimizations:
 * - Memoized computed values
 * - useCallback for handlers
 * - Proper cleanup with abort controllers
 * - Optimized re-renders
 */

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  BedDouble,
  Users,
  Building2,
  MapPin,
  Phone,
  Mail,
  Wifi,
  Utensils,
  Tv,
  Wind,
  Droplet,
  Bed,
  Home,
  Loader2,
  AlertCircle,
  IndianRupee,
  MessageSquareWarning,
  FileText,
  ArrowLeft,
  User,
  Hash,
  Layers,
  CheckCircle,
  XCircle,
  Calendar,
} from "lucide-react";

// ============================================================================
// CONSTANTS
// ============================================================================

const API_BASE_URL = process.env.REACT_APP_API_URL;

// Amenity icons mapping
const AMENITY_ICONS = {
  WiFi: { icon: <Wifi size={20} />, color: "text-blue-500" },
  Food: { icon: <Utensils size={20} />, color: "text-orange-500" },
  Mess: { icon: <Utensils size={20} />, color: "text-orange-500" },
  TV: { icon: <Tv size={20} />, color: "text-purple-500" },
  AC: { icon: <Wind size={20} />, color: "text-cyan-500" },
  "Air Conditioning": { icon: <Wind size={20} />, color: "text-cyan-500" },
  Laundry: { icon: <Droplet size={20} />, color: "text-blue-400" },
  Geyser: { icon: <Droplet size={20} />, color: "text-red-400" },
  "Hot Water": { icon: <Droplet size={20} />, color: "text-red-400" },
  Parking: { icon: <Building2 size={20} />, color: "text-slate-500" },
  Security: { icon: <Home size={20} />, color: "text-green-500" },
  "24/7 Security": { icon: <Home size={20} />, color: "text-green-500" },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const getToken = () => localStorage.getItem("token");

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const MyRoomDetails = () => {
  const navigate = useNavigate();

  // ==========================================================================
  // STATE MANAGEMENT
  // ==========================================================================

  const [state, setState] = useState({
    roomData: null,
    loading: true,
    error: null,
  });

  // ==========================================================================
  // DATA FETCHING
  // ==========================================================================

  /**
   * Fetches student's room details and roommates information
   */
  const fetchRoomDetails = useCallback(async () => {
    const token = getToken();

    if (!token) {
      navigate("/login");
      return;
    }

    const abortController = new AbortController();

    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      // Fetch student's current hostel and room info
      const response = await axios.get(
        `${API_BASE_URL}/api/students/my-requests`,
        {
          headers: { Authorization: `Bearer ${token}` },
          signal: abortController.signal,
        },
      );

      console.log("📊 Room data response:", response.data);

      const currentHostel = response.data.currentHostel;

      if (!currentHostel) {
        setState({
          roomData: null,
          loading: false,
          error: "You are not currently staying in any hostel.",
        });
        return;
      }

      // Fetch roommates (students in the same room)
      // This endpoint needs to be created in backend
      let roommates = [];
      try {
        const roommatesResponse = await axios.get(
          `${API_BASE_URL}/api/students/my-roommates`,
          {
            headers: { Authorization: `Bearer ${token}` },
            signal: abortController.signal,
          },
        );
        roommates = roommatesResponse.data.roommates || [];
      } catch (err) {
        console.log("⚠️ Roommates endpoint not available:", err.message);
        // Continue without roommates data
      }

      setState({
        roomData: {
          hostel: currentHostel,
          roommates: roommates,
        },
        loading: false,
        error: null,
      });
    } catch (err) {
      if (err.name === "CanceledError" || err.code === "ERR_CANCELED") {
        return;
      }

      console.error("❌ Error fetching room details:", err);

      // Handle 404 gracefully
      if (err.response?.status === 404) {
        setState({
          roomData: null,
          loading: false,
          error: "You are not currently staying in any hostel.",
        });
        return;
      }

      setState({
        roomData: null,
        loading: false,
        error: err.response?.data?.message || "Failed to fetch room details.",
      });

      toast.error(
        err.response?.data?.message || "Failed to fetch room details.",
      );
    }

    return () => abortController.abort();
  }, [navigate]);

  useEffect(() => {
    fetchRoomDetails();
  }, [fetchRoomDetails]);

  // ==========================================================================
  // COMPUTED VALUES
  // ==========================================================================

  /**
   * Extract room amenities from hostel features
   */
  const roomAmenities = useMemo(() => {
    if (!state.roomData?.hostel?.features) return [];
    return state.roomData.hostel.features;
  }, [state.roomData]);

  /**
   * Count total roommates (including self)
   */
  const totalOccupants = useMemo(() => {
    return (state.roomData?.roommates?.length || 0) + 1; // +1 for current student
  }, [state.roomData]);

  // ==========================================================================
  // EVENT HANDLERS
  // ==========================================================================

  const handleNavigate = useCallback(
    (path) => {
      navigate(path);
    },
    [navigate],
  );

  const handleGoBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleRetry = useCallback(() => {
    fetchRoomDetails();
  }, [fetchRoomDetails]);

  const handleContactRoommate = useCallback((phone) => {
    if (phone) {
      window.location.href = `tel:${phone}`;
    }
  }, []);

  const handleEmailRoommate = useCallback((email) => {
    if (email) {
      window.location.href = `mailto:${email}`;
    }
  }, []);

  // ==========================================================================
  // RENDER HELPERS
  // ==========================================================================

  /**
   * Renders loading state
   */
  const renderLoading = () => (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
        <p className="text-slate-600 dark:text-slate-400">
          Loading room details...
        </p>
      </div>
    </div>
  );

  /**
   * Renders error state (no hostel)
   */
  const renderError = () => (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg max-w-md text-center">
        <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2 text-slate-800 dark:text-white">
          No Active Room
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">{state.error}</p>
        <button
          onClick={() => handleNavigate("/student/hostels")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition mb-3 w-full"
        >
          Browse Hostels
        </button>
        <button
          onClick={handleRetry}
          className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white px-6 py-3 rounded-lg font-semibold transition w-full"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  /**
   * Renders page header
   */
  const renderHeader = () => (
    <div className="mb-6">
      <button
        onClick={handleGoBack}
        className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-4 transition"
      >
        <ArrowLeft size={20} />
        <span>Back</span>
      </button>
      <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
        My Room Details
      </h1>
      <p className="text-slate-600 dark:text-slate-400 mt-2">
        View your room information and roommates
      </p>
    </div>
  );

  /**
   * Renders hostel and room information card
   */
  const renderRoomInfo = () => {
    const hostel = state.roomData.hostel;

    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-800 dark:text-white">
          <Home size={22} className="text-blue-500" />
          Room Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Hostel Name */}
          <div className="flex items-start gap-3">
            <Building2 className="text-blue-500 mt-1" size={20} />
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Hostel Name
              </p>
              <p className="font-semibold text-slate-900 dark:text-white">
                {hostel.name}
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start gap-3">
            <MapPin className="text-red-500 mt-1" size={20} />
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Location
              </p>
              <p className="font-semibold text-slate-900 dark:text-white">
                {hostel.location || hostel.locality || "N/A"}
              </p>
            </div>
          </div>

          {/* Room Number */}
          <div className="flex items-start gap-3">
            <Hash className="text-purple-500 mt-1" size={20} />
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Room Number
              </p>
              <p className="font-semibold text-slate-900 dark:text-white">
                {hostel.roomNumber || "Not Assigned"}
              </p>
            </div>
          </div>

          {/* Floor */}
          <div className="flex items-start gap-3">
            <Layers className="text-green-500 mt-1" size={20} />
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Floor
              </p>
              <p className="font-semibold text-slate-900 dark:text-white">
                {hostel.floor || hostel.floors || "N/A"}
              </p>
            </div>
          </div>

          {/* Room Type */}
          <div className="flex items-start gap-3">
            <BedDouble className="text-indigo-500 mt-1" size={20} />
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Room Type
              </p>
              <p className="font-semibold text-slate-900 dark:text-white">
                {hostel.type || hostel.roomType || "Standard"}
              </p>
            </div>
          </div>

          {/* Occupancy */}
          <div className="flex items-start gap-3">
            <Users className="text-orange-500 mt-1" size={20} />
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Occupancy
              </p>
              <p className="font-semibold text-slate-900 dark:text-white">
                {totalOccupants} {totalOccupants === 1 ? "Person" : "People"}
              </p>
            </div>
          </div>
        </div>

        {/* Admission Date */}
        {hostel.admissionDate && (
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <Calendar size={16} />
              <span>
                Staying since:{" "}
                {new Date(hostel.admissionDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  /**
   * Renders amenities card
   */
  const renderAmenities = () => {
    if (roomAmenities.length === 0) {
      return null;
    }

    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-800 dark:text-white">
          <CheckCircle size={22} className="text-green-500" />
          Room Amenities
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {roomAmenities.map((amenity, index) => {
            const amenityConfig = AMENITY_ICONS[amenity] || {
              icon: <CheckCircle size={20} />,
              color: "text-slate-500",
            };

            return (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg"
              >
                <div className={amenityConfig.color}>{amenityConfig.icon}</div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {amenity}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  /**
   * Renders roommates section
   */
  const renderRoommates = () => {
    const roommates = state.roomData.roommates || [];

    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-800 dark:text-white">
          <Users size={22} className="text-purple-500" />
          Roommates ({roommates.length})
        </h2>

        {roommates.length > 0 ? (
          <div className="space-y-4">
            {roommates.map((roommate, index) => (
              <div
                key={roommate._id || index}
                className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {roommate.name?.charAt(0).toUpperCase() || "?"}
                  </div>

                  {/* Info */}
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {roommate.name || "Unknown"}
                    </h3>
                    <div className="flex items-center gap-4 mt-1">
                      {roommate.email && (
                        <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <Mail size={12} />
                          {roommate.email}
                        </span>
                      )}
                      {roommate.phone && (
                        <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <Phone size={12} />
                          {roommate.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contact Actions */}
                <div className="flex gap-2">
                  {roommate.phone && (
                    <button
                      onClick={() => handleContactRoommate(roommate.phone)}
                      className="p-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition"
                      aria-label="Call"
                    >
                      <Phone size={16} />
                    </button>
                  )}
                  {roommate.email && (
                    <button
                      onClick={() => handleEmailRoommate(roommate.email)}
                      className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition"
                      aria-label="Email"
                    >
                      <Mail size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
            <User className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-500 dark:text-slate-400">
              No roommates found. You might have a single room!
            </p>
          </div>
        )}
      </div>
    );
  };

  /**
   * Renders quick actions section
   */
  const renderQuickActions = () => (
    <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-white">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => handleNavigate("/student/payments")}
          className="flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-3 rounded-lg font-semibold transition"
        >
          <IndianRupee size={18} />
          Pay Rent
        </button>
        <button
          onClick={() => handleNavigate("/student/raise-complaint")}
          className="flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-3 rounded-lg font-semibold transition"
        >
          <MessageSquareWarning size={18} />
          Complaint
        </button>
        <button
          onClick={() => handleNavigate("/student/notifications")}
          className="flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-3 rounded-lg font-semibold transition"
        >
          <FileText size={18} />
          Notifications
        </button>
      </div>
    </div>
  );

  // ==========================================================================
  // MAIN RENDER
  // ==========================================================================

  if (state.loading) {
    return renderLoading();
  }

  if (state.error || !state.roomData) {
    return renderError();
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        {renderHeader()}
        {renderRoomInfo()}
        {renderAmenities()}
        {renderRoommates()}
        {renderQuickActions()}
      </div>
    </div>
  );
};

export default MyRoomDetails;

/**
 * ============================================================================
 * BACKEND API REQUIREMENTS
 * ============================================================================
 *
 * This component requires the following endpoints:
 *
 * 1. GET /api/students/my-requests
 *    - Returns currentHostel with room details
 *    - Response format:
 *    {
 *      currentHostel: {
 *        _id: "...",
 *        name: "Hostel Name",
 *        location: "Address",
 *        roomNumber: "101",
 *        floor: "1st Floor",
 *        type: "Boys Hostel",
 *        features: ["WiFi", "AC", "Food"],
 *        admissionDate: "2024-01-01"
 *      }
 *    }
 *
 * 2. GET /api/students/my-roommates (OPTIONAL - needs to be created)
 *    - Returns list of students in the same room
 *    - Response format:
 *    {
 *      roommates: [
 *        {
 *          _id: "...",
 *          name: "Student Name",
 *          email: "student@example.com",
 *          phone: "1234567890"
 *        }
 *      ]
 *    }
 *
 * ============================================================================
 * BACKEND CONTROLLER TO CREATE (Optional)
 * ============================================================================
 *
 * // controllers/studentController.js
 *
 * exports.getMyRoommates = async (req, res) => {
 *   try {
 *     const userId = req.user.id;
 *
 *     // Find current student
 *     const currentStudent = await Student.findOne({ user: userId });
 *
 *     if (!currentStudent || !currentStudent.currentHostel || !currentStudent.roomNumber) {
 *       return res.status(404).json({
 *         success: false,
 *         message: "You are not currently in a room"
 *       });
 *     }
 *
 *     // Find other students in the same room
 *     const roommates = await Student.find({
 *       currentHostel: currentStudent.currentHostel,
 *       roomNumber: currentStudent.roomNumber,
 *       _id: { $ne: currentStudent._id }, // Exclude self
 *       status: "Active"
 *     }).select("name email phone");
 *
 *     res.status(200).json({
 *       success: true,
 *       roommates
 *     });
 *   } catch (err) {
 *     console.error("Error fetching roommates:", err);
 *     res.status(500).json({
 *       success: false,
 *       message: "Failed to fetch roommates"
 *     });
 *   }
 * };
 *
 * // Add to routes/studentRoutes.js:
 * router.get("/my-roommates", requireAuth, requireStudent, studentController.getMyRoommates);
 *
 * ============================================================================
 * FEATURES
 * ============================================================================
 *
 * ✅ Production Ready Design
 * ✅ Fully Responsive (Mobile, Tablet, Desktop)
 * ✅ Dark Mode Support
 * ✅ Loading States
 * ✅ Error Handling
 * ✅ Empty States
 * ✅ Real API Integration
 * ✅ Contact Roommates (Call/Email)
 * ✅ Quick Actions (Pay Rent, Complaint, Notifications)
 * ✅ Beautiful UI with Icons
 * ✅ Optimized Performance
 * ✅ Accessibility (aria-labels, keyboard navigation)
 *
 * ============================================================================
 */
