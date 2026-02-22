/**
 * BottomNav.jsx - Mobile Bottom Navigation Component
 *
 * Sticky bottom navigation for mobile devices
 * Shows key student dashboard actions
 *
 * Props:
 * - activeRoute: Current active route path
 */

import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Building, Heart, User, Bell } from "lucide-react";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      icon: Home,
      label: "Home",
      route: "/student-dashboard",
    },
    {
      icon: Building,
      label: "Hostels",
      route: "/student/hostels",
    },
    {
      icon: Heart,
      label: "Saved",
      route: "/student/interested",
    },
    {
      icon: Bell,
      label: "Alerts",
      route: "/student/notifications",
    },
    {
      icon: User,
      label: "Profile",
      route: "/student/profile-settings",
    },
  ];

  const isActive = (route) => location.pathname === route;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 px-4 py-2 sm:hidden z-50 shadow-lg">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const active = isActive(item.route);

          return (
            <button
              key={index}
              onClick={() => navigate(item.route)}
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-all duration-200 ${
                active
                  ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30"
                  : "text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 2} />
              <span
                className={`text-xs font-medium ${active ? "font-semibold" : ""}`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
