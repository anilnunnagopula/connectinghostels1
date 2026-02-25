/**
 * RecentlyViewed.jsx - Student's Recently Viewed Hostels History
 *
 * Migration Status:
 * - Migrated to React Query (useRecentlyViewed, useRemoveRecentlyViewed, useClearRecentlyViewed)
 * - Removed manual fetch and localStorage sync logic
 * - Fixed singular/plural API pathing bugs
 * - Standarized navigation to /student/hostels/:id
 */

import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  Eye,
  Trash2,
  MapPin,
  IndianRupee,
  Grid3x3,
  List,
  Loader2,
  AlertCircle,
  X,
  SortAsc,
  Calendar,
} from "lucide-react";
import { 
  useRecentlyViewed, 
  useRemoveRecentlyViewed, 
  useClearRecentlyViewed 
} from "../../hooks/useQueries";

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

const extractPrice = (priceString) => {
  if (!priceString) return 0;
  if (typeof priceString === "number") return priceString;
  const match = priceString.match(/\d+/);
  return match ? parseInt(match[0]) : 0;
};

const getRelativeTime = (timestamp) => {
  if (!timestamp) return "Unknown";
  const now = new Date();
  const viewed = new Date(timestamp);
  const diffMs = now - viewed;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return viewed.toLocaleDateString();
};

const formatFullDate = (timestamp) => {
  if (!timestamp) return "Unknown date";
  return new Date(timestamp).toLocaleString("en-IN", {
    month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const RecentlyViewed = () => {
  const navigate = useNavigate();

  // ==========================================================================
  // QUERIES & MUTATIONS
  // ==========================================================================

  const { data: hostels = [], isLoading, error, refetch } = useRecentlyViewed();
  const removeMutation = useRemoveRecentlyViewed();
  const clearMutation = useClearRecentlyViewed();

  const [sortBy, setSortBy] = useState(SORT_OPTIONS.DATE_DESC);
  const [viewMode, setViewMode] = useState(VIEW_MODES.GRID);
  const [showClearModal, setShowClearModal] = useState(false);

  // ==========================================================================
  // COMPUTED VALUES
  // ==========================================================================

  const sortedHostels = useMemo(() => {
    if (!hostels.length) return [];
    const sorted = [...hostels];

    switch (sortBy) {
      case SORT_OPTIONS.DATE_DESC:
        return sorted.sort((a, b) => new Date(b.viewedAt || 0) - new Date(a.viewedAt || 0));
      case SORT_OPTIONS.DATE_ASC:
        return sorted.sort((a, b) => new Date(a.viewedAt || 0) - new Date(b.viewedAt || 0));
      case SORT_OPTIONS.PRICE_DESC:
        return sorted.sort((a, b) => extractPrice(b.price) - extractPrice(a.price));
      case SORT_OPTIONS.PRICE_ASC:
        return sorted.sort((a, b) => extractPrice(a.price) - extractPrice(b.price));
      case SORT_OPTIONS.NAME_ASC:
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return sorted;
    }
  }, [hostels, sortBy]);

  // ==========================================================================
  // EVENT HANDLERS
  // ==========================================================================

  const handleRemoveHostel = (id) => removeMutation.mutate(id);
  const handleClearAll = () => clearMutation.mutate(undefined, { onSuccess: () => setShowClearModal(false) });
  const handleViewDetails = (id) => navigate(`/student/hostels/${id}`);

  // ==========================================================================
  // RENDER HELPERS
  // ==========================================================================

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-slate-400">Loading your viewing history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 p-4">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Unable to Load History</h2>
          <p className="text-gray-600 dark:text-slate-400 mb-6">{error.message || "Something went wrong"}</p>
          <button onClick={() => refetch()} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition">Try Again</button>
        </div>
      </div>
    );
  }

  const renderCard = (hostel) => {
    const isRemoving = removeMutation.isPending && removeMutation.variables === hostel.id;
    const date = hostel.viewedAt || hostel.timestamp;

    if (viewMode === VIEW_MODES.GRID) {
      return (
        <div key={hostel.id} className="bg-white dark:bg-slate-800 rounded-lg shadow hover:shadow-lg transition transform hover:scale-[1.01] overflow-hidden relative">
          <div className="absolute top-2 left-2 z-10 bg-black/70 text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1 backdrop-blur-sm"><Clock size={10} />{getRelativeTime(date)}</div>
          <button onClick={() => handleRemoveHostel(hostel.id)} disabled={isRemoving} className="absolute top-2 right-2 z-10 p-2 bg-white/90 dark:bg-slate-800/90 rounded-full shadow-lg hover:bg-red-50 dark:hover:bg-red-900/40 transition">
            {isRemoving ? <Loader2 size={16} className="animate-spin text-red-500" /> : <X size={16} className="text-gray-500" />}
          </button>
          <div onClick={() => handleViewDetails(hostel.id)} className="cursor-pointer">
            <img src={hostel.image || "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?fit=crop&w=800&q=80"} alt={hostel.name} className="w-full h-44 object-cover" />
          </div>
          <div className="p-4">
            <h2 onClick={() => handleViewDetails(hostel.id)} className="text-lg font-bold mb-1 line-clamp-1 cursor-pointer hover:text-blue-600 transition">{hostel.name}</h2>
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-3"><MapPin size={12} className="text-blue-500" />{hostel.location}</div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-lg font-bold text-gray-900 dark:text-white"><IndianRupee size={16} />{hostel.price}</div>
              <button onClick={() => handleViewDetails(hostel.id)} className="text-sm font-semibold text-blue-600 hover:text-blue-700">View Again</button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div key={hostel.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-3 flex gap-4 pr-12 relative overflow-hidden group">
        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer" onClick={() => handleViewDetails(hostel.id)}>
          <img src={hostel.image || "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?fit=crop&w=400&q=80"} alt={hostel.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        </div>
        <div className="flex-1 min-w-0 pr-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded">{hostel.type}</span>
            <span className="text-[10px] text-gray-400 flex items-center gap-1"><Clock size={10} />{getRelativeTime(date)}</span>
          </div>
          <h2 onClick={() => handleViewDetails(hostel.id)} className="text-xl font-bold mb-1 truncate cursor-pointer hover:text-blue-600">{hostel.name}</h2>
          <div className="flex items-center gap-1 text-sm text-gray-500 mb-2"><MapPin size={14} className="text-blue-500" />{hostel.location}</div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-0.5 text-lg font-bold text-slate-900 dark:text-white"><IndianRupee size={16} />{hostel.price}</div>
             <button onClick={() => handleViewDetails(hostel.id)} className="text-sm font-semibold text-blue-600">View Details</button>
          </div>
        </div>
        <button onClick={() => handleRemoveHostel(hostel.id)} disabled={isRemoving} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition">
           {isRemoving ? <Loader2 size={20} className="animate-spin" /> : <Trash2 size={20} />}
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-white p-4 sm:p-6 pb-24 lg:pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black mb-2 flex items-center gap-3"><Eye className="text-blue-600 w-8 h-8" />Recently Viewed</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{hostels.length} {hostels.length === 1 ? "hostel" : "hostels"} in your history</p>
          </div>
          {hostels.length > 0 && (
            <button onClick={() => setShowClearModal(true)} className="flex items-center gap-2 text-red-500 hover:text-red-600 font-bold text-sm bg-red-50 dark:bg-red-900/10 px-4 py-2 rounded-lg transition"><Trash2 size={16} />Clear History</button>
          )}
        </div>

        {hostels.length === 0 ? (
          <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
            <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6"><Eye size={40} className="text-slate-300" /></div>
            <h2 className="text-2xl font-bold mb-2">No History Yet</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm">Hostels you browse will show up here for quick access later.</p>
            <button onClick={() => navigate("/student/hostels")} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 dark:shadow-none transition transform hover:scale-105">Find Your Next Hostel</button>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 sticky top-0 z-20 py-2 bg-gray-50 dark:bg-slate-900/90 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <SortAsc size={20} className="text-blue-500" />
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-transparent font-bold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer">
                  <option value={SORT_OPTIONS.DATE_DESC}>Most Recent</option>
                  <option value={SORT_OPTIONS.DATE_ASC}>Oldest First</option>
                  <option value={SORT_OPTIONS.PRICE_DESC}>Price: High to Low</option>
                  <option value={SORT_OPTIONS.PRICE_ASC}>Price: Low to High</option>
                  <option value={SORT_OPTIONS.NAME_ASC}>Name: A to Z</option>
                </select>
              </div>
              <div className="flex bg-white dark:bg-slate-800 p-1 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <button onClick={() => setViewMode(VIEW_MODES.GRID)} className={`p-2 rounded-lg transition ${viewMode === VIEW_MODES.GRID ? "bg-blue-600 text-white shadow-md" : "text-slate-400"}`}><Grid3x3 size={20} /></button>
                <button onClick={() => setViewMode(VIEW_MODES.LIST)} className={`p-2 rounded-lg transition ${viewMode === VIEW_MODES.LIST ? "bg-blue-600 text-white shadow-md" : "text-slate-400"}`}><List size={20} /></button>
              </div>
            </div>

            <div className={viewMode === VIEW_MODES.GRID ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4 max-w-4xl"}>
              {sortedHostels.map(renderCard)}
            </div>
          </>
        )}

        {showClearModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setShowClearModal(false)}>
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl scale-in-center" onClick={(e) => e.stopPropagation()}>
              <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6 mx-auto"><Trash2 size={32} className="text-red-500" /></div>
              <h2 className="text-2xl font-black text-center mb-2">Clear History?</h2>
              <p className="text-slate-500 dark:text-slate-400 text-center mb-8">This will permanently remove your entire viewing history. You can't undo this action.</p>
              <div className="flex flex-col gap-3">
                <button onClick={handleClearAll} disabled={clearMutation.isPending} className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold transition transform active:scale-95 shadow-lg shadow-red-100 flex items-center justify-center gap-2">
                   {clearMutation.isPending ? <Loader2 size={20} className="animate-spin" /> : <Trash2 size={20} />}Clear Everything
                </button>
                <button onClick={() => setShowClearModal(false)} className="w-full py-4 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-2xl font-bold transition hover:bg-slate-200">Keep it</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentlyViewed;
