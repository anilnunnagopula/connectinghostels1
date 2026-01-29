import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Building,
  BedDouble,
  Users,
  GitPullRequest,
  MailCheck,
  Send,
  ScrollText,
  CreditCard,
  Settings,
  ChevronRight,
} from "lucide-react";

/**
 * Sidebar Navigation Component for Owner Dashboard
 * Displays on desktop/tablet, hidden on mobile
 */
const Sidebar = ({ isCollapsed = false }) => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  // Navigation menu structure
  const menuSections = [
    {
      title: "Overview",
      items: [
        {
          path: "/owner-dashboard",
          label: "Dashboard",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: "Management",
      items: [
        {
          path: "/owner/my-hostels",
          label: "My Hostels",
          icon: Building,
        },
        {
          path: "/owner/manage-rooms",
          label: "Manage Rooms",
          icon: BedDouble,
        },
        {
          path: "/owner/my-students",
          label: "My Students",
          icon: Users,
        },
      ],
    },
    {
      title: "Operations",
      items: [
        {
          path: "/owner/view-requests",
          label: "Booking Requests",
          icon: GitPullRequest,
          badge: 0, // Can be made dynamic
        },
        {
          path: "/owner/view-complaints",
          label: "Complaints",
          icon: MailCheck,
          badge: 0, // Can be made dynamic
        },
        {
          path: "/owner/payment-settings",
          label: "Payments",
          icon: CreditCard,
        },
      ],
    },
    {
      title: "Communication",
      items: [
        {
          path: "/owner/send-alerts",
          label: "Send Alerts",
          icon: Send,
        },
      ],
    },
    {
      title: "Settings",
      items: [
        {
          path: "/owner/rules-and-regulations",
          label: "Rules",
          icon: ScrollText,
        },
        {
          path: "/owner/profile-settings",
          label: "Profile Settings",
          icon: Settings,
        },
      ],
    },
  ];

  return (
    <aside
      className={`
        fixed left-0 top-16 bottom-0 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700
        transition-all duration-300 z-40 overflow-y-auto
        ${isCollapsed ? "w-20" : "w-64"}
        hidden lg:block
      `}
    >
      <div className="py-6">
        {menuSections.map((section, idx) => (
          <div key={idx} className="mb-6">
            {/* Section Title */}
            {!isCollapsed && (
              <h3 className="px-6 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                {section.title}
              </h3>
            )}

            {/* Menu Items */}
            <nav className="space-y-1 px-3">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`
                      group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                      transition-all duration-200
                      ${
                        active
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50"
                      }
                    `}
                  >
                    <Icon
                      size={20}
                      className={
                        active ? "text-blue-600 dark:text-blue-400" : ""
                      }
                    />
                    {!isCollapsed && (
                      <>
                        <span className="flex-1">{item.label}</span>

                        {/* Badge */}
                        {item.badge > 0 && (
                          <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        )}

                        {/* Active Indicator */}
                        {active && (
                          <ChevronRight
                            size={16}
                            className="text-blue-600 dark:text-blue-400"
                          />
                        )}
                      </>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
