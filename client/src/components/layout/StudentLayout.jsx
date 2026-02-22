import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Building2,
  Heart,
  Bell,
  History,
  FileText,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  MessageSquare,
  BookOpen,
  DoorOpen,
  ChevronRight,
} from "lucide-react";

const StudentLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Get user info from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const studentName = user.name || "Student";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const menuItems = [
    {
      section: "Main",
      items: [
        {
          icon: Home,
          label: "Dashboard",
          path: "/student-dashboard",
        },
        {
          icon: Building2,
          label: "Browse Hostels",
          path: "/student/hostels",
        },
        {
          icon: DoorOpen,
          label: "My Hostel",
          path: "/student/my-hostel",
        },
      ],
    },
    {
      section: "My Activity",
      items: [
        {
          icon: FileText,
          label: "My Requests",
          path: "/student/my-requests",
        },
        {
          icon: Heart,
          label: "Interested",
          path: "/student/interested",
        },
        {
          icon: History,
          label: "Recently Viewed",
          path: "/student/recently-viewed",
        },
      ],
    },
    {
      section: "Hostel Info",
      items: [
        {
          icon: BookOpen,
          label: "Rules & Regulations",
          path: "/student/rules-and-regulations",
        },
        {
          icon: DoorOpen,
          label: "My Room",
          path: "/student/my-room",
        },
      ],
    },
    {
      section: "Support",
      items: [
        {
          icon: CreditCard,
          label: "Payments",
          path: "/student/payments",
        },
        {
          icon: MessageSquare,
          label: "Raise Complaint",
          path: "/student/raise-complaint",
        },
        {
          icon: Bell,
          label: "Notifications",
          path: "/student/notifications",
        },
      ],
    },
    {
      section: "Account",
      items: [
        {
          icon: Settings,
          label: "Settings",
          path: "/student/profile-settings",
        },
      ],
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Only visible when menu is opened on mobile */}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-72 transform border-r border-gray-200 bg-white transition-transform duration-300 dark:border-gray-800 dark:bg-gray-900 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center justify-between border-b border-gray-200 p-6 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  ConnectingHostels
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Student Portal
                </p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X size={20} />
            </button>
          </div>

          {/* User Profile */}
          <div className="border-b border-gray-200 p-4 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-purple-100 text-blue-600 dark:from-blue-900 dark:to-purple-900 dark:text-blue-400">
                <User size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate font-semibold text-gray-900 dark:text-white">
                  {studentName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Student Account
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-6">
              {menuItems.map((section, idx) => (
                <div key={idx}>
                  <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {section.section}
                  </h3>
                  <div className="space-y-1">
                    {section.items.map((item, itemIdx) => {
                      const Icon = item.icon;
                      const active = isActive(item.path);
                      return (
                        <Link
                          key={itemIdx}
                          to={item.path}
                          onClick={() => setSidebarOpen(false)}
                          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                            active
                              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                              : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                          }`}
                        >
                          <Icon size={18} />
                          <span className="flex-1">{item.label}</span>
                          {active && <ChevronRight size={16} />}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </nav>

          {/* Logout */}
          <div className="border-t border-gray-200 p-4 dark:border-gray-800">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-all hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content - No left margin since we're using your global navbar */}
      <main className="min-h-screen">
        <div className="pb-20 lg:pb-0">{children}</div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
        <nav className="border-t border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900">
          <div className="grid grid-cols-5 gap-1 px-2 py-2 safe-area-inset-bottom">
            <Link
              to="/student-dashboard"
              className={`flex flex-col items-center justify-center gap-1 rounded-lg px-2 py-2.5 transition-all ${
                isActive("/student-dashboard")
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              }`}
            >
              <Home size={20} strokeWidth={2.5} />
              <span className="text-[10px] font-semibold">Home</span>
            </Link>

            <Link
              to="/student/hostels"
              className={`flex flex-col items-center justify-center gap-1 rounded-lg px-2 py-2.5 transition-all ${
                isActive("/student/hostels")
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              }`}
            >
              <Building2 size={20} strokeWidth={2.5} />
              <span className="text-[10px] font-semibold">Browse</span>
            </Link>

            <Link
              to="/student/my-requests"
              className={`flex flex-col items-center justify-center gap-1 rounded-lg px-2 py-2.5 transition-all ${
                isActive("/student/my-requests")
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              }`}
            >
              <FileText size={20} strokeWidth={2.5} />
              <span className="text-[10px] font-semibold">Requests</span>
            </Link>

            <Link
              to="/student/interested"
              className={`flex flex-col items-center justify-center gap-1 rounded-lg px-2 py-2.5 transition-all ${
                isActive("/student/interested")
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              }`}
            >
              <Heart size={20} strokeWidth={2.5} />
              <span className="text-[10px] font-semibold">Saved</span>
            </Link>

            <button
              onClick={() => setSidebarOpen(true)}
              className="flex flex-col items-center justify-center gap-1 rounded-lg px-2 py-2.5 text-gray-600 transition-all hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              <Menu size={20} strokeWidth={2.5} />
              <span className="text-[10px] font-semibold">More</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default StudentLayout;
