import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

// The authentication token is retrieved from local storage, as in other components
const getToken = () => localStorage.getItem("token");

const ViewRequests = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    setLoading(true);
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      // ✅ NEW: Fetch requests from the backend
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/owner/booking-requests/mine`, // New endpoint
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRequests(response.data.requests);
    } catch (err) {
      console.error("Error fetching requests:", err);
      toast.error("Failed to fetch booking requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (requestId, action) => {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      // ✅ NEW: Send an API call to approve or reject the request
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/owner/booking-requests/${requestId}/${action}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(
        `Request ${
          action === "approve" ? "approved" : "rejected"
        } successfully!`
      );
      fetchRequests(); // Re-fetch to update the list
    } catch (err) {
      console.error(`Error ${action}ing request:`, err);
      toast.error(`Failed to ${action} request.`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="p-6 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-white font-inter">
      <h2 className="text-2xl font-bold mb-4">📩 Booking Requests</h2>
      {requests.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No pending requests.
        </p>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req._id}
              className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-4 shadow flex flex-col sm:flex-row justify-between items-start sm:items-center"
            >
              <div>
                <p>
                  <strong>{req.student.name}</strong> wants to book room{" "}
                  <strong>{req.roomNumber}</strong> in{" "}
                  <strong>{req.hostel.name}</strong>
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Date: {new Date(req.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2 mt-4 sm:mt-0">
                <button
                  onClick={() => handleAction(req._id, "approve")}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded transition"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleAction(req._id, "reject")}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded transition"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewRequests;
