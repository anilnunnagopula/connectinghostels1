import React, { useState } from "react";
import {
  IndianRupee,
  CreditCard,
  Landmark,
  Wallet,
  Download,
  CheckCircle,
  Clock,
} from "lucide-react";

// Dummy data to simulate what would come from an API
const dummyBillDetails = {
  hostelName: "Sunrise Boys Hostel",
  month: "August 2025",
  amount: 5000,
  dueDate: "August 5, 2025",
  status: "Pending",
};

const dummyPaymentHistory = [
  { id: "txn_123xyz", date: "July 1, 2025", amount: 5000, status: "Success" },
  { id: "txn_456abc", date: "June 2, 2025", amount: 5000, status: "Success" },
  { id: "txn_789def", date: "May 4, 2025", amount: 5000, status: "Success" },
];

const StudentPaymentsPage = () => {
  const [selectedMethod, setSelectedMethod] = useState("UPI");
  const [isPaying, setIsPaying] = useState(false);

  const handlePayment = (e) => {
    e.preventDefault();
    setIsPaying(true);
    // Simulate API call
    setTimeout(() => {
      alert("This is a UI demonstration. No real payment will be processed.");
      setIsPaying(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Make a Payment</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Bill and Payment Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Current Bill Section */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-semibold mb-4">Current Bill</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">
                    Hostel Name:
                  </span>
                  <span className="font-medium">
                    {dummyBillDetails.hostelName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">
                    Bill for Month:
                  </span>
                  <span className="font-medium">{dummyBillDetails.month}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">
                    Due Date:
                  </span>
                  <span className="font-medium">
                    {dummyBillDetails.dueDate}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-lg font-bold">Amount Due:</span>
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400 flex items-center">
                    <IndianRupee size={22} />
                    {dummyBillDetails.amount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Method Section */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-semibold mb-4">
                Choose Payment Method
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {["UPI", "Card", "Net Banking"].map((method) => (
                  <button
                    key={method}
                    onClick={() => setSelectedMethod(method)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center justify-center ${
                      selectedMethod === method
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                        : "border-slate-300 dark:border-slate-600 hover:border-blue-400"
                    }`}
                  >
                    {method === "UPI" && <Wallet size={24} className="mb-2" />}
                    {method === "Card" && (
                      <CreditCard size={24} className="mb-2" />
                    )}
                    {method === "Net Banking" && (
                      <Landmark size={24} className="mb-2" />
                    )}
                    <span className="text-sm font-medium">{method}</span>
                  </button>
                ))}
              </div>

              {/* Placeholder for form based on selection */}
              <div className="mt-4">
                {selectedMethod === "UPI" && (
                  <p className="text-sm text-center text-slate-500">
                    You will be redirected to your UPI app to complete the
                    payment.
                  </p>
                )}
                {selectedMethod === "Card" && (
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Card Number"
                      className="w-full p-2 rounded bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex gap-3">
                      <input
                        type="text"
                        placeholder="MM / YY"
                        className="w-1/2 p-2 rounded bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="CVV"
                        className="w-1/2 p-2 rounded bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}
                {selectedMethod === "Net Banking" && (
                  <p className="text-sm text-center text-slate-500">
                    You will be redirected to your bank's portal to complete the
                    payment.
                  </p>
                )}
              </div>

              <button
                onClick={handlePayment}
                disabled={isPaying}
                className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-green-700 disabled:bg-slate-400 transition-colors flex items-center justify-center"
              >
                {isPaying
                  ? "Processing..."
                  : `Pay ₹${dummyBillDetails.amount.toLocaleString(
                      "en-IN"
                    )} Now`}
              </button>
            </div>
          </div>

          {/* Right Column: Payment History */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-semibold mb-4">Payment History</h2>
              <div className="space-y-4">
                {dummyPaymentHistory.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-3"
                  >
                    <div>
                      <p className="font-medium">
                        ₹{item.amount.toLocaleString("en-IN")}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {item.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 px-2 py-1 rounded-full">
                        {item.status}
                      </span>
                      <button
                        title="Download Receipt"
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full"
                      >
                        <Download size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPaymentsPage;
