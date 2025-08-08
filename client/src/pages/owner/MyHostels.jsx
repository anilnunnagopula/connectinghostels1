import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Eye, Trash2, Home, Wifi, Bed, MapPin } from "lucide-react";
import axios from "axios";

const MyHostels = () => {
  const navigate = useNavigate();
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to handle fetching hostels
  const fetchHostels = async () => {
    setLoading(true);
    setError(null);
    try {
      const authToken = localStorage.getItem("token");
      if (!authToken) {
        throw new Error("Authentication token not found.");
      }

      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/owner/hostels/my-hostels`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`, // Sending auth token
          },
        }
      );
      // We are no longer merging with demo data; we replace it.
      setHostels(res.data.hostels);
    } catch (err) {
      console.error("❌ Error fetching hostels:", err);
      setError("Failed to fetch hostels. Please try again.");
      // Redirect to login if unauthorized
      if (err.response && err.response.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  // Effect hook to run the fetch function on component mount
  useEffect(() => {
    fetchHostels();
  }, []);

  // Handler for delete button
  const handleDelete = async (hostelId) => {
    if (window.confirm("Are you sure you want to delete this hostel?")) {
      alert(
        "⚠️ You have been warned... This will be implemented in the future"
      );
      // Add real delete logic here
      /*
      try {
        const authToken = localStorage.getItem("token");
        await axios.delete(
          `${process.env.REACT_APP_API_URL}/api/owner/hostels/${hostelId}`,
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        // After deletion, re-fetch the list to update the UI
        fetchHostels();
      } catch (err) {
        console.error("Error deleting hostel:", err);
        alert("Failed to delete hostel.");
      }
      */
    }
  };

  // UI rendering based on loading/error state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-xl text-gray-700 dark:text-gray-300">
          Loading your hostels...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  if (hostels.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-700 dark:text-gray-300">
          No Hostels Added
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          It looks like you haven't added any hostels yet.
        </p>
        <button
          onClick={() => navigate("/owner/add-hostel")}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition"
        >
          Add Your First Hostel
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white p-6 font-inter">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Home className="text-blue-500" /> My Hostels
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hostels.map((hostel) => (
          <div
            key={hostel._id} // Use MongoDB's _id for unique keys
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold mb-1">{hostel.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1">
              <MapPin className="w-4 h-4" /> {hostel.location}
            </p>
            <p className="text-sm mb-1 flex items-center gap-1">
              <Bed className="w-4 h-4" /> Category: {hostel.type}
            </p>
            {/* Rooms available is not in the model yet, so we'll hide it for now */}
            {/* <p className="text-sm mb-3 flex items-center gap-1">
              <Bed className="w-4 h-4" /> Rooms Available: {hostel.roomsAvailable}
            </p> */}

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => navigate(`/owner/hostel/${hostel._id}/edit`)}
                className="bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1 rounded flex items-center gap-1 text-sm transition"
              >
                <Pencil className="w-4 h-4" /> Edit
              </button>

              <button
                onClick={() => navigate(`/owner/hostel/${hostel._id}/view`)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1 text-sm transition"
              >
                <Eye className="w-4 h-4" /> View
              </button>

              <button
                onClick={() => handleDelete(hostel._id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1 text-sm transition"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyHostels;
