import React from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Eye, Trash2, MapPin, Bed, Users } from "lucide-react";
import { API_BASE_URL } from "../../apiConfig";

/**
 * Enhanced HostelCard Component
 * Reusable card for displaying hostel information with navigation to view details
 *
 * @param {Object} hostel - Hostel data
 * @param {Function} onDelete - Delete handler
 */
const HostelCard = ({ hostel, onDelete }) => {
  const navigate = useNavigate();

  // Navigation Helper
  const goToView = () => navigate(`/owner/hostel/${hostel._id}/view`);
  const goToEdit = () => navigate(`/owner/hostel/${hostel._id}/edit`);

  // Helper function to construct image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;

    // If it's already a full URL, return as-is
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }

    // Otherwise, construct the full URL using API_BASE_URL
    return `${API_BASE_URL}/uploads/${imagePath}`;
  };

  // Calculate occupancy percentage
  const totalRooms = hostel.totalRooms || 0;
  const availableRooms = hostel.availableRooms || 0;
  const occupiedRooms = totalRooms - availableRooms;
  const occupancyPercentage =
    totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0;

  // Get occupancy color
  const getOccupancyColor = () => {
    if (occupancyPercentage >= 80) return "text-green-600 dark:text-green-400";
    if (occupancyPercentage >= 50)
      return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  // Get category badge color
  const getCategoryColor = () => {
    switch (hostel.type) {
      case "Girls":
        return "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300";
      case "Boys":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
      case "Co-Live":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div className="group bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200 dark:border-slate-700">
      {/* Image Section */}
      <div
        onClick={goToView}
        className="relative h-48 cursor-pointer bg-gradient-to-br from-blue-100 to-blue-50 dark:from-slate-700 dark:to-slate-600 overflow-hidden"
      >
        {hostel.images && hostel.images.length > 0 ? (
          <img
            src={getImageUrl(hostel.images[0])}
            alt={hostel.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              // Show the Bed icon fallback instead
              e.target.style.display = "none";
              e.target.parentElement
                .querySelector(".fallback-icon")
                ?.classList.remove("hidden");
            }}
          />
        ) : null}

        {/* Fallback Icon - shown when no image or image fails */}
        <div
          className={`fallback-icon w-full h-full flex items-center justify-center ${hostel.images && hostel.images.length > 0 ? "hidden" : ""}`}
        >
          <Bed className="w-16 h-16 text-slate-300 dark:text-slate-600" />
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor()}`}
          >
            {hostel.type}
          </span>
        </div>

        {/* Active Status Badge */}
        {!hostel.isActive && (
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-500 text-white shadow-sm">
              Inactive
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Hostel Name - Clickable */}
        <h3
          onClick={goToView}
          className="text-lg font-bold text-slate-800 dark:text-white mb-2 line-clamp-1 cursor-pointer hover:text-blue-500 transition-colors"
        >
          {hostel.name}
        </h3>

        {/* Location */}
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 flex items-center gap-1">
          <MapPin className="w-4 h-4 flex-shrink-0 text-red-500" />
          <span className="line-clamp-1">
            {hostel.location || hostel.address || "Location not specified"}
          </span>
        </p>

        {/* Stats Row */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Total Rooms
            </span>
            <span className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-1">
              <Bed className="w-4 h-4 text-blue-500" />
              {totalRooms}
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Occupancy
            </span>
            <span className={`text-lg font-bold ${getOccupancyColor()}`}>
              {occupancyPercentage.toFixed(0)}%
            </span>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Available
            </span>
            <span className="text-lg font-bold text-green-600 dark:text-green-400">
              {availableRooms}
            </span>
          </div>
        </div>

        {/* Price Section */}
        {hostel.pricePerMonth && (
          <div className="mb-4">
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
              Starting from
            </p>
            <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
              ₹{hostel.pricePerMonth.toLocaleString()}
              <span className="text-sm font-normal text-slate-500 ml-1">
                /month
              </span>
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 mt-2">
          <button
            onClick={goToView}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2.5 rounded-lg flex items-center justify-center gap-1 text-sm font-medium transition-all shadow-sm active:scale-95"
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">View</span>
          </button>

          <button
            onClick={goToEdit}
            className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2.5 rounded-lg flex items-center justify-center gap-1 text-sm font-medium transition-all shadow-sm active:scale-95"
          >
            <Pencil className="w-4 h-4" />
            <span className="hidden sm:inline">Edit</span>
          </button>

          <button
            onClick={() => onDelete(hostel._id)}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2.5 rounded-lg flex items-center justify-center gap-1 text-sm font-medium transition-all shadow-sm active:scale-95"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HostelCard;
