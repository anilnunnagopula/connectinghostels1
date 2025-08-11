import React, { useState, useEffect } from "react";
import {
  Building,
  MapPin,
  Image,
  ArrowLeft,
  Search,
  ArrowRight,
  Send,
  Loader2,
  List,
  Home,
  BedDouble,
  Calendar,
  ShieldCheck,
  History,
  IndianRupee,
  MessageSquareWarning,
  FileText,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import HostelListings from "../HostelListings"; //  HostelListings 

// The authentication token is retrieved from local storage
const getToken = () => localStorage.getItem("token");

const MyHostel = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [hostel, setHostel] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [locationFilter, setLocationFilter] = useState("Mangalpally");

  // --- Fetch Booking Data and Current Hostel ---
  const fetchData = async () => {
    setLoading(true);
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      // Fetch all bookings for the student
      const bookingsRes = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/student/bookings`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBookings(bookingsRes.data.bookings);

      // Find the active booking to display as the current hostel
      const activeBooking = bookingsRes.data.bookings.find(
        (b) => b.status === "Active"
      );
      if (activeBooking) {
        setHostel(activeBooking.hostel);
      } else {
        setHostel(null);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      toast.error(err.response?.data?.message || "Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [navigate]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsSearching(true);
    const token = getToken();
    try {
      const url = new URL(
        `${process.env.REACT_APP_API_URL}/api/student/search-hostel`
      );
      url.searchParams.append("location", locationFilter);

      const res = await axios.get(url.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSearchResults(res.data.hostels);
    } catch (err) {
      console.error("Error fetching hostels:", err);
      toast.error("Failed to fetch hostels.");
    } finally {
      setIsSearching(false);
    }
  };


  const handleRequest = async (hostelId) => {
    const token = getToken();
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/student/booking-request`,
        { hostelId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Booking request sent successfully!");
    } catch (err) {
      console.error("Error sending request:", err);
      toast.error(err.response?.data?.message || "Failed to send request.");
    }
  };

  const activeBooking = bookings.find((b) => b.status === "Active");
  const pastBookings = bookings.filter((b) => b.status === "Completed");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white p-4 sm:p-6 font-inter">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            <ArrowLeft />
          </button>
          <h1 className="text-3xl font-bold flex-1 text-center">Your Hostel</h1>
          {hostel ? (
            <span className="opacity-0 w-8 h-8"></span>
          ) : (
            <div className="flex items-center gap-2">
              <Home className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <select
                value={locationFilter}
                onChange={(e) => {
                  setLocationFilter(e.target.value);
                  setSearchResults([]);
                }}
                className="px-2 py-2 border rounded-md dark:bg-slate-800 dark:text-white"
              >
                <option value="Mangalpally">Mangalpally</option>
                <option value="Adibatla">Adibatla</option>
                <option value="Sheriguda">Sheriguda</option>
                <option value="Dilsukhnagar">Dilsukhnagar</option>
                <option value="Maisammaguda">Maisammaguda</option>
                <option value="Narayanaguda">Narayanaguda</option>
                <option value="Others">Others</option>
              </select>
            </div>
          )}
        </div>

        {activeBooking ? (
          // UI for students with an assigned hostel (Current Stay)
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border-l-4 border-green-500">
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
                <BedDouble size={22} /> Current Stay
              </h2>
              <div className="flex flex-col sm:flex-row justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold">
                    {activeBooking.hostel.name}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 mt-1">
                    Room {activeBooking.roomNumber}, {activeBooking.roomInfo}
                  </p>
                </div>
                <span className="mt-2 sm:mt-0 text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 px-3 py-1 rounded-full flex items-center gap-1">
                  <ShieldCheck size={14} /> Active
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-4 flex items-center gap-2">
                <Calendar size={16} /> Checked-in since:{" "}
                {new Date(activeBooking.checkInDate).toLocaleDateString()}
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
                  className="flex items-center gap-2 text-sm font-semibold bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  <MessageSquareWarning size={16} /> Raise Complaint
                </button>
                <button
                  onClick={() => navigate("/student/rules-and-regulations")}
                  className="flex items-center gap-2 text-sm font-semibold bg-slate-100 dark:bg-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  <FileText size={16} /> View Rules
                </button>
              </div>
            </div>

            {/* Past Bookings Section */}
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <History size={22} /> Stay History
            </h2>
            {pastBookings.length > 0 ? (
              <div className="space-y-4">
                {pastBookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md flex justify-between items-center"
                  >
                    <div>
                      <h4 className="font-bold">{booking.hostel.name}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Duration:{" "}
                        {new Date(booking.checkInDate).toLocaleDateString()} -{" "}
                        {new Date(booking.checkOutDate).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        navigate(`/student/hostels/${booking.hostel._id}`)
                      }
                      className="text-sm font-semibold bg-blue-500 text-white px-3 py-1.5 rounded-md hover:bg-blue-600 transition-colors"
                    >
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
        ) : (
          // UI for students without an assigned hostel
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 space-y-6">
            <h2 className="text-2xl font-bold text-center">
              You are not yet assigned to a hostel.
            </h2>
            <p className="text-center text-slate-500 dark:text-slate-400">
              Search for a hostel to send a booking request.
            </p>
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by hostel name..."
                className="flex-grow px-4 py-2 rounded-md bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button
                type="submit"
                disabled={isSearching}
                className="bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
              >
                {isSearching ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Search />
                )}
              </button>
            </form>

            {searchResults.length > 0 && (
              <div className="space-y-4 mt-6">
                <h3 className="text-xl font-semibold">
                  Search Results in {locationFilter}
                </h3>
                {searchResults.map((result) => (
                  <div
                    key={result._id}
                    className="bg-slate-100 dark:bg-slate-700 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                  >
                    <div>
                      <p className="font-bold">{result.name}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <MapPin size={16} /> {result.location}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRequest(result._id)}
                      disabled={isSearching}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send Request
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyHostel;
