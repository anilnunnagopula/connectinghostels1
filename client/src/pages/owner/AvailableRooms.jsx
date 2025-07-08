// File: AvailableRooms.jsx (Hyderabadi Dum Biryani Version 🌶️)

import React, { useState } from "react";
import { BedDouble } from "lucide-react";
import { motion } from "framer-motion";

const allRooms = [
  { room: "101", category: "Boys", status: "Available" },
  { room: "102", category: "Girls", status: "Available" },
  { room: "103", category: "Co-Live", status: "Filled" },
  { room: "104", category: "Boys", status: "Available" },
  { room: "105", category: "Girls", status: "Filled" },
  { room: "106", category: "Co-Live", status: "Available" },
];

const AvailableRooms = () => {
  const [filter, setFilter] = useState("All");

  const filteredRooms =
    filter === "All"
      ? allRooms.filter((room) => room.status === "Available")
      : allRooms.filter(
          (room) => room.category === filter && room.status === "Available"
        );

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-200 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Available Rooms
      </h1>

      {/* Filter Buttons */}
      <div className="flex justify-center flex-wrap gap-4 mb-8">
        {["All", "Boys", "Girls", "Co-Live"].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-5 py-2 rounded-full border-2 font-semibold transition-all duration-300 ${
              filter === cat
                ? "bg-gradient-to-r from-pink-500 to-yellow-500 text-white shadow-lg scale-105"
                : "bg-white dark:bg-gray-700 dark:text-white text-gray-800 hover:scale-105"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Room Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 flex items-center gap-4 border border-yellow-300 dark:border-gray-700"
          >
            <div className="text-green-600 dark:text-green-400">
              <BedDouble size={28} />
            </div>
            <div>
              <h2 className="text-xl font-bold">
                Room <span className="text-yellow-500">{room.room}</span>
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Category: <strong>{room.category}</strong>
              </p>
              <p className="text-sm text-green-600 dark:text-green-400">
                ✅ {room.status}
              </p>
            </div>
          </motion.div>
        ))}
        {filteredRooms.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 col-span-full mt-4">
            😔 No available rooms in this category.
          </p>
        )}
      </div>
    </div>
  );
};

export default AvailableRooms;
