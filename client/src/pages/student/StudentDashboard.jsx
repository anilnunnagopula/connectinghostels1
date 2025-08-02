import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaEye,
  FaHeart,
  FaSearch,
  FaUserAlt,
  FaCreditCard,
  FaBell,
  FaBuilding,
  FaQuestionCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import HostelListings from "../HostelListings";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const userData = localStorage.getItem("user");
      if (!userData) throw new Error("No user data found");

      const parsedUser = JSON.parse(userData);
      if (!parsedUser || parsedUser.role !== "student") {
        throw new Error("Invalid user data or not a student");
      }
      setUser(parsedUser);
    } catch (error) {
      console.error("Error loading user data:", error.message);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const stats = [
    {
      icon: <FaEye className="text-blue-500 dark:text-blue-400 text-2xl" />,
      label: "Hostels Viewed",
      value: 8,
    },
    {
      icon: <FaHeart className="text-pink-500 dark:text-pink-400 text-2xl" />,
      label: "Interested",
      value: 3,
    },
    {
      icon: (
        <FaSearch className="text-purple-500 dark:text-purple-400 text-2xl" />
      ),
      label: "Recent Searches",
      value: 5,
    },
  ];

  const cards = [
    {
      icon: <FaBuilding />,
      title: "Browse Hostels",
      description: "Explore and find your perfect stay.",
      route: "/student/hostels",
    },
    {
      icon: <FaHeart />,
      title: "Interested List",
      description: "View the hostels you've saved.",
      route: "/student/interested",
    },
    {
      icon: <FaUserAlt />,
      title: "My Profile",
      description: "Update your personal information.",
      route: "/student/profile-settings",
    },
    {
      icon: <FaCreditCard />,
      title: "Payment History",
      description: "Review your past transactions.",
      route: "/student/payments",
    },
    {
      icon: <FaBell />,
      title: "Notifications",
      description: "Check updates and alerts.",
      route: "/student/notifications",
    },
    {
      icon: <FaExclamationTriangle />,
      title: "Raise a Complaint",
      description: "Report issues or concerns.",
      route: "/student/raise-complaint",
    },
    {
      icon: <FaQuestionCircle />,
      title: "Contact Support",
      description: "Get help with any issues.",
      route: "/contact",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-2xl text-slate-500">Loading Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
            <span>Welcome, {user?.name || "Student"}</span>
            <span>👋</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Here's your activity overview and quick actions.
          </p>
        </div>

        {/* Stats Bar
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-md flex items-center gap-5"
            >
              <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded-full">
                {stat.icon}
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div> */}

        {/* Action Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {cards.map((card, index) => (
            <div
              key={index}
              onClick={() => navigate(card.route)}
              className="bg-white dark:bg-slate-800 shadow-md rounded-xl p-6 hover:shadow-xl hover:scale-[1.03] transition-all duration-300 cursor-pointer flex flex-col items-start"
            >
              <div className="flex items-center gap-3 mb-3 text-slate-800 dark:text-white">
                <span className="text-lg">{card.icon}</span>
                <h2 className="text-lg font-bold">{card.title}</h2>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                {card.description}
              </p>
            </div>
          ))}
        </div>

        {/* Explore Hostels Section */}
        <div className="border-t border-slate-200 dark:border-slate-700 pt-8">
          <h2 className="text-3xl font-extrabold text-center mb-6 text-slate-800 dark:text-white tracking-wide flex items-center justify-center gap-3">
            <span>🏠</span>
            <span>Explore Nearby Hostels</span>
          </h2>
          <HostelListings />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
