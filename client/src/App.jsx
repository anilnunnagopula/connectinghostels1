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
import StudentPaymentsPage from "./pages/student/PaymentsPage";
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
import PaymentsPage from "./pages/owner/PaymentsPage";
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

// Owner - Hostel Details (FIXED IMPORT)
import OwnerHostelDetails from "./pages/owner/HostelDetails";

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

            {/* Student Routes (No Layout Wrapper Yet) */}
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route
              path="/student/profile-settings"
              element={<StudentSettingsPage />}
            />
            <Route path="/student/hostels" element={<HostelListings />} />
            <Route path="/student/hostels/:id" element={<HostelListings />} />
            <Route path="/student/interested" element={<Interested />} />
            <Route path="/student/notifications" element={<Notifications />} />
            <Route
              path="/student/recently-viewed"
              element={<RecentlyViewed />}
            />
            <Route
              path="/student/raise-complaint"
              element={<RaiseComplaint />}
            />
            <Route path="/student/payments" element={<StudentPaymentsPage />} />
            <Route path="/student/my-bookings" element={<MyBookingsPage />} />
            <Route path="/student/my-hostel" element={<MyHostelPage />} />

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
                  <PaymentsPage />
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
            {/* Owner Hostel Routes - FIXED TO USE OWNER COMPONENT */}
            <Route
              path="/owner/hostel/:id/view"
              element={
                <OwnerLayout>
                  <OwnerHostelDetails /> {/* ✅ NOW USING OWNER VERSION */}
                </OwnerLayout>
              }
            />
            <Route
              path="/owner/hostel/:id/edit"
              element={
                <OwnerLayout>
                  <AddHostel /> {/* Reusing AddHostel for editing logic */}
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
