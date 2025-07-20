import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaHeart, FaSearch } from "react-icons/fa";
//to render hostel under the customer dashboard bottom
import HostelListings from "../HostelListings";
const StudentDashboard = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    // Safely get and parse user data
    try {
      const userData = localStorage.getItem("user");

      if (!userData) {
        throw new Error("No user data found");
      }

      const parsedUser = JSON.parse(userData);

      if (!parsedUser || parsedUser.role !== "student") {
        throw new Error("Invalid user data or not a student");
      }

      setUser(parsedUser);
    } catch (error) {
      console.error("Error loading user data:", error);
      // Clear invalid data and redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const stats = [
    {
      icon: <FaEye className="text-blue-500 text-2xl" />,
      label: "Hostels Viewed",
      value: 8,
    },
    {
      icon: <FaHeart className="text-pink-500 text-2xl" />,
      label: "Interested",
      value: 3,
    },
    {
      icon: <FaSearch className="text-purple-500 text-2xl" />,
      label: "Recent Searches",
      value: 5,
    },
  ];

  const cards = [
    {
      title: "🏠 Browse Hostels",
      description: "Explore available hostels in your area.",
      route: "/student/hostels",
    },
    {
      title: "💖 Interested",
      description: "List of your Interested Hostels",
      route: "/student/interested",
    },
    {
      title: "🔔 Notifications",
      description: "See Your Notifications",
      route: "/student/notifications",
    },
    {
      title: "🕵️‍♂️ Recently Viewed",
      description: "See your recently visited hostels",
      route: "/student/recently-viewed",
    },
    {
      title: "🙆‍♂️ Raise a complaint",
      description: "See your recently visited hostels",
      route: "/student/raise-complaint",
    },
    {
      title: "📲 Contact Support",
      description: "Having issues? Reach out to us.",
      route: "/contact",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-2xl">Redirecting to login...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 px-4 py-6 text-gray-800 dark:text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Welcome, {user.name} 👋</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={() => navigate(card.route)}
            className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 hover:scale-[1.02] transition cursor-pointer"
          >
            <h2 className="text-xl font-semibold mb-2">{card.title}</h2>
            <p className="text-gray-600 dark:text-gray-400">
              {card.description}
            </p>
          </div>
        ))}
      </div>

      <hr />

      <h2 className="text-xl md:text-3xl font-extrabold text-center mb-6 mt-4 text-gray-800 dark:text-white tracking-wide">
        🏠 Explore Hostels  
      </h2>
      <HostelListings />
    </div>
  );
};

export default StudentDashboard;
