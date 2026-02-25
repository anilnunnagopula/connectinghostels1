import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "./context/AuthContext";
import { DarkModeProvider } from "./context/DarkModeContext";
import { SocketProvider } from "./context/SocketContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";
import HostelListings from "./pages/HostelListings";
import Contact from "./pages/Contact";
import StudentDashboard from "./pages/student/StudentDashboard";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import PageNotFound from "./pages/PageNotFound";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ViewProfile from "./pages/ViewProfile";
import EditProfile from "./pages/EditProfile";
import StudentSettingsPage from "./pages/student/SettingsPage";
import MyBookingsPage from "./pages/student/MyBookingsPage";
import CompleteProfile from "./pages/CompleteProfile";

// Owner Layout
import OwnerLayout from "./components/layout/OwnerLayout";

// Owner Pages
import RulesAndRegulations from "./pages/owner/RulesAndRegulations";
import AddHostel from "./pages/owner/AddHostel";
import ViewRequests from "./pages/owner/ViewRequests";
import AddStudent from "./pages/owner/AddStudent";
import SendAlerts from "./pages/owner/SendAlerts";
import MyHostels from "./pages/owner/MyHostels";
import FilledRooms from "./pages/owner/FilledRooms";
import MyStudents from "./pages/owner/MyStudents";
import ViewComplaints from "./pages/owner/ViewComplaints";
import AvailableRooms from "./pages/owner/AvailableRooms";
import OwnerProfile from "./pages/owner/OwnerProfile";
import Interested from "./pages/student/Interested";
import Notifications from "./pages/student/Notifications";
import RecentlyViewed from "./pages/student/RecentlyViewed";
import RaiseComplaint from "./pages/student/RaiseComplaint";
import Support from "./pages/Support";
import OwnerPaymentsPage from "./pages/owner/PaymentsPage";
import OwnerSettingsPage from "./pages/owner/SettingsPage";
import OwnerNotificationsPage from "./pages/owner/OwnerNotificationsPage";
import ManageRooms from "./pages/owner/ManageRooms";

// Legal
import PrivacyPolicy from "./pages/legal/privacy-policy";
import TermsAndConditions from "./pages/legal/terms-and-conditions";
import CookiePolicy from "./pages/legal/cookie-policy";
import RefundPolicy from "./pages/legal/refund-policy";
import CommunityGuidelines from "./pages/legal/community-guidelines";
import PartnerTerms from "./pages/legal/partner-terms";
import DataProtection from "./pages/legal/data-protection";
import Transparency from "./pages/legal/transparency";

// Student
import StudentHostelDetails from "./pages/student/HostelDetails";
import MyHostelPage from "./pages/student/MyHostelPage";
import BookingRequestPage from "./pages/student/BookingRequestPage";
import StudentRequestsStatus from "./pages/student/StudentRequestsStatus";
import MyHostelRules from "./pages/student/MyHostelRules";
import MyRoomDetails from "./pages/student/MyRoomDetails";
import PayHostelFee from "./pages/student/PaymentsPage";
import StudentLayout from "./components/layout/StudentLayout";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";

// Owner - Hostel Details
import OwnerHostelDetails from "./pages/owner/HostelDetails";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60_000, retry: 1, refetchOnWindowFocus: false },
  },
});

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -8 },
};
const pageTransition = { duration: 0.22, ease: "easeOut" };

// Wraps public (non-layout) route content with a fade transition
const P = ({ children }) => (
  <motion.div
    variants={pageVariants}
    initial="initial"
    animate="in"
    exit="out"
    transition={pageTransition}
  >
    {children}
  </motion.div>
);

// Inner component so useLocation works inside <Router>
const AppContent = () => {
  const location = useLocation();
  return (
    <>
      <Navbar />
      <ErrorBoundary>
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>

            {/* Public Routes */}
            <Route path="/" element={<P><Home /></P>} />
            <Route path="/login" element={<P><Login /></P>} />
            <Route path="/register" element={<P><Register /></P>} />
            <Route path="/about" element={<P><About /></P>} />
            <Route path="/contact" element={<P><Contact /></P>} />
            <Route path="/forgot-password" element={<P><ForgotPassword /></P>} />
            <Route path="/reset-password/:token" element={<P><ResetPassword /></P>} />
            <Route path="/complete-profile" element={<P><CompleteProfile /></P>} />
            <Route path="/profile" element={<P><ViewProfile /></P>} />
            <Route path="/edit-profile" element={<P><EditProfile /></P>} />
            <Route path="/support" element={<P><Support /></P>} />

            {/* Student Routes - All Wrapped in StudentLayout + ProtectedRoute */}
            <Route
              path="/student-dashboard"
              element={
                <ProtectedRoute role="student">
                  <StudentLayout>
                    <StudentDashboard />
                  </StudentLayout>
                </ProtectedRoute>
              }
            />
            <Route path="/student/profile-settings" element={<ProtectedRoute role="student"><StudentLayout><StudentSettingsPage /></StudentLayout></ProtectedRoute>} />
            <Route path="/student/hostels" element={<ProtectedRoute role="student"><StudentLayout><HostelListings /></StudentLayout></ProtectedRoute>} />
            <Route path="/student/hostels/:id" element={<ProtectedRoute role="student"><StudentLayout><StudentHostelDetails /></StudentLayout></ProtectedRoute>} />
            <Route path="/student/interested" element={<ProtectedRoute role="student"><StudentLayout><Interested /></StudentLayout></ProtectedRoute>} />
            <Route path="/student/notifications" element={<ProtectedRoute role="student"><StudentLayout><Notifications /></StudentLayout></ProtectedRoute>} />
            <Route path="/student/recently-viewed" element={<ProtectedRoute role="student"><StudentLayout><RecentlyViewed /></StudentLayout></ProtectedRoute>} />
            <Route path="/booking-request/:hostelId" element={<ProtectedRoute role="student"><StudentLayout><BookingRequestPage /></StudentLayout></ProtectedRoute>} />
            <Route path="/student/raise-complaint" element={<ProtectedRoute role="student"><StudentLayout><RaiseComplaint /></StudentLayout></ProtectedRoute>} />
            <Route path="/student/my-requests" element={<ProtectedRoute role="student"><StudentLayout><StudentRequestsStatus /></StudentLayout></ProtectedRoute>} />
            <Route path="/student/my-room" element={<ProtectedRoute role="student"><StudentLayout><MyRoomDetails /></StudentLayout></ProtectedRoute>} />
            <Route path="/student/rules-and-regulations" element={<ProtectedRoute role="student"><StudentLayout><MyHostelRules /></StudentLayout></ProtectedRoute>} />
            <Route path="/student/payments" element={<ProtectedRoute role="student"><StudentLayout><PayHostelFee /></StudentLayout></ProtectedRoute>} />
            <Route path="/student/my-bookings" element={<ProtectedRoute role="student"><StudentLayout><MyBookingsPage /></StudentLayout></ProtectedRoute>} />
            <Route path="/student/my-hostel" element={<ProtectedRoute role="student"><StudentLayout><MyHostelPage /></StudentLayout></ProtectedRoute>} />

            {/* Owner Routes - Wrapped in OwnerLayout + ProtectedRoute */}
            <Route path="/owner-dashboard" element={<ProtectedRoute role="owner"><OwnerLayout><OwnerDashboard /></OwnerLayout></ProtectedRoute>} />
            <Route path="/owner/add-hostel" element={<ProtectedRoute role="owner"><OwnerLayout><AddHostel /></OwnerLayout></ProtectedRoute>} />
            <Route path="/owner/view-requests" element={<ProtectedRoute role="owner"><OwnerLayout><ViewRequests /></OwnerLayout></ProtectedRoute>} />
            <Route path="/owner/add-student" element={<ProtectedRoute role="owner"><OwnerLayout><AddStudent /></OwnerLayout></ProtectedRoute>} />
            <Route path="/owner/send-alerts" element={<ProtectedRoute role="owner"><OwnerLayout><SendAlerts /></OwnerLayout></ProtectedRoute>} />
            <Route path="/owner/my-hostels" element={<ProtectedRoute role="owner"><OwnerLayout><MyHostels /></OwnerLayout></ProtectedRoute>} />
            <Route path="/owner/filled-rooms" element={<ProtectedRoute role="owner"><OwnerLayout><FilledRooms /></OwnerLayout></ProtectedRoute>} />
            <Route path="/owner/my-students" element={<ProtectedRoute role="owner"><OwnerLayout><MyStudents /></OwnerLayout></ProtectedRoute>} />
            <Route path="/owner/view-complaints" element={<ProtectedRoute role="owner"><OwnerLayout><ViewComplaints /></OwnerLayout></ProtectedRoute>} />
            <Route path="/owner/available-rooms" element={<ProtectedRoute role="owner"><OwnerLayout><AvailableRooms /></OwnerLayout></ProtectedRoute>} />
            <Route path="/owner/manage-rooms" element={<ProtectedRoute role="owner"><OwnerLayout><ManageRooms /></OwnerLayout></ProtectedRoute>} />
            <Route path="/owner/rules-and-regulations" element={<ProtectedRoute role="owner"><OwnerLayout><RulesAndRegulations /></OwnerLayout></ProtectedRoute>} />
            <Route path="/owner/payment-settings" element={<ProtectedRoute role="owner"><OwnerLayout><OwnerPaymentsPage /></OwnerLayout></ProtectedRoute>} />
            <Route path="/owner/profile-settings" element={<ProtectedRoute role="owner"><OwnerLayout><OwnerSettingsPage /></OwnerLayout></ProtectedRoute>} />
            <Route path="/owner/notifications" element={<ProtectedRoute role="owner"><OwnerLayout><OwnerNotificationsPage /></OwnerLayout></ProtectedRoute>} />
            <Route path="/owner/profile" element={<ProtectedRoute role="owner"><OwnerLayout><OwnerProfile /></OwnerLayout></ProtectedRoute>} />
            <Route path="/owner/hostel/:id/view" element={<ProtectedRoute role="owner"><OwnerLayout><OwnerHostelDetails /></OwnerLayout></ProtectedRoute>} />
            <Route path="/owner/hostel/:id/edit" element={<ProtectedRoute role="owner"><OwnerLayout><AddHostel /></OwnerLayout></ProtectedRoute>} />

            {/* Legal Routes */}
            <Route path="/legal/privacy-policy" element={<PrivacyPolicy />} />
            <Route
              path="/legal/terms-and-conditions"
              element={<TermsAndConditions />}
            />
            <Route path="/legal/cookie-policy" element={<CookiePolicy />} />
            <Route path="/legal/refund-policy" element={<RefundPolicy />} />
            <Route
              path="/legal/community-guidelines"
              element={<CommunityGuidelines />}
            />
            <Route path="/legal/partner-terms" element={<PartnerTerms />} />
            <Route path="/legal/data-protection" element={<DataProtection />} />
            <Route path="/legal/transparency" element={<Transparency />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />

            {/* 404 Page */}
            <Route path="*" element={<P><PageNotFound /></P>} />
          </Routes>
        </AnimatePresence>
      </ErrorBoundary>
      <Footer />
    </>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <DarkModeProvider>
            <SocketProvider>
              <AppContent />
            </SocketProvider>
          </DarkModeProvider>
        </AuthProvider>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;
