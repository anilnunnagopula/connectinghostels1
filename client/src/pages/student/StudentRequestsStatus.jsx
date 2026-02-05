/**
 * StudentRequestsStatus.jsx - Student's Request Management Dashboard
 *
 * NEW COMPONENT - Shows all student requests with status tracking
 *
 * Features:
 * - View all requests (pending/approved/rejected)
 * - Cancel pending requests
 * - See admission status
 * - Filter by status
 * - Real-time status updates
 *
 * Use: Can be integrated into student dashboard or as standalone page
 */

import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Trash2,
  Building2,
  MapPin,
  Home,
  DoorOpen,
  AlertCircle,
} from "lucide-react";

// ============================================================================
// CONSTANTS
// ============================================================================

const API_BASE_URL = process.env.REACT_APP_API_URL;

const getToken = () => localStorage.getItem("token");

// Status configuration
const STATUS_CONFIG = {
  Pending: {
    icon: Clock,
    color: "text-yellow-600 dark:text-yellow-400",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    borderColor: "border-yellow-200 dark:border-yellow-800",
    label: "Pending Review",
  },
  Approved: {
    icon: CheckCircle,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    borderColor: "border-green-200 dark:border-green-800",
    label: "Approved ✓",
  },
  Rejected: {
    icon: XCircle,
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    borderColor: "border-red-200 dark:border-red-800",
    label: "Rejected",
  },
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const StudentRequestsStatus = () => {
  const navigate = useNavigate();

  // State
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentStatus, setStudentStatus] = useState(null);
  const [currentHostel, setCurrentHostel] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("all");

  // ==========================================================================
  // DATA FETCHING
  // ==========================================================================

  const fetchRequests = useCallback(async () => {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/api/students/my-requests`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setRequests(response.data.requests || []);
      setStudentStatus(response.data.studentStatus);
      setCurrentHostel(response.data.currentHostel);
    } catch (err) {
      console.error("Error fetching requests:", err);
      alert("Failed to load requests");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // ==========================================================================
  // EVENT HANDLERS
  // ==========================================================================

  /**
   * Cancel a pending request
   */
  const handleCancelRequest = async (requestId) => {
    if (!window.confirm("Are you sure you want to cancel this request?")) {
      return;
    }

    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setCancellingId(requestId);

      await axios.delete(
        `${API_BASE_URL}/api/students/booking-request/${requestId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      alert("Request cancelled successfully");
      fetchRequests(); // Refresh list
    } catch (err) {
      console.error("Error cancelling request:", err);
      alert(err.response?.data?.error || "Failed to cancel request");
    } finally {
      setCancellingId(null);
    }
  };

  /**
   * Navigate to hostel details
   */
  const handleViewHostel = (hostelId) => {
    navigate(`/hostel/${hostelId}`);
  };

  // ==========================================================================
  // FILTERING
  // ==========================================================================

  const filteredRequests =
    selectedFilter === "all"
      ? requests
      : requests.filter((req) => req.status === selectedFilter);

  // ==========================================================================
  // RENDER HELPERS
  // ==========================================================================

  /**
   * Render loading state
   */
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  /**
   * Render admission status banner
   */
  const renderAdmissionStatus = () => {
    if (!currentHostel) return null;

    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <CheckCircle
            className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5"
            size={24}
          />
          <div>
            <h3 className="text-lg font-bold text-green-800 dark:text-green-200 mb-1">
              🎉 You're Admitted!
            </h3>
            <p className="text-green-700 dark:text-green-300 text-sm">
              You are currently admitted to a hostel. Status:{" "}
              <strong>{studentStatus}</strong>
            </p>
          </div>
        </div>
      </div>
    );
  };

  /**
   * Render empty state
   */
  const renderEmptyState = () => (
    <div className="text-center py-12">
      <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
        No Requests Yet
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-4">
        You haven't sent any booking requests yet.
      </p>
      <button
        onClick={() => navigate("/student/hostels")}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
      >
        Browse Hostels
      </button>
    </div>
  );

  /**
   * Render filter tabs
   */
  const renderFilterTabs = () => {
    const counts = {
      all: requests.length,
      Pending: requests.filter((r) => r.status === "Pending").length,
      Approved: requests.filter((r) => r.status === "Approved").length,
      Rejected: requests.filter((r) => r.status === "Rejected").length,
    };

    return (
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {["all", "Pending", "Approved", "Rejected"].map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter)}
            className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
              selectedFilter === filter
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            {filter === "all" ? "All" : filter} ({counts[filter]})
          </button>
        ))}
      </div>
    );
  };

  /**
   * Render single request card
   */
  const renderRequestCard = (request) => {
    const statusConfig = STATUS_CONFIG[request.status];
    const StatusIcon = statusConfig.icon;
    const isCancelling = cancellingId === request._id;

    return (
      <div
        key={request._id}
        className={`bg-white dark:bg-gray-800 border ${statusConfig.borderColor} rounded-lg p-5 shadow-sm hover:shadow-md transition`}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">
              {request.hostel?.name || "Hostel"}
            </h3>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
              <MapPin size={14} />
              <span>{request.hostel?.location || "Location"}</span>
            </div>
          </div>
          <div
            className={`flex items-center gap-2 px-3 py-1 rounded-full ${statusConfig.bgColor}`}
          >
            <StatusIcon size={16} className={statusConfig.color} />
            <span className={`text-sm font-semibold ${statusConfig.color}`}>
              {statusConfig.label}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Home size={16} />
            <span className="text-sm">
              Floor: <strong>{request.floor}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <DoorOpen size={16} />
            <span className="text-sm">
              Room: <strong>{request.roomNumber}</strong>
            </span>
          </div>
        </div>

        {/* Timestamp */}
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          Requested on:{" "}
          {new Date(request.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>

        {/* Rejection reason */}
        {request.status === "Rejected" && request.rejectionReason && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-3 mb-4">
            <p className="text-sm text-red-800 dark:text-red-200">
              <strong>Reason:</strong> {request.rejectionReason}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => handleViewHostel(request.hostel._id)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition text-sm"
          >
            View Hostel
          </button>
          {request.status === "Pending" && (
            <button
              onClick={() => handleCancelRequest(request._id)}
              disabled={isCancelling}
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition text-sm flex items-center gap-2"
            >
              {isCancelling ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Cancelling...
                </>
              ) : (
                <>
                  <Trash2 size={16} />
                  Cancel
                </>
              )}
            </button>
          )}
        </div>
      </div>
    );
  };

  // ==========================================================================
  // MAIN RENDER
  // ==========================================================================

  return (
    <div className="p-6 dark:bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            My Booking Requests
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track the status of your hostel booking requests
          </p>
        </div>

        {/* Admission Status */}
        {renderAdmissionStatus()}

        {/* Empty State */}
        {requests.length === 0 ? (
          renderEmptyState()
        ) : (
          <>
            {/* Filter Tabs */}
            {renderFilterTabs()}

            {/* Requests List */}
            <div className="space-y-4">
              {filteredRequests.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No{" "}
                  {selectedFilter === "all" ? "" : selectedFilter.toLowerCase()}{" "}
                  requests found
                </div>
              ) : (
                filteredRequests.map(renderRequestCard)
              )}
            </div>
          </>
        )}

        {/* Info Box */}
        {requests.some((r) => r.status === "Pending") && (
          <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle
                className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
                size={20}
              />
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <p className="font-semibold mb-1">Pending Requests</p>
                <p>
                  Your request is being reviewed by the hostel owner. You'll
                  receive a notification once they respond. You can cancel the
                  request if you change your mind.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentRequestsStatus;

/**
 * ============================================================================
 * INTEGRATION NOTES
 * ============================================================================
 *
 * HOW TO USE:
 *
 * 1. As Standalone Page:
 *    <Route path="/student/my-requests" element={<StudentRequestsStatus />} />
 *
 * 2. In Student Dashboard:
 *    <StudentRequestsStatus />
 *
 * 3. In Sidebar/Navigation:
 *    <Link to="/student/my-requests">My Requests</Link>
 *
 * FEATURES:
 * ✅ View all requests with status
 * ✅ Filter by status (all/pending/approved/rejected)
 * ✅ Cancel pending requests
 * ✅ See admission status if approved
 * ✅ View hostel details from card
 * ✅ Responsive design
 * ✅ Dark mode support
 * ✅ Loading states
 * ✅ Empty states
 * ✅ Rejection reasons display
 */
