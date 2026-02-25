/**
 * PaymentsPage.jsx - Student Monthly Fee Payment Page
 *
 * Features:
 * - Display current hostel and monthly fee via React Query
 * - Integrated Razorpay payment gateway (via PayHostelFee component)
 * - Payment history from /api/payments/my-payments
 * - Only for ADMITTED students
 *
 * Route: /student/payments
 */

import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../apiConfig";
import PayHostelFee from "../../components/PayHostelFee";
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
import toast from "react-hot-toast";
import { useStudentPayments } from "../../hooks/useQueries";

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const PaymentsPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // ── Hostel / fee data ─────────────────────────────────────────────────────
  const {
    data: hostelData,
    isLoading: hostelLoading,
    error: hostelError,
  } = useQuery({
    queryKey: ["student-current-hostel"],
    queryFn: async () => {
      // Fetch student profile to get currentHostel ID
      const profileRes = await api.get("/api/students/my-hostel");
      const { currentHostel } = profileRes.data;
      if (!currentHostel) return null;

      // Fetch full hostel details
      const hostelRes = await api.get(`/api/hostels/${currentHostel}`);
      const details = hostelRes.data.hostel || hostelRes.data.data || hostelRes.data;

      let monthlyFee =
        details.monthlyFee ||
        parseInt((details.price || "").replace(/[^0-9]/g, "")) ||
        10; // ₹10 as test fallback

      return { hostelId: currentHostel, details, monthlyFee };
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  // ── Payment history ────────────────────────────────────────────────────────
  const { data: paymentsData, isLoading: historyLoading } = useStudentPayments();
  const paymentHistory = paymentsData?.payments || [];

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handlePaymentSuccess = useCallback(() => {
    toast.success("Payment successful! Your monthly fee has been paid.");
    queryClient.invalidateQueries({ queryKey: ["student-payments"] });
  }, [queryClient]);

  // ── Loading state ──────────────────────────────────────────────────────────
  if (hostelLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-slate-400">Loading payment details...</p>
        </div>
      </div>
    );
  }

  // ── Not admitted state ─────────────────────────────────────────────────────
  if (hostelError || !hostelData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-4">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">Not Admitted Yet</h2>
          <p className="text-gray-600 dark:text-slate-400 mb-6">
            You need to be admitted to a hostel before making payments.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate("/student/hostels")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Browse Hostels
            </button>
            <button
              onClick={() => navigate("/student-dashboard")}
              className="bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-800 dark:text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Main render ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate("/student-dashboard")}
          className="flex items-center gap-2 text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white mb-6 transition"
        >
          <ArrowLeft size={20} />
          <span>Back to Dashboard</span>
        </button>

        <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Monthly Fee Payment</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column — Payment Section */}
          <div>
            {/* Hostel Info */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Current Hostel</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Building2 className="text-blue-500" size={20} />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-slate-400">Hostel Name</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {hostelData.details.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <IndianRupee className="text-green-500" size={20} />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-slate-400">Monthly Fee</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      ₹{hostelData.monthlyFee.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="text-purple-500" size={20} />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-slate-400">Payment Due</p>
                    <p className="font-semibold text-orange-600 dark:text-orange-400">Every month</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Razorpay payment widget */}
            <PayHostelFee
              hostelId={hostelData.hostelId}
              amount={hostelData.monthlyFee}
              onSuccess={handlePaymentSuccess}
            />

            {/* Info box */}
            <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" size={20} />
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

          {/* Right Column — Payment History */}
          <div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Payment History</h2>

              {historyLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto" />
                </div>
              ) : paymentHistory.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-slate-400">
                  <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No payment history yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {paymentHistory.map((payment) => (
                    <div
                      key={payment._id}
                      className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg flex items-center justify-between"
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
                          <p className="text-sm text-gray-500 dark:text-slate-400">
                            {payment.hostel?.name && `${payment.hostel.name} · `}
                            {new Date(payment.createdAt).toLocaleDateString()}
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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;
