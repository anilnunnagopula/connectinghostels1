import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Sun,
  Moon,
  Bell,
  Plus,
  UserCircle,
  LogOut,
  Heart,
  ClipboardCheck,
} from "lucide-react";
import { useDarkMode } from "../context/DarkModeContext";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode, setDarkMode } = useDarkMode();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const isLoggedIn = !!user;
  const userRole = user?.role;

  const navigateToDashboard = useCallback(() => {
    setIsMobileMenuOpen(false);
    if (!isLoggedIn) {
      navigate("/");
      return;
    }
    if (userRole === "student") navigate("/student-dashboard");
    else if (userRole === "owner") navigate("/owner-dashboard");
    else navigate("/");
  }, [isLoggedIn, userRole, navigate]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, children }) => (
    <Link
      to={to}
      onClick={() => setIsMobileMenuOpen(false)}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        isActive(to)
          ? "text-blue-600 dark:text-blue-400"
          : "hover:text-blue-600 dark:hover:text-blue-300"
      }`}
    >
      {children}
    </Link>
  );

  const NavButton = ({ onClick, children, active }) => (
    <button
      onClick={onClick}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        active
          ? "text-blue-600 dark:text-blue-400"
          : "hover:text-blue-600 dark:hover:text-blue-300"
      }`}
    >
      {children}
    </button>
  );

  const IconLink = ({ to, title, icon: Icon }) => (
    <Link
      to={to}
      onClick={() => setIsMobileMenuOpen(false)}
      title={title}
      className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
    >
      <Icon size={20} />
    </Link>
  );

  return (
    <nav className="bg-white dark:bg-slate-800 shadow-md sticky top-0 z-50 text-slate-800 dark:text-slate-200">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-2">
        <div className="flex items-center justify-between h-16">
          {/* Left Side: Brand */}
          <button
            onClick={navigateToDashboard}
            className="text-2xl font-bold text-blue-600 dark:text-blue-400"
          >
            ConnectingHostels
          </button>

          {/* Right Side: All Links, Actions & Profile */}
          <div className="hidden md:flex items-center space-x-3">
            <NavButton
              onClick={navigateToDashboard}
              active={
                isActive("/student-dashboard") || isActive("/owner-dashboard")
              }
            >
              Home
            </NavButton>
            {!isLoggedIn && <NavLink to="/about">About Us</NavLink>}

            {userRole === "owner" && (
              <>
                <NavLink to="/owner/my-hostels">My Hostels</NavLink>
                <NavLink to="/owner/view-requests">Booking Requests</NavLink>
                <NavLink to="/owner/payment-settings">Payouts</NavLink>
              </>
            )}
            {userRole === "student" && (
              <NavLink to="/student/hostels">Browse Hostels</NavLink>
            )}
            <NavLink to="/contact">Contact Us</NavLink>

            {/* Icons and Login/Profile */}
            <div className="flex items-center space-x-4 pl-4 border-l border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setDarkMode(!darkMode)}
                title="Toggle Theme"
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                {darkMode ? (
                  <Sun size={20} className="text-yellow-400" />
                ) : (
                  <Moon size={20} className="text-blue-500" />
                )}
              </button>

              {isLoggedIn ? (
                <>
                  {userRole === "student" && (
                    <>
                      <IconLink
                        to="/student/interested"
                        title="Interested List"
                        icon={Heart}
                      />
                      <IconLink
                        to="/student/my-bookings"
                        title="My Bookings"
                        icon={ClipboardCheck}
                      />
                    </>
                  )}
                  {userRole === "owner" && (
                    <IconLink
                      to="/owner/add-hostel"
                      title="Add New Hostel"
                      icon={Plus}
                    />
                  )}
                  <IconLink
                    to={`/${userRole}/notifications`}
                    title="Notifications"
                    icon={Bell}
                  />

                  <div className="relative">
                    <button
                      onClick={() => setIsProfileDropdownOpen((prev) => !prev)}
                      className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 px-3 py-2 rounded-full text-sm font-medium"
                    >
                      <UserCircle size={20} />
                      <span>{user.name || "Profile"}</span>
                    </button>
                    {isProfileDropdownOpen && (
                      <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                          <Link
                            to={
                              userRole === "student"
                                ? "/student-dashboard"
                                : "/owner-dashboard"
                            }
                            className="block px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700"
                            onClick={() => setIsProfileDropdownOpen(false)}
                          >
                            Dashboard
                          </Link>
                          <Link
                            to={`/${userRole}/profile-settings`}
                            className="block px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700"
                            onClick={() => setIsProfileDropdownOpen(false)}
                          >
                            Settings
                          </Link>
                          <button
                            onClick={logout}
                            className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                          >
                            <LogOut size={16} /> Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Login
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md inline-flex items-center justify-center"
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavButton
              onClick={navigateToDashboard}
              active={
                isActive("/student-dashboard") || isActive("/owner-dashboard")
              }
            >
              Home
            </NavButton>
            {!isLoggedIn && <NavLink to="/about">About Us</NavLink>}
            {userRole === "owner" && (
              <>
                <NavLink to="/owner/my-hostels">My Hostels</NavLink>
                <NavLink to="/owner/view-requests">Booking Requests</NavLink>
                <NavLink to="/owner/payment-settings">Payouts</NavLink>
              </>
            )}
            {userRole === "student" && (
              <NavLink to="/student/hostels">Browse Hostels</NavLink>
            )}
            <NavLink to="/contact">Contact Us</NavLink>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              {isLoggedIn ? (
                <>
                  <NavLink
                    to={
                      userRole === "student"
                        ? "/student-dashboard"
                        : "/owner-dashboard"
                    }
                  >
                    Dashboard
                  </NavLink>
                  <NavLink to={`/${userRole}/profile-settings`}>
                    Settings
                  </NavLink>
                  <button
                    onClick={logout}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-left px-3 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700"
                >
                  Login / Sign Up
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
