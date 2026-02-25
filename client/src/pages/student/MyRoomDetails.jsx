/**
 * MyRoomDetails.jsx - Student Room Information Dashboard
 *
 * Migration Status:
 * - Migrated to React Query (useStudentRequests, useRoommates)
 * - Removed manual fetch and status logic
 * - Enhanced UI for a premium, card-based resident experience
 * - Unified quick actions with MyHostel and MyBookings
 */

import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  BedDouble,
  Users,
  Building2,
  MapPin,
  Phone,
  Mail,
  Wifi,
  Utensils,
  Tv,
  Wind,
  Droplet,
  Home,
  Loader2,
  AlertCircle,
  IndianRupee,
  MessageSquare,
  FileText,
  ArrowLeft,
  User,
  Hash,
  Layers,
  CheckCircle,
  Calendar,
} from "lucide-react";
import { useStudentRequests, useRoommates, useHostelDetail } from "../../hooks/useQueries";
import toast from 'react-hot-toast';

// Amenity icons mapping
const AMENITY_ICONS = {
  WiFi: { icon: <Wifi size={20} />, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
  Food: { icon: <Utensils size={20} />, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/20" },
  Mess: { icon: <Utensils size={20} />, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/20" },
  TV: { icon: <Tv size={20} />, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/20" },
  AC: { icon: <Wind size={20} />, color: "text-cyan-500", bg: "bg-cyan-50 dark:bg-cyan-900/20" },
  "Air Conditioning": { icon: <Wind size={20} />, color: "text-cyan-500", bg: "bg-cyan-50 dark:bg-cyan-900/20" },
  Laundry: { icon: <Droplet size={20} />, color: "text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20" },
  Geyser: { icon: <Droplet size={20} />, color: "text-red-400", bg: "bg-red-50 dark:bg-red-900/20" },
  Parking: { icon: <Building2 size={20} />, color: "text-slate-500", bg: "bg-slate-50 dark:bg-slate-900/20" },
  Security: { icon: <CheckCircle size={20} />, color: "text-green-500", bg: "bg-green-50 dark:bg-green-900/20" },
};

const MyRoomDetails = () => {
  const navigate = useNavigate();

  // Queries
  const { data: statusData, isLoading: loadingStatus, error: statusError } = useStudentRequests();
  const { data: roommates = [], isLoading: loadingRoommates } = useRoommates();
  
  const currentHostelId = statusData?.currentHostel;
  const { data: hostel, isLoading: loadingHostel } = useHostelDetail(currentHostelId);

  // Derive approved request for room specifics
  const approvedRequest = useMemo(() => 
    statusData?.requests?.find(r => r.status === "Approved" && (r.hostel?._id === currentHostelId || r.hostel?.id === currentHostelId)),
    [statusData, currentHostelId]
  );

  // ==========================================================================
  // RENDER HELPERS
  // ==========================================================================

  if (loadingStatus || loadingHostel || loadingRoommates) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-xs">Syncing Room Data...</p>
        </div>
      </div>
    );
  }

  if (statusError || !currentHostelId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
        <div className="bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] shadow-2xl max-w-md text-center border border-slate-100 dark:border-slate-700">
          <div className="w-20 h-20 bg-amber-50 dark:bg-amber-900/20 rounded-full flex items-center justify-center mx-auto mb-6"><AlertCircle className="text-amber-500" size={40} /></div>
          <h2 className="text-3xl font-black mb-2 tracking-tight">Access Denied</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">You must be an active resident to view room information.</p>
          <div className="flex flex-col gap-3">
             <button onClick={() => navigate("/student/hostels")} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black transition shadow-lg shadow-blue-100">Find a Room</button>
             <button onClick={() => navigate(-1)} className="text-slate-500 font-bold px-8 py-4">Go Back</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 sm:p-6 lg:p-12 pb-24">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest mb-4 transition hover:translate-x-[-4px]"><ArrowLeft size={16} />Back to Dashboard</button>
            <h1 className="text-5xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">Your Sanctuary</h1>
            <p className="text-slate-400 dark:text-slate-500 font-bold mt-2">Manage your living space and connect with roommates</p>
          </div>
          <div className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-2xl font-black text-sm tracking-widest uppercase shadow-xl shadow-slate-200 dark:shadow-none flex items-center gap-2 italic"><Hash size={18} /> Room {approvedRequest?.roomNumber || "000"}</div>
        </div>

        {/* Room Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Main Stats Card */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-xl shadow-blue-900/5 p-8 lg:p-10 border border-slate-100 dark:border-slate-700/50">
               <div className="flex items-center gap-4 mb-8">
                  <div className="p-4 bg-blue-600 text-white rounded-3xl shadow-lg shadow-blue-200 dark:shadow-none"><Home size={28} /></div>
                  <div>
                    <h2 className="text-2xl font-black tracking-tight">{hostel?.name || "Premium Hostel"}</h2>
                    <p className="text-slate-400 font-bold text-sm flex items-center gap-1"><MapPin size={14} className="text-blue-500" /> {hostel?.location}</p>
                  </div>
               </div>

               <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Assignment</p>
                    <p className="text-lg font-black">{approvedRequest?.roomNumber || "TBD"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Position</p>
                    <p className="text-lg font-black">{approvedRequest?.floor || "Ground"} Floor</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Capacity</p>
                    <p className="text-lg font-black">{(roommates.length + 1)} Residents</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Type</p>
                    <p className="text-lg font-black">Admitted</p>
                  </div>
               </div>
               
               <div className="mt-10 pt-10 border-t border-slate-50 dark:border-slate-700/50">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-300 mb-6 flex items-center gap-2"><Layers size={16} /> Included Amenities</h3>
                  <div className="flex flex-wrap gap-3">
                    {hostel?.features?.length > 0 ? (
                      hostel.features.map((f, i) => {
                         const cfg = AMENITY_ICONS[f] || { icon: <CheckCircle size={16} />, color: "text-slate-400", bg: "bg-slate-50 dark:bg-slate-900/30" };
                         return (
                           <div key={i} className={`flex items-center gap-2 ${cfg.bg} ${cfg.color} px-4 py-2 rounded-xl font-bold text-sm border border-transparent hover:border-current transition-colors cursor-default`}>
                             {cfg.icon} <span>{f}</span>
                           </div>
                         );
                      })
                    ) : <p className="text-slate-400 italic font-medium">No amenities listed</p>}
                  </div>
               </div>
            </div>

            {/* Roommates Card */}
            <div className="bg-slate-900 text-white rounded-[2.5rem] shadow-2xl p-8 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-12 -mr-12 -mt-12 bg-blue-500/20 rounded-full blur-3xl w-48 h-48 group-hover:scale-125 transition-transform duration-1000" />
               <div className="relative z-10 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-8">
                     <h3 className="text-2xl font-black tracking-tight uppercase italic">Roommates</h3>
                     <Users size={24} className="text-blue-400" />
                  </div>

                  <div className="space-y-6 flex-1">
                    {roommates.length > 0 ? roommates.map((r, i) => (
                      <div key={r.id || i} className="flex items-center gap-4 group/mate">
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center font-black text-blue-400 group-hover/mate:bg-blue-600 group-hover/mate:text-white transition-all duration-300 uppercase tracking-tighter shadow-lg">{r.name?.charAt(0) || "?"}</div>
                        <div className="min-w-0 flex-1">
                          <p className="font-black text-sm truncate uppercase tracking-tight">{r.name}</p>
                          <div className="flex gap-3 mt-1 opacity-60 group-hover/mate:opacity-100 transition-opacity">
                             {r.phone && <a href={`tel:${r.phone}`} className="hover:text-blue-400 transition-colors"><Phone size={12} /></a>}
                             {r.email && <a href={`mailto:${r.email}`} className="hover:text-blue-400 transition-colors"><Mail size={12} /></a>}
                          </div>
                        </div>
                      </div>
                    )) : (
                      <div className="flex flex-col items-center justify-center h-full text-center py-10">
                        <User size={40} className="text-white/10 mb-4" />
                        <p className="text-white/40 font-bold text-sm tracking-wide">SOLO RESIDENCY<br/><span className="text-[10px] font-black uppercase">No roommates currently assigned</span></p>
                      </div>
                    )}
                  </div>

                  <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                     <p className="text-[10px] font-black uppercase tracking-widest text-white/30 italic">Connect Privately</p>
                     <p className="text-xs font-bold text-blue-400">{roommates.length} Connections</p>
                  </div>
               </div>
            </div>
        </div>

        {/* Action Belt */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-[2rem] shadow-lg border border-slate-100 dark:border-slate-700/50 flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px] flex items-center gap-4 pl-4 text-slate-400 font-bold text-[10px] uppercase tracking-widest italic border-l-4 border-blue-600">
               Essential Controls for Current Resident
            </div>
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => navigate("/student/payments")} 
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-100 dark:shadow-none hover:scale-105 transition active:scale-95"
              >
                <IndianRupee size={16} /> Rent Pay
              </button>
              <button 
                onClick={() => navigate("/student/raise-complaint")} 
                className="flex items-center gap-2 px-6 py-3 bg-rose-500 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-rose-100 dark:shadow-none hover:scale-105 transition active:scale-95"
              >
                <MessageSquare size={16} /> Raise Issue
              </button>
              <button 
                onClick={() => navigate("/student/my-hostel-rules")} 
                className="flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition"
              >
                <FileText size={16} /> Rules History
              </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default MyRoomDetails;
