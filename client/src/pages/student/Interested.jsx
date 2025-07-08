import React from "react";

const interestedHostels = [
  {
    name: "Sai Krupa Boys Hostel",
    location: "Mangalpally",
    price: "₹4800/mo",
    type: "Boys",
    image:
      "https://images.unsplash.com/photo-1586105251261-72a756497a12?fit=crop&w=800&q=80",
  },
  {
    name: "CoLive Nest",
    location: "Hyderabad",
    price: "₹5500/mo",
    type: "Co-Living",
    image:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?fit=crop&w=800&q=80",
  },
];

const Interested = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white p-6">
      <h1 className="text-2xl font-bold mb-6">💖 Your Interested Hostels</h1>

      {interestedHostels.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">
          You haven't added any hostels to your interest list yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {interestedHostels.map((hostel, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition transform hover:scale-[1.02] overflow-hidden"
            >
              <img
                src={hostel.image}
                alt={hostel.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-1">{hostel.name}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  📍 {hostel.location}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  🛏️ {hostel.type}
                </p>
                <p className="text-lg font-bold mt-2">{hostel.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Interested;
