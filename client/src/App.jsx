import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import RaiseComplaint from "./RaiseComplaint";
const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/student/hostels" element={<HostelListings />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/owner-dashboard" element={<OwnerDashboard />}/>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/profile" element={<ViewProfile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/owner/add-hostel" element={<AddHostel />} />
        <Route path="/owner/view-requests" element={<ViewRequests />} />
        <Route path="/owner/add-student" element={<AddStudent />} />
        <Route path="/owner/send-alerts" element={<SendAlerts />} />
        <Route path="/owner/my-hostels" element={<MyHostels />} />
        <Route path="/owner/filledrooms" element={<FilledRooms />} />
        <Route path="/owner/my-students" element={<MyStudents />} />
        <Route path="/owner/view-complaints" element={<ViewComplaints />} />
        <Route path="/owner/available-rooms" element={<AvailableRooms />} />
        <Route path="/student/interested" element={<Interested/>} />
        <Route path="/student/notifications" element={<Notifications/>} />
        <Route path="/student/recently-viewed" element={<RecentlyViewed/>} />
        <Route path="/student/raise-complaint" element={<RaiseComplaint/>} />

        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
