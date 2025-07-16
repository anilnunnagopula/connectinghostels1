import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaGooglePlay,
  FaApple,
} from "react-icons/fa";

const Footer = () => {
  const { pathname } = useLocation();

  // ❌ Hide on auth pages if needed
  const hiddenRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ];
  if (hiddenRoutes.includes(pathname)) return null;

  return (
    <footer className="bg-blue-950 text-gray-300 pt-5 pb-6 px-20 border-t border-blue-800 mt-10">
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
            <a href="#" className="text-white text-lg hover:text-gray-300">
              <FaGooglePlay />
            </a>
            <a href="#" className="text-white text-lg hover:text-gray-300">
              <FaApple />
            </a>
          </div>
        </div>

        {/* 📌 Quick Navigation */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 ml-20">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm ml-20">
            <li>
              <Link to="/" className="hover:text-white">
                🏠 Home
              </Link>
            </li>

            <li>
              <Link to="/login" className="hover:text-white">
                📊 Dashboard
              </Link>
            </li>
          </ul>
        </div>

        {/* 📞 Contact + Social */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Get in Touch
          </h3>
          <p className="text-sm mb-3">
            <a
              href="https://www.google.com/maps/search/?api=1&query=CVR+College+Road,+Mangalpally,+Hyderabad,+Telangana"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div>
                <p className="cursor-pointer hover:text-white">
                  📍CVR College Road, Mangalpally, Hyderabad, Telangana
                </p>
              </div>
            </a>
            {/* <br /> */}
            📧{" "}
            <a
              href="mailto:anilnunnagopula15@gmail.com"
              className="hover:text-white"
            >
              anilnunnagopula15@gmail.com
            </a>
            <br />
            <a
              href="tel:+919398828248"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div>
                {/* <h3 className="font-semibold text-lg">Call Us</h3> */}
                <p className="cursor-pointer hover:text-white">
                  📞 +91 93988 28248
                </p>
              </div>
            </a>
          </p>
          <div className="flex gap-3 text-lg mt-2">
            <a href="#" className="hover:text-blue-300">
              <FaFacebookF />
            </a>
            <a href="#" className="hover:text-pink-400">
              <FaInstagram />
            </a>
            <a href="#" className="hover:text-blue-400">
              <FaTwitter />
            </a>
            <a href="#" className="hover:text-blue-500">
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
          <Link to="/legal/privacy-policy" className="hover:text-white">
            Privacy Policy
          </Link>
          <Link to="/legal/terms-and-conditions" className="hover:text-white">
            Terms & Conditions
          </Link>
          <Link to="/legal/cookie-policy" className="hover:text-white">
            Cookies
          </Link>
          <Link to="/legal/refund-policy" className="hover:text-white">
            Refund Policy
          </Link>
          <Link to="/legal/community-guidelines" className="hover:text-white">
            Community Guidelines
          </Link>
          <Link to="/legal/partner-terms" className="hover:text-white">
            partner-terms
          </Link>
          <Link to="/legal/data-protection" className="hover:text-white">
            data-protection
          </Link>
          <Link to="/legal/transparency" className="hover:text-white">
            transparency
          </Link>

          <Link to="/support" className="hover:text-white">
            Support
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
