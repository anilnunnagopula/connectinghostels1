// File: ViewComplaints.jsx

import React from "react";
import { CircleAlert, Trash2 } from "lucide-react";

const complaints = [
  {
    student: "Rahul Sharma",
    room: "101",
    issue: "Wi-Fi not working",
    date: "2025-06-30",
  },
  {
    student: "Sneha Reddy",
    room: "202",
    issue: "Mess food quality is bad",
    date: "2025-06-29",
  },
  {
    student: "Amit Verma",
    room: "303",
    issue: "Water leakage in bathroom",
    date: "2025-06-28",
  },
];

const ViewComplaints = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white p-6">
      <h1 className="text-2xl font-bold mb-6">📮 Student Complaints</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md">
          <thead className="bg-gray-200 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left">Student</th>
              <th className="px-6 py-3 text-left">Room</th>
              <th className="px-6 py-3 text-left">Issue</th>
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((complaint, index) => (
              <tr
                key={index}
                className="border-t border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="px-6 py-4 flex items-center gap-2">
                  <CircleAlert className="text-yellow-500" />
                  {complaint.student}
                </td>
                <td className="px-6 py-4">{complaint.room}</td>
                <td className="px-6 py-4">{complaint.issue}</td>
                <td className="px-6 py-4">{complaint.date}</td>
                <td className="px-6 py-4">
                  <button className="text-red-600 hover:text-red-800 dark:text-red-400">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewComplaints;
