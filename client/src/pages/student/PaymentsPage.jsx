/**
 * PaymentsPage.jsx - Student Monthly Fee Payment Page
 *
 * Features:
 * - Display current hostel and monthly fee
 * - Integrated Razorpay payment gateway
 * - Payment history
 * - Only for ADMITTED students
 *
 * Route: /student/payments
 */

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PayHostelFee from "../../components/PayHostelFee"; // ✅ Import payment component
import {
  ArrowLeft,
  Building2,
  Calendar,
  AlertCircle,
  Loader2,
  IndianRupee,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { toast } from "react-toastify";

// ============================================================================
// CONSTANTS
// ============================================================================

const API_BASE_URL = process.env.REACT_APP_API_URL;
const getToken = () => localStorage.getItem("token");

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const PaymentsPage = () => {
  const navigate = useNavigate();

  // ==========================================================================
  // STATE MANAGEMENT
  // ==========================================================================

  const [state, setState] = useState({
    currentHostel: null,
    hostelDetails: null,
    monthlyFee: 0,
    loading: true,
    error: null,
  });

  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // ==========================================================================
  // DATA FETCHING
  // ==========================================================================

  /**
   * Fetch student's current hostel and fee details
   */
  const fetchHostelData = useCallback(async () => {
    const token = getToken();

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      console.log("📋 Fetching student hostel data...");

      // Get student's current hostel
      const response = await axios.get(
        `${API_BASE_URL}/api/students/my-requests`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const { currentHostel } = response.data;

      if (!currentHostel) {
        setState({
          currentHostel: null,
          hostelDetails: null,
          monthlyFee: 0,
          loading: false,
          error: "You are not admitted to any hostel yet.",
        });
        return;
      }

      // Fetch full hostel details to get monthly fee
      const hostelResponse = await axios.get(
        `${API_BASE_URL}/api/hostels/${currentHostel}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const hostelDetails = hostelResponse.data.data || hostelResponse.data;

      // Extract monthly fee from price string (e.g., "₹5000/mo" -> 5000)
      let monthlyFee =
        hostelDetails.monthlyFee ||
        parseInt(hostelDetails.price?.replace(/[^0-9]/g, "")) ||
        0;

      // ✅ FOR TESTING: Use ₹10 if fee is 0 or invalid
      if (monthlyFee === 0) {
        monthlyFee = 10; // ₹10 for testing payment gateway
        console.log("⚠️ Using test amount: ₹10 for payment gateway testing");
      }

      setState({
        currentHostel: currentHostel,
        hostelDetails: hostelDetails,
        monthlyFee: monthlyFee,
        loading: false,
        error: null,
      });

      console.log("✅ Hostel data loaded:", {
        hostel: hostelDetails.name,
        monthlyFee: monthlyFee,
      });
    } catch (err) {
      console.error("❌ Error fetching hostel data:", err);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err.response?.data?.message || "Failed to load hostel data.",
      }));
    }
  }, [navigate]);

  /**
   * Fetch payment history (optional - if you have this endpoint)
   */
  const fetchPaymentHistory = useCallback(async () => {
    const token = getToken();
    if (!token) return;

    try {
      setLoadingHistory(true);

      // TODO: Replace with your actual payment history endpoint
      const response = await axios.get(
        `${API_BASE_URL}/api/students/payment-history`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setPaymentHistory(response.data.payments || []);
      setLoadingHistory(false);
    } catch (err) {
      console.log("Payment history endpoint not available yet");
      setLoadingHistory(false);
      // Don't show error - this is optional
    }
  }, []);

  useEffect(() => {
    fetchHostelData();
    fetchPaymentHistory();
  }, [fetchHostelData, fetchPaymentHistory]);

  // ==========================================================================
  // EVENT HANDLERS
  // ==========================================================================

  /**
   * Handle successful payment
   */
  const handlePaymentSuccess = (paymentData) => {
    console.log("✅ Payment successful!", paymentData);

    toast.success("Payment successful! Your monthly fee has been paid.");

    // Refresh payment history
    fetchPaymentHistory();

    // Optional: Navigate to dashboard or show success page
    // navigate("/student-dashboard");
  };

  /**
   * Navigate back
   */
  const handleGoBack = () => {
    navigate("/student-dashboard");
  };

  // ==========================================================================
  // RENDER HELPERS
  // ==========================================================================

  /**
   * Render loading state
   */
  const renderLoading = () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">
          Loading payment details...
        </p>
      </div>
    </div>
  );

  /**
   * Render error/not admitted state
   */
  const renderNotAdmitted = () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl max-w-md text-center">
        <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">
          Not Admitted Yet
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {state.error ||
            "You need to be admitted to a hostel before making payments."}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate("/student/hostels")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Browse Hostels
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

  /**
   * Render payment history
   */
  const renderPaymentHistory = () => {
    if (loadingHistory) {
      return (
        <div className="text-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto" />
        </div>
      );
    }

    if (paymentHistory.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No payment history yet</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {paymentHistory.map((payment, index) => (
          <div
            key={index}
            className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              {payment.status === "success" ? (
                <CheckCircle className="text-green-500" size={20} />
              ) : (
                <XCircle className="text-red-500" size={20} />
              )}
              <div>
                <p className="font-semibold text-gray-800 dark:text-white">
                  ₹{payment.amount.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(payment.date).toLocaleDateString()}
                </p>
              </div>
            </div>
            <span
              className={`text-xs px-3 py-1 rounded-full font-semibold ${
                payment.status === "success"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              }`}
            >
              {payment.status}
            </span>
          </div>
        ))}
      </div>
    );
  };

  // ==========================================================================
  // MAIN RENDER
  // ==========================================================================

  if (state.loading) {
    return renderLoading();
  }

  if (state.error || !state.currentHostel || !state.hostelDetails) {
    return renderNotAdmitted();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <button
          onClick={handleGoBack}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition"
        >
          <ArrowLeft size={20} />
          <span>Back to Dashboard</span>
        </button>

        <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
          Monthly Fee Payment
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Payment Section */}
          <div>
            {/* Current Hostel Info */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                Current Hostel
              </h2>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Building2 className="text-blue-500" size={20} />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Hostel Name
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {state.hostelDetails.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <IndianRupee className="text-green-500" size={20} />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Monthly Fee
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      ₹{state.monthlyFee.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="text-purple-500" size={20} />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Payment Due
                    </p>
                    <p className="font-semibold text-orange-600 dark:text-orange-400">
                      Every month
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ✅ PAYMENT COMPONENT - THIS IS WHERE IT'S USED */}
            <PayHostelFee
              hostelId={state.currentHostel}
              amount={state.monthlyFee}
              onSuccess={handlePaymentSuccess}
            />

            {/* Important Info */}
            <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle
                  className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
                  size={20}
                />
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  <p className="font-semibold mb-1">Payment Information:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Pay your monthly hostel fee on time</li>
                    <li>Payment is due by the end of each month</li>
                    <li>Late payments may incur additional charges</li>
                    <li>You will receive a payment receipt via email</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Payment History */}
          <div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                Payment History
              </h2>
              {renderPaymentHistory()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;
