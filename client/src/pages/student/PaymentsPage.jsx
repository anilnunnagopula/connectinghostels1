import React, { useState, useEffect } from "react";
import {
  CreditCard,
  Building,
  Save,
  Loader2,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// The authentication token is retrieved from local storage, as in other components
const getToken = () => localStorage.getItem("token");

const PaymentSettings = () => {
  const navigate = useNavigate();
  const [bankDetails, setBankDetails] = useState({
    accountNumber: "",
    ifscCode: "",
    beneficiaryName: "",
    bankName: "",
  });
  const [upiId, setUpiId] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchPaymentDetails = async () => {
    setLoading(true);
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      // ✅ NEW: Fetch owner's payment details from the backend
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/owner/payment-settings`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.settings) {
        setBankDetails(res.data.settings.bankDetails || {});
        setUpiId(res.data.settings.upiId || "");
      }
    } catch (err) {
      console.error("Error fetching payment settings:", err);
      toast.error("Failed to fetch payment settings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentDetails();
  }, []);

  const handleBankChange = (e) => {
    const { name, value } = e.target;
    setBankDetails({ ...bankDetails, [name]: value });
  };

  const handleUpiChange = (e) => {
    setUpiId(e.target.value);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      // ✅ NEW: Save the owner's payment details to the backend
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/owner/payment-settings`,
        { bankDetails, upiId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Payment settings saved successfully!");
    } catch (err) {
      console.error("Error saving payment settings:", err);
      toast.error(err.response?.data?.message || "Failed to save settings.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-slate-900">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white p-4 sm:p-6 font-inter">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            <ArrowLeft />
          </button>
          <h1 className="text-3xl font-bold">Payment Settings</h1>
        </div>
        <form onSubmit={handleSave} className="space-y-8">
          {/* Bank Account Details */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Building size={24} className="text-blue-500" />
              Bank Account Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  name="accountNumber"
                  value={bankDetails.accountNumber}
                  onChange={handleBankChange}
                  className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500"
                  disabled={isSaving}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  IFSC Code
                </label>
                <input
                  type="text"
                  name="ifscCode"
                  value={bankDetails.ifscCode}
                  onChange={handleBankChange}
                  className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500"
                  disabled={isSaving}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Beneficiary Name
                </label>
                <input
                  type="text"
                  name="beneficiaryName"
                  value={bankDetails.beneficiaryName}
                  onChange={handleBankChange}
                  className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500"
                  disabled={isSaving}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Bank Name
                </label>
                <input
                  type="text"
                  name="bankName"
                  value={bankDetails.bankName}
                  onChange={handleBankChange}
                  className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500"
                  disabled={isSaving}
                />
              </div>
            </div>
          </div>

          {/* UPI Details */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <CreditCard size={24} className="text-blue-500" />
              UPI Details
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Enter your UPI ID to receive payments directly.
            </p>
            <div>
              <label className="block text-sm font-medium mb-1">UPI ID</label>
              <input
                type="text"
                name="upiId"
                value={upiId}
                onChange={handleUpiChange}
                className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500"
                disabled={isSaving}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-green-700 disabled:bg-slate-400 transition-colors flex items-center justify-center gap-2"
          >
            {isSaving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save />}
            {isSaving ? "Saving..." : "Save Payment Details"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentSettings;
