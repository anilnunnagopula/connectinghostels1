import React, { useState } from "react";

const HostelListings = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("None");
  const [currentPage, setCurrentPage] = useState(1);
  const [locationFilter, setLocationFilter] = useState("Mangalpally");

  const itemsPerPage = 12;
  const hostels = [
    {
      id: 1,
      name: "Sri Hasha Boys Hostel",
      type: "Boys",
      location: "Mangalpally",
      floors: 3,
      price: "₹5500/mo",
      available: true,
      features: ["✅ AC", "🚿 Attached Bathroom", "📶 Wi-Fi"],
    },
    {
      id: 2,
      name: "Manjunath Boys Hostel",
      type: "Girls",
      location: "Sheriguda",
      floors: 2,
      price: "₹5000/mo",
      available: false,
      features: ["🚿 Attached Bathroom"],
    },
    {
      id: 3,
      name: "Annapurna Ladies Hostel",
      type: "Girls",
      location: "Dilsukhnagar",
      floors: 4,
      price: "₹5200/mo",
      available: true,
      features: ["📶 Wi-Fi", "🧺 Laundry"],
    },
    {
      id: 4,
      name: "Sai Krupa Boys Hostel",
      type: "Boys",
      location: "Mangalpally",
      floors: 2,
      price: "₹4800/mo",
      available: true,
      features: ["🍽️ Mess", "📶 Wi-Fi"],
    },
    {
      id: 5,
      name: "CoLive Orange Nest",
      type: "Co-Living",
      location: "Maisammaguda",
      floors: 4,
      price: "₹5500/mo",
      available: true,
      features: ["🛋️ Furnished", "📺 TV Lounge"],
    },
    {
      id: 6,
      name: "Sri Venkateshwara Residency",
      type: "Boys",
      location: "Sheriguda",
      floors: 3,
      price: "₹4700/mo",
      available: true,
      features: ["✅ AC", "📶 Wi-Fi"],
    },
    {
      id: 7,
      name: "Sri Lakshmi Girls Hostel",
      type: "Girls",
      location: "Mangalpally",
      floors: 4,
      price: "₹5300/mo",
      available: true,
      features: ["👮 Security", "📶 Wi-Fi"],
    },
    {
      id: 8,
      name: "Shiva Sai Boys Mansion",
      type: "Boys",
      location: "Mangalpally",
      floors: 5,
      price: "₹4600/mo",
      available: false,
      features: ["🧹 Housekeeping"],
    },
    {
      id: 9,
      name: "Orange Blossom ",
      type: "Boys",
      location: "Mangalpally",
      floors: 4,
      price: "₹5600/mo",
      available: true,
      features: ["✅ AC", "🛏️ Twin Beds"],
    },
    {
      id: 10,
      name: "Nandini Nivas",
      type: "Girls",
      location: "Mangalpally",
      floors: 3,
      price: "₹5000/mo",
      available: true,
      features: ["🚿 Attached Bathroom", "📶 Wi-Fi"],
    },
    {
      id: 11,
      name: "Padmavathi Residency",
      type: "Girls",
      location: "Mangalpally",
      floors: 2,
      price: "₹5200/mo",
      available: true,
      features: ["🧺 Laundry", "👮 Security"],
    },
    {
      id: 12,
      name: "Govinda Boys Hostel",
      type: "Boys",
      location: "Mangalpally",
      floors: 3,
      price: "₹4500/mo",
      available: true,
      features: ["🍽️ Mess"],
    },
    {
      id: 13,
      name: "Saraswati Ladies Nest",
      type: "Girls",
      location: "Mangalpally",
      floors: 4,
      price: "₹5400/mo",
      available: true,
      features: ["🧹 Housekeeping", "📶 Wi-Fi"],
    },
    {
      id: 14,
      name: "Krishna Nilayam",
      type: "Boys",
      location: "Mangalpally",
      floors: 4,
      price: "₹5500/mo",
      available: true,
      features: ["🛋️ Furnished", "📶 Wi-Fi"],
    },
    {
      id: 15,
      name: "Hanuman Residency",
      type: "Boys",
      location: "Mangalpally",
      floors: 4,
      price: "₹4900/mo",
      available: true,
      features: ["📶 Wi-Fi"],
    },
    {
      id: 16,
      name: "Gowthami Girls Mansion",
      type: "Girls",
      location: "Mangalpally",
      floors: 4,
      price: "₹5100/mo",
      available: false,
      features: ["🚿 Attached Bathroom"],
    },
    {
      id: 17,
      name: "Tulasi  Homes",
      type: "Girls",
      location: "Mangalpally",
      floors: 5,
      price: "₹5700/mo",
      available: true,
      features: ["✅ AC", "👮 Security"],
    },
    {
      id: 18,
      name: "Balaji Boys Nivas",
      type: "Boys",
      location: "Mangalpally",
      floors: 3,
      price: "₹4600/mo",
      available: true,
      features: ["📶 Wi-Fi"],
    },
    // Add more with location keys as needed...
  ];

  // 🔍 Filter logic
  let filteredCategories = hostels
    .filter((item) => item.location === locationFilter)
    .filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((item) => typeFilter === "All" || item.type === typeFilter);

  // 🔢 Sort by Price
  if (sortOrder === "asc") {
    filteredCategories.sort(
      (a, b) =>
        parseInt(a.price.replace(/[^\d]/g, "")) -
        parseInt(b.price.replace(/[^\d]/g, ""))
    );
  } else if (sortOrder === "desc") {
    filteredCategories.sort(
      (a, b) =>
        parseInt(b.price.replace(/[^\d]/g, "")) -
        parseInt(a.price.replace(/[^\d]/g, ""))
    );
  }

  // 🔁 Pagination
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentHostels = filteredCategories.slice(indexOfFirst, indexOfLast);

  return (
    <div className="min-h-screen px-6 py-6 bg-gray-100 dark:bg-gray-900">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        {/* 🌍 Location Filter */}
        <div>
          <select
            value={locationFilter}
            onChange={(e) => {
              setLocationFilter(e.target.value);
              setCurrentPage(1); // Reset page when location changes
            }}
            className="px-2 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
          >
            <option value="Mangalpally">Mangalpally</option>
            <option value="Adibatla">Adibatla</option>
            <option value="Sheriguda">Sheriguda</option>
            <option value="Dilsukhnagar">Dilsukhnagar</option>
            <option value="Maisammaguda">Maisammaguda</option>
          </select>
        </div>

        {/* 🔍 Search Bar */}
        <div className="relative max-w-md mx-auto w-full">
          <span className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-300">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search Hostels..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-12 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-2 top-2 text-gray-500 hover:text-red-500 dark:text-gray-300"
            >
              ❌
            </button>
          )}
        </div>

        {/* 🧠 Type & Sort Filters */}
        <div className="flex gap-1 ">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-2 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
          >
            <option value="All">All Types</option>
            <option value="Boys">Boys</option>
            <option value="Girls">Girls</option>
            <option value="Co-Living">Co-Living</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="px-2 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
          >
            <option value="None">Sort by Price</option>
            <option value="asc">Low to High</option>
            <option value="desc">High to Low</option>
          </select>
        </div>
        <div>
          <button
            onClick={() => {
              setSearchTerm("");
              setTypeFilter("All");
              setSortOrder("None");
            }}
            className="px-2 py-1  bg-red-500 text-white rounded-md hover:bg-red-600 transition"
          >
            Reset
          </button>
        </div>
      </div>

      {/* 🎯 Hostels List */}
      {currentHostels.length === 0 ? (
        typeFilter === "Co-Living"? (
          <div className="text-center text-pink-600 dark:text-pink-400 text-xl mt-6 font-semibold animate-bounce">
            😏 Hey naughty, there are no co-lives in {locationFilter}!
          </div>
        ) : (
          <div className="text-center text-red-500 text-xl mt-10">
            😕 No hostels found in <b>{locationFilter}</b>!
          </div>
        )
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-4">
          {currentHostels.map((hostel) => (
            <div
              key={hostel.id}
              className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {hostel.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Type: {hostel.type}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Location: {hostel.location}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Price: {hostel.price}
              </p>
              <p
                className={`text-sm font-semibold ${
                  hostel.available
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {hostel.available ? "Available" : "Not Available"}
              </p>

              <div className="mt-2 flex flex-wrap gap-2">
                {hostel.features?.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-white"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 📄 Pagination */}
      {filteredCategories.length > 0 && (
        <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white disabled:opacity-50"
          >
            ⬅ Prev
          </button>
          {Array.from({
            length: Math.ceil(filteredCategories.length / itemsPerPage),
          }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-3 py-1 rounded border ${
                currentPage === index + 1
                  ? "bg-blue-600 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() =>
              setCurrentPage((prev) =>
                prev < Math.ceil(filteredCategories.length / itemsPerPage)
                  ? prev + 1
                  : prev
              )
            }
            disabled={
              currentPage ===
              Math.ceil(filteredCategories.length / itemsPerPage)
            }
            className="px-3 py-1 rounded bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white disabled:opacity-50"
          >
            Next ➡
          </button>
        </div>
      )}
    </div>
  );
};

export default HostelListings;
