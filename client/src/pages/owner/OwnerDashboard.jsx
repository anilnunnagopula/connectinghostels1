import React, { useState, useEffect } from "react";
import {
  Building,
  BedDouble,
  Users,
  PlusCircle,
  MailCheckIcon,
  CreditCard,
  Settings,
  Send,
  ScrollText,
  GitPullRequest,
  UserPlus,
  Loader2,
} from "lucide-react";
import { FaRestroom } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// The authentication token is retrieved from local storage, as in other components
const getToken = () => localStorage.getItem("token");

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalHostels: 0,
    roomsFilled: 0,
    totalStudents: 0,
    complaints: 0,
    availableRooms: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user name for welcome message
    const ownerData = localStorage.getItem("user");
    if (ownerData) {
      setUser(JSON.parse(ownerData));
    }

    const fetchDashboardStats = async () => {
      setLoading(true);
      const token = getToken();
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/owner/dashboard/metrics`, // New endpoint
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setStats({
          totalHostels: res.data.totalHostels,
          roomsFilled: res.data.roomsFilled,
          totalStudents: res.data.studentsCount,
          complaints: res.data.complaintsCount,
          availableRooms: res.data.availableRooms,
        });
      } catch (err) {
        console.error("Dashboard stats fetch failed ❌", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [navigate]);

  const statCards = [
    {
      icon: <Building className="text-indigo-500" />,
      title: "Total Hostels",
      description: "Properties you manage",
      value: stats.totalHostels,
      route: "/owner/my-hostels",
    },
    {
      icon: <BedDouble className="text-green-500" />,
      title: "Rooms Filled",
      description: "Currently occupied",
      value: stats.roomsFilled,
      route: "/owner/filled-rooms",
    },
    {
      icon: <Users className="text-purple-500" />,
      title: "Total Students",
      description: "Across all properties",
      value: stats.totalStudents,
      route: "/owner/my-students",
    },
    {
      icon: <MailCheckIcon className="text-red-500" />,
      title: "Pending Complaints",
      description: "Needs your attention",
      value: stats.complaints,
      route: "/owner/view-complaints",
    },
    {
      icon: <FaRestroom className="text-blue-500" />,
      title: "Available Rooms",
      description: "Ready for booking",
      value: stats.availableRooms,
      route: "/owner/available-rooms",
    },
    {
      icon: <BedDouble className="text-orange-500" />,
      title: "Manage Rooms",
      description: "Edit, toggle, and view rooms",
      value: stats.roomsFilled + stats.availableRooms,
      route: "/owner/manage-rooms",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 sm:p-6 text-slate-800 dark:text-white">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">
        Welcome, {user?.name || "Owner"}! 👋
      </h1>

      {/* Quick Stats (Polished Cards with NO shadow) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {statCards.map((stat, index) => (
          <div
            key={index}
            onClick={() => navigate(stat.route)}
            className="bg-white dark:bg-slate-800 p-5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors duration-300 group cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded-lg">
                {stat.icon}
              </div>
              <div>
                <p className="font-semibold text-slate-700 dark:text-slate-200">
                  {stat.title}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {stat.description}
                </p>
              </div>
            </div>
            <p className="text-3xl font-bold mt-4">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Actions (Original UI with new buttons) */}
      <div className="flex flex-wrap justify-center items-center gap-4">
        <button
          onClick={() => navigate("/owner/add-hostel")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow hover:scale-105 transition"
        >
          <PlusCircle size={18} />
          <span>Add New Hostel</span>
        </button>
        <button
          onClick={() => navigate("/owner/view-requests")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow hover:scale-105 transition"
        >
          <GitPullRequest size={18} />
          <span>View Requests</span>
        </button>
        <button
          onClick={() => navigate("/owner/add-student")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow hover:scale-105 transition"
        >
          <UserPlus size={18} />
          <span>Add New Student</span>
        </button>
        <button
          onClick={() => navigate("/owner/send-alerts")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow hover:scale-105 transition"
        >
          <Send size={18} />
          <span>Send Messages/Alerts</span>
        </button>
        <button
          onClick={() => navigate("/owner/rules-and-regulations")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow hover:scale-105 transition"
        >
          <ScrollText size={18} />
          <span>Rules & Regulations</span>
        </button>
        {/* --- New Buttons --- */}
        <button
          onClick={() => navigate("/owner/payment-settings")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow hover:scale-105 transition"
        >
          <CreditCard size={18} />
          <span>Payment Methods</span>
        </button>
        <button
          onClick={() => navigate("/owner/profile-settings")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow hover:scale-105 transition"
        >
          <Settings size={18} />
          <span>Profile Settings</span>
        </button>
      </div>
    </div>
  );
};

export default OwnerDashboard;
