/**
 * MyHostelPage.jsx - Student's Current Hostel Dashboard
 *
 * Migration Status:
 * - Migrated to React Query (useStudentRequests, useHostelDetail)
 * - Removed manual fetch chains and API_BASE_URL
 * - Standardized navigation and action flows
 * - Unified UI with MyBookingsPage for consistent "Active Resident" branding
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Building,
  MapPin,
  ArrowLeft,
  Loader2,
  Home,
  BedDouble,
  Calendar,
  ShieldCheck,
  IndianRupee,
  MessageSquare,
  FileText,
  AlertCircle,
  CheckCircle,
  DoorOpen,
  Sparkles,
  Clock,
} from "lucide-react";
import { useStudentRequests, useHostelDetail } from "../../hooks/useQueries";
import { SkeletonHostelCard } from "../../components/ui/SkeletonCard";

const MyHostel = () => {
  const navigate = useNavigate();

  // 1. Get status and current hostel ID
  const { 
    data: statusData, 
    isLoading: loadingStatus, 
    error: statusError,
    refetch: refetchStatus
  } = useStudentRequests();

  const currentHostelId = statusData?.currentHostel;
  const requests = statusData?.requests || [];

  // 2. Get full hostel details (only if admitted)
  const {
    data: hostel,
    isLoading: loadingHostel,
    error: hostelError,
    refetch: refetchHostel
  } = useHostelDetail(currentHostelId);

  // Derive the approved request to get specific room/floor (if available)
  const approvedRequest = requests.find(r => r.status === "Approved" && (r.hostel?._id === currentHostelId || r.hostel?.id === currentHostelId));

  // ==========================================================================
  // RENDER HELPERS
  // ==========================================================================

  const handleRetry = () => {
    refetchStatus();
    if (currentHostelId) refetchHostel();
  };

  if (loadingStatus || (currentHostelId && loadingHostel)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400 font-medium tracking-wide">Retrieving your hostel information...</p>
        </div>
      </div>
    );
  }

  if (statusError || (currentHostelId && hostelError)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black mb-2 uppercase tracking-tight">Sync Failure</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6 font-medium">{statusError?.message || hostelError?.message || "Something went wrong"}</p>
          <button onClick={handleRetry} className="bg-slate-900 dark:bg-blue-600 text-white px-8 py-3 rounded-xl font-bold transition hover:scale-105">Try Again</button>
        </div>
      </div>
    );
  }

  // CASE: Not admitted to any hostel
  if (!currentHostelId || !hostel) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 sm:p-6 pb-24 lg:pb-8">
        <div className="max-w-4xl mx-auto pt-8">
          <div className="flex items-center justify-between mb-8">
            <button onClick={() => navigate(-1)} className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-white transition"><ArrowLeft size={20} /></button>
            <h1 className="text-3xl font-black uppercase tracking-tighter">My Hostel</h1>
            <div className="w-10"></div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800">
            <div className="bg-blue-50 dark:bg-blue-900/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse text-blue-600"><Home size={40} /></div>
            <h2 className="text-3xl font-black mb-4">No Active Residency</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-10 font-medium">You're not currently checked into a hostel. Browse our premium listings to find your next home!</p>
            
            {requests.some(r => r.status === "Pending") && (
              <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/50 rounded-2xl p-5 mb-10 max-w-md mx-auto flex items-center gap-4 text-left">
                <Clock className="text-amber-500 flex-shrink-0" size={24} />
                <p className="text-sm font-bold text-amber-800 dark:text-amber-300">You have matching pending requests. Please wait for owner approval.</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => navigate("/student/hostels")} className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-blue-100 dark:shadow-none transition transform hover:scale-105 flex items-center justify-center gap-2 tracking-wide"><Building size={20} />EXPLORE HOSTELS</button>
              <button onClick={() => navigate("/student/my-bookings")} className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-10 py-4 rounded-2xl font-black hover:bg-slate-200 transition-colors tracking-wide">VIEW HISTORY</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // CASE: Admitted resident
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 sm:p-6 pb-24 lg:pb-8">
      <div className="max-w-5xl mx-auto pt-4">
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => navigate(-1)} className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-white transition"><ArrowLeft size={20} /></button>
          <h1 className="text-3xl font-black uppercase tracking-tighter">My Residency</h1>
          <div className="w-10"></div>
        </div>

        {/* Premium Dashboard Hero */}
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl shadow-blue-900/5 overflow-hidden mb-8 border border-slate-100 dark:border-slate-700/50">
          <div className="relative h-56 group overflow-hidden">
            <img src={hostel.images?.[0] || "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?fit=crop&w=1200&q=80"} alt={hostel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
            <div className="absolute bottom-6 left-8 text-white">
              <div className="flex items-center gap-2 mb-2"><Sparkles className="text-blue-400" size={20} /><span className="text-[10px] font-black uppercase tracking-widest text-blue-200">Official Resident</span></div>
              <h2 className="text-4xl font-black tracking-tight">{hostel.name}</h2>
              <div className="flex items-center gap-2 mt-2 text-slate-200 font-medium"><MapPin size={16} className="text-blue-400" />{hostel.location}</div>
            </div>
            <div className="absolute top-6 right-8"><div className="bg-emerald-500 text-white px-5 py-2.5 rounded-2xl text-xs font-black tracking-widest uppercase flex items-center gap-2 shadow-xl shadow-emerald-500/20"><CheckCircle size={16} />ACTIVE</div></div>
          </div>

          <div className="p-8 lg:p-12">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
              <div className="bg-blue-50/50 dark:bg-blue-900/10 rounded-3xl p-6 border border-blue-100/50 dark:border-blue-900/30">
                <div className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-3 ml-1">Room Assignment</div>
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-white dark:bg-slate-700 rounded-2xl shadow-sm text-blue-600"><BedDouble size={24} /></div>
                   <div className="text-2xl font-black">#{approvedRequest?.roomNumber || "B-12"}</div>
                </div>
              </div>
              <div className="bg-indigo-50/50 dark:bg-indigo-900/10 rounded-3xl p-6 border border-indigo-100/50 dark:border-indigo-900/30">
                <div className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-3 ml-1">Floor Level</div>
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-white dark:bg-slate-700 rounded-2xl shadow-sm text-indigo-600"><DoorOpen size={24} /></div>
                   <div className="text-2xl font-black">{approvedRequest?.floor || "2nd"} Floor</div>
                </div>
              </div>
              <div className="bg-emerald-50/50 dark:bg-emerald-900/10 rounded-3xl p-6 border border-emerald-100/50 dark:border-emerald-900/30">
                <div className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-3 ml-1">Member Since</div>
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-white dark:bg-slate-700 rounded-2xl shadow-sm text-emerald-600"><Calendar size={24} /></div>
                   <div className="text-sm font-black">{approvedRequest?.createdAt ? new Date(approvedRequest.createdAt).toLocaleDateString() : "Active State"}</div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-8 mb-12 py-6 border-y border-slate-100 dark:border-slate-700">
               <div className="flex items-center gap-3"><div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-blue-500"><Building size={20} /></div><div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hostel Type</p><p className="font-bold">{hostel.type}</p></div></div>
               <div className="flex items-center gap-3"><div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-emerald-500"><IndianRupee size={20} /></div><div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Monthly Rent</p><p className="font-bold">₹{String(hostel.pricePerMonth || hostel.price).replace(/\D/g, '')}/mo</p></div></div>
            </div>

            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2"><div className="w-1 h-4 bg-blue-600 rounded-full" />Quick Controls</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button onClick={() => navigate("/student/payments")} className="bg-slate-900 dark:bg-blue-600 text-white px-8 py-5 rounded-2xl font-black text-sm transition transform hover:scale-105 active:scale-95 shadow-xl shadow-slate-200 dark:shadow-none flex items-center justify-center gap-3"><IndianRupee size={20} />PAY RENT</button>
                <button onClick={() => navigate("/student/raise-complaint")} className="bg-rose-500 text-white px-8 py-5 rounded-2xl font-black text-sm transition transform hover:scale-105 active:scale-95 shadow-xl shadow-rose-200 dark:shadow-none flex items-center justify-center gap-3"><MessageSquare size={20} />COMPLAINTS</button>
                <button onClick={() => navigate("/student/my-hostel-rules")} className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-8 py-5 rounded-2xl font-black text-sm transition border border-slate-200 dark:border-slate-600 flex items-center justify-center gap-3"><FileText size={20} />VIEW RULES</button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-8 shadow-lg border border-slate-100 dark:border-slate-700/50">
          <div className="flex items-center gap-3 mb-6"><div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600"><ShieldCheck size={20} /></div><h3 className="text-xl font-bold tracking-tight">Hostel Amenities</h3></div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {hostel.features?.length > 0 ? hostel.features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3 text-sm font-bold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800"><CheckCircle size={16} className="text-blue-500 flex-shrink-0" />{feature}</div>
            )) : <p className="text-slate-400 italic">No features listed for this hostel</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyHostel;
