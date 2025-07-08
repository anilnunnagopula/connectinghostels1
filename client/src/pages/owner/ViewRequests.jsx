import React from "react";

const ViewRequests = () => {
  const requests = [
    {
      id: 1,
      studentName: "Amit Kumar",
      hostelName: "Sunrise Hostel",
      roomNumber: 104,
      date: "2025-06-30",
    },
    {
      id: 2,
      studentName: "Sneha Reddy",
      hostelName: "Harmony Girls Hostel",
      roomNumber: 202,
      date: "2025-06-29",
    },
  ];

  return (
    <div className="p-6 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-white">
      <h2 className="text-2xl font-bold mb-4">📩 Booking Requests</h2>

      {requests.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req.id}
              className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-4 shadow flex justify-between items-center"
            >
              <div>
                <p>
                  <strong>{req.studentName}</strong> wants to book room{" "}
                  <strong>{req.roomNumber}</strong> in{" "}
                  <strong>{req.hostelName}</strong>
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Date: {req.date}
                </p>
              </div>
              <div className="flex gap-2">
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded">
                  Approve
                </button>
                <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded">
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
