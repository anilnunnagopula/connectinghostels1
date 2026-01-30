import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaGooglePlay,
  FaApple,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const Footer = () => {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const isLoggedIn = !!user;
  const userRole = user?.role;

  // ❌ Hide on auth pages and all dashboard pages
  const hiddenRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ];

  // // Hide footer on both owner and student dashboard pages
  // const isOwnerPage = pathname.startsWith("/owner");
  // const isStudentDashboard = pathname.startsWith("/student");

  // if (hiddenRoutes.includes(pathname) || isOwnerPage || isStudentDashboard) {
  //   return null;
  // }
  if (hiddenRoutes.includes(pathname)) {
    return null;
  }

  // Smart navigation handlers
  const handleDashboardClick = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      navigate("/login");
    } else if (userRole === "student") {
      navigate("/student-dashboard");
    } else if (userRole === "owner") {
      navigate("/owner-dashboard");
    } else {
      navigate("/");
    }
  };

  const handleHomeClick = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      navigate("/");
    } else if (userRole === "student") {
      navigate("/student-dashboard");
    } else if (userRole === "owner") {
      navigate("/owner-dashboard");
    } else {
      navigate("/");
    }
  };

  return (
    <footer className="bg-blue-950 text-gray-300 pt-5 pb-6 px-4 sm:px-10 lg:px-20 border-t border-blue-800 mt-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {/* 🧱 Brand Overview */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-3">
            ConnectingHostels
          </h2>
          <p className="text-sm leading-6">
            The platform for searching the hostel in Mangalpally.
          </p>
          <div className="flex gap-4 mt-4">
            <a
              href="#"
              className="text-white text-lg hover:text-gray-300 transition-colors"
              aria-label="Download on Google Play"
            >
              <FaGooglePlay />
            </a>
            <a
              href="#"
              className="text-white text-lg hover:text-gray-300 transition-colors"
              aria-label="Download on App Store"
            >
              <FaApple />
            </a>
          </div>
        </div>

        {/* 📌 Quick Navigation - Context-Aware */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 sm:ml-20">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm sm:ml-20">
            <li>
              <button
                onClick={handleHomeClick}
                className="hover:text-white transition-colors text-left"
              >
                🏠 Home
              </button>
            </li>
            <li>
              <Link to="/about" className="hover:text-white transition-colors">
                ℹ️ About Us
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="hover:text-white transition-colors"
              >
                📞 Contact
              </Link>
            </li>
            <li>
              <button
                onClick={handleDashboardClick}
                className="hover:text-white transition-colors text-left"
              >
                📊 {isLoggedIn ? "Dashboard" : "Login"}
              </button>
            </li>

            {/* Show role-specific links if logged in */}
            {isLoggedIn && userRole === "student" && (
              <li>
                <Link
                  to="/student/hostels"
                  className="hover:text-white transition-colors"
                >
                  🏢 Browse Hostels
                </Link>
              </li>
            )}
          </ul>
        </div>

        {/* 📞 Contact + Social */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Get in Touch
          </h3>
          <div className="text-sm mb-3 space-y-1">
            <a
              href="https://www.google.com/maps/search/?api=1&query=CVR+College+Road,+Mangalpally,+Hyderabad,+Telangana"
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:text-white transition-colors"
            >
              📍 CVR College Road, Mangalpally, Hyderabad, Telangana
            </a>

            <a
              href="mailto:anilnunnagopula15@gmail.com"
              className="block hover:text-white transition-colors"
            >
              📧 anilnunnagopula15@gmail.com
            </a>

            <a
              href="tel:+919398828248"
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:text-white transition-colors"
            >
              📞 +91 93988 28248
            </a>
          </div>

          <div className="flex gap-3 text-lg mt-2">
            <a
              href="#"
              className="hover:text-blue-300 transition-colors"
              aria-label="Facebook"
            >
              <FaFacebookF />
            </a>
            <a
              href="#"
              className="hover:text-pink-400 transition-colors"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              className="hover:text-blue-400 transition-colors"
              aria-label="Twitter"
            >
              <FaTwitter />
            </a>
            <a
              href="#"
              className="hover:text-blue-500 transition-colors"
              aria-label="LinkedIn"
            >
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>

      {/* 🧾 Legal Row */}
      <div className="mt-10 border-t border-blue-800 pt-6 text-sm text-center text-gray-400">
        <p>
          &copy; {new Date().getFullYear()}{" "}
          <span className="text-white font-semibold">ConnectingHostels</span>.
          All rights reserved.
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-4">
          <Link
            to="/legal/privacy-policy"
            className="hover:text-white transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            to="/legal/terms-and-conditions"
            className="hover:text-white transition-colors"
          >
            Terms & Conditions
          </Link>
          <Link
            to="/legal/cookie-policy"
            className="hover:text-white transition-colors"
          >
            Cookies
          </Link>
          <Link
            to="/legal/refund-policy"
            className="hover:text-white transition-colors"
          >
            Refund Policy
          </Link>
          <Link
            to="/legal/community-guidelines"
            className="hover:text-white transition-colors"
          >
            Community Guidelines
          </Link>
          <Link
            to="/legal/partner-terms"
            className="hover:text-white transition-colors"
          >
            Partner Terms
          </Link>
          <Link
            to="/legal/data-protection"
            className="hover:text-white transition-colors"
          >
            Data Protection
          </Link>
          <Link
            to="/legal/transparency"
            className="hover:text-white transition-colors"
          >
            Transparency
          </Link>
          <Link to="/support" className="hover:text-white transition-colors">
            Support
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
