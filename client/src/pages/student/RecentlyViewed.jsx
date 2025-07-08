// File: RecentlyViewed.jsx

import React from "react";
import { useNavigate } from "react-router-dom";

const dummyViewedHostels = [
  {
    name: "Sai Krupa Boys Hostel",
    location: "Mangalpally",
    type: "Boys",
    price: "₹4800/mo",
    image: "https://source.unsplash.com/400x300/?hostel,room",
  },
  {
    name: "CoLive Orange Nest",
    location: "Mangalpally",
    type: "Co-Living",
    price: "₹5500/mo",
    image: "https://source.unsplash.com/400x300/?bedroom,dorm",
  },
  {
    name: "Anil Boys Premium Stay",
    location: "Mangalpally",
    type: "Boys",
    price: "₹5000/mo",
    image: "https://source.unsplash.com/400x300/?student,hostel",
  },
];

const RecentlyViewed = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 px-6 py-8 text-gray-800 dark:text-white">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">
        🕵️ Recently Viewed Hostels
      </h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {dummyViewedHostels.map((hostel, index) => (
          <div
            key={index}
            onClick={() => navigate("/hostels")}
            className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition hover:scale-[1.02] cursor-pointer"
          >
            <img
              src={hostel.image}
              alt={hostel.name}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-1">{hostel.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {hostel.location} • {hostel.type}
              </p>
              <p className="text-blue-600 dark:text-blue-400 font-medium mt-2">
                {hostel.price}
              </p>
            </div>
          </div>
        ))}
      </div>

      {dummyViewedHostels.length === 0 && (
        <p className="text-gray-600 dark:text-gray-400 mt-10 text-center">
          You haven't viewed any hostels yet.
        </p>
      )}
    </div>
  );
};

export default RecentlyViewed;
