// File: Navbar.jsx

import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Moon, Sun, Menu, X } from "lucide-react";

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = !!user;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getNavLinkClass = (route) =>
    `${
      pathname === route ? "text-blue-600 dark:text-blue-300 font-bold" : ""
    } hover:text-blue-600 dark:hover:text-blue-300 text-sm`;

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md px-4 py-3 flex items-center justify-between sticky top-0 z-50">
      <Link
        to="/"
        className={`text-xl sm:text-2xl font-bold transition-colors duration-300 ${
          darkMode ? "text-blue-400" : "text-blue-700"
        }`}
      >
        ConnectingHostels
      </Link>

      <div className="hidden md:flex items-center gap-5">
        {!isLoggedIn && (
          <Link to="/about" className={getNavLinkClass("/about")}>
            About
          </Link>
        )}
        <Link to="/contact" className={getNavLinkClass("/contact")}>
          Contact
        </Link>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-110 transition"
          title="Toggle Theme"
        >
          {darkMode ? (
            <Sun size={18} className="text-yellow-400" />
          ) : (
            <Moon size={18} className="text-blue-600" />
          )}
        </button>

        {isLoggedIn ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-8 h-8 rounded-full overflow-hidden border hover:ring-2 transition"
            >
              <img
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${
                  user.name || "U"
                }`}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border dark:border-gray-600 rounded-lg shadow-lg z-50 animate-fade-in-up">
                <Link
                  to="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="block px-4 py-2 text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  View Profile
                </Link>
                <Link
                  to="/edit-profile"
                  onClick={() => setDropdownOpen(false)}
                  className="block px-4 py-2 text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  Edit Profile
                </Link>
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link
              to="/login"
              className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-2 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
            >
              Register
            </Link>
          </>
        )}
      </div>

      <div className="md:hidden flex items-center gap-2">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-gray-700 dark:text-white"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          className="absolute top-16 left-0 w-full md:hidden bg-white dark:bg-gray-900 px-4 py-4 flex flex-col gap-3 shadow-md z-40 animate-fade-in-down"
        >
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={getNavLinkClass("/")}
          >
            Home
          </Link>
          {!isLoggedIn && (
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className={getNavLinkClass("/about")}
            >
              About
            </Link>
          )}
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className={getNavLinkClass("/contact")}
          >
            Contact
          </Link>

          {isLoggedIn ? (
            <>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className={getNavLinkClass("/profile")}
              >
                View Profile
              </Link>
              <Link
                to="/edit-profile"
                onClick={() => setMobileMenuOpen(false)}
                className={getNavLinkClass("/edit-profile")}
              >
                Edit Profile
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="text-left text-red-600 hover:text-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-100"
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
