import React from "react";
import AddHostel from "./AddHostel";
import {
  Building,
  BedDouble,
  Users,
  PlusCircle,
  MailCheckIcon,
  Settings,
} from "lucide-react";
import { FaRestroom } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const OwnerDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 text-gray-800 dark:text-white">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">🏠 Welcome! Owner</h1>

      {/* 🔢 Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {[
          {
            icon: <Building />,
            title: "Total Hostels",
            value: 3,
            route: "/owner/my-hostels",
          },
          {
            icon: <BedDouble />,
            title: "Rooms Filled",
            value: 24,
            route: "/owner/filledrooms",
          },
          {
            icon: <Users />,
            title: "Students",
            value: 45,
            route: "/owner/my-students",
          },
          {
            icon: <MailCheckIcon />,
            title: "View Complaints",
            value: 12,
            route: "/owner/view-complaints",
          },
          {
            icon: <FaRestroom />,
            title: "Available Rooms",
            value: 17,
            route: "/owner/available-rooms",
          },
          // { icon: <Settings />, title: "My Profile", value: "Edit/View" },
        ].map((stat, index) => (
          <div
            key={index}
            onClick={() => navigate(stat.route)}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg hover:scale-[1.03] transition-all duration-300 group"
          >
            <div className="flex items-center gap-3">
              <div className="text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-all">
                {stat.icon}
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.title}
                </p>
                <h3 className="text-xl font-semibold">{stat.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ✨ Actions */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-5">
        <button
          onClick={() => navigate("/owner/add-hostel")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow hover:scale-105 transition"
        >
          <PlusCircle size={18} /> Add New Hostel
        </button>

        <button
          onClick={() => navigate("/owner/view-requests")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow hover:scale-105 transition"
        >
          View Requests
        </button>
        <button
          onClick={() => navigate("/owner/add-student")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow hover:scale-105 transition"
        >
          Add New Student
        </button>
        <button
          onClick={() => navigate("/owner/send-alerts")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow hover:scale-105 transition"
        >
          Send Messages/Alerts
        </button>
      </div>
    </div>
  );
};
export default OwnerDashboard;
