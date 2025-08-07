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

//owner
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


//legal
import PrivacyPolicy from "./pages/legal/privacy-policy";
import TermsAndConditions from "./pages/legal/terms-and-conditions";
import CookiePolicy from "./pages/legal/cookie-policy";
import RefundPolicy from "./pages/legal/refund-policy";
import CommunityGuidelines from "./pages/legal/community-guidelines";
import PartnerTerms from "./pages/legal/partner-terms";
import DataProtection from "./pages/legal/data-protection";
import Transparency from "./pages/legal/transparency";
//student 
import HostelDetails from "./pages/student/HostelDetails";
const App = () => {
  return (
    <Router>
      <AuthProvider>
        <DarkModeProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="/owner-dashboard" element={<OwnerDashboard />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/profile" element={<ViewProfile />} />
            <Route
              path="/student/profile-settings"
              element={<StudentSettingsPage />}
            />
            <Route path="/edit-profile" element={<EditProfile />} />
            {/* owner */}
            <Route path="/owner/add-hostel" element={<AddHostel />} />
            <Route path="/owner/view-requests" element={<ViewRequests />} />
            <Route path="/owner/add-student" element={<AddStudent />} />
            <Route path="/owner/send-alerts" element={<SendAlerts />} />
            <Route path="/owner/my-hostels" element={<MyHostels />} />
            <Route path="/owner/filled-rooms" element={<FilledRooms />} />
            <Route path="/owner/my-students" element={<MyStudents />} />
            <Route path="/owner/view-complaints" element={<ViewComplaints />} />
            <Route path="/owner/available-rooms" element={<AvailableRooms />} />
            <Route path="/owner/manage-rooms" element={<ManageRooms />} />
            <Route
              path="/owner/rules-and-regulations"
              element={<RulesAndRegulations />}
            />
            <Route path="/owner/payment-settings" element={<PaymentsPage />} />
            <Route
              path="/owner/profile-settings"
              element={<OwnerSettingsPage />}
            />
            <Route
              path="/owner/notifications"
              element={<OwnerNotificationsPage />}
            />

            {/* student  */}
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

            {/* legal  */}
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
            <Route path="/support" element={<Support />} />

            <Route path="*" element={<PageNotFound />} />
          </Routes>
          <Footer />
        </DarkModeProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
