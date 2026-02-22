import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { DarkModeProvider } from "./context/DarkModeContext";

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

// Owner - Hostel Details
import OwnerHostelDetails from "./pages/owner/HostelDetails";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <DarkModeProvider>
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/complete-profile" element={<CompleteProfile />} />
            <Route path="/profile" element={<ViewProfile />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/support" element={<Support />} />

            {/* Student Routes - All Wrapped in StudentLayout */}
            <Route
              path="/student-dashboard"
              element={
                <StudentLayout>
                  <StudentDashboard />
                </StudentLayout>
              }
            />
            <Route
              path="/student/profile-settings"
              element={
                <StudentLayout>
                  <StudentSettingsPage />
                </StudentLayout>
              }
            />
            <Route
              path="/student/hostels"
              element={
                <StudentLayout>
                  <HostelListings />
                </StudentLayout>
              }
            />
            <Route
              path="/student/hostels/:id"
              element={
                <StudentLayout>
                  <StudentHostelDetails />
                </StudentLayout>
              }
            />
            <Route
              path="/student/interested"
              element={
                <StudentLayout>
                  <Interested />
                </StudentLayout>
              }
            />
            <Route
              path="/student/notifications"
              element={
                <StudentLayout>
                  <Notifications />
                </StudentLayout>
              }
            />
            <Route
              path="/student/recently-viewed"
              element={
                <StudentLayout>
                  <RecentlyViewed />
                </StudentLayout>
              }
            />
            <Route
              path="/booking-request/:hostelId"
              element={
                <StudentLayout>
                  <BookingRequestPage />
                </StudentLayout>
              }
            />
            <Route
              path="/student/raise-complaint"
              element={
                <StudentLayout>
                  <RaiseComplaint />
                </StudentLayout>
              }
            />
            <Route
              path="/student/my-requests"
              element={
                <StudentLayout>
                  <StudentRequestsStatus />
                </StudentLayout>
              }
            />
            <Route
              path="/student/my-room"
              element={
                <StudentLayout>
                  <MyRoomDetails />
                </StudentLayout>
              }
            />
            <Route
              path="/student/rules-and-regulations"
              element={
                <StudentLayout>
                  <MyHostelRules />
                </StudentLayout>
              }
            />
            <Route
              path="/student/payments"
              element={
                <StudentLayout>
                  <PayHostelFee />
                </StudentLayout>
              }
            />
            <Route
              path="/student/my-bookings"
              element={
                <StudentLayout>
                  <MyBookingsPage />
                </StudentLayout>
              }
            />
            <Route
              path="/student/my-hostel"
              element={
                <StudentLayout>
                  <MyHostelPage />
                </StudentLayout>
              }
            />

            {/* Owner Routes - Wrapped in OwnerLayout */}
            <Route
              path="/owner-dashboard"
              element={
                <OwnerLayout>
                  <OwnerDashboard />
                </OwnerLayout>
              }
            />
            <Route
              path="/owner/add-hostel"
              element={
                <OwnerLayout>
                  <AddHostel />
                </OwnerLayout>
              }
            />
            <Route
              path="/owner/view-requests"
              element={
                <OwnerLayout>
                  <ViewRequests />
                </OwnerLayout>
              }
            />
            <Route
              path="/owner/add-student"
              element={
                <OwnerLayout>
                  <AddStudent />
                </OwnerLayout>
              }
            />
            <Route
              path="/owner/send-alerts"
              element={
                <OwnerLayout>
                  <SendAlerts />
                </OwnerLayout>
              }
            />
            <Route
              path="/owner/my-hostels"
              element={
                <OwnerLayout>
                  <MyHostels />
                </OwnerLayout>
              }
            />
            <Route
              path="/owner/filled-rooms"
              element={
                <OwnerLayout>
                  <FilledRooms />
                </OwnerLayout>
              }
            />
            <Route
              path="/owner/my-students"
              element={
                <OwnerLayout>
                  <MyStudents />
                </OwnerLayout>
              }
            />
            <Route
              path="/owner/view-complaints"
              element={
                <OwnerLayout>
                  <ViewComplaints />
                </OwnerLayout>
              }
            />
            <Route
              path="/owner/available-rooms"
              element={
                <OwnerLayout>
                  <AvailableRooms />
                </OwnerLayout>
              }
            />
            <Route
              path="/owner/manage-rooms"
              element={
                <OwnerLayout>
                  <ManageRooms />
                </OwnerLayout>
              }
            />
            <Route
              path="/owner/rules-and-regulations"
              element={
                <OwnerLayout>
                  <RulesAndRegulations />
                </OwnerLayout>
              }
            />
            <Route
              path="/owner/payment-settings"
              element={
                <OwnerLayout>
                  <OwnerPaymentsPage />
                </OwnerLayout>
              }
            />
            <Route
              path="/owner/profile-settings"
              element={
                <OwnerLayout>
                  <OwnerSettingsPage />
                </OwnerLayout>
              }
            />
            <Route
              path="/owner/notifications"
              element={
                <OwnerLayout>
                  <OwnerNotificationsPage />
                </OwnerLayout>
              }
            />
            <Route
              path="/owner/hostel/:id/view"
              element={
                <OwnerLayout>
                  <OwnerHostelDetails />
                </OwnerLayout>
              }
            />
            <Route
              path="/owner/hostel/:id/edit"
              element={
                <OwnerLayout>
                  <AddHostel />
                </OwnerLayout>
              }
            />

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
            <Route path="/admin" element={<AdminDashboard />} />

            {/* 404 Page */}
            <Route path="*" element={<PageNotFound />} />
          </Routes>
          <Footer />
        </DarkModeProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
