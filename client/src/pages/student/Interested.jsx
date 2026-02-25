import React, { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  Heart,
  Trash2,
  MapPin,
  IndianRupee,
  Grid3x3,
  List,
  AlertCircle,
  X,
  SortAsc,
  RefreshCw,
} from "lucide-react";
import {
  useInterestedHostels,
  useRemoveInterested,
  useClearInterested,
} from "../../hooks/useQueries";
import { SkeletonHostelCard } from "../../components/ui/SkeletonCard";

// ============================================================================
// CONSTANTS
// ============================================================================

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

const getImageUrl = (hostel) => {
  if (!hostel.images || hostel.images.length === 0)
    return "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?fit=crop&w=800&q=80";
  const img = hostel.images[0];
  if (img.startsWith("http")) return img;
  
  // Note: We'll assume the baseURL is handled by the server serving static files from /uploads
  // For now, consistent with other pages, we'll prefix with host if needed.
  // But standardizing on the server providing full URLs or handling it centrally is better.
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
  return img.startsWith("/") ? `${API_BASE_URL}${img}` : `${API_BASE_URL}/${img}`;
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const Interested = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // TanStack Query — data + mutations
  const { data, isLoading, isError } = useInterestedHostels();
  const hostels = useMemo(() => data || [], [data]);

  const removeMutation = useRemoveInterested();
  const clearMutation = useClearInterested();

  // ==========================================================================
  // LOCAL UI STATE
  // ==========================================================================

  const [sortBy, setSortBy] = useState(SORT_OPTIONS.DATE_DESC);
  const [viewMode, setViewMode] = useState(VIEW_MODES.GRID);
  const [removingId, setRemovingId] = useState(null);
  const [showClearModal, setShowClearModal] = useState(false);

  // ==========================================================================
  // COMPUTED VALUES (Memoized)
  // ==========================================================================

  const sortedHostels = useMemo(() => {
    if (!hostels.length) return [];
    const sorted = [...hostels];

    switch (sortBy) {
      case SORT_OPTIONS.DATE_DESC:
        return sorted.reverse();
      case SORT_OPTIONS.DATE_ASC:
        return sorted;
      case SORT_OPTIONS.PRICE_DESC:
        return sorted.sort((a, b) => (b.pricePerMonth || 0) - (a.pricePerMonth || 0));
      case SORT_OPTIONS.PRICE_ASC:
        return sorted.sort((a, b) => (a.pricePerMonth || 0) - (b.pricePerMonth || 0));
      case SORT_OPTIONS.NAME_ASC:
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return sorted;
    }
  }, [hostels, sortBy]);

  // ==========================================================================
  // EVENT HANDLERS
  // ==========================================================================

  const handleRemoveHostel = useCallback(
    async (hostelId) => {
      setRemovingId(hostelId);

      // Optimistic update in cache
      queryClient.setQueryData(["interested"], (old) => {
        if (!Array.isArray(old)) return old;
        return old.filter((h) => (h._id || h.id) !== hostelId);
      });

      try {
        await removeMutation.mutateAsync(hostelId);
      } catch {
        // Revert by invalidating
        queryClient.invalidateQueries({ queryKey: ["interested"] });
        toast.error("Failed to remove hostel");
      } finally {
        setRemovingId(null);
      }
    },
    [queryClient, removeMutation],
  );

  const handleClearAll = useCallback(async () => {
    queryClient.setQueryData(["interested"], []);
    setShowClearModal(false);

    try {
      await clearMutation.mutateAsync();
      toast.success("All hostels removed from your list");
    } catch {
      queryClient.invalidateQueries({ queryKey: ["interested"] });
      toast.error("Failed to clear list");
    }
  }, [queryClient, clearMutation]);

  const handleViewDetails = useCallback(
    (hostelId) => {
      navigate(`/student/hostels/${hostelId}`);
    },
    [navigate],
  );

  const handleToggleView = useCallback(() => {
    setViewMode((prev) =>
      prev === VIEW_MODES.GRID ? VIEW_MODES.LIST : VIEW_MODES.GRID,
    );
  }, []);

  const handleSortChange = useCallback((e) => {
    setSortBy(e.target.value);
  }, []);

  // ==========================================================================
  // RENDER HELPERS
  // ==========================================================================

  const renderControls = () => (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <SortAsc size={20} className="text-gray-600 dark:text-slate-400" />
          <select
            value={sortBy}
            onChange={handleSortChange}
            className="px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="p-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition"
          aria-label="Toggle view mode"
        >
          {viewMode === VIEW_MODES.GRID ? <List size={20} /> : <Grid3x3 size={20} />}
        </button>
      </div>

      {hostels.length > 0 && (
        <button
          onClick={() => setShowClearModal(true)}
          className="flex items-center gap-2 text-red-600 dark:text-red-400 hover:underline"
        >
          <Trash2 size={18} />
          <span>Clear All List</span>
        </button>
      )}
    </div>
  );

  const renderGridCard = (hostel) => {
    const id = hostel._id || hostel.id;
    const imgSrc = getImageUrl(hostel);
    const isRemoving = removingId === id;

    return (
      <div
        key={id}
        className="bg-white dark:bg-slate-800 rounded-lg shadow hover:shadow-lg transition transform hover:scale-[1.02] overflow-hidden relative"
      >
        <button
          onClick={(e) => { e.stopPropagation(); handleRemoveHostel(id); }}
          disabled={isRemoving}
          className="absolute top-2 right-2 z-10 p-2 bg-white/90 dark:bg-slate-800/90 rounded-full shadow-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition"
          aria-label="Remove from interested"
        >
          {isRemoving ? (
            <RefreshCw size={18} className="animate-spin text-red-500" />
          ) : (
            <Heart size={18} className="text-red-500" fill="red" />
          )}
        </button>

        <div onClick={() => handleViewDetails(id)} className="cursor-pointer">
          <img
            src={imgSrc}
            alt={hostel.name}
            onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?fit=crop&w=800&q=80"; }}
            className="w-full h-48 object-cover"
            loading="lazy"
          />
        </div>

        <div className="p-4">
          <h2
            onClick={() => handleViewDetails(id)}
            className="text-xl font-bold mb-2 text-gray-800 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            {hostel.name}
          </h2>
          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-slate-400 mb-3 font-medium">
            <MapPin size={16} className="text-blue-500" />
            <span>{hostel.locality || hostel.location}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-xl font-black text-gray-900 dark:text-white">
              <IndianRupee size={18} />
              <span>{hostel.pricePerMonth || hostel.price}<span className="text-sm font-normal text-gray-500">/mo</span></span>
            </div>
            <button onClick={() => handleViewDetails(id)} className="text-blue-600 font-bold hover:underline">Details</button>
          </div>
        </div>
      </div>
    );
  };

  const renderListCard = (hostel) => {
    const id = hostel._id || hostel.id;
    const imgSrc = getImageUrl(hostel);
    const isRemoving = removingId === id;

    return (
      <div
        key={id}
        className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-3 flex gap-4 pt-4 relative pr-12"
      >
        <div onClick={() => handleViewDetails(id)} className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer">
          <img
            src={imgSrc}
            alt={hostel.name}
            onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?fit=crop&w=400&q=80"; }}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h2
            onClick={() => handleViewDetails(id)}
            className="text-xl font-bold mb-1 truncate cursor-pointer hover:text-blue-600 transition"
          >
            {hostel.name}
          </h2>
          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-slate-400 mb-2">
            <MapPin size={16} className="text-blue-500" />
            <span>{hostel.locality || hostel.location}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-lg font-black text-gray-900 dark:text-white">
              <IndianRupee size={16} />
              <span>{hostel.pricePerMonth || hostel.price}</span>
            </div>
            <button
               onClick={() => handleViewDetails(id)}
               className="text-sm font-bold text-blue-600 hover:text-blue-700"
            >
              View Details
            </button>
          </div>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); handleRemoveHostel(id); }}
          disabled={isRemoving}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-gray-50 dark:bg-slate-700 rounded-full hover:bg-red-50 transition"
        >
          {isRemoving ? <RefreshCw size={20} className="animate-spin text-red-500" /> : <Trash2 size={20} className="text-gray-400 hover:text-red-500" />}
        </button>
      </div>
    );
  };

  const renderClearModal = () => {
    if (!showClearModal) return null;
    return (
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in"
        onClick={() => setShowClearModal(false)}
      >
        <div
          className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6 mx-auto"><Trash2 size={32} className="text-red-500" /></div>
          <h2 className="text-2xl font-black mb-2 text-center text-gray-800 dark:text-white">Clear the entire list?</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 text-center">
            This will remove all {hostels.length} hostels from your favorites. You can't undo this.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={handleClearAll}
              disabled={clearMutation.isPending}
              className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold transition shadow-lg shadow-red-100 flex items-center justify-center gap-2"
            >
              {clearMutation.isPending ? <RefreshCw size={20} className="animate-spin" /> : "Remove All"}
            </button>
            <button
              onClick={() => setShowClearModal(false)}
              className="w-full py-4 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-2xl font-bold transition hover:bg-slate-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ==========================================================================
  // MAIN RENDER
  // ==========================================================================

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 p-4">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Unable to Load</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">Failed to load your interested hostels.</p>
          <button onClick={() => queryClient.invalidateQueries({ queryKey: ["interested"] })} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-white p-4 sm:p-6 pb-24">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-black mb-2">💖 Your Favorites</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium font-sm">
            {isLoading ? "Loading…" : `${hostels.length} ${hostels.length === 1 ? "hostel" : "hostels"} saved`}
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonHostelCard key={i} />)}
          </div>
        ) : hostels.length === 0 ? (
          <div className="min-h-[50vh] flex flex-col items-center justify-center text-center">
            <Heart className="w-20 h-20 text-slate-200 dark:text-slate-700 mb-6" />
            <h2 className="text-2xl font-bold mb-2">No Favorites Yet</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm">Explore hostels and save them here to compare and book later.</p>
            <button onClick={() => navigate("/student/hostels")} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-100 transition transform hover:scale-105">Explore Now</button>
          </div>
        ) : (
          <>
            {renderControls()}
            <div className={viewMode === VIEW_MODES.GRID ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4 max-w-4xl"}>
              {sortedHostels.map((hostel) => viewMode === VIEW_MODES.GRID ? renderGridCard(hostel) : renderListCard(hostel))}
            </div>
          </>
        )}

        {renderClearModal()}
      </div>
    </div>
  );
};

export default Interested;
