import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const navigate = useNavigate();
  const [showMobilePopup, setShowMobilePopup] = useState(false);
  const [showProgressPopup, setShowProgressPopup] = useState(true);

  useEffect(() => {
    // Mobile popup
    if (window.innerWidth < 768) {
      setShowMobilePopup(true);
      const timer = setTimeout(() => setShowMobilePopup(false), 8000);
      return () => clearTimeout(timer);
    }

    // Dark mode toggle
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    // Always show progress popup for 5 seconds
    const timer = setTimeout(() => setShowProgressPopup(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {/* ✅ Popup: Project in Progress */}
      {showProgressPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-yellow-100 text-black dark:bg-yellow-900 dark:text-white p-6 rounded-lg shadow-xl w-96 text-center space-y-4">
            <h2 className="text-xl font-bold">🚧 Project in Progress</h2>
            <p className="text-sm">
              This website is still under development. Backend integration is
              in progress.
              <br />
              so please use testing credentials for login
            </p>
            <button
              onClick={() => setShowProgressPopup(false)}
              className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition"
            >
              Okay, got it!
            </button>
          </div>
        </div>
      )}

      {/* ✅ Mobile Warning Popup */}
      {showMobilePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-6 rounded-lg shadow-lg w-80 text-center space-y-4">
            <h2 className="text-lg font-semibold">📱 Heads Up!</h2>
            <p className="text-sm">
              For better viewing experience, please use a desktop or landscape
              mode.
            </p>
            <button
              onClick={() => setShowMobilePopup(false)}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      {/* Main Page */}
      <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-all">
        <div
          className="w-full h-[92vh] bg-cover bg-center relative flex flex-col items-center justify-center px-4"
          style={{
            backgroundImage: `url(${process.env.PUBLIC_URL}/Hostel.jpg)`,
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="relative z-10 text-center text-white">
            <h1 className="text-4xl font-bold mb-4 drop-shadow-lg">
              Welcome!
              <br />
              <strong>the one-stop platform for hostels in Mangalpally</strong>
              <br />
            </h1>
            <p className="text-lg mb-6 drop-shadow-sm">
              Searching for Hostel (in Mangalpally).
              <br />
              Let’s do it together.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
