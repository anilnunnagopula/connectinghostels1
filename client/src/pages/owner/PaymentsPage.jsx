import React, { useState, useEffect, useCallback } from "react";
import {
  Loader2,
  Plus,
  Trash2,
  ArrowLeft,
  Building,
  CreditCard,
  CheckCircle,
  Clock,
  Download,
  IndianRupee,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

// The authentication token is retrieved from local storage
const getToken = () => localStorage.getItem("token");

const PaymentsPage = () => {
  const navigate = useNavigate();
  const [payoutMethods, setPayoutMethods] = useState([]);
  const [payoutHistory, setPayoutHistory] = useState([]);
  const [newMethodForm, setNewMethodForm] = useState({
    type: "BANK_TRANSFER",
    details: {
      accountNumber: "",
      ifscCode: "",
      bankName: "",
      accountHolderName: "",
      upiId: "",
    },
    isDefault: false,
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // --- Fetch Payout Methods and History ---
  const fetchData = useCallback(async () => {
    setLoading(true);
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const [methodsRes, historyRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/api/owner/payout-methods`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${process.env.REACT_APP_API_URL}/api/owner/payout-history`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setPayoutMethods(methodsRes.data.methods); // ✅ Corrected to match backend response
      setPayoutHistory(historyRes.data.history);
    } catch (err) {
      console.error("Error loading payment data:", err);
      toast.error(err.response?.data?.message || "Error loading payment data.");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "type") {
      setNewMethodForm((prev) => ({
        ...prev,
        type: value,
        details: {
          accountNumber: "",
          upiId: "",
          ifscCode: "",
          bankName: "",
          accountHolderName: "",
        },
      }));
    } else if (type === "checkbox") {
      setNewMethodForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setNewMethodForm((prev) => ({
        ...prev,
        details: { ...prev.details, [name]: value },
      }));
    }
  };

  const performApiAction = async (method, url, data = null) => {
    setSubmitting(true);
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      let response;
      if (method === "POST") {
        response = await axios.post(url, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else if (method === "PUT") {
        response = await axios.put(url, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else if (method === "DELETE") {
        response = await axios.delete(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      toast.success(response.data.message || "Action successful!");
      fetchData(); // Re-fetch all data to update the UI
    } catch (err) {
      console.error("API Action Error:", err);
      toast.error(err.response?.data?.message || "An error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitNewMethod = (e) => {
    e.preventDefault();
    performApiAction(
      "POST",
      `${process.env.REACT_APP_API_URL}/api/owner/payout-methods`,
      newMethodForm
    );
  };

  const handleSetDefault = (methodId) => {
    performApiAction(
      "PUT",
      `${process.env.REACT_APP_API_URL}/api/owner/payout-methods/${methodId}/default`,
      {}
    );
  };

  const handleDeleteMethod = (methodId) => {
    if (!window.confirm("Are you sure you want to delete this payout method?"))
      return;
    performApiAction(
      "DELETE",
      `${process.env.REACT_APP_API_URL}/api/owner/payout-methods/${methodId}`
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 sm:p-6 text-slate-800 dark:text-white font-inter">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            <ArrowLeft />
          </button>
          <h2 className="text-3xl font-bold text-center flex-1">
            Payment Methods & History
          </h2>
        </div>

        {/* Add New Payout Method Form */}
        <section className="mb-10 p-6 border border-slate-200 dark:border-slate-700 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-slate-800 dark:text-white flex items-center gap-2">
            <Plus size={20} />
            Add New Payout Method
          </h3>
          <form
            onSubmit={handleSubmitNewMethod}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <label className="block text-sm font-medium mb-1">
                Method Type
              </label>
              <select
                name="type"
                value={newMethodForm.type}
                onChange={handleFormChange}
                disabled={submitting}
                className="w-full p-2 rounded bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500"
              >
                <option value="BANK_TRANSFER">Bank Transfer</option>
                <option value="UPI">UPI</option>
              </select>
            </div>
            {newMethodForm.type === "BANK_TRANSFER" ? (
              <>
                <div>
                  <label className="block text-sm mb-1">Account Number</label>
                  <input
                    type="text"
                    name="accountNumber"
                    value={newMethodForm.details.accountNumber}
                    onChange={handleFormChange}
                    required
                    disabled={submitting}
                    className="w-full p-2 rounded bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">IFSC Code</label>
                  <input
                    type="text"
                    name="ifscCode"
                    value={newMethodForm.details.ifscCode}
                    onChange={handleFormChange}
                    required
                    disabled={submitting}
                    className="w-full p-2 rounded bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Bank Name</label>
                  <input
                    type="text"
                    name="bankName"
                    value={newMethodForm.details.bankName}
                    onChange={handleFormChange}
                    required
                    disabled={submitting}
                    className="w-full p-2 rounded bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    name="accountHolderName"
                    value={newMethodForm.details.accountHolderName}
                    onChange={handleFormChange}
                    required
                    disabled={submitting}
                    className="w-full p-2 rounded bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            ) : (
              <div>
                <label className="block text-sm mb-1">UPI ID</label>
                <input
                  type="text"
                  name="upiId"
                  value={newMethodForm.details.upiId}
                  onChange={handleFormChange}
                  required
                  disabled={submitting}
                  className="w-full p-2 rounded bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
            <div className="md:col-span-2 flex items-center">
              <input
                type="checkbox"
                name="isDefault"
                id="isDefault"
                checked={newMethodForm.isDefault}
                onChange={handleFormChange}
                disabled={submitting}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
              />
              <label htmlFor="isDefault" className="ml-2 text-sm">
                Set as default payout method
              </label>
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 text-white px-6 py-2.5 rounded-md hover:bg-blue-700 transition font-semibold disabled:opacity-50"
              >
                {submitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Add Payout Method"
                )}
              </button>
            </div>
          </form>
        </section>

        {/* Existing Payout Methods */}
        <section className="mb-10">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            Your Payout Methods
            <span className="text-sm font-normal text-slate-500">
              ({payoutMethods.length})
            </span>
          </h3>
          <div className="space-y-4">
            {payoutMethods.length === 0 ? (
              <p className="text-slate-500">No payout methods added yet.</p>
            ) : (
              payoutMethods.map((method) => (
                <div
                  key={method._id}
                  className="bg-slate-100 dark:bg-slate-700 rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center"
                >
                  <div>
                    <p className="font-bold">
                      {method.type === "BANK_TRANSFER"
                        ? "Bank Transfer"
                        : "UPI"}
                    </p>
                    {method.type === "BANK_TRANSFER" ? (
                      <>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          Account: ****{method.details.accountNumber.slice(-4)}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          Bank: {method.details.bankName}
                        </p>
                      </>
                    ) : (
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        ID: {method.details.upiId}
                      </p>
                    )}
                    {method.isDefault && (
                      <span className="mt-1 inline-block bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-semibold">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-2 mt-3 md:mt-0 self-end md:self-center">
                    {!method.isDefault && (
                      <button
                        onClick={() => handleSetDefault(method._id)}
                        disabled={submitting}
                        className="bg-slate-200 dark:bg-slate-600 text-xs px-3 py-1.5 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500 transition disabled:opacity-50"
                      >
                        Set Default
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteMethod(method._id)}
                      disabled={submitting}
                      className="bg-red-100 dark:bg-red-900/50 text-red-600 px-3 py-1.5 rounded-md text-xs hover:bg-red-200 dark:hover:bg-red-900 transition disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Payout History */}
        <section>
          <h3 className="text-xl font-semibold mb-4">Payout History</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
              <thead className="bg-slate-100 dark:bg-slate-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase">
                    Method
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                {payoutHistory.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-4 py-3 text-center text-sm text-slate-500"
                    >
                      No payout history found.
                    </td>
                  </tr>
                ) : (
                  payoutHistory.map((payout) => (
                    <tr key={payout._id}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        {new Date(payout.processedAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-green-600">
                        ₹{payout.amount.toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        {payout.payoutMethodDetailsSnapshot?.type.replace(
                          "_",
                          " "
                        ) || "N/A"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            payout.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {payout.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PaymentsPage;
