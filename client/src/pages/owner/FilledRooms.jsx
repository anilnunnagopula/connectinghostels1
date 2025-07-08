// File: FilledRooms.jsx

import React from "react";
import { CheckCircle, XCircle } from "lucide-react";

const demoRooms = [
  { roomNo: "101", isFilled: true, student: "Rahul Sharma" },
  { roomNo: "102", isFilled: false, student: null },
  { roomNo: "103", isFilled: true, student: "Amit Verma" },
  { roomNo: "104", isFilled: true, student: "Sneha Reddy" },
  { roomNo: "105", isFilled: false, student: null },
];

const FilledRooms = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white p-6">
      <h1 className="text-2xl font-bold mb-6">🛏️ Rooms & Filled Status</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {demoRooms.map((room, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 hover:shadow-lg transition"
          >
            <h2 className="text-lg font-semibold mb-1">Room {room.roomNo}</h2>
            {room.isFilled ? (
              <p className="text-green-600 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" /> Filled by {room.student}
              </p>
            ) : (
              <p className="text-red-500 flex items-center gap-2">
                <XCircle className="w-5 h-5" /> Vacant
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilledRooms;
