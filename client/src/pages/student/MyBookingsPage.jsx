import React from "react";
import { useNavigate } from "react-router-dom";
import {
  BedDouble,
  Calendar,
  ShieldCheck,
  History,
  IndianRupee,
  MessageSquareWarning,
  FileText,
} from "lucide-react";

// Dummy data for UI demonstration
const dummyBookings = [
  {
    id: "booking_active_01",
    hostelName: "Sunrise Boys Hostel",
    roomInfo: "Room 201, 2-Sharing AC",
    checkInDate: "July 15, 2025",
    status: "Active",
  },
  {
    id: "booking_past_01",
    hostelName: "Green Valley Living",
    duration: "Jan 2025 - June 2025",
    status: "Completed",
  },
  {
    id: "booking_past_02",
    hostelName: "City Center Co-ed",
    duration: "July 2024 - Dec 2024",
    status: "Completed",
  },
];

const MyBookingsPage = () => {
  const navigate = useNavigate();
  const activeBooking = dummyBookings.find((b) => b.status === "Active");
  const pastBookings = dummyBookings.filter((b) => b.status === "Completed");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

        {/* Active Booking Section */}
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <BedDouble size={22} /> Current Stay
        </h2>
        {activeBooking ? (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border-l-4 border-green-500 mb-10">
            <div className="flex flex-col sm:flex-row justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold">
                  {activeBooking.hostelName}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                  {activeBooking.roomInfo}
                </p>
              </div>
              <span className="mt-2 sm:mt-0 text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 px-3 py-1 rounded-full flex items-center gap-1">
                <ShieldCheck size={14} /> Active
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-4 flex items-center gap-2">
              <Calendar size={16} /> Checked-in since:{" "}
              {activeBooking.checkInDate}
            </p>
            <div className="flex flex-wrap gap-3 mt-6 border-t border-slate-200 dark:border-slate-700 pt-4">
              <button
                onClick={() => navigate("/student/payments")}
                className="flex items-center gap-2 text-sm font-semibold bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <IndianRupee size={16} /> Pay Rent
              </button>
              <button
                onClick={() => navigate("/student/raise-complaint")}
                className="flex items-center gap-2 text-sm font-semibold bg-slate-100 dark:bg-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                <MessageSquareWarning size={16} /> Raise Complaint
              </button>
              <button className="flex items-center gap-2 text-sm font-semibold bg-slate-100 dark:bg-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                <FileText size={16} /> View Rules
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-10 bg-white dark:bg-slate-800 rounded-lg mb-10">
            <p className="text-slate-500 dark:text-slate-400">
              You have no active bookings.
            </p>
            <button
              onClick={() => navigate("/student/hostels")}
              className="mt-4 text-blue-600 font-semibold hover:underline"
            >
              Browse Hostels to find your stay
            </button>
          </div>
        )}

        {/* Past Bookings Section */}
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <History size={22} /> Stay History
        </h2>
        {pastBookings.length > 0 ? (
          <div className="space-y-4">
            {pastBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md flex justify-between items-center"
              >
                <div>
                  <h4 className="font-bold">{booking.hostelName}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {booking.duration}
                  </p>
                </div>
                <button className="text-sm font-semibold bg-blue-500 text-white px-3 py-1.5 rounded-md hover:bg-blue-600 transition-colors">
                  Book Again
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-slate-500 dark:text-slate-400">
            No past booking history found.
          </p>
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;
