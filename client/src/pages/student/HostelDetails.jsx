import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const HostelDetails = () => {
  const { id } = useParams();
  const [hostel, setHostel] = useState(null);

  // 👇 this is just a placeholder; you can replace with API call
  useEffect(() => {
    // You can fetch data from backend or use dummy list
    const storedHostels = JSON.parse(localStorage.getItem("hostelData"));
    if (storedHostels) {
      const found = storedHostels.find((h) => h.id === parseInt(id));
      setHostel(found);
    }
  }, [id]);

  if (!hostel)
    return <div className="text-center text-xl mt-10">Loading...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-md">
      <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
        {hostel.name}
      </h1>
      <p className="text-gray-600 dark:text-gray-300">📍 {hostel.location}</p>
      <p className="text-gray-600 dark:text-gray-300">Type: {hostel.type}</p>
      <p className="text-gray-600 dark:text-gray-300">
        Floors: {hostel.floors}
      </p>
      <p className="text-gray-600 dark:text-gray-300">Price: {hostel.price}</p>
      <p
        className={`font-semibold mt-2 ${
          hostel.available ? "text-green-500" : "text-red-500"
        }`}
      >
        {hostel.available ? "Available ✅" : "Not Available ❌"}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {hostel.features.map((feat, i) => (
          <span
            key={i}
            className="px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-900 dark:text-white rounded-full text-sm"
          >
            {feat}
          </span>
        ))}
      </div>
    </div>
  );
};

export default HostelDetails;
