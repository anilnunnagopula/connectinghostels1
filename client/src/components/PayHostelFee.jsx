/**
 * PayHostelFee.jsx - FIXED Payment Component
 *
 * Usage: <PayHostelFee hostelId="123" amount={5000} onSuccess={handleSuccess} />
 * Note: amount should be in rupees (e.g., 5000 for ₹5000)
 */
import React, { useState } from "react";
import axios from "axios";
import { Loader2, IndianRupee, CheckCircle, XCircle } from "lucide-react";

const API_BASE_URL = process.env.REACT_APP_API_URL;
const getToken = () => localStorage.getItem("token");

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
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' or 'failed'

  const handlePayment = async () => {
    // ✅ FIX 1: Better validation with clear error messages
    if (!hostelId) {
      alert("Hostel ID is required");
      return;
    }

    if (amount === undefined || amount === null) {
      alert("Amount is required");
      return;
    }

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert(
        `Invalid amount: ${amount}. Please provide a valid amount greater than 0.`,
      );
      return;
    }

    // Step 1: Load Razorpay script
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      alert("Failed to load payment gateway. Please check your internet.");
      return;
    }

    const token = getToken();
    if (!token) {
      alert("Please login first");
      return;
    }

    try {
      setLoading(true);
      setStatus(null);

      // ✅ FIX 2: Convert rupees to paise (Razorpay expects paise)
      const amountInPaise = Math.round(numAmount * 100);

      console.log("💰 Payment Details:", {
        hostelId,
        amountInRupees: numAmount,
        amountInPaise: amountInPaise,
      });

      // Step 2: Create order on backend
      const orderResponse = await axios.post(
        `${API_BASE_URL}/api/payments/create-order`,
        {
          amount: amountInPaise, // Send in paise
          hostelId: hostelId,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const { order, key_id } = orderResponse.data;

      console.log("📦 Order created:", order);

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
            const verifyResponse = await axios.post(
              `${API_BASE_URL}/api/payments/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                amount: order.amount,
                hostelId: hostelId,
              },
              { headers: { Authorization: `Bearer ${token}` } },
            );

            console.log("✅ Payment verified:", verifyResponse.data);
            setStatus("success");
            if (onSuccess) {
              onSuccess(verifyResponse.data);
            }
          } catch (err) {
            console.error("❌ Payment verification failed:", err);
            setStatus("failed");
            alert("Payment verification failed. Please contact support.");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: "Student Name", // TODO: Get from user data
          email: "student@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#3B82F6", // Blue color
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            console.log("Payment cancelled by user");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error("❌ Payment error:", err);
      setLoading(false);
      setStatus("failed");

      // ✅ FIX 3: Better error messages
      const errorMessage =
        err.response?.data?.message || err.message || "Unknown error";
      alert(`Failed to initiate payment: ${errorMessage}`);
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
