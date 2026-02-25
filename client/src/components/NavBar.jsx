import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Sun,
  Moon,
  Bell,
  Plus,
  LogOut,
  Heart,
  ClipboardCheck,
  ChevronDown,
} from "lucide-react";
import { useDarkMode } from "../context/DarkModeContext";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";

const AUTH_PAGES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-otp",
  "/complete-profile",
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { darkMode, setDarkMode } = useDarkMode();
  const { unreadCount, newRequestsCount } = useSocket();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isLoggedIn = !!user;
  const userRole = user?.role;
  // Owner layout pages — sidebar handles all navigation here
  const isOwnerPage =
    location.pathname.startsWith("/owner") ||
    location.pathname === "/owner-dashboard";
  // Student layout pages — bottom nav + drawer handles all navigation here
  const isStudentPage =
    location.pathname.startsWith("/student") ||
    location.pathname === "/student-dashboard";
  const isAuthPage = AUTH_PAGES.some((p) => location.pathname.startsWith(p));
  // On owner/student pages the layouts own navigation — global nav links are hidden
  const showNavLinks = !isOwnerPage && !isStudentPage && !isAuthPage;
  const isActive = (path) => location.pathname === path;

  const notificationCount =
    userRole === "student"
      ? unreadCount
      : userRole === "owner"
      ? newRequestsCount
      : 0;

  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || "U";

  const homeTo = isLoggedIn
    ? userRole === "student"
      ? "/student-dashboard"
      : "/owner-dashboard"
    : "/";

  // Elevate navbar shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
  }, [location.pathname]);

  // Escape key closes open menus
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      {/* Skip to main content — accessibility & SEO */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 z-[200] bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium"
      >
        Skip to main content
      </a>

      <header
        className={`sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-700/60 transition-shadow duration-200 ${
          scrolled ? "shadow-md" : ""
        }`}
      >
        <nav
          aria-label="Main navigation"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="flex items-center justify-between h-16">

            {/* ── Brand ──────────────────────────────────────── */}
            <Link
              to="/"
              aria-label="ConnectingHostels — Home"
              className="flex items-center gap-2 shrink-0 group"
            >
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-blue-600 text-white text-[11px] font-black tracking-tight select-none">
                CH
              </span>
              <span className="hidden sm:inline text-[17px] font-bold text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                ConnectingHostels
              </span>
            </Link>

            {/* ── Desktop Nav Links — hidden on owner/student layout pages ── */}
            {showNavLinks && (
              <div className="hidden md:flex items-center gap-0.5">
                <NavLink
                  to={homeTo}
                  active={isActive("/")}
                >
                  Home
                </NavLink>

                {!isLoggedIn && (
                  <NavLink to="/about" active={isActive("/about")}>
                    About
                  </NavLink>
                )}

                {userRole === "owner" && (
                  <>
                    <NavLink
                      to="/owner/my-hostels"
                      active={isActive("/owner/my-hostels")}
                    >
                      My Hostels
                    </NavLink>
                    <NavLink
                      to="/owner/view-requests"
                      active={isActive("/owner/view-requests")}
                    >
                      Requests
                    </NavLink>
                  </>
                )}

                {userRole === "student" && (
                  <NavLink
                    to="/student/hostels"
                    active={isActive("/student/hostels")}
                  >
                    Browse Hostels
                  </NavLink>
                )}

                <NavLink to="/contact" active={isActive("/contact")}>
                  Contact
                </NavLink>
              </div>
            )}

            {/* ── Desktop Right: Icons + Profile ──────────────── */}
            <div className="hidden md:flex items-center gap-1.5">
              {/* Dark mode toggle */}
              <IconButton
                onClick={() => setDarkMode(!darkMode)}
                aria-label={
                  darkMode ? "Switch to light mode" : "Switch to dark mode"
                }
                title={darkMode ? "Light mode" : "Dark mode"}
              >
                {darkMode ? (
                  <Sun size={17} className="text-amber-400" />
                ) : (
                  <Moon size={17} className="text-slate-500 dark:text-slate-400" />
                )}
              </IconButton>

              {isLoggedIn ? (
                <>
                  {userRole === "student" && (
                    <>
                      <IconLink
                        to="/student/interested"
                        aria-label="Saved hostels"
                        title="Saved Hostels"
                      >
                        <Heart size={17} />
                      </IconLink>
                      <IconLink
                        to="/student/my-bookings"
                        aria-label="My bookings"
                        title="My Bookings"
                      >
                        <ClipboardCheck size={17} />
                      </IconLink>
                    </>
                  )}

                  {userRole === "owner" && (
                    <IconLink
                      to="/owner/add-hostel"
                      aria-label="Add new hostel"
                      title="Add Hostel"
                    >
                      <Plus size={17} />
                    </IconLink>
                  )}

                  {/* Notification bell — real-time badge */}
                  <Link
                    to={`/${userRole}/notifications`}
                    aria-label={`Notifications${
                      notificationCount > 0
                        ? `, ${notificationCount} unread`
                        : ""
                    }`}
                    title="Notifications"
                    className="relative p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                  >
                    <Bell
                      size={17}
                      className={
                        notificationCount > 0 ? "text-blue-500" : ""
                      }
                    />
                    {notificationCount > 0 && (
                      <>
                        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full inline-flex items-center justify-center leading-none px-0.5">
                          {notificationCount > 99 ? "99+" : notificationCount}
                        </span>
                        <span className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] bg-red-400 rounded-full animate-ping opacity-50 pointer-events-none" />
                      </>
                    )}
                  </Link>

                  {/* Profile dropdown */}
                  <div className="relative ml-0.5">
                    <button
                      type="button"
                      onClick={() => setIsProfileDropdownOpen((v) => !v)}
                      aria-expanded={isProfileDropdownOpen}
                      aria-haspopup="true"
                      aria-label="Open profile menu"
                      className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold inline-flex items-center justify-center select-none">
                        {userInitials}
                      </span>
                      <span className="hidden lg:inline text-sm font-medium text-slate-700 dark:text-slate-200 max-w-[110px] truncate">
                        {user.name || "Profile"}
                      </span>
                      <ChevronDown
                        size={13}
                        className={`text-slate-400 transition-transform duration-200 ${
                          isProfileDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isProfileDropdownOpen && (
                      <div
                        role="menu"
                        aria-label="Profile options"
                        className="absolute right-0 mt-2 w-52 rounded-xl shadow-xl ring-1 ring-slate-200 dark:ring-slate-700 bg-white dark:bg-slate-800 py-1 z-50"
                      >
                        <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-700">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                            Signed in as
                          </p>
                          <p className="text-sm font-semibold text-slate-800 dark:text-white truncate mt-0.5">
                            {user.name || user.email}
                          </p>
                        </div>

                        <Link
                          role="menuitem"
                          to={
                            userRole === "student"
                              ? "/student-dashboard"
                              : "/owner-dashboard"
                          }
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="flex items-center px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/70 transition-colors"
                        >
                          Dashboard
                        </Link>
                        <Link
                          role="menuitem"
                          to={`/${userRole}/profile-settings`}
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="flex items-center px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/70 transition-colors"
                        >
                          Settings
                        </Link>

                        <div className="border-t border-slate-100 dark:border-slate-700 mt-1 pt-1">
                          <button
                            role="menuitem"
                            type="button"
                            onClick={logout}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          >
                            <LogOut size={14} />
                            Sign out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2 ml-1">
                  <Link
                    to="/login"
                    className="px-3.5 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
                  >
                    Sign up free
                  </Link>
                </div>
              )}
            </div>

            {/* ── Mobile Right ───────────────────────────────── */}
            <div className="md:hidden flex items-center gap-1">
              <IconButton
                onClick={() => setDarkMode(!darkMode)}
                aria-label={
                  darkMode ? "Switch to light mode" : "Switch to dark mode"
                }
              >
                {darkMode ? (
                  <Sun size={17} className="text-amber-400" />
                ) : (
                  <Moon size={17} className="text-slate-500" />
                )}
              </IconButton>

              {/* On owner/student pages, their own layouts handle mobile nav — hide hamburger */}
              {!isOwnerPage && !isStudentPage && (
                <>
                  {isLoggedIn && notificationCount > 0 && (
                    <Link
                      to={`/${userRole}/notifications`}
                      aria-label={`${notificationCount} unread notifications`}
                      className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Bell size={17} className="text-blue-500" />
                      <span className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] bg-red-500 text-white text-[10px] font-bold rounded-full inline-flex items-center justify-center leading-none">
                        {notificationCount > 9 ? "9+" : notificationCount}
                      </span>
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen((v) => !v)}
                    aria-expanded={isMobileMenuOpen}
                    aria-label={
                      isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
                    }
                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-200"
                  >
                    {isMobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
                  </button>
                </>
              )}
            </div>
          </div>
        </nav>

        {/* ── Mobile Dropdown Menu ────────────────────────────── */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
            <nav
              aria-label="Mobile navigation"
              className="px-4 pt-3 pb-4 space-y-0.5"
            >
              {/* Nav links — hidden on owner/student layout pages (they have their own nav) */}
              {showNavLinks && (
                <>
                  <MobileNavLink
                    to={homeTo}
                    onClick={() => setIsMobileMenuOpen(false)}
                    active={isActive("/")}
                  >
                    Home
                  </MobileNavLink>

                  {!isLoggedIn && (
                    <MobileNavLink
                      to="/about"
                      onClick={() => setIsMobileMenuOpen(false)}
                      active={isActive("/about")}
                    >
                      About
                    </MobileNavLink>
                  )}

                  {userRole === "owner" && (
                    <>
                      <MobileNavLink
                        to="/owner/my-hostels"
                        onClick={() => setIsMobileMenuOpen(false)}
                        active={isActive("/owner/my-hostels")}
                      >
                        My Hostels
                      </MobileNavLink>
                      <MobileNavLink
                        to="/owner/view-requests"
                        onClick={() => setIsMobileMenuOpen(false)}
                        active={isActive("/owner/view-requests")}
                      >
                        Requests
                      </MobileNavLink>
                    </>
                  )}

                  {userRole === "student" && (
                    <MobileNavLink
                      to="/student/hostels"
                      onClick={() => setIsMobileMenuOpen(false)}
                      active={isActive("/student/hostels")}
                    >
                      Browse Hostels
                    </MobileNavLink>
                  )}

                  <MobileNavLink
                    to="/contact"
                    onClick={() => setIsMobileMenuOpen(false)}
                    active={isActive("/contact")}
                  >
                    Contact
                  </MobileNavLink>
                </>
              )}

              {/* Authenticated section */}
              {isLoggedIn && (
                <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-700 space-y-0.5">
                  <div className="flex items-center gap-3 px-3 py-2.5 mb-1">
                    <span className="w-9 h-9 rounded-full bg-blue-600 text-white text-sm font-bold inline-flex items-center justify-center shrink-0">
                      {userInitials}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">
                        {user.name || "User"}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                        {userRole}
                      </p>
                    </div>
                  </div>

                  <MobileNavLink
                    to={
                      userRole === "student"
                        ? "/student-dashboard"
                        : "/owner-dashboard"
                    }
                    onClick={() => setIsMobileMenuOpen(false)}
                    active={false}
                  >
                    Dashboard
                  </MobileNavLink>
                  <MobileNavLink
                    to={`/${userRole}/profile-settings`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    active={false}
                  >
                    Settings
                  </MobileNavLink>

                  {userRole === "student" && (
                    <>
                      <MobileNavLink
                        to="/student/interested"
                        onClick={() => setIsMobileMenuOpen(false)}
                        active={false}
                      >
                        Saved Hostels
                      </MobileNavLink>
                      <MobileNavLink
                        to="/student/my-bookings"
                        onClick={() => setIsMobileMenuOpen(false)}
                        active={false}
                      >
                        My Bookings
                      </MobileNavLink>
                    </>
                  )}

                  <button
                    type="button"
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <LogOut size={15} />
                    Sign out
                  </button>
                </div>
              )}

              {/* Guest CTAs */}
              {!isLoggedIn && (
                <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-700 grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-center px-4 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors"
                  >
                    Sign up free
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>
    </>
  );
};

// ── Shared sub-components ───────────────────────────────────────────────────

const NavLink = ({ to, active, children }) => (
  <Link
    to={to}
    aria-current={active ? "page" : undefined}
    className={`relative px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      active
        ? "text-blue-600 dark:text-blue-400"
        : "text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/60"
    }`}
  >
    {children}
    {active && (
      <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
    )}
  </Link>
);

const IconButton = ({ children, className = "", ...props }) => (
  <button
    type="button"
    className={`p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors ${className}`}
    {...props}
  >
    {children}
  </button>
);

const IconLink = ({ to, children, ...props }) => (
  <Link
    to={to}
    className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
    {...props}
  >
    {children}
  </Link>
);

const MobileNavLink = ({ to, active, onClick, children }) => (
  <Link
    to={to}
    onClick={onClick}
    aria-current={active ? "page" : undefined}
    className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      active
        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
        : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60"
    }`}
  >
    {children}
  </Link>
);

export default Navbar;
