/**
 * PayHostelFee.jsx - FIXED Payment Component
 *
 * Usage: <PayHostelFee hostelId="123" amount={5000} onSuccess={handleSuccess} />
 * Note: amount should be in rupees (e.g., 5000 for ₹5000)
 */
import React, { useState } from "react";
import api from "../apiConfig";
import { Loader2, IndianRupee, CheckCircle, XCircle } from "lucide-react";
import toast from 'react-hot-toast';

// Load Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const PayHostelFee = ({ hostelId, amount, onSuccess }) => {
  // Get user info for Razorpay prefill (non-sensitive — stored in localStorage for UI)
  const storedUser = (() => {
    try { return JSON.parse(localStorage.getItem("user") || "{}"); }
    catch { return {}; }
  })();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' or 'failed'

  const handlePayment = async () => {
    // ✅ FIX 1: Better validation with clear error messages
    if (!hostelId) {
      toast.error("Hostel ID is required");
      return;
    }

    if (amount === undefined || amount === null) {
      toast.error("Amount is required");
      return;
    }

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error("Invalid payment amount. Must be greater than 0.");
      return;
    }

    // Step 1: Load Razorpay script
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      toast.error("Failed to load payment gateway");
      return;
    }

    // Auth is via httpOnly cookie — no localStorage token needed
    // The api instance already sends the cookie automatically (withCredentials: true)

    try {
      setLoading(true);
      setStatus(null);

      // ✅ FIX 2: Convert rupees to paise (Razorpay expects paise)
      const amountInPaise = Math.round(numAmount * 100);

      // Step 2: Create order on backend
      const orderResponse = await api.post(
        `/api/payments/create-order`,
        {
          amount: amountInPaise, // Send in paise
          hostelId: hostelId,
        },
      );

      const { order, key_id } = orderResponse.data;


      // Step 3: Open Razorpay Checkout
      const options = {
        key: key_id,
        amount: order.amount,
        currency: order.currency,
        name: "ConnectingHostels",
        description: "Hostel Fee Payment",
        order_id: order.id,
        handler: async function (response) {
          // Step 4: Verify payment on backend
          try {
            const verifyResponse = await api.post(
              `/api/payments/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                amount: order.amount,
                hostelId: hostelId,
              },
            );

            setStatus("success");
            if (onSuccess) {
              onSuccess(verifyResponse.data);
            }
          } catch (err) {
            setStatus("failed");
            toast.error("Payment verification failed. Please contact support.");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: storedUser.name || "",
          email: storedUser.email || "",
          contact: storedUser.phone || "",
        },
        theme: {
          color: "#3B82F6", // Blue color
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      setLoading(false);
      setStatus("failed");
      const errorMessage = err.response?.data?.message || err.message || "Unknown error";
      toast.error(`Payment failed: ${errorMessage}`);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Pay Hostel Fee
      </h2>

      {/* Amount Display */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <div className="text-sm text-gray-600 mb-1">Amount to Pay</div>
        <div className="flex items-center text-3xl font-bold text-gray-800">
          <IndianRupee className="w-8 h-8" />
          {(amount || 0).toLocaleString()}
        </div>
      </div>

      {/* Payment Status */}
      {status === "success" && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 text-green-700 font-semibold mb-2">
            <CheckCircle className="w-5 h-5" />
            Payment Successful!
          </div>
          <div className="text-sm text-green-600">
            Your payment has been processed successfully.
          </div>
        </div>
      )}

      {status === "failed" && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 text-red-700 font-semibold mb-2">
            <XCircle className="w-5 h-5" />
            Payment Failed
          </div>
          <div className="text-sm text-red-600">
            Please try again or contact support.
          </div>
        </div>
      )}

      {/* Pay Button */}
      <button
        onClick={handlePayment}
        disabled={loading || status === "success"}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 
                   text-white font-semibold py-3 px-6 rounded-lg 
                   flex items-center justify-center gap-2 transition-colors"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : status === "success" ? (
          <>
            <CheckCircle className="w-5 h-5" />
            Payment Completed
          </>
        ) : (
          <>
            <IndianRupee className="w-5 h-5" />
            Pay Now via UPI/QR
          </>
        )}
      </button>

      {/* Info */}
      <div className="mt-4 text-center text-sm text-gray-500">
        Supports UPI, QR Code, PhonePe, Google Pay, Paytm, and more
      </div>
    </div>
  );
};

export default PayHostelFee;
