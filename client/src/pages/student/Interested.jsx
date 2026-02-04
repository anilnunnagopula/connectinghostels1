/**
 * Interested.jsx - Student's Wishlist/Saved Hostels
 *
 * Features:
 * - Display all saved/interested hostels
 * - Remove from list with optimistic update
 * - Sort by date added, price, name
 * - Grid/list view toggle
 * - Clear all with confirmation
 * - Navigate to hostel details
 *
 * Performance Optimizations:
 * - Memoized sorted hostels
 * - Optimistic UI updates
 * - useCallback for handlers
 * - Proper loading/error states
 */

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Heart,
  Trash2,
  MapPin,
  IndianRupee,
  Grid3x3,
  List,
  Loader2,
  AlertCircle,
  X,
  SortAsc,
} from "lucide-react";

// ============================================================================
// CONSTANTS
// ============================================================================

const API_BASE_URL = process.env.REACT_APP_API_URL;

const SORT_OPTIONS = {
  DATE_DESC: "date_desc",
  DATE_ASC: "date_asc",
  PRICE_DESC: "price_desc",
  PRICE_ASC: "price_asc",
  NAME_ASC: "name_asc",
};

const VIEW_MODES = {
  GRID: "grid",
  LIST: "list",
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const getToken = () => localStorage.getItem("token");

/**
 * Extracts numeric price from string like "₹4800/mo"
 */
const extractPrice = (priceString) => {
  if (!priceString) return 0;
  const match = priceString.match(/\d+/);
  return match ? parseInt(match[0]) : 0;
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const Interested = () => {
  const navigate = useNavigate();

  // ==========================================================================
  // STATE MANAGEMENT
  // ==========================================================================

  const [state, setState] = useState({
    hostels: [],
    loading: true,
    error: null,
  });

  const [sortBy, setSortBy] = useState(SORT_OPTIONS.DATE_DESC);
  const [viewMode, setViewMode] = useState(VIEW_MODES.GRID);
  const [removingId, setRemovingId] = useState(null);
  const [showClearModal, setShowClearModal] = useState(false);

  // ==========================================================================
  // DATA FETCHING
  // ==========================================================================

  /**
   * Fetches interested hostels from API or localStorage
   */
  const fetchInterestedHostels = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const token = getToken();

      // Try API first
      if (token) {
        try {
          const response = await axios.get(
            `${API_BASE_URL}/api/students/interested`,
            { headers: { Authorization: `Bearer ${token}` } },
          );

          setState({
            hostels: response.data.data || response.data || [],
            loading: false,
            error: null,
          });
          return;
        } catch (apiError) {
          console.log("API fetch failed, using localStorage fallback");
        }
      }

      // Fallback to localStorage
      const storedHostels = localStorage.getItem("interestedHostels");
      const hostels = storedHostels ? JSON.parse(storedHostels) : [];

      setState({
        hostels,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("Error fetching interested hostels:", error);
      setState({
        hostels: [],
        loading: false,
        error: error.message || "Failed to load your interested hostels",
      });
    }
  }, []);

  useEffect(() => {
    fetchInterestedHostels();
  }, [fetchInterestedHostels]);

  // ==========================================================================
  // COMPUTED VALUES (Memoized)
  // ==========================================================================

  /**
   * Sorts hostels based on selected sort option
   */
  const sortedHostels = useMemo(() => {
    if (!state.hostels || state.hostels.length === 0) return [];

    const sorted = [...state.hostels];

    switch (sortBy) {
      case SORT_OPTIONS.DATE_DESC:
        return sorted.reverse(); // Most recently added first
      case SORT_OPTIONS.DATE_ASC:
        return sorted; // Oldest first
      case SORT_OPTIONS.PRICE_DESC:
        return sorted.sort(
          (a, b) => extractPrice(b.price) - extractPrice(a.price),
        );
      case SORT_OPTIONS.PRICE_ASC:
        return sorted.sort(
          (a, b) => extractPrice(a.price) - extractPrice(b.price),
        );
      case SORT_OPTIONS.NAME_ASC:
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return sorted;
    }
  }, [state.hostels, sortBy]);

  // ==========================================================================
  // EVENT HANDLERS
  // ==========================================================================

  /**
   * Removes a hostel from interested list with optimistic update
   */
  const handleRemoveHostel = useCallback(
    async (hostelId) => {
      const token = getToken();
      setRemovingId(hostelId);

      // Optimistic update
      const originalHostels = state.hostels;
      setState((prev) => ({
        ...prev,
        hostels: prev.hostels.filter((h) => h.id !== hostelId),
      }));

      try {
        // Try API call
        if (token) {
          await axios.delete(
            `${API_BASE_URL}/api/students/interested/${hostelId}`,
            { headers: { Authorization: `Bearer ${token}` } },
          );
        }

        // Update localStorage
        const updatedHostels = originalHostels.filter((h) => h.id !== hostelId);
        localStorage.setItem(
          "interestedHostels",
          JSON.stringify(updatedHostels),
        );
      } catch (error) {
        console.error("Failed to remove hostel:", error);
        // Revert optimistic update on error
        setState((prev) => ({ ...prev, hostels: originalHostels }));
      } finally {
        setRemovingId(null);
      }
    },
    [state.hostels],
  );

  /**
   * Clears all interested hostels
   */
  const handleClearAll = useCallback(async () => {
    const token = getToken();
    const originalHostels = state.hostels;

    // Optimistic update
    setState((prev) => ({ ...prev, hostels: [] }));
    setShowClearModal(false);

    try {
      // Try API call
      if (token) {
        await axios.delete(`${API_BASE_URL}/api/students/interested/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      // Clear localStorage
      localStorage.setItem("interestedHostels", JSON.stringify([]));
    } catch (error) {
      console.error("Failed to clear all:", error);
      // Revert on error
      setState((prev) => ({ ...prev, hostels: originalHostels }));
    }
  }, [state.hostels]);

  /**
   * Navigates to hostel details page
   */
  const handleViewDetails = useCallback(
    (hostelId) => {
      navigate(`/student/hostels/${hostelId}`);
    },
    [navigate],
  );

  /**
   * Toggles view mode between grid and list
   */
  const handleToggleView = useCallback(() => {
    setViewMode((prev) =>
      prev === VIEW_MODES.GRID ? VIEW_MODES.LIST : VIEW_MODES.GRID,
    );
  }, []);

  /**
   * Changes sort option
   */
  const handleSortChange = useCallback((e) => {
    setSortBy(e.target.value);
  }, []);

  // ==========================================================================
  // RENDER HELPERS
  // ==========================================================================

  /**
   * Renders loading state
   */
  const renderLoading = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">
          Loading your interested hostels...
        </p>
      </div>
    </div>
  );

  /**
   * Renders error state
   */
  const renderError = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">
          Unable to Load
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{state.error}</p>
        <button
          onClick={fetchInterestedHostels}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  /**
   * Renders empty state
   */
  const renderEmpty = () => (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <Heart className="w-24 h-24 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">
          No Interested Hostels Yet
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Start exploring hostels and save your favorites here
        </p>
        <button
          onClick={() => navigate("/student/hostels")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          Explore Hostels
        </button>
      </div>
    </div>
  );

  /**
   * Renders controls (sort, view toggle, clear all)
   */
  const renderControls = () => (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <SortAsc size={20} className="text-gray-600 dark:text-gray-400" />
          <select
            value={sortBy}
            onChange={handleSortChange}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={SORT_OPTIONS.DATE_DESC}>Newest First</option>
            <option value={SORT_OPTIONS.DATE_ASC}>Oldest First</option>
            <option value={SORT_OPTIONS.PRICE_DESC}>Price: High to Low</option>
            <option value={SORT_OPTIONS.PRICE_ASC}>Price: Low to High</option>
            <option value={SORT_OPTIONS.NAME_ASC}>Name: A to Z</option>
          </select>
        </div>

        <button
          onClick={handleToggleView}
          className="p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          aria-label="Toggle view mode"
        >
          {viewMode === VIEW_MODES.GRID ? (
            <List size={20} />
          ) : (
            <Grid3x3 size={20} />
          )}
        </button>
      </div>

      {state.hostels.length > 0 && (
        <button
          onClick={() => setShowClearModal(true)}
          className="flex items-center gap-2 text-red-600 dark:text-red-400 hover:underline"
        >
          <Trash2 size={18} />
          <span>Clear All</span>
        </button>
      )}
    </div>
  );

  /**
   * Renders hostel card in grid view
   */
  const renderGridCard = (hostel) => (
    <div
      key={hostel.id}
      className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition transform hover:scale-[1.02] overflow-hidden relative"
    >
      {/* Remove button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleRemoveHostel(hostel.id);
        }}
        disabled={removingId === hostel.id}
        className="absolute top-2 right-2 z-10 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition"
        aria-label="Remove from interested"
      >
        {removingId === hostel.id ? (
          <Loader2 size={18} className="animate-spin text-red-500" />
        ) : (
          <Heart size={18} className="text-red-500" fill="red" />
        )}
      </button>

      {/* Image */}
      <div
        onClick={() => handleViewDetails(hostel.id)}
        className="cursor-pointer"
      >
        <img
          src={hostel.image}
          alt={hostel.name}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <h2
          onClick={() => handleViewDetails(hostel.id)}
          className="text-xl font-semibold mb-2 text-gray-800 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition"
        >
          {hostel.name}
        </h2>
        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 mb-1">
          <MapPin size={16} />
          <span>{hostel.location}</span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          🛏️ {hostel.type}
        </p>
        <div className="flex items-center gap-1 text-lg font-bold text-gray-900 dark:text-white">
          <IndianRupee size={18} />
          <span>{hostel.price}</span>
        </div>

        <button
          onClick={() => handleViewDetails(hostel.id)}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition"
        >
          View Details
        </button>
      </div>
    </div>
  );

  /**
   * Renders hostel card in list view
   */
  const renderListCard = (hostel) => (
    <div
      key={hostel.id}
      className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition p-4 flex gap-4 relative"
    >
      {/* Remove button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleRemoveHostel(hostel.id);
        }}
        disabled={removingId === hostel.id}
        className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition"
        aria-label="Remove from interested"
      >
        {removingId === hostel.id ? (
          <Loader2 size={18} className="animate-spin text-red-500" />
        ) : (
          <Heart size={18} className="text-red-500" fill="red" />
        )}
      </button>

      {/* Image */}
      <div
        onClick={() => handleViewDetails(hostel.id)}
        className="cursor-pointer flex-shrink-0"
      >
        <img
          src={hostel.image}
          alt={hostel.name}
          className="w-32 h-32 object-cover rounded-lg"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="flex-1">
        <h2
          onClick={() => handleViewDetails(hostel.id)}
          className="text-xl font-semibold mb-2 text-gray-800 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition"
        >
          {hostel.name}
        </h2>
        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 mb-1">
          <MapPin size={16} />
          <span>{hostel.location}</span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          🛏️ {hostel.type}
        </p>
        <div className="flex items-center gap-1 text-lg font-bold text-gray-900 dark:text-white">
          <IndianRupee size={18} />
          <span>{hostel.price}</span>
        </div>
      </div>

      {/* Action */}
      <div className="flex items-center">
        <button
          onClick={() => handleViewDetails(hostel.id)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
        >
          View Details
        </button>
      </div>
    </div>
  );

  /**
   * Renders clear all confirmation modal
   */
  const renderClearModal = () => {
    if (!showClearModal) return null;

    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={() => setShowClearModal(false)}
      >
        <div
          className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Clear All Interested Hostels?
            </h2>
            <button
              onClick={() => setShowClearModal(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X size={24} />
            </button>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            This will remove all {state.hostels.length} hostel(s) from your
            interested list. This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowClearModal(false)}
              className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleClearAll}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ==========================================================================
  // MAIN RENDER
  // ==========================================================================

  if (state.loading) {
    return renderLoading();
  }

  if (state.error) {
    return renderError();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            💖 Your Interested Hostels
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {state.hostels.length}{" "}
            {state.hostels.length === 1 ? "hostel" : "hostels"} saved
          </p>
        </div>

        {/* Empty state */}
        {state.hostels.length === 0 ? (
          renderEmpty()
        ) : (
          <>
            {/* Controls */}
            {renderControls()}

            {/* Hostel Grid/List */}
            <div
              className={
                viewMode === VIEW_MODES.GRID
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }
            >
              {sortedHostels.map((hostel) =>
                viewMode === VIEW_MODES.GRID
                  ? renderGridCard(hostel)
                  : renderListCard(hostel),
              )}
            </div>
          </>
        )}

        {/* Clear all modal */}
        {renderClearModal()}
      </div>
    </div>
  );
};

export default Interested;

/**
 * ============================================================================
 * REFACTORING IMPROVEMENTS
 * ============================================================================
 *
 * 1. STATE MANAGEMENT
 *    ✅ Consolidated state object
 *    ✅ Proper loading/error states
 *
 * 2. PERFORMANCE
 *    ✅ Memoized sorted hostels (useMemo)
 *    ✅ useCallback for all handlers
 *    ✅ Lazy loading images
 *    ✅ Optimistic UI updates for remove
 *
 * 3. UX IMPROVEMENTS
 *    ✅ Sort options (date, price, name)
 *    ✅ Grid/list view toggle
 *    ✅ Remove individual hostels
 *    ✅ Clear all with confirmation
 *    ✅ Empty state with CTA
 *    ✅ Loading indicators
 *    ✅ Navigate to details
 *
 * 4. CODE QUALITY
 *    ✅ API + localStorage fallback
 *    ✅ Separated render functions
 *    ✅ Clear organization
 *    ✅ Comprehensive documentation
 *
 * OPTIONAL ENHANCEMENTS:
 * - Add search/filter by location or type
 * - Add export to PDF/email
 * - Add share list functionality
 * - Add comparison mode
 * - Add drag-to-reorder
 */
