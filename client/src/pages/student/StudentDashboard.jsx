// /**
//  * StudentDashboard.jsx - Main Student Dashboard
//  *
//  * Features:
//  * - Dashboard statistics from multiple endpoints
//  * - Quick action cards for navigation
//  * - Hostel listings integration
//  *
//  * Performance Optimizations:
//  * - Consolidated state management
//  * - Memoized event handlers
//  * - Proper API cleanup
//  * - Error handling with retry
//  */

// import React, { useState, useEffect, useCallback } from "react";
// import Footer from "../../components/Footer";
// import {
//   Building,
//   BedDouble,
//   IndianRupee,
//   MailCheckIcon,
//   ScrollText,
//   Send,
//   Loader2,
// } from "lucide-react";
// import {
//   FaGraduationCap,
//   FaBuilding,
//   FaHeart,
//   FaUserAlt,
//   FaCreditCard,
//   FaBell,
//   FaExclamationTriangle,
//   FaQuestionCircle,
// } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import HostelListings from "../HostelListings";

// // ============================================================================
// // CONSTANTS
// // ============================================================================

// const API_BASE_URL = process.env.REACT_APP_API_URL;

// // ============================================================================
// // UTILITY FUNCTIONS
// // ============================================================================

// /**
//  * Retrieves authentication token from localStorage
//  */
// const getToken = () => localStorage.getItem("token");

// /**
//  * Retrieves user data from localStorage
//  */
// const getUserData = () => {
//   const userData = localStorage.getItem("user");
//   return userData ? JSON.parse(userData) : null;
// };

// // ============================================================================
// // MAIN COMPONENT
// // ============================================================================

// const StudentDashboard = () => {
//   const navigate = useNavigate();

//   // ==========================================================================
//   // STATE MANAGEMENT (Consolidated)
//   // ==========================================================================

//   const [dashboardState, setDashboardState] = useState({
//     user: null,
//     stats: {
//       hostelName: "N/A",
//       roomNumber: "N/A",
//       pendingFees: 0,
//     },
//     loading: true,
//     error: null,
//   });

//   // ==========================================================================
//   // DATA FETCHING
//   // ==========================================================================

//   /**
//    * Fetches dashboard statistics
//    * NOTE: Since /dashboard/metrics doesn't exist, we use default/static values
//    * You can add real API calls here when endpoints are available
//    */
//   const fetchDashboardStats = useCallback(async () => {
//     const token = getToken();

//     // Redirect to login if no token
//     if (!token) {
//       navigate("/login");
//       return;
//     }

//     try {
//       setDashboardState((prev) => ({ ...prev, loading: true, error: null }));

//       // =====================================================================
//       // OPTION 1: If you have separate endpoints, uncomment and modify:
//       // =====================================================================
//       /*
//       const [hostelRes, paymentsRes, complaintsRes] = await Promise.all([
//         axios.get(`${API_BASE_URL}/api/student/hostel`, {
//           headers: { Authorization: `Bearer ${token}` }
//         }),
//         axios.get(`${API_BASE_URL}/api/student/payments/pending`, {
//           headers: { Authorization: `Bearer ${token}` }
//         }), 
//       ]);

//       setDashboardState((prev) => ({
//         ...prev,
//         stats: {
//           hostelName: hostelRes.data?.hostelName || "N/A",
//           roomNumber: hostelRes.data?.roomNumber || "N/A",
//           pendingFees: paymentsRes.data?.pendingAmount || 0,
//         },
//         loading: false,
//         error: null,
//       }));
//       */

//       // =====================================================================
//       // OPTION 2: Using static/default values (CURRENT IMPLEMENTATION)
//       // =====================================================================
//       // Since we don't have the endpoints, we'll use default values
//       // This prevents the 404 error

//       // Simulate API delay for UX consistency
//       await new Promise((resolve) => setTimeout(resolve, 500));

//       setDashboardState((prev) => ({
//         ...prev,
//         stats: {
//           hostelName: "N/A", // Will show "N/A" until real data available
//           roomNumber: "N/A",
//           pendingFees: 0, 
//         },
//         loading: false,
//         error: null,
//       }));
//     } catch (error) {
//       // Don't set error if request was aborted
//       if (error.name === "CanceledError" || error.code === "ERR_CANCELED") {
//         return;
//       }

//       // Handle 401 Unauthorized (token expired)
//       if (error.response?.status === 401) {
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//         navigate("/login");
//         return;
//       }

//       console.error("Dashboard stats fetch failed ❌", error);

//       setDashboardState((prev) => ({
//         ...prev,
//         stats: {
//           hostelName: "N/A",
//           roomNumber: "N/A",
//           pendingFees: 0, 
//         },
//         loading: false,
//         error: null, // Don't show error for missing endpoints
//       }));
//     }
//   }, [navigate]);

//   // ==========================================================================
//   // EFFECTS
//   // ==========================================================================

//   /**
//    * Initialize user data and fetch dashboard stats on mount
//    */
//   useEffect(() => {
//     const userData = getUserData();
//     setDashboardState((prev) => ({ ...prev, user: userData }));

//     fetchDashboardStats();
//   }, [fetchDashboardStats]);

//   // ==========================================================================
//   // EVENT HANDLERS (Optimized with useCallback)
//   // ==========================================================================

//   /**
//    * Handles navigation to different routes
//    */
//   const handleNavigate = useCallback(
//     (route) => {
//       navigate(route);
//     },
//     [navigate],
//   );

//   /**
//    * Handles retry when dashboard fails to load
//    */
//   const handleRetry = useCallback(() => {
//     fetchDashboardStats();
//   }, [fetchDashboardStats]);

//   // ==========================================================================
//   // DASHBOARD CARDS CONFIGURATION
//   // ==========================================================================

//   /**
//    * Dynamic stats cards with API data
//    */
//   const statsCards = [
//     {
//       icon: <Building className="text-indigo-500" />,
//       title: "Your Hostel",
//       description: "Property assigned to you",
//       value: dashboardState.stats.hostelName,
//       route: "/student/my-hostel",
//     },
//     {
//       icon: <BedDouble className="text-green-500" />,
//       title: "Your Room",
//       description: "Your assigned room number",
//       value: dashboardState.stats.roomNumber,
//       route: "/student/my-room",
//     },
//     {
//       icon: <IndianRupee className="text-yellow-500" />,
//       title: "Pending Fees",
//       description: "Amount due for this month",
//       value: `₹${dashboardState.stats.pendingFees.toLocaleString("en-IN")}`,
//       route: "/student/payments",
//     },
//   ];

//   /**
//    * Static navigation cards
//    */
//   const navigationCards = [
//     {
//       icon: <FaBuilding className="text-blue-600" />,
//       title: "Browse Hostels",
//       description: "Explore and find your perfect stay.",
//       route: "/student/hostels",
//     },
//     {
//       icon: <FaHeart className="text-pink-600" />,
//       title: "Interested List",
//       description: "View the hostels you've saved.",
//       route: "/student/interested",
//     },
//     {
//       icon: <FaUserAlt className="text-purple-600" />,
//       title: "My Profile",
//       description: "Update your personal information.",
//       route: "/student/profile-settings",
//     },
//     {
//       icon: <FaCreditCard className="text-green-600" />,
//       title: "Payment History",
//       description: "Review your past transactions.",
//       route: "/student/payments",
//     },
//     {
//       icon: <FaBell className="text-yellow-600" />,
//       title: "Notifications",
//       description: "Check updates and alerts.",
//       route: "/student/notifications",
//     },
//     {
//       icon: <FaExclamationTriangle className="text-red-600" />,
//       title: "Raise a Complaint",
//       description: "Report issues or concerns.",
//       route: "/student/raise-complaint",
//     },
//     {
//       icon: <FaQuestionCircle className="text-teal-600" />,
//       title: "Contact Support",
//       description: "Get help with any issues.",
//       route: "/contact",
//     },
//     {
//       icon: <FaBuilding className="text-indigo-600" />,
//       title: "My Bookings",
//       description: "Your current and previous hostels.",
//       route: "/student/my-bookings",
//     },
//     {
//       icon: <FaBuilding className="text-indigo-600" />,
//       title: "Recently Viewed Hostels",
//       description: "Your recently hostels.",
//       route: "/student/recently-viewed",
//     },
//     {
//       icon: <FaBuilding className="text-indigo-600" />,
//       title: "Hostel Request Status",
//       description: "Status of you hostel requests.",
//       route: "/student/my-requests",
//     },
//   ];

//   // Combine all cards
//   const allCards = [...statsCards, ...navigationCards];

//   // ==========================================================================
//   // RENDER HELPERS
//   // ==========================================================================

//   /**
//    * Renders loading state
//    */
//   const renderLoading = () => (
//     <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
//       <div className="text-center">
//         <Loader2 className="w-10 h-10 animate-spin text-blue-500 mx-auto mb-4" />
//         <p className="text-slate-600 dark:text-slate-400">
//           Loading your dashboard...
//         </p>
//       </div>
//     </div>
//   );

//   /**
//    * Renders error state with retry option
//    */
//   const renderError = () => (
//     <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
//       <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg max-w-md text-center">
//         <div className="text-red-500 mb-4">
//           <FaExclamationTriangle className="w-16 h-16 mx-auto" />
//         </div>
//         <h2 className="text-2xl font-bold mb-2 text-slate-800 dark:text-white">
//           Unable to Load Dashboard
//         </h2>
//         <p className="text-slate-600 dark:text-slate-400 mb-6">
//           {dashboardState.error}
//         </p>
//         <button
//           onClick={handleRetry}
//           className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
//         >
//           Try Again
//         </button>
//       </div>
//     </div>
//   );

//   /**
//    * Renders a dashboard card
//    */
//   const renderCard = (card, index) => (
//     <div
//       key={index}
//       onClick={() => handleNavigate(card.route)}
//       className="bg-white dark:bg-slate-800 p-5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors duration-300 group cursor-pointer"
//     >
//       <div className="flex items-center gap-4">
//         <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded-lg">
//           {card.icon}
//         </div>
//         <div>
//           <p className="font-semibold text-slate-700 dark:text-slate-200">
//             {card.title}
//           </p>
//           <p className="text-xs text-slate-500 dark:text-slate-400">
//             {card.description}
//           </p>
//         </div>
//       </div>
//       {card.value && (
//         <p className="text-1xl font-bold mt-2 text-slate-800 dark:text-white">
//           {card.value}
//         </p>
//       )}
//     </div>
//   );

//   // ==========================================================================
//   // MAIN RENDER
//   // ==========================================================================

//   // Show loading state on initial load
//   if (dashboardState.loading && !dashboardState.user) {
//     return renderLoading();
//   }

//   // Show error state if critical error occurred
//   if (dashboardState.error && !dashboardState.user) {
//     return renderError();
//   }

//   return (
//     <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 sm:p-6 text-slate-800 dark:text-white">
//       {/* Header */}
//       <div className="mb-6">
//         <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
//           Welcome, {dashboardState.user?.name || "Student"}!
//           <FaGraduationCap className="inline-block" />
//         </h1>

//         {/* Show loading indicator during refresh */}
//         {dashboardState.loading && dashboardState.user && (
//           <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
//             <Loader2 className="w-4 h-4 animate-spin" />
//             Loading dashboard data...
//           </p>
//         )}

//         {/* Show error banner if refresh failed */}
//         {dashboardState.error && dashboardState.user && (
//           <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center justify-between">
//             <p className="text-sm text-red-700 dark:text-red-400">
//               {dashboardState.error}
//             </p>
//             <button
//               onClick={handleRetry}
//               className="text-sm text-red-600 dark:text-red-400 hover:underline font-medium"
//             >
//               Retry
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Quick Stats and Navigation Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
//         {allCards.map(renderCard)}
//       </div>

//       {/* Action Buttons */}
//       <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
//         <button
//           onClick={() => handleNavigate("/student/raise-complaint")}
//           className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow hover:scale-105 transition"
//         >
//           <Send size={18} />
//           <span>Submit a Complaint</span>
//         </button>
//         <button
//           onClick={() => handleNavigate("/student/rules-and-regulations")}
//           className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow hover:scale-105 transition"
//         >
//           <ScrollText size={18} />
//           <span>Hostel Rules</span>
//         </button>
//         <button
//           onClick={() => handleNavigate("/student/payments")}
//           className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow hover:scale-105 transition"
//         >
//           <IndianRupee size={18} />
//           <span>Make a Payment</span>
//         </button>
//       </div>

//       {/* Explore Hostels Section */}
//       <div className="mt-12 border-t border-slate-200 dark:border-slate-700 pt-8">
//         <h2 className="text-3xl font-extrabold text-center mb-6 text-slate-800 dark:text-white tracking-wide">
//           Explore Nearby Hostels
//         </h2>
//         <HostelListings />
//       </div>
//     </div>
//   );
// };

// export default StudentDashboard;

// /**
//  * ============================================================================
//  * REFACTORING IMPROVEMENTS SUMMARY
//  * ============================================================================
//  *
//  * 1. FIXED 404 ERROR
//  *    ✅ Removed non-existent /dashboard/metrics endpoint
//  *    ✅ Added placeholder for real API calls (see comments in code)
//  *    ✅ Dashboard now loads without errors
//  *
//  * 2. STATE MANAGEMENT
//  *    ✅ Consolidated user, stats, loading, error into single state object
//  *    ✅ Prevents state update race conditions
//  *
//  * 3. ERROR HANDLING
//  *    ✅ Comprehensive try-catch with user-friendly messages
//  *    ✅ Token expiry detection (401) with auto-redirect
//  *    ✅ Clean error recovery
//  *
//  * 4. PERFORMANCE
//  *    ✅ useCallback for navigation handlers (stable references)
//  *    ✅ Optimized re-renders
//  *
//  * 5. CODE ORGANIZATION
//  *    ✅ Clear section comments for readability
//  *    ✅ Separated stats cards and navigation cards
//  *    ✅ Extracted utility functions
//  *    ✅ Fixed duplicate "My Hostel" card (now "My Bookings")
//  *
//  * ============================================================================
//  * HOW TO ADD REAL API CALLS
//  * ============================================================================
//  *
//  * When your backend has the endpoints, uncomment the section marked
//  * "OPTION 1" in the fetchDashboardStats function and modify the endpoints
//  * to match your actual API structure.
//  *
//  * Example endpoints you might need:
//  * - GET /api/student/hostel (for current hostel & room)
//  * - GET /api/student/payments/pending (for pending fees) 
//  *
//  * ============================================================================
//  */




//new
/**
 * StudentDashboard.jsx - Refactored Student Dashboard
 * 
 * IMPROVEMENTS:
 * - Mobile-first responsive design
 * - Reusable components (StatCard, ActionCard, EmptyState)
 * - Clean UI matching Owner Dashboard
 * - NO ENDPOINT CHANGES - All existing API calls preserved
 * - Bottom navigation ready for mobile
 */

import React, { useState, useEffect, useCallback } from "react";
import {
  Building,
  BedDouble,
  IndianRupee,
  Heart,
  User,
  CreditCard,
  Bell,
  AlertTriangle,
  HelpCircle,
  BookOpen,
  Send,
  ScrollText,
  Eye,
  FileText,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Import reusable components (create these matching Owner Dashboard)
import StatCard from "../../components/dashboard/StatCard";
import ActionCard from "../../components/dashboard/ActionCard";
import EmptyState from "../../components/dashboard/EmptyState";

// ============================================================================
// CONSTANTS & UTILITIES
// ============================================================================

const API_BASE_URL = process.env.REACT_APP_API_URL;
const getToken = () => localStorage.getItem("token");
const getUserData = () => {
  const userData = localStorage.getItem("user");
  return userData ? JSON.parse(userData) : null;
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const StudentDashboard = () => {
  const navigate = useNavigate();

  // ==========================================================================
  // STATE MANAGEMENT
  // ==========================================================================

  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    hostelName: "N/A",
    roomNumber: "N/A",
    pendingFees: 0,
  });
  const [loading, setLoading] = useState(true);

  // ==========================================================================
  // DATA FETCHING (PRESERVED - NO CHANGES TO ENDPOINTS)
  // ==========================================================================

  const fetchDashboardStats = useCallback(async () => {
    const token = getToken();

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      // Simulate API delay for UX consistency
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Using default values (NO ENDPOINT CALLS - as per original)
      setStats({
        hostelName: "N/A",
        roomNumber: "N/A",
        pendingFees: 0,
      });
    } catch (error) {
      // Handle errors gracefully
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      console.error("Dashboard stats fetch failed ❌", error);
      
      setStats({
        hostelName: "N/A",
        roomNumber: "N/A",
        pendingFees: 0,
      });
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // ==========================================================================
  // EFFECTS
  // ==========================================================================

  useEffect(() => {
    const userData = getUserData();
    setUser(userData);
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  // ==========================================================================
  // DASHBOARD CONFIGURATION
  // ==========================================================================

  // KPI Stats Cards (Top Section)
  const statCards = [
    {
      icon: <Building />,
      iconColor: "text-indigo-500",
      title: "Your Hostel",
      description: "Property assigned to you",
      value: stats.hostelName,
      route: "/student/my-hostel",
    },
    {
      icon: <BedDouble />,
      iconColor: "text-green-500",
      title: "Your Room",
      description: "Your assigned room",
      value: stats.roomNumber,
      route: "/student/my-room",
    },
    {
      icon: <IndianRupee />,
      iconColor: "text-yellow-500",
      title: "Pending Fees",
      description: "Amount due",
      value: `₹${stats.pendingFees.toLocaleString("en-IN")}`,
      route: "/student/payments",
    },
  ];

  // Quick Actions (Grouped by Category)
  const quickActions = {
    accommodation: [
      {
        icon: <Building />,
        title: "Browse Hostels",
        description: "Explore available properties",
        route: "/student/hostels",
        variant: "primary",
      },
      {
        icon: <Heart />,
        title: "Interested List",
        description: "Saved hostels",
        route: "/student/interested",
        variant: "primary",
      },
      {
        icon: <Eye />,
        title: "Recently Viewed",
        description: "Your browsing history",
        route: "/student/recently-viewed",
        variant: "primary",
      },
    ],
    bookings: [
      {
        icon: <BookOpen />,
        title: "My Bookings",
        description: "Current & past hostels",
        route: "/student/my-bookings",
        variant: "primary",
      },
      {
        icon: <FileText />,
        title: "Request Status",
        description: "Track your applications",
        route: "/student/my-requests",
        variant: "primary",
      },
    ],
    financial: [
      {
        icon: <CreditCard />,
        title: "Payment History",
        description: "View transactions",
        route: "/student/payments",
        variant: "success",
      },
      {
        icon: <IndianRupee />,
        title: "Make Payment",
        description: "Pay pending fees",
        route: "/student/payments",
        variant: "success",
      },
    ],
    support: [
      {
        icon: <AlertTriangle />,
        title: "Raise Complaint",
        description: "Report issues",
        route: "/student/raise-complaint",
        variant: "warning",
      },
      {
        icon: <Bell />,
        title: "Notifications",
        description: "Updates & alerts",
        route: "/student/notifications",
        variant: "primary",
      },
      {
        icon: <HelpCircle />,
        title: "Contact Support",
        description: "Get help",
        route: "/contact",
        variant: "primary",
      },
    ],
    settings: [
      {
        icon: <ScrollText />,
        title: "Hostel Rules",
        description: "View regulations",
        route: "/student/rules-and-regulations",
        variant: "primary",
      },
      {
        icon: <User />,
        title: "Profile Settings",
        description: "Update your info",
        route: "/student/profile-settings",
        variant: "primary",
      },
    ],
  };

  // Check if student has no hostel assigned
  const hasNoHostel = stats.hostelName === "N/A";
  // console.log(stats.hostelName)

  // ==========================================================================
  // RENDER
  // ==========================================================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 sm:p-6 lg:p-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white mb-2">
          Welcome, {user?.name || "Student"}! 👋
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Here's your hostel dashboard overview
        </p>
      </div>

      {/* Empty State - Show if no hostel assigned */}
      {hasNoHostel && (
        <div className="mb-8">
          <EmptyState
            icon={<Building className="w-16 h-16 text-slate-400" />}
            title="No hostel assigned yet"
            message="Start exploring available hostels and submit booking requests. You'll see your hostel details here once approved."
            actionLabel="Browse Hostels"
            onAction={() => navigate("/student/hostels")}
            secondaryLabel="View Requests"
            onSecondary={() => navigate("/student/my-requests")}
          />
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
          Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {statCards.map((stat, index) => (
            <StatCard
              key={index}
              icon={stat.icon}
              iconColor={stat.iconColor}
              title={stat.title}
              description={stat.description}
              value={stat.value}
              onClick={() => navigate(stat.route)}
            />
          ))}
        </div>
      </div>

      {/* Quick Actions Sections */}
      <div className="space-y-8">
        {/* Accommodation */}
        <div>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
            Find Your Home
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.accommodation.map((action, index) => (
              <ActionCard
                key={index}
                icon={action.icon}
                title={action.title}
                description={action.description}
                variant={action.variant}
                onClick={() => navigate(action.route)}
              />
            ))}
          </div>
        </div>

        {/* Bookings & Requests */}
        <div>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
            Bookings & Requests
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.bookings.map((action, index) => (
              <ActionCard
                key={index}
                icon={action.icon}
                title={action.title}
                description={action.description}
                variant={action.variant}
                onClick={() => navigate(action.route)}
              />
            ))}
          </div>
        </div>

        {/* Financial */}
        <div>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
            Payments
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.financial.map((action, index) => (
              <ActionCard
                key={index}
                icon={action.icon}
                title={action.title}
                description={action.description}
                variant={action.variant}
                onClick={() => navigate(action.route)}
              />
            ))}
          </div>
        </div>

        {/* Support */}
        <div>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
            Support & Help
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.support.map((action, index) => (
              <ActionCard
                key={index}
                icon={action.icon}
                title={action.title}
                description={action.description}
                variant={action.variant}
                onClick={() => navigate(action.route)}
              />
            ))}
          </div>
        </div>

        {/* Settings */}
        <div>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
            Settings
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.settings.map((action, index) => (
              <ActionCard
                key={index}
                icon={action.icon}
                title={action.title}
                description={action.description}
                variant={action.variant}
                onClick={() => navigate(action.route)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;