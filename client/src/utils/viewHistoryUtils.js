/**
 * viewHistoryUtils.js
 *
 * Utility functions for managing recently viewed hostels
 * Used in HostelDetails.jsx and other components
 */

import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL;
const MAX_HISTORY_ITEMS = 50;

/**
 * Adds a hostel to recently viewed history
 * Updates both localStorage and API (if user is logged in)
 *
 * @param {Object} hostel - The hostel object to add to history
 * @returns {Promise<boolean>} Success status
 */
export const addToRecentlyViewed = async (hostel) => {
  try {
    if (!hostel) {
      console.warn("Cannot add null/undefined hostel to history");
      return false;
    }

    // Prepare hostel data for storage
    const viewedHostel = {
      id: hostel._id || hostel.id,
      name: hostel.name,
      location: hostel.locality || hostel.location || hostel.address,
      type: hostel.type,
      price: hostel.pricePerMonth
        ? `₹${hostel.pricePerMonth}/mo`
        : hostel.price,
      image:
        hostel.images?.[0] ||
        hostel.image ||
        "https://source.unsplash.com/400x300/?hostel,room",
      viewedAt: new Date().toISOString(),
      timestamp: Date.now(), // For easy sorting
    };

    // Update localStorage
    updateLocalStorageHistory(viewedHostel);

    // Sync with API if user is logged in
    const token = localStorage.getItem("token");
    if (token) {
      try {
        await axios.post(
          `${API_BASE_URL}/api/student/recently-viewed`,
          { hostelId: viewedHostel.id, hostel: viewedHostel },
          { headers: { Authorization: `Bearer ${token}` } },
        );
      } catch (apiError) {
        console.error("Failed to sync view history with API:", apiError);
        // Don't fail silently - localStorage update still succeeded
      }
    }

    return true;
  } catch (error) {
    console.error("Error adding to recently viewed:", error);
    return false;
  }
};

/**
 * Updates localStorage with viewed hostel
 * Prevents duplicates and enforces max history limit
 *
 * @param {Object} viewedHostel - The hostel to add
 */
const updateLocalStorageHistory = (viewedHostel) => {
  try {
    const stored = localStorage.getItem("recentlyViewedHostels");
    let history = stored ? JSON.parse(stored) : [];

    // Remove if already exists (to update timestamp and move to top)
    history = history.filter((h) => h.id !== viewedHostel.id);

    // Add to beginning (most recent first)
    history.unshift(viewedHostel);

    // Enforce max limit
    if (history.length > MAX_HISTORY_ITEMS) {
      history = history.slice(0, MAX_HISTORY_ITEMS);
    }

    localStorage.setItem("recentlyViewedHostels", JSON.stringify(history));
  } catch (error) {
    console.error("Error updating localStorage history:", error);
  }
};

/**
 * Gets all recently viewed hostels from localStorage
 *
 * @returns {Array} Array of hostel objects
 */
export const getRecentlyViewedFromStorage = () => {
  try {
    const stored = localStorage.getItem("recentlyViewedHostels");
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error reading recently viewed from storage:", error);
    return [];
  }
};

/**
 * Removes a specific hostel from viewing history
 *
 * @param {string} hostelId - ID of hostel to remove
 * @returns {Promise<boolean>} Success status
 */
export const removeFromRecentlyViewed = async (hostelId) => {
  try {
    // Update localStorage
    const stored = localStorage.getItem("recentlyViewedHostels");
    const history = stored ? JSON.parse(stored) : [];
    const updated = history.filter((h) => h.id !== hostelId);
    localStorage.setItem("recentlyViewedHostels", JSON.stringify(updated));

    // Sync with API
    const token = localStorage.getItem("token");
    if (token) {
      try {
        await axios.delete(
          `${API_BASE_URL}/api/student/recently-viewed/${hostelId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
      } catch (apiError) {
        console.error("Failed to sync removal with API:", apiError);
      }
    }

    return true;
  } catch (error) {
    console.error("Error removing from recently viewed:", error);
    return false;
  }
};

/**
 * Clears all viewing history
 *
 * @returns {Promise<boolean>} Success status
 */
export const clearRecentlyViewed = async () => {
  try {
    // Clear localStorage
    localStorage.setItem("recentlyViewedHostels", JSON.stringify([]));

    // Sync with API
    const token = localStorage.getItem("token");
    if (token) {
      try {
        await axios.delete(`${API_BASE_URL}/api/student/recently-viewed/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (apiError) {
        console.error("Failed to sync clear with API:", apiError);
      }
    }

    return true;
  } catch (error) {
    console.error("Error clearing recently viewed:", error);
    return false;
  }
};

/**
 * Checks if a hostel is in recently viewed
 *
 * @param {string} hostelId - ID to check
 * @returns {boolean} True if in history
 */
export const isInRecentlyViewed = (hostelId) => {
  try {
    const history = getRecentlyViewedFromStorage();
    return history.some((h) => h.id === hostelId);
  } catch (error) {
    console.error("Error checking recently viewed:", error);
    return false;
  }
};

/**
 * Gets count of recently viewed hostels
 *
 * @returns {number} Count
 */
export const getRecentlyViewedCount = () => {
  try {
    const history = getRecentlyViewedFromStorage();
    return history.length;
  } catch (error) {
    console.error("Error getting recently viewed count:", error);
    return 0;
  }
};
