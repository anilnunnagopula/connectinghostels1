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
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// The authentication token is retrieved from local storage
const getToken = () => localStorage.getItem("token");

const MyHostelPage = () => {
  const navigate = useNavigate();
  const [hostel, setHostel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [locationFilter, setLocationFilter] = useState("Mangalpally");

  const fetchMyHostel = async () => {
    setLoading(true);
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      // ✅ NEW: Fetch the student's assigned hostel from the backend
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/student/my-hostel`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHostel(res.data.hostel);
    } catch (err) {
      console.error("Error fetching hostel:", err);
      if (err.response?.status === 404) {
        setHostel(null); // No hostel assigned
      } else {
        toast.error(
          err.response?.data?.message || "Failed to fetch hostel details."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyHostel();
  }, [navigate]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsSearching(true);
    const token = getToken();
    try {
      // ✅ UPDATED: Send location and search term as query parameters
      const url = new URL(
        `${process.env.REACT_APP_API_URL}/api/student/search-hostel`
      );
      url.searchParams.append("query", search);
      url.searchParams.append("location", locationFilter);

      const res = await axios.get(url.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSearchResults(res.data.hostels);
    } catch (err) {
      console.error("Error searching hostels:", err);
      toast.error("Failed to search for hostels.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleRequest = async (hostelId) => {
    const token = getToken();
    try {
      // ✅ NEW: Send a booking request to the hostel owner
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
            <span className="opacity-0 w-8 h-8"></span> // Placeholder
          ) : (
            <div className="flex items-center gap-2">
              <Home className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <select
                value={locationFilter}
                onChange={(e) => {
                  setLocationFilter(e.target.value);
                  setSearchResults([]); // Clear results on filter change
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

        {hostel ? (
          // UI for students with an assigned hostel
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Building className="text-blue-500" />
              {hostel.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {hostel.images && hostel.images.length > 0 && (
                <div className="w-full h-48 rounded-lg overflow-hidden">
                  <img
                    src={hostel.images[0]}
                    alt={hostel.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="space-y-4">
                <p className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <MapPin /> {hostel.location}
                </p>
                <p className="text-slate-500 dark:text-slate-400">
                  <strong className="text-slate-800 dark:text-white">
                    Category:
                  </strong>{" "}
                  {hostel.type}
                </p>
                <p className="text-slate-500 dark:text-slate-400">
                  <strong className="text-slate-800 dark:text-white">
                    Description:
                  </strong>{" "}
                  {hostel.description}
                </p>
                <p className="text-slate-500 dark:text-slate-400">
                  <strong className="text-slate-800 dark:text-white">
                    Facilities:
                  </strong>{" "}
                  {hostel.facilities}
                </p>
                <p className="text-slate-500 dark:text-slate-400">
                  <strong className="text-slate-800 dark:text-white">
                    Rooms:
                  </strong>{" "}
                  {hostel.rooms}
                </p>
                <button
                  onClick={() => navigate("/student/rules-and-regulations")}
                  className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                >
                  View Rules & Regulations
                </button>
                <button
                  onClick={() => navigate("/student/submit-complaint")}
                  className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition"
                >
                  Submit a Complaint
                </button>
              </div>
            </div>
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

export default MyHostelPage;
