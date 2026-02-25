/**
 * BookingRequestPage.jsx - Dedicated Booking Request Form
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

import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
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
  Bell,
  Clock,
  ArrowRight,
} from "lucide-react";
import { 
  useHostelDetail, 
  useStudentRequests, 
  useSendBookingRequest 
} from "../../hooks/useQueries";

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const BookingRequestPage = () => {
  const { hostelId } = useParams();
  const navigate = useNavigate();
  const handleGoBack = () => navigate(-1);

  // ==========================================================================
  // STATE & QUERIES
  // ==========================================================================

  // Form state
  const [selectedFloor, setSelectedFloor] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submittedDetails, setSubmittedDetails] = useState(null);

  // Data fetching
  const { 
    data: hostel, 
    isLoading: loadingHostel, 
    error: hostelError 
  } = useHostelDetail(hostelId);

  const { 
    data: studentStatus, 
    isLoading: loadingStatus,
    error: statusError
  } = useStudentRequests();

  const bookingMutation = useSendBookingRequest();

  // Derived states
  const isAdmitted = !!studentStatus?.currentHostel;
  const hasExistingRequest = useMemo(() => {
    return !!studentStatus?.requests?.find(req => req.status.toLowerCase() === "pending");
  }, [studentStatus]);

  // Generate floor options
  const floorOptions = useMemo(() => {
    if (!hostel?.floors) return [];
    const totalFloors = Number(hostel.floors);
    if (isNaN(totalFloors) || totalFloors <= 0) return [];
    
    return Array.from({ length: totalFloors }, (_, i) => i + 1);
  }, [hostel]);

  // ==========================================================================
  // EVENT HANDLERS
  // ==========================================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFloor) {
      toast.error("Please select a floor");
      return;
    }

    if (!roomNumber || roomNumber < 1) {
      toast.error("Please enter a valid room number");
      return;
    }

    bookingMutation.mutate(
      {
        hostelId: hostelId,
        floor: Number(selectedFloor),
        roomNumber: Number(roomNumber),
      },
      {
        onSuccess: () => {
          setSubmittedDetails({
            hostelName: hostel.name,
            floor: Number(selectedFloor),
            roomNumber: Number(roomNumber),
          });
          setSubmitted(true);
        },
        onError: (err) => {
          const errorMessage = err.response?.data?.error || err.message || "Failed to send request";
          toast.error(errorMessage);
        },
      }
    );
  };

  const handleViewDetails = (hostelId) => {
    navigate(`/student/hostels/${hostelId}`);
  };

  // ==========================================================================
  // RENDER HELPERS
  // ==========================================================================

  if (loadingHostel || loadingStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Handle specific user-not-found error (profile incomplete)
  if (statusError?.response?.status === 404) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 p-4">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">Profile Incomplete</h2>
          <p className="text-gray-600 dark:text-slate-400 mb-6">
            Please complete your profile before requesting a booking.
          </p>
          <button
            onClick={() => navigate("/complete-profile")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Complete Profile
          </button>
        </div>
      </div>
    );
  }

  if (hostelError || !hostel) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 p-4">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">Unable to Load</h2>
          <p className="text-gray-600 dark:text-slate-400 mb-6">
            {hostelError?.message || "Hostel not found"}
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

  if (isAdmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 p-4">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg max-w-md text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">Already Admitted</h2>
          <p className="text-gray-600 dark:text-slate-400 mb-6">
            You are already admitted to a hostel. Please vacate your current hostel before requesting a new one.
          </p>
          <button
            onClick={() => navigate("/student/dashboard")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (hasExistingRequest && !submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 p-4">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">Request Already Sent</h2>
          <p className="text-gray-600 dark:text-slate-400 mb-6">
            You already have a pending booking request. Please wait for the owner's response or cancel your existing request first.
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
              className="bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-800 dark:text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (submitted && submittedDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-lg w-full text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg shadow-green-200 dark:shadow-green-900/30">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
          <h1 className="mb-3 text-3xl font-bold text-slate-900 dark:text-white">Request Sent!</h1>
          <p className="mb-2 text-lg text-slate-600 dark:text-slate-300">Your booking request has been sent to</p>
          <p className="mb-8 text-2xl font-semibold text-blue-600 dark:text-blue-400">{submittedDetails.hostelName}</p>
          <div className="mb-8 rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800 p-5 text-left shadow-sm">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Your Request</p>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400">Floor</span>
              <span className="font-medium text-slate-800 dark:text-white">Floor {submittedDetails.floor}</span>
            </div>
            <div className="mt-2 flex justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400">Room</span>
              <span className="font-medium text-slate-800 dark:text-white">Room {submittedDetails.roomNumber}</span>
            </div>
          </div>
          <div className="mb-8 rounded-2xl border border-blue-100 bg-blue-50 dark:border-blue-900/30 dark:bg-blue-900/10 p-5 text-left">
            <div className="mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">What happens next</p>
            </div>
            <ol className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
              <li className="flex items-start gap-2"><span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-200 dark:bg-blue-800 text-xs font-bold text-blue-700 dark:text-blue-200">1</span>The hostel owner reviews your request</li>
              <li className="flex items-start gap-2"><span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-200 dark:bg-blue-800 text-xs font-bold text-blue-700 dark:text-blue-200">2</span>You get notified the moment they respond</li>
              <li className="flex items-start gap-2"><span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-200 dark:bg-blue-800 text-xs font-bold text-blue-700 dark:text-blue-200">3</span>If approved — your room is confirmed!</li>
            </ol>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button onClick={() => navigate("/student/my-requests")} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3.5 font-semibold text-white shadow-md transition-all hover:scale-105 hover:shadow-lg">
              <Bell className="h-4 w-4" />Track My Request<ArrowRight className="h-4 w-4" />
            </button>
            <button onClick={() => navigate("/student/dashboard")} className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 font-semibold text-slate-700 transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-white">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <button onClick={handleGoBack} className="flex items-center gap-2 text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white mb-6 transition">
          <ArrowLeft size={20} /><span>Back to Hostel Details</span>
        </button>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
            <h1 className="text-3xl font-bold mb-2">{hostel.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-blue-100">
              <div className="flex items-center gap-2"><MapPin size={18} /><span>{hostel.location}</span></div>
              <div className="flex items-center gap-2"><Building2 size={18} /><span>{hostel.type}</span></div>
              <div className="flex items-center gap-2"><IndianRupee size={18} /><span className="font-semibold">{hostel.price?.replace("₹", "").replace("/mo", "")}/month</span></div>
            </div>
          </div>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">Request Booking</h2>
            <p className="text-gray-600 dark:text-slate-400 mb-6">Fill in the details below to send a booking request to the hostel owner. They will review your request and respond shortly.</p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2 dark:text-white"><Home size={18} className="inline mr-2" />Select Floor *</label>
                <select value={selectedFloor} onChange={(e) => setSelectedFloor(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white outline-none transition">
                  <option value="">-- Choose Floor --</option>
                  {floorOptions.map((floor) => (
                    <option key={floor} value={floor}>Floor {floor}{floor === 1 && " (Ground Floor)"}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">This hostel has {hostel.floors} floor(s)</p>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 dark:text-white"><DoorOpen size={18} className="inline mr-2" />Preferred Room Number *</label>
                <input type="number" value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} min="1" required placeholder="e.g., 101, 205" className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white outline-none transition" />
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">The owner will verify room availability and confirm</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" size={20} />
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    <p className="font-semibold mb-1">Important Information:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Your request will be reviewed by the hostel owner</li>
                      <li>Room availability is subject to confirmation</li>
                      <li>You can track your request status in the dashboard</li>
                      <li>Only one pending request is allowed at a time</li>
                    </ul>
                  </div>
                </div>
              </div>
              <button type="submit" disabled={bookingMutation.isPending} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition flex items-center justify-center gap-2 text-lg">
                {bookingMutation.isPending ? (<><Loader2 size={24} className="animate-spin" />Sending Request...</>) : (<><CheckCircle size={24} />Send Booking Request</>)}
              </button>
            </form>
          </div>
        </div>
        <div className="mt-6 bg-white dark:bg-slate-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-3 dark:text-white">What happens next?</h3>
          <ol className="space-y-2 text-gray-600 dark:text-slate-400">
            <li className="flex items-start gap-3"><span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span><span>Your request will be sent to the hostel owner</span></li>
            <li className="flex items-start gap-3"><span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span><span>The owner will review your profile and request</span></li>
            <li className="flex items-start gap-3"><span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span><span>You'll be notified once the owner accepts or rejects</span></li>
            <li className="flex items-start gap-3"><span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span><span>If accepted, your hostel admission will be confirmed!</span></li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default BookingRequestPage;
