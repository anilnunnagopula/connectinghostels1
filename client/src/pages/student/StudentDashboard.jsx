import React from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaHeart, FaSearch } from "react-icons/fa";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = React.useState(
    localStorage.getItem("theme") === "dark"
  );

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const user = JSON.parse(localStorage.getItem("user"));

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

  const recentViewed = [
    {
      name: "Sai Krupa Boys Hostel",
      location: "Mangalpally",
      type: "Boys",
      price: "₹4800/mo",
    },
    {
      name: "CoLive Orange Nest",
      location: "Mangalpally",
      type: "Co-Living",
      price: "₹5500/mo",
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

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 px-4 py-6 text-gray-800 dark:text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Welcome, {user?.name || "Student"} 👋
        </h1>
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
    </div>
  );
}; 
export default StudentDashboard;
