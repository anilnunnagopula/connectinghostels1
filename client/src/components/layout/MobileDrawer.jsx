import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  X,
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
} from "lucide-react";

/**
 * Mobile Drawer Menu Component
 * Full menu overlay for mobile devices
 */
const MobileDrawer = ({ isOpen, onClose }) => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const menuItems = [
    {
      section: "Overview",
      items: [
        { path: "/owner-dashboard", label: "Dashboard", icon: LayoutDashboard },
      ],
    },
    {
      section: "Management",
      items: [
        { path: "/owner/my-hostels", label: "My Hostels", icon: Building },
        { path: "/owner/manage-rooms", label: "Manage Rooms", icon: BedDouble },
        { path: "/owner/my-students", label: "My Students", icon: Users },
      ],
    },
    {
      section: "Operations",
      items: [
        {
          path: "/owner/view-requests",
          label: "Booking Requests",
          icon: GitPullRequest,
        },
        {
          path: "/owner/view-complaints",
          label: "Complaints",
          icon: MailCheck,
        },
        {
          path: "/owner/payment-settings",
          label: "Payments",
          icon: CreditCard,
        },
      ],
    },
    {
      section: "Communication",
      items: [{ path: "/owner/send-alerts", label: "Send Alerts", icon: Send }],
    },
    {
      section: "Settings",
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

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-80 max-w-full bg-white dark:bg-slate-800 shadow-xl z-50 lg:hidden overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
            Menu
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Menu Content */}
        <div className="py-4">
          {menuItems.map((section, idx) => (
            <div key={idx} className="mb-6">
              <h3 className="px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                {section.section}
              </h3>
              <nav className="space-y-1 px-2">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={onClose}
                      className={`
                        flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium
                        transition-colors
                        ${
                          active
                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50"
                        }
                      `}
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MobileDrawer;
