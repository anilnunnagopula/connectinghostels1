// File: MyHostels.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Eye, Trash2 } from "lucide-react";

const demoHostels = [
  {
    id: 1,
    name: "Anil Boys Hostel",
    location: "Mangalpally, Hyderabad",
    category: "Boys",
    roomsAvailable: 8,
  },
  {
    id: 2,
    name: "Sunrise Girls Hostel",
    location: "LB Nagar, Hyderabad",
    category: "Girls",
    roomsAvailable: 5,
  },
  {
    id: 3,
    name: "Unity Co-live Hostel",
    location: "Ibrahimpatnam, Hyderabad",
    category: "Co-Live",
    roomsAvailable: 10,
  },
];

const MyHostels = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white p-6">
      <h1 className="text-2xl font-bold mb-6">🏠 My Hostels</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {demoHostels.map((hostel) => (
          <div
            key={hostel.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold mb-1">{hostel.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              📍 {hostel.location}
            </p>
            <p className="text-sm mb-1">🏷️ Category: {hostel.category}</p>
            <p className="text-sm mb-3">
              🛏️ Rooms Available: {hostel.roomsAvailable}
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => navigate(`/owner/hostel/${hostel.id}/edit`)}
                className="bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1 rounded flex items-center gap-1 text-sm"
              >
                <Pencil className="w-4 h-4" /> Edit
              </button>

              <button
                onClick={() => navigate(`/owner/hostel/${hostel.id}/view`)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1 text-sm"
              >
                <Eye className="w-4 h-4" /> View
              </button>

              <button
                onClick={() => alert("Delete logic here")}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1 text-sm"
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
