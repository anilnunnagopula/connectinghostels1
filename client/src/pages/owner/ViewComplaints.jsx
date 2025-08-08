import React, { useEffect, useState } from "react";
import {
  CircleAlert,
  Trash2,
  Home,
  User,
  BedDouble,
  Calendar,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ViewComplaints = () => {
  const navigate = useNavigate();
  const [hostels, setHostels] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [selectedHostel, setSelectedHostel] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch all hostels and all complaints for the logged-in owner
  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        throw new Error("Authentication token not found");
      }

      // Fetch hostels for the dropdown filter
      const hostelsRes = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/owner/hostels/my-hostels`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHostels(hostelsRes.data.hostels);

      // Set the first hostel as the default selected filter
      if (hostelsRes.data.hostels.length > 0) {
        setSelectedHostel(hostelsRes.data.hostels[0]._id);
      }

      // Fetch all complaints for the owner
      const complaintsRes = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/complaints/mine`, // New endpoint
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComplaints(complaintsRes.data.complaints);
    } catch (err) {
      console.error("❌ Error fetching data:", err.message);
      toast.error("Failed to fetch complaints.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (complaintId) => {
    if (window.confirm("Are you sure you want to delete this complaint?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(
          `${process.env.REACT_APP_API_URL}/api/complaints/${complaintId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Complaint resolved and deleted!");
        // Refresh the data to update the UI
        fetchData();
      } catch (err) {
        console.error("❌ Error deleting complaint:", err.message);
        toast.error("Failed to delete complaint.");
      }
    }
  };

  // Filter complaints based on the selected hostel
  const filteredComplaints = selectedHostel
    ? complaints.filter((complaint) => complaint.hostel._id === selectedHostel)
    : complaints;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white p-6 font-inter">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <CircleAlert className="text-red-500" /> Student Complaints
        </h1>

        {/* Hostel Filter Dropdown */}
        {hostels.length > 0 && (
          <div className="flex items-center gap-2">
            <Home className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <select
              value={selectedHostel}
              onChange={(e) => setSelectedHostel(e.target.value)}
              className="px-3 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            >
              {hostels.map((hostel) => (
                <option key={hostel._id} value={hostel._id}>
                  {hostel.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {loading ? (
        <p className="text-center text-gray-600 dark:text-gray-400">
          Loading complaints...
        </p>
      ) : filteredComplaints.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredComplaints.map((complaint) => (
              <motion.div
                key={complaint._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-red-500 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
                      <User className="text-blue-500 w-5 h-5" />
                      {complaint.student.name}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <Home className="w-4 h-4" />
                      Hostel: {complaint.hostel.name}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(complaint._id)}
                    className="p-2 rounded-full text-red-600 hover:bg-red-100 dark:hover:bg-gray-700 transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-2">
                  <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <BedDouble className="w-4 h-4 text-purple-500" />
                    Room: <strong>{complaint.room}</strong>
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong className="text-gray-800 dark:text-white">
                      Issue:
                    </strong>{" "}
                    {complaint.issue}
                  </p>
                  <p className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    Date: {new Date(complaint.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400 mt-6">
          🎉 No pending complaints.
        </p>
      )}
    </div>
  );
};

export default ViewComplaints;
