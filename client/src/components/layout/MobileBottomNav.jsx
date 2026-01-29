import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Building, Users, Menu } from "lucide-react";

/**
 * Mobile Bottom Navigation Component
 * Shows on mobile devices only (< 1024px)
 */
const MobileBottomNav = ({ onMenuClick }) => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const navItems = [
    {
      path: "/owner-dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      path: "/owner/my-hostels",
      label: "Hostels",
      icon: Building,
    },
    {
      path: "/owner/my-students",
      label: "Students",
      icon: Users,
    },
    {
      label: "More",
      icon: Menu,
      onClick: onMenuClick,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 lg:hidden z-50">
      <div className="grid grid-cols-4 h-16">
        {navItems.map((item, index) =>
          item.onClick ? (
            // Menu button
            <button
              key={index}
              onClick={item.onClick}
              className="flex flex-col items-center justify-center gap-1 text-slate-600 dark:text-slate-400"
            >
              <item.icon size={22} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ) : (
            // Nav link
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex flex-col items-center justify-center gap-1 transition-colors
                ${
                  isActive(item.path)
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-slate-600 dark:text-slate-400"
                }
              `}
            >
              <item.icon size={22} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ),
        )}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
