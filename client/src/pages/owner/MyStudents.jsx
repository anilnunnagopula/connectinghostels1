// File: MyStudents.jsx

import React from "react";
import { UserRound, Phone, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

const students = [
  { name: "Rahul Sharma", room: "101", phone: "9876543210" },
  { name: "Sneha Reddy", room: "202", phone: "8765432109" },
  { name: "Amit Verma", room: "303", phone: "9999888877" },
  { name: "Fatima Khan", room: "204", phone: "8888999900" },
];

const MyStudents = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-cyan-100 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">
        🎓 My Hostel Students
      </h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map((student, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 border-l-4 "
          >
            <div className="flex items-center gap-4 mb-3">
              <UserRound
                className="text-blue-600 dark:text-cyan-400"
                size={28}
              />
              <h2 className="text-xl font-semibold">{student.name}</h2>
            </div>
            <p className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <GraduationCap size={16} /> Room: {student.room}
            </p>
            <p className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mt-1">
              <Phone size={16} /> {student.phone}
            </p>
          </motion.div>
        ))}
      </div>

      {students.length === 0 && (
        <p className="text-center mt-2 text-gray-500 dark:text-gray-400">
          No students assigned yet.
        </p>
      )}
    </div>
  );
};

export default MyStudents;
