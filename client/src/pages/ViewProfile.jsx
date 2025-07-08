import React from "react";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  return (
    <div className="min-h-screen px-4 py-8 bg-gray-100 dark:bg-gray-900 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 w-full max-w-md">
        {/* 🔘 Profile Avatar & Name */}
        <div className="flex flex-col items-center">
          <img
            src={`https://ui-avatars.com/api/?name=${
              user?.name || "U"
            }&background=random`}
            alt="avatar"
            className="w-24 h-24 rounded-full shadow-lg"
          />
          <h2 className="text-2xl mt-4 font-bold text-gray-900 dark:text-white">
            {user?.name}
          </h2>
          <span className="text-sm mt-1 px-3 py-1 bg-blue-200 dark:bg-blue-700 text-blue-800 dark:text-white rounded-full">
            {user?.role === "owner" ? "Hostel Owner" : "Student"}
          </span>
        </div>

        {/* 📄 User Info */}
        <div className="mt-6 space-y-3 text-gray-800 dark:text-gray-300">
          <div>
            <span className="font-semibold">📧 Email:</span> {user?.email}
          </div>
          <div>
            <span className="font-semibold">📱 Phone:</span>{" "}
            {user?.phone || "Not provided"}
          </div>
          {user?.role === "owner" && (
            <div>
              <span className="font-semibold">🏠 Hostel Name:</span>{" "}
              {user?.hostelName || "Not added yet"}
            </div>
          )}
        </div>

        {/* ✏️ Edit Profile Button */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/edit-profile")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
