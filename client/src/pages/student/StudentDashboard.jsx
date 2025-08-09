import React, { useState, useEffect } from "react";
import {
  Building,
  BedDouble,
  IndianRupee,
  MailCheckIcon,
  ScrollText,
  Send,
  Loader2,
  ArrowRight,
  User,
  Lock,
  MapPin,
  Camera,
  CreditCard,
  Plus,
  Trash2,
} from "lucide-react";
import {
  FaGraduationCap,
  FaBuilding,
  FaHeart,
  FaUserAlt,
  FaCreditCard,
  FaBell,
  FaExclamationTriangle,
  FaQuestionCircle,
} from "react-icons/fa"; // ✅ FIXED: Added missing icons
import { useNavigate } from "react-router-dom";
import axios from "axios";
import HostelListings from "../HostelListings"; // Assuming this component exists

// The authentication token is retrieved from local storage
const getToken = () => localStorage.getItem("token");

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    hostelName: "N/A",
    roomNumber: "N/A",
    pendingFees: 0,
    pendingComplaints: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const studentData = localStorage.getItem("user");
    if (studentData) {
      setUser(JSON.parse(studentData));
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
          `${process.env.REACT_APP_API_URL}/api/student/dashboard/metrics`, // New endpoint
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setStats({
          hostelName: res.data.hostelName || "N/A",
          roomNumber: res.data.roomNumber || "N/A",
          pendingFees: res.data.pendingFees,
          pendingComplaints: res.data.pendingComplaints,
        });
      } catch (err) {
        console.error("Dashboard stats fetch failed ❌", err);
        setStats({
          hostelName: "N/A",
          roomNumber: "N/A",
          pendingFees: 0,
          pendingComplaints: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [navigate]);

  const cards = [
    {
      icon: <Building className="text-indigo-500" />,
      title: "Your Hostel",
      description: "Property assigned to you",
      value: stats.hostelName,
      route: "/student/my-hostel",
    },
    {
      icon: <BedDouble className="text-green-500" />,
      title: "Your Room",
      description: "Your assigned room number",
      value: stats.roomNumber,
      route: "/student/my-room",
    },
    {
      icon: <IndianRupee className="text-yellow-500" />,
      title: "Pending Fees",
      description: "Amount due for this month",
      value: `₹${stats.pendingFees.toLocaleString("en-IN")}`,
      route: "/student/payments",
    },
    {
      icon: <MailCheckIcon className="text-red-500" />,
      title: "Pending Complaints",
      description: "Complaints needing attention",
      value: stats.pendingComplaints,
      route: "/student/view-complaints",
    },
    // Adding the existing static cards from your provided code here
    {
      icon: <FaBuilding className="text-blue-600" />,
      title: "Browse Hostels",
      description: "Explore and find your perfect stay.",
      route: "/student/hostels",
    },
    {
      icon: <FaHeart className="text-pink-600" />,
      title: "Interested List",
      description: "View the hostels you've saved.",
      route: "/student/interested",
    },
    {
      icon: <FaUserAlt className="text-purple-600" />,
      title: "My Profile",
      description: "Update your personal information.",
      route: "/student/profile-settings",
    },
    {
      icon: <FaCreditCard className="text-green-600" />,
      title: "Payment History",
      description: "Review your past transactions.",
      route: "/student/payments",
    },
    {
      icon: <FaBell className="text-yellow-600" />,
      title: "Notifications",
      description: "Check updates and alerts.",
      route: "/student/notifications",
    },
    {
      icon: <FaExclamationTriangle className="text-red-600" />,
      title: "Raise a Complaint",
      description: "Report issues or concerns.",
      route: "/student/raise-complaint",
    },
    {
      icon: <FaQuestionCircle className="text-teal-600" />,
      title: "Contact Support",
      description: "Get help with any issues.",
      route: "/contact",
    },
    {
      icon: <FaBuilding className="text-indigo-600" />,
      title: "My Hostel",
      description: "Your current hostel and previous hostels",
      route: "/student/my-bookings",
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
        Welcome, {user?.name || "Student"}!{" "}
        <FaGraduationCap className="inline-block" />
      </h1>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {cards.map((stat, index) => (
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

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center items-center gap-4">
        <button
          onClick={() => navigate("/student/raise-complaint")}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow hover:scale-105 transition"
        >
          <Send size={18} />
          <span>Submit a Complaint</span>
        </button>
        <button
          onClick={() => navigate("/student/rules-and-regulations")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow hover:scale-105 transition"
        >
          <ScrollText size={18} />
          <span>Hostel Rules</span>
        </button>
        <button
          onClick={() => navigate("/student/payments")}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow hover:scale-105 transition"
        >
          <IndianRupee size={18} />
          <span>Make a Payment</span>
        </button>
      </div>

      {/* Explore Hostels Section */}
      <div className="mt-12 border-t border-slate-200 dark:border-slate-700 pt-8">
        <h2 className="text-3xl font-extrabold text-center mb-6 text-slate-800 dark:text-white tracking-wide">
          Explore Nearby Hostels
        </h2>
        <HostelListings />
      </div>
    </div>
  );
};

export default StudentDashboard;
