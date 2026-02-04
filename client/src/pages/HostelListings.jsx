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
import { Link } from "react-router-dom";
import axios from "axios";
import { Heart, Search, Loader2 } from "lucide-react";

const HostelListings = () => {
  // --- STATE ---
  const [hostels, setHostels] = useState([]);
  const [interestedIds, setInterestedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("None");
  const [currentPage, setCurrentPage] = useState(1);
  const [locationFilter, setLocationFilter] = useState("Mangalpally");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const itemsPerPage = 12;

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

  // --- API FETCHING ---
  const fetchHostels = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const API_BASE_URL =
        process.env.REACT_APP_API_URL || "http://localhost:5000";
      const storedUser = localStorage.getItem("user");
      const userObj = storedUser ? JSON.parse(storedUser) : null;
      const token = userObj?.token || localStorage.getItem("token");

      if (!token) {
        setError("Please login to view hostels.");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `${API_BASE_URL}/api/students/search-hostel`,
        {
          params: { location: locationFilter },
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const data = response.data?.hostels || response.data || [];
      setHostels(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching hostels:", err);
      setError(
        err.response?.data?.error ||
          "Failed to fetch hostels. Check your connection.",
      );
    } finally {
      setLoading(false);
    }
  }, [locationFilter]);

  useEffect(() => {
    fetchHostels();
  }, [fetchHostels]);

  // --- TOGGLE INTERESTED LOGIC ---
  const toggleInterested = (e, hostel) => {
    e.preventDefault();
    e.stopPropagation();

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
    // Note: You can add an axios.post call here to sync with your database
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

      {/* Main Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center mt-20 dark:text-white">
          <Loader2 className="animate-spin text-blue-500 mb-2" size={40} />
          <p className="text-xl animate-pulse">
            Finding hostels in {locationFilter}...
          </p>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 mt-10 p-4 border border-red-200 rounded-lg bg-red-50 mx-auto max-w-md">
          <p className="font-bold">❌ Error</p>
          <p>{error}</p>
          <button
            onClick={fetchHostels}
            className="mt-4 text-blue-600 underline"
          >
            Try Again
          </button>
        </div>
      ) : currentHostels.length === 0 ? (
        <div className="text-center text-slate-500 text-xl mt-10">
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
                >
                  <Heart
                    size={20}
                    className={
                      isLiked ? "fill-red-500 text-red-500" : "text-slate-400"
                    }
                  />
                </button>

                <Link to={`/student/hostels/${hId}`}>
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
                        className={`absolute top-2 right-2 px-2 py-1 text-xs font-semibold rounded-full text-white ${hostel.available ? "bg-green-500" : "bg-red-500"}`}
                      >
                        {hostel.available ? "Available" : "Full"}
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
                    </div>
                  </div>
                </Link>
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
            className="px-4 py-2 rounded-lg bg-white dark:bg-slate-800 shadow disabled:opacity-50"
          >
            Prev
          </button>
          <span className="dark:text-white font-medium">
            Page {currentPage}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={
              currentPage >= Math.ceil(sortedHostels.length / itemsPerPage)
            }
            className="px-4 py-2 rounded-lg bg-white dark:bg-slate-800 shadow disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default HostelListings;