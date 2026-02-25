/**
 * MyBookingsPage.jsx - Student Booking Management
 *
 * Migration Status:
 * - Migrated to React Query (useStudentRequests, useToggleInterested, useInterestedHostels)
 * - Removed manual state-based fetches and localStorage sync
 * - Standardized navigation to /student/hostels/:id
 * - Polished UI with consistent status badges
 */

import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  BedDouble,
  Calendar,
  ShieldCheck,
  History,
  IndianRupee,
  MessageSquare,
  FileText,
  Heart,
  Loader2,
  AlertCircle,
  Filter,
  ArrowUpDown,
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
} from "lucide-react";
import { 
  useStudentRequests, 
  useToggleInterested, 
  useInterestedHostels 
} from "../../hooks/useQueries";
import toast from 'react-hot-toast';

// ============================================================================
// CONSTANTS
// ============================================================================

const REQUEST_STATUS = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

const SORT_OPTIONS = {
  DATE_DESC: "date_desc",
  DATE_ASC: "date_asc",
  NAME_ASC: "name_asc",
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const MyBookingsPage = () => {
  const navigate = useNavigate();

  // ==========================================================================
  // QUERIES & MUTATIONS
  // ==========================================================================

  const { data, isLoading, error, refetch } = useStudentRequests();
  const { data: interestedList = [] } = useInterestedHostels();
  const toggleInterestMutation = useToggleInterested();

  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState(SORT_OPTIONS.DATE_DESC);

  // Derive data from query
  const requests = data?.requests || [];
  const currentHostel = data?.currentHostel || null;

  // ==========================================================================
  // COMPUTED VALUES
  // ==========================================================================

  const processedRequests = useMemo(() => {
    let filtered = requests;
    if (filterStatus !== "all") {
      filtered = filtered.filter((r) => r.status === filterStatus);
    }

    const sorted = [...filtered];
    switch (sortBy) {
      case SORT_OPTIONS.DATE_DESC:
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case SORT_OPTIONS.DATE_ASC:
        sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case SORT_OPTIONS.NAME_ASC:
        sorted.sort((a, b) => (a.hostel?.name || "").localeCompare(b.hostel?.name || ""));
        break;
    }
    return sorted;
  }, [requests, filterStatus, sortBy]);

  const requestCounts = useMemo(() => ({
    pending: requests.filter((r) => r.status === REQUEST_STATUS.PENDING).length,
    total: requests.length,
  }), [requests]);

  const interestedIds = useMemo(() => 
    new Set(interestedList.map(h => h._id || h.id)), 
    [interestedList]
  );

  // ==========================================================================
  // EVENT HANDLERS
  // ==========================================================================

  const handleToggleInterested = async (hostelId) => {
    try {
      await toggleInterestMutation.mutateAsync(hostelId);
      const isRemoving = interestedIds.has(hostelId);
      toast.success(isRemoving ? "Removed from favorites" : "Added to favorites");
    } catch {
      toast.error("Failed to update favorites");
    }
  };

  // ==========================================================================
  // RENDER HELPERS
  // ==========================================================================

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400 font-medium">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Unable to Load Bookings</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">{error.message || "Failed to fetch booking data."}</p>
          <button onClick={() => refetch()} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition">Try Again</button>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case REQUEST_STATUS.PENDING:
        return { icon: <Clock size={14} />, className: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400", text: "Pending" };
      case REQUEST_STATUS.APPROVED:
        return { icon: <CheckCircle size={14} />, className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400", text: "Approved" };
      case REQUEST_STATUS.REJECTED:
        return { icon: <XCircle size={14} />, className: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400", text: "Rejected" };
      default:
        return { icon: null, className: "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300", text: status };
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white p-4 sm:p-6 pb-24 lg:pb-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-black mb-2">My Bookings</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Manage your stays and booking requests</p>
        </div>

        {/* Current Stay */}
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg text-white"><BedDouble size={20} /></div>
            Current Stay
          </h2>
          
          {currentHostel ? (
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl shadow-blue-900/5 border border-slate-100 dark:border-slate-700/50 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-10 -mr-10 -mt-10 bg-blue-500/5 rounded-full blur-3xl w-40 h-40" />
               <div className="flex flex-col sm:flex-row justify-between items-start gap-4 relative z-10">
                <div>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white">{currentHostel.name}</h3>
                  <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium flex items-center gap-2">
                    <MapPin size={18} className="text-blue-500" /> {currentHostel.location}
                  </p>
                </div>
                <span className="text-xs font-black tracking-widest uppercase bg-emerald-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-200 dark:shadow-none">
                  <ShieldCheck size={16} /> Active Resident
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10 relative z-10">
                <button onClick={() => navigate("/student/payments")} className="flex flex-col items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-2xl transition group">
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm text-blue-600 group-hover:scale-110 transition-transform"><IndianRupee size={20} /></div>
                  <span className="text-sm font-bold">Pay Rent</span>
                </button>
                <button onClick={() => navigate("/student/raise-complaint")} className="flex flex-col items-center gap-3 p-4 bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/30 rounded-2xl transition group">
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm text-rose-500 group-hover:scale-110 transition-transform"><MessageSquare size={20} /></div>
                  <span className="text-sm font-bold">Complaints</span>
                </button>
                <button onClick={() => navigate("/student/notifications")} className="flex flex-col items-center gap-3 p-4 bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl transition group">
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm text-slate-600 dark:text-slate-300 group-hover:scale-110 transition-transform"><FileText size={20} /></div>
                  <span className="text-sm font-bold">Updates</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800/40 border-2 border-dashed border-slate-200 dark:border-slate-700 p-12 rounded-3xl text-center">
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6"><BedDouble size={32} className="text-slate-300" /></div>
              <h3 className="text-xl font-bold mb-2">No Active Stay</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-xs mx-auto">You're not currently checked into any hostel. Start your journey today!</p>
              <button onClick={() => navigate("/student/hostels")} className="bg-slate-900 dark:bg-blue-600 text-white px-8 py-3 rounded-xl font-black shadow-xl transition transform hover:scale-105">Browse Hostels</button>
            </div>
          )}
        </div>

        {/* Requests History */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-lg text-white"><History size={20} /></div>
              Booking Requests
            </h2>
            <div className="text-sm font-bold text-slate-400">{requestCounts.total} Applications</div>
          </div>

          <div className="flex flex-wrap items-center gap-6 mb-8 bg-white dark:bg-slate-800 p-2 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-2 flex-1 min-w-[150px] px-3">
              <Filter size={18} className="text-blue-500" />
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="bg-transparent font-bold text-sm w-full focus:outline-none cursor-pointer">
                <option value="all">All Statuses</option>
                <option value={REQUEST_STATUS.PENDING}>Pending Only</option>
                <option value={REQUEST_STATUS.APPROVED}>Approved Only</option>
                <option value={REQUEST_STATUS.REJECTED}>Rejected Only</option>
              </select>
            </div>
            <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 hidden sm:block" />
            <div className="flex items-center gap-2 flex-1 min-w-[150px] px-3">
              <ArrowUpDown size={18} className="text-indigo-500" />
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-transparent font-bold text-sm w-full focus:outline-none cursor-pointer">
                <option value={SORT_OPTIONS.DATE_DESC}>Most Recent First</option>
                <option value={SORT_OPTIONS.DATE_ASC}>Oldest First</option>
                <option value={SORT_OPTIONS.NAME_ASC}>Hostel Name (A-Z)</option>
              </select>
            </div>
          </div>

          {processedRequests.length > 0 ? (
            <div className="space-y-4">
              {processedRequests.map((request) => {
                const hostelId = request.hostel?._id || request.hostel?.id;
                const isInterested = interestedIds.has(hostelId);
                const statusBadge = getStatusBadge(request.status);
                const isToggling = toggleInterestMutation.isPending && toggleInterestMutation.variables === hostelId;

                return (
                  <div key={request._id || request.id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow hover:shadow-md transition border border-transparent hover:border-blue-100 dark:hover:border-blue-900 group">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                           <h4 className="font-black text-xl text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors uppercase tracking-tight">{request.hostel?.name || "Premium Hostel"}</h4>
                           <span className={`text-[10px] sm:text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1 shadow-sm ${statusBadge.className}`}>
                             {statusBadge.icon} {statusBadge.text}
                           </span>
                        </div>
                        <p className="text-sm font-medium text-slate-400 flex items-center gap-2">
                          <Calendar size={14} /> Applied on {new Date(request.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                      
                      <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                        <button
                          onClick={() => handleToggleInterested(hostelId)}
                          disabled={isToggling}
                          className={`p-3 rounded-xl transition flex-1 sm:flex-none flex items-center justify-center gap-2 font-bold text-sm ${
                            isInterested 
                              ? "bg-rose-50 text-rose-500 dark:bg-rose-900/20" 
                              : "bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500 dark:bg-slate-700/50"
                          }`}
                        >
                          {isToggling ? <Loader2 size={16} className="animate-spin" /> : <Heart size={16} fill={isInterested ? "currentColor" : "none"} />}
                          <span className="sm:hidden">{isInterested ? "Saved" : "Save"}</span>
                        </button>
                        <button
                          onClick={() => navigate(`/student/hostels/${hostelId}`)}
                          className="flex-1 sm:flex-none px-6 py-3 bg-slate-900 dark:bg-slate-700 text-white rounded-xl font-black text-sm hover:translate-x-1 transition-transform"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-100/40 dark:bg-slate-800/20 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
               <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4"><History size={28} className="text-slate-300" /></div>
               <p className="font-bold text-slate-400">No applications found matching your criteria</p>
               {filterStatus !== 'all' && <button onClick={() => setFilterStatus('all')} className="mt-4 text-blue-500 font-bold text-sm">Clear Filters</button>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBookingsPage;
