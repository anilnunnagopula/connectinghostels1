/**
 * BookingRequestPage.jsx - Dedicated Booking Request Form
 *
 * NEW COMPONENT - Replaces modal in HostelDetails
 *
 * Features:
 * - Floor selection dropdown
 * - Room number input with validation
 * - Hostel information display
 * - Prevents duplicate requests
 * - Checks if student already admitted
 * - Shows loading states
 * - Redirects to dashboard on success
 *
 * Route: /booking-request/:hostelId
 */

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Building2,
  MapPin,
  IndianRupee,
  ArrowLeft,
  Loader2,
  CheckCircle,
  AlertCircle,
  Home,
  DoorOpen,
} from "lucide-react";

// ============================================================================
// CONSTANTS
// ============================================================================

const API_BASE_URL = process.env.REACT_APP_API_URL;

const getToken = () => localStorage.getItem("token");

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const BookingRequestPage = () => {
  const { hostelId } = useParams();
  const navigate = useNavigate();

  // ==========================================================================
  // STATE MANAGEMENT
  // ==========================================================================

  const [hostel, setHostel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state
  const [selectedFloor, setSelectedFloor] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Request state checking
  const [hasExistingRequest, setHasExistingRequest] = useState(false);
  const [isAdmitted, setIsAdmitted] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  // ==========================================================================
  // DATA FETCHING
  // ==========================================================================

  /**
   * Fetch hostel details
   */
  const fetchHostelDetails = useCallback(async () => {
    try {
      setLoading(true);
      const token = getToken();

      const response = await axios.get(
        `${API_BASE_URL}/api/hostels/${hostelId}`,
        token ? { headers: { Authorization: `Bearer ${token}` } } : {},
      );

      setHostel(response.data.data || response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching hostel:", err);
      setError("Failed to load hostel details");
    } finally {
      setLoading(false);
    }
  }, [hostelId]);

  /**
   * Check if student already has pending request or is admitted
   */
  const checkStudentStatus = useCallback(async () => {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setCheckingStatus(true);

      // Fetch student's current requests
      const response = await axios.get(
        `${API_BASE_URL}/api/students/my-requests`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      console.log("📋 Student status response:", response.data); // Debug log

      const { requests, studentStatus, currentHostel } = response.data;

      // Check if already admitted
      if (currentHostel) {
        setIsAdmitted(true);
        setHasExistingRequest(false);
        return;
      }

      // Check for pending request for THIS hostel OR any hostel
      const pendingRequest = requests?.find((req) => req.status === "Pending");
      if (pendingRequest) {
        setHasExistingRequest(true);
      }
    } catch (err) {
      console.error("❌ Error checking student status:", err);
      // Don't block the form if this check fails
      // Only block if it's a 404 (student profile doesn't exist)
      if (err.response?.status === 404) {
        setError("Please complete your profile first");
      }
    } finally {
      setCheckingStatus(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchHostelDetails();
    checkStudentStatus();
  }, [fetchHostelDetails, checkStudentStatus]);

  // ==========================================================================
  // EVENT HANDLERS
  // ==========================================================================

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    // Validation
    if (!selectedFloor) {
      alert("Please select a floor");
      return;
    }

    if (!roomNumber || roomNumber < 1) {
      alert("Please enter a valid room number");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await axios.post(
        `${API_BASE_URL}/api/students/booking-request`,
        {
          hostelId: hostelId,
          floor: Number(selectedFloor),
          roomNumber: Number(roomNumber),
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      console.log("✅ Request sent:", response.data);

      // Success - redirect to dashboard
      alert(response.data.message || "Request sent successfully!");
      navigate("/student/my-requests");
    } catch (err) {
      console.error("❌ Booking error:", err);

      const errorMessage =
        err.response?.data?.error ||
        "Failed to send request. Please try again.";

      alert(errorMessage);

      // If they already have a request, update state
      if (errorMessage.includes("already have a pending request")) {
        setHasExistingRequest(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Navigate back to hostel details
   */
  const handleGoBack = () => {
    navigate(`/hostel/${hostelId}`);
  };

  // ==========================================================================
  // RENDER HELPERS
  // ==========================================================================

  /**
   * Render loading state
   */
  if (loading || checkingStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  /**
   * Render error state
   */
  if (error || !hostel) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">
            Unable to Load
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error || "Hostel not found"}
          </p>
          <button
            onClick={handleGoBack}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  /**
   * Render already admitted message
   */
  if (isAdmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">
            Already Admitted
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You are already admitted to a hostel. Please vacate your current
            hostel before requesting a new one.
          </p>
          <button
            onClick={() => navigate("/student/my-requests")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  /**
   * Render existing request message
   */
  if (hasExistingRequest) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">
            Request Already Sent
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You already have a pending booking request. Please wait for the
            owner's response or cancel your existing request first.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate("/student/my-requests")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              View Requests
            </button>
            <button
              onClick={handleGoBack}
              className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Generate floor options
  console.log("🏢 hostel.floors =", hostel.floors, typeof hostel.floors);
  const totalFloors = Number(hostel.floors);

  const floorOptions = [];
  if (!Number.isNaN(totalFloors) && totalFloors > 0) {
    for (let i = 1; i <= totalFloors; i++) {
      floorOptions.push(i);
    }
  }


  // ==========================================================================
  // MAIN RENDER
  // ==========================================================================

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <button
          onClick={handleGoBack}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition"
        >
          <ArrowLeft size={20} />
          <span>Back to Hostel Details</span>
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {/* Hostel Info Section */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
            <h1 className="text-3xl font-bold mb-2">{hostel.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-blue-100">
              <div className="flex items-center gap-2">
                <MapPin size={18} />
                <span>{hostel.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 size={18} />
                <span>{hostel.type}</span>
              </div>
              <div className="flex items-center gap-2">
                <IndianRupee size={18} />
                <span className="font-semibold">
                  {hostel.price?.replace("₹", "").replace("/mo", "")}/month
                </span>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">
              Request Booking
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Fill in the details below to send a booking request to the hostel
              owner. They will review your request and respond shortly.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Floor Selection */}
              <div>
                <label className="block text-sm font-semibold mb-2 dark:text-white">
                  <Home size={18} className="inline mr-2" />
                  Select Floor *
                </label>
                <select
                  value={selectedFloor}
                  onChange={(e) => setSelectedFloor(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white outline-none transition"
                >
                  <option value="">-- Choose Floor --</option>
                  {floorOptions.map((floor) => (
                    <option key={floor} value={floor}>
                      Floor {floor}
                      {floor === 1 && " (Ground Floor)"}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  This hostel has {hostel.floors} floor(s)
                </p>
              </div>

              {/* Room Number */}
              <div>
                <label className="block text-sm font-semibold mb-2 dark:text-white">
                  <DoorOpen size={18} className="inline mr-2" />
                  Preferred Room Number *
                </label>
                <input
                  type="number"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  min="1"
                  required
                  placeholder="e.g., 101, 205"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white outline-none transition"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  The owner will verify room availability and confirm
                </p>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle
                    className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
                    size={20}
                  />
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    <p className="font-semibold mb-1">Important Information:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Your request will be reviewed by the hostel owner</li>
                      <li>Room availability is subject to confirmation</li>
                      <li>
                        You can track your request status in the dashboard
                      </li>
                      <li>Only one pending request is allowed at a time</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition flex items-center justify-center gap-2 text-lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={24} className="animate-spin" />
                    Sending Request...
                  </>
                ) : (
                  <>
                    <CheckCircle size={24} />
                    Send Booking Request
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-3 dark:text-white">
            What happens next?
          </h3>
          <ol className="space-y-2 text-gray-600 dark:text-gray-400">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                1
              </span>
              <span>Your request will be sent to the hostel owner</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                2
              </span>
              <span>The owner will review your profile and request</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                3
              </span>
              <span>You'll be notified once the owner accepts or rejects</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                4
              </span>
              <span>If accepted, your hostel admission will be confirmed!</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default BookingRequestPage;

/**
 * ============================================================================
 * IMPLEMENTATION NOTES
 * ============================================================================
 *
 * ✅ NEW FEATURES:
 * - Dedicated page (not modal)
 * - Floor selection dropdown
 * - Room number input with validation
 * - Prevents duplicate requests
 * - Checks admission status
 * - Shows hostel info at top
 * - Clear "what happens next" section
 *
 * ✅ USER EXPERIENCE:
 * - Back button to hostel details
 * - Loading states during submission
 * - Error handling with alerts
 * - Success redirect to dashboard
 * - Disabled state during submission
 * - Info tooltips for clarity
 *
 * ✅ VALIDATION:
 * - Requires floor selection
 * - Validates room number > 0
 * - Checks for existing requests
 * - Verifies student not already admitted
 * - Floor count validation
 *
 * ROUTE TO ADD IN APP.JS:
 * <Route path="/booking-request/:hostelId" element={<BookingRequestPage />} />
 */
