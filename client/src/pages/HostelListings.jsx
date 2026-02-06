// import React, { useState } from "react";
// import { Link } from "react-router-dom";

// const HostelListings = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [typeFilter, setTypeFilter] = useState("All");
//   const [sortOrder, setSortOrder] = useState("None");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [locationFilter, setLocationFilter] = useState("Mangalpally");

//   const itemsPerPage = 12;

//   const hostels = [
//     {
//       id: 1,
//       name: "Sri Hasha Boys Hostel",
//       type: "Boys",
//       location: "Mangalpally",
//       price: 5500,
//       available: true,
//       features: ["✅ AC", "🚿 Attached Bathroom", "📶 Wi-Fi"],
//       imageUrl:
//         "https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
//     },
//     {
//       id: 2,
//       name: "Manjunath Boys Hostel",
//       type: "Boys",
//       location: "Sheriguda",
//       price: 5000,
//       available: false,
//       features: ["🚿 Attached Bathroom"],
//       imageUrl:
//         "https://images.pexels.com/photos/262048/pexels-photo-262048.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
//     },
//     {
//       id: 3,
//       name: "Annapurna Ladies Hostel",
//       type: "Girls",
//       location: "Dilsukhnagar",
//       price: 5200,
//       available: true,
//       features: ["📶 Wi-Fi", "🧺 Laundry"],
//       imageUrl:
//         "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
//     },
//     {
//       id: 4,
//       name: "Sai Krupa Boys Hostel",
//       type: "Boys",
//       location: "Mangalpally",
//       price: 4800,
//       available: true,
//       features: ["🍽️ Mess", "📶 Wi-Fi"],
//       imageUrl:
//         "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
//     },
//     {
//       id: 5,
//       name: "CoLive Orange Nest",
//       type: "Co-Living",
//       location: "Maisammaguda",
//       price: 5500,
//       available: true,
//       features: ["🛋️ Furnished", "📺 TV Lounge"],
//       imageUrl:
//         "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
//     },
//     {
//       id: 6,
//       name: "Sri Venkateshwara Residency",
//       type: "Boys",
//       location: "Sheriguda",
//       price: 4700,
//       available: true,
//       features: ["✅ AC", "📶 Wi-Fi"],
//       imageUrl:
//         "https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
//     },
//     {
//       id: 7,
//       name: "Sri Lakshmi Girls Hostel",
//       type: "Girls",
//       location: "Mangalpally",
//       price: 5300,
//       available: true,
//       features: ["👮 Security", "📶 Wi-Fi"],
//       imageUrl:
//         "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
//     },
//     {
//       id: 8,
//       name: "Shiva Sai Boys Mansion",
//       type: "Boys",
//       location: "Mangalpally",
//       price: 4600,
//       available: false,
//       features: ["🧹 Housekeeping"],
//       imageUrl:
//         "https://images.pexels.com/photos/262048/pexels-photo-262048.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
//     },
//     {
//       id: 9,
//       name: "Orange Blossom",
//       type: "Boys",
//       location: "Mangalpally",
//       price: 5600,
//       available: true,
//       features: ["✅ AC", "🛏️ Twin Beds"],
//       imageUrl:
//         "https://images.pexels.com/photos/262048/pexels-photo-262048.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
//     },
//     {
//       id: 10,
//       name: "Nandini Nivas",
//       type: "Girls",
//       location: "Mangalpally",
//       price: 5000,
//       available: true,
//       features: ["🚿 Attached Bathroom", "📶 Wi-Fi"],
//       imageUrl:
//         "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
//     },
//     {
//       id: 11,
//       name: "Padmavathi Residency",
//       type: "Girls",
//       location: "Mangalpally",
//       price: 5200,
//       available: true,
//       features: ["🧺 Laundry", "👮 Security"],
//       imageUrl:
//         "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
//     },
//     {
//       id: 12,
//       name: "Govinda Boys Hostel",
//       type: "Boys",
//       location: "Mangalpally",
//       price: 4500,
//       available: true,
//       features: ["🍽️ Mess"],
//       imageUrl:
//         "https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
//     },
//     // --- Added More Hostels for Mangalpally ---
//     {
//       id: 13,
//       name: "New Gen Boys Hostel",
//       type: "Boys",
//       location: "Mangalpally",
//       price: 5100,
//       available: true,
//       features: ["📶 Wi-Fi", "Parking"],
//       imageUrl:
//         "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
//     },
//     {
//       id: 14,
//       name: "Comfort Stay Girls Hostel",
//       type: "Girls",
//       location: "Mangalpally",
//       price: 5350,
//       available: true,
//       features: ["✅ AC", "👮 Security"],
//       imageUrl:
//         "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
//     },
//     {
//       id: 15,
//       name: "Prime Living Boys PG",
//       type: "Boys",
//       location: "Mangalpally",
//       price: 4950,
//       available: true,
//       features: ["🍽️ Mess", "🧹 Housekeeping"],
//       imageUrl:
//         "https://images.pexels.com/photos/262048/pexels-photo-262048.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
//     },
//     {
//       id: 16,
//       name: "Royal Ladies Hostel",
//       type: "Girls",
//       location: "Mangalpally",
//       price: 5500,
//       available: true,
//       features: ["🚿 Attached Bathroom", "🧺 Laundry"],
//       imageUrl:
//         "https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
//     },
//     {
//       id: 17,
//       name: "Elite Stay for Men",
//       type: "Boys",
//       location: "Mangalpally",
//       price: 5800,
//       available: false,
//       features: ["✅ AC", "📶 Wi-Fi", "📺 TV Lounge"],
//       imageUrl:
//         "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
//     },
//   ];

//   let filteredHostels = hostels
//     .filter((item) => item.location === locationFilter)
//     .filter((item) =>
//       item.name.toLowerCase().includes(searchTerm.toLowerCase())
//     )
//     .filter((item) => typeFilter === "All" || item.type === typeFilter);

//   if (sortOrder === "asc") {
//     filteredHostels.sort((a, b) => a.price - b.price);
//   } else if (sortOrder === "desc") {
//     filteredHostels.sort((a, b) => b.price - a.price);
//   }

//   const indexOfLast = currentPage * itemsPerPage;
//   const indexOfFirst = indexOfLast - itemsPerPage;
//   const currentHostels = filteredHostels.slice(indexOfFirst, indexOfLast);

//   return (
//     <div className="min-h-screen px-6 py-6 bg-slate-50 dark:bg-slate-900">
//       <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
//         <div>
//           <select
//             value={locationFilter}
//             onChange={(e) => {
//               setLocationFilter(e.target.value);
//               setCurrentPage(1);
//             }}
//             className="px-2 py-2 border rounded-md dark:bg-slate-800 dark:text-white"
//           >
//             <option value="Mangalpally">Mangalpally</option>
//             <option value="Adibatla">Adibatla</option>
//             <option value="Sheriguda">Sheriguda</option>
//             <option value="Dilsukhnagar">Dilsukhnagar</option>
//             <option value="Maisammaguda">Maisammaguda</option>
//             <option value="Narayanaguda">Narayanaguda</option>
//             <option value="Others">Others</option>
//           </select>
//         </div>
//         <div className="relative max-w-md mx-auto w-full">
//           <span className="absolute left-3 top-2.5 text-slate-400">🔍</span>
//           <input
//             type="text"
//             placeholder="Search Hostels..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full pl-10 pr-4 py-2 border rounded-md dark:bg-slate-800 dark:text-white"
//           />
//         </div>
//         <div className="flex gap-2">
//           <select
//             value={typeFilter}
//             onChange={(e) => setTypeFilter(e.target.value)}
//             className="px-2 py-2 border rounded-md dark:bg-slate-800 dark:text-white"
//           >
//             <option value="All">All Types</option>
//             <option value="Boys">Boys</option>
//             <option value="Girls">Girls</option>
//             <option value="Co-Living">Co-Living</option>
//           </select>
//           <select
//             value={sortOrder}
//             onChange={(e) => setSortOrder(e.target.value)}
//             className="px-2 py-2 border rounded-md dark:bg-slate-800 dark:text-white"
//           >
//             <option value="None">Sort by Price</option>
//             <option value="asc">Low to High</option>
//             <option value="desc">High to Low</option>
//           </select>
//         </div>
//       </div>

//       {currentHostels.length === 0 ? (
//         // Restored your "naughty" message for the co-living filter
//         typeFilter === "Co-Living" ? (
//           <div className="text-center text-pink-600 dark:text-pink-400 text-xl mt-6 font-semibold animate-bounce">
//             😏 Hey naughty, there are no co-lives in {locationFilter}!
//           </div>
//         ) : (
//           <div className="text-center text-red-500 text-xl mt-10">
//             😕 No hostels found matching your criteria in{" "}
//             <b>{locationFilter}</b>!
//           </div>
//         )
//       ) : (
//         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-4">
//           {currentHostels.map((hostel) => (
//             <Link
//               to={`/student/hostels/${hostel.id}`}
//               key={hostel.id}
//               className="group"
//             >
//               <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
//                 <div className="relative">
//                   <img
//                     src={hostel.imageUrl}
//                     alt={hostel.name}
//                     className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
//                   />
//                   <div
//                     className={`absolute top-2 right-2 px-2 py-1 text-xs font-semibold rounded-full text-white ${
//                       hostel.available ? "bg-green-500" : "bg-red-500"
//                     }`}
//                   >
//                     {hostel.available ? "Available" : "Full"}
//                   </div>
//                 </div>
//                 <div className="p-4">
//                   <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">
//                     {hostel.name}
//                   </h3>
//                   <p className="text-sm text-slate-500 dark:text-slate-400">
//                     {hostel.location}
//                   </p>
//                   <div className="mt-2 flex flex-wrap gap-2">
//                     {hostel.features?.map((tag, idx) => (
//                       <span
//                         key={idx}
//                         className="px-2 py-1 text-xs rounded-full bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200"
//                       >
//                         {tag}
//                       </span>
//                     ))}
//                   </div>
//                   <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 mt-3">
//                     ₹{hostel.price}/month
//                   </p>
//                 </div>
//               </div>
//             </Link>
//           ))}
//         </div>
//       )}

//       {filteredHostels.length > itemsPerPage && (
//         <div className="flex justify-center items-center gap-2 mt-10">
//           <button
//             onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//             disabled={currentPage === 1}
//             className="px-3 py-1 rounded bg-slate-300 dark:bg-slate-700 disabled:opacity-50"
//           >
//             ⬅ Prev
//           </button>
//           {Array.from({
//             length: Math.ceil(filteredHostels.length / itemsPerPage),
//           }).map((_, index) => (
//             <button
//               key={index}
//               onClick={() => setCurrentPage(index + 1)}
//               className={`px-3 py-1 rounded border ${
//                 currentPage === index + 1
//                   ? "bg-blue-600 text-white"
//                   : "bg-white dark:bg-slate-800"
//               }`}
//             >
//               {index + 1}
//             </button>
//           ))}
//           <button
//             onClick={() =>
//               setCurrentPage((prev) =>
//                 prev < Math.ceil(filteredHostels.length / itemsPerPage)
//                   ? prev + 1
//                   : prev
//               )
//             }
//             disabled={
//               currentPage === Math.ceil(filteredHostels.length / itemsPerPage)
//             }
//             className="px-3 py-1 rounded bg-slate-300 dark:bg-slate-700 disabled:opacity-50"
//           >
//             Next ➡
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default HostelListings;
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Heart, Search, Loader2 } from "lucide-react";
import LoginPrompt from "../components/LoginPrompt";

const HostelListings = () => {
  // --- STATE ---
  const navigate = useNavigate();
  const [hostels, setHostels] = useState([]);
  const [interestedIds, setInterestedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("None");
  const [currentPage, setCurrentPage] = useState(1);
  const [locationFilter, setLocationFilter] = useState("Mangalpally");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const itemsPerPage = 12;

  // Check if user is authenticated
  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    const userObj = localStorage.getItem("user");
    if (token) return true;
    if (userObj) {
      try {
        const parsed = JSON.parse(userObj);
        return !!parsed.token;
      } catch {
        return false;
      }
    }
    return false;
  };

  // --- INITIALIZE INTERESTED LIST ---
  useEffect(() => {
    const stored = localStorage.getItem("interestedHostels");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setInterestedIds(parsed.map((h) => h.id || h._id));
      } catch (e) {
        console.error("Failed to parse interested hostels");
      }
    }
  }, []);

  // --- API FETCHING (MADE PUBLIC) ---
const fetchHostels = useCallback(async () => {
  try {
    setLoading(true);
    setError(null);

    const API_BASE_URL =
      process.env.REACT_APP_API_URL || "http://localhost:5000";
    const storedUser = localStorage.getItem("user");
    const userObj = storedUser ? JSON.parse(storedUser) : null;
    const token = userObj?.token || localStorage.getItem("token");

    // ========== UPDATED: Make auth optional ==========
    const config = {
      params: { location: locationFilter },
    };

    // Only add auth header if token exists
    if (token) {
      config.headers = { Authorization: `Bearer ${token}` };
    }
    // ================================================

    const response = await axios.get(
      `${API_BASE_URL}/api/students/search-hostel`,
      config,
    );

    const data = response.data?.hostels || response.data || [];
    setHostels(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error("Error fetching hostels:", err);

    // ========== UPDATED: Handle 401/403 gracefully ==========
    if (err.response?.status === 401 || err.response?.status === 403) {
      // User not authenticated - this is OK, just show empty state
      setError("Please login to view hostels in this area.");
      setHostels([]);
    } else {
      setError(
        err.response?.data?.error ||
          "Failed to fetch hostels. Check your connection.",
      );
    }
    // =======================================================
  } finally {
    setLoading(false);
  }
}, [locationFilter]);

  useEffect(() => {
    fetchHostels();
  }, [fetchHostels]);

  // --- HANDLE HOSTEL CARD CLICK (INTERCEPT IF NOT AUTHENTICATED) ---
  const handleHostelClick = (e, hostelId) => {
    e.preventDefault();

    if (!isAuthenticated()) {
      setShowLoginPrompt(true);
      return;
    }

    // Proceed to details for authenticated users
    navigate(`/student/hostels/${hostelId}`);
  };

  // --- TOGGLE INTERESTED LOGIC (INTERCEPT IF NOT AUTHENTICATED) ---
  const toggleInterested = (e, hostel) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated()) {
      setShowLoginPrompt(true);
      return;
    }

    const hostelId = hostel._id || hostel.id;
    const isInterested = interestedIds.includes(hostelId);
    const storedHostels = JSON.parse(
      localStorage.getItem("interestedHostels") || "[]",
    );

    let updatedList;
    if (isInterested) {
      updatedList = storedHostels.filter((h) => (h.id || h._id) !== hostelId);
      setInterestedIds((prev) => prev.filter((id) => id !== hostelId));
    } else {
      const newEntry = {
        id: hostelId,
        name: hostel.name,
        location: hostel.locality || hostel.location,
        price: hostel.price,
        type: hostel.type,
        image: hostel.imageUrl || "https://placehold.co/400x300?text=Hostel",
        dateAdded: new Date().toISOString(),
      };
      updatedList = [...storedHostels, newEntry];
      setInterestedIds((prev) => [...prev, hostelId]);
    }

    localStorage.setItem("interestedHostels", JSON.stringify(updatedList));
  };

  // --- FILTERING & SORTING LOGIC ---
  const filteredHostels = (hostels || [])
    .filter((item) =>
      item?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter((item) => typeFilter === "All" || item.type === typeFilter);

  const sortedHostels = [...filteredHostels];
  if (sortOrder === "asc") sortedHostels.sort((a, b) => a.price - b.price);
  if (sortOrder === "desc") sortedHostels.sort((a, b) => b.price - a.price);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentHostels = sortedHostels.slice(indexOfFirst, indexOfLast);

  return (
    <>
      <div className="min-h-screen px-6 py-6 bg-slate-50 dark:bg-slate-900">
        {/* Header & Filters */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <div>
            <select
              value={locationFilter}
              onChange={(e) => {
                setLocationFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border rounded-md dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[
                "Mangalpally",
                "Adibatla",
                "Sheriguda",
                "Dilsukhnagar",
                "Maisammaguda",
                "Narayanaguda",
                "Others",
              ].map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div className="relative max-w-md mx-auto w-full">
            <Search
              className="absolute left-3 top-2.5 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search Hostels..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-2 py-2 border rounded-md dark:bg-slate-800 dark:text-white"
            >
              <option value="All">All Types</option>
              <option value="Boys">Boys</option>
              <option value="Girls">Girls</option>
              <option value="Co-Living">Co-Living</option>
            </select>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-2 py-2 border rounded-md dark:bg-slate-800 dark:text-white"
            >
              <option value="None">Sort by Price</option>
              <option value="asc">Low to High</option>
              <option value="desc">High to Low</option>
            </select>
          </div>
        </div>

        {/* Info Banner for Logged Out Users */}
        {!isAuthenticated() && !loading && (
          <div className="mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-700 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <svg
                className="w-6 h-6 text-indigo-600 dark:text-indigo-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm text-indigo-800 dark:text-indigo-300">
                <strong>Browse freely!</strong> Login to save favorites and
                request rooms.
              </p>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        {loading ? (
          <div className="flex flex-col items-center justify-center mt-20 dark:text-white">
            <Loader2 className="animate-spin text-blue-500 mb-2" size={40} />
            <p className="text-xl animate-pulse">
              Finding hostels in {locationFilter}...
            </p>
          </div>
        ) : error ? (
          <div className="text-center mt-10 p-6 border rounded-2xl mx-auto max-w-md bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-200 dark:border-indigo-700">
            <div className="mb-4">
              <svg
                className="w-16 h-16 mx-auto text-indigo-600 dark:text-indigo-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Login to View Hostels
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{error}</p>
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all"
            >
              Login / Sign Up
            </button>
          </div>
        ) : currentHostels.length === 0 ? (
          <div className="text-center text-slate-500 dark:text-slate-400 text-xl mt-10">
            😕 No hostels found matching your criteria.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-4">
            {currentHostels.map((hostel) => {
              const hId = hostel._id || hostel.id;
              const isLiked = interestedIds.includes(hId);

              return (
                <div key={hId} className="relative group">
                  {/* Heart Toggle */}
                  <button
                    onClick={(e) => toggleInterested(e, hostel)}
                    className="absolute top-3 left-3 z-20 p-2 bg-white/90 dark:bg-slate-800/90 rounded-full shadow-md hover:scale-110 transition-transform"
                    title={
                      isAuthenticated()
                        ? "Add to favorites"
                        : "Login to save favorites"
                    }
                  >
                    <Heart
                      size={20}
                      className={
                        isLiked ? "fill-red-500 text-red-500" : "text-slate-400"
                      }
                    />
                  </button>

                  {/* Hostel Card - Clickable */}
                  <div
                    onClick={(e) => handleHostelClick(e, hId)}
                    className="cursor-pointer"
                  >
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden h-full border border-transparent hover:border-blue-500">
                      <div className="relative">
                        <img
                          src={
                            hostel.imageUrl ||
                            "https://placehold.co/400x300?text=No+Image"
                          }
                          alt={hostel.name}
                          onError={(e) => {
                            e.target.src =
                              "https://placehold.co/400x300?text=Image+Error";
                          }}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div
                          className={`absolute top-2 right-2 px-2 py-1 text-xs font-semibold rounded-full text-white ${hostel.availableRooms > 0 ? "bg-green-500" : "bg-red-500"}`}
                        >
                          {hostel.availableRooms > 0 ? "Available" : "Full"}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">
                          {hostel.name}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {hostel.locality || hostel.location}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {hostel.features?.slice(0, 3).map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 text-[10px] rounded-full bg-blue-50 text-blue-700 dark:bg-slate-700 dark:text-blue-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-3">
                          ₹{hostel.price}
                          <span className="text-xs font-normal text-slate-500">
                            /month
                          </span>
                        </p>
                        <button className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                          View & Request
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {!loading && sortedHostels.length > itemsPerPage && (
          <div className="flex justify-center items-center gap-2 mt-10 pb-10">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg bg-white dark:bg-slate-800 shadow disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-slate-700 transition"
            >
              Prev
            </button>
            <span className="dark:text-white font-medium">
              Page {currentPage} of{" "}
              {Math.ceil(sortedHostels.length / itemsPerPage)}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={
                currentPage >= Math.ceil(sortedHostels.length / itemsPerPage)
              }
              className="px-4 py-2 rounded-lg bg-white dark:bg-slate-800 shadow disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-slate-700 transition"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Login Prompt Modal */}
      <LoginPrompt
        isOpen={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
      />
    </>
  );
};

export default HostelListings;