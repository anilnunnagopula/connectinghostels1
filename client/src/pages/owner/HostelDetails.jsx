/**
 * HostelDetails.jsx - Owner View for Property Management
 *
 * Migration Status:
 * - Migrated to React Query (useOwnerHostelDetail, useOwnerRooms)
 * - Removed manual fetch and API_BASE_URL prefixing
 * - Standardized image logic using optimized fallback approach
 * - Enhanced UI for a premium, high-contrast management dashboard
 * - Unified quick actions (Add Student, Manage Rooms, Edit)
 */

import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  Bed,
  Users,
  Shield,
  Wifi,
  Coffee,
  ChevronLeft,
  ChevronRight,
  Phone,
  Loader2,
  CheckCircle2,
  ArrowRight,
  Info,
  LayoutDashboard,
  Edit3,
  TrendingUp,
  Share2,
  AlertCircle,
  Star,
  Home,
  Zap,
  Clock,
  Activity,
  Eye,
  X,
  Plus,
  ArrowUpRight,
} from "lucide-react";
import { useOwnerHostelDetail, useOwnerRooms } from "../../hooks/useQueries";
import toast from 'react-hot-toast';

const HostelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // 1. Fetch Property Data
  const { 
    data: hostel, 
    isLoading: loadingHostel, 
    error: hostelError 
  } = useOwnerHostelDetail(id);

  // 2. Fetch Room Data for Occupancy Calculation
  const { 
    data: roomsData, 
    isLoading: loadingRooms 
  } = useOwnerRooms(id);

  // Gallery State
  const [activeImage, setActiveImage] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);

  // ==========================================================================
  // COMPUTED METRICS
  // ==========================================================================

  const metrics = useMemo(() => {
    if (!hostel) return null;
    
    // Use roomsData for more accurate occupancy if available
    const total = hostel.totalRooms || 0;
    const available = hostel.availableRooms || 0;
    const occupied = total - available;
    const percentage = total > 0 ? (occupied / total) * 100 : 0;

    return {
      total,
      occupied,
      available,
      percentage: Math.round(percentage),
      revenue: occupied * (hostel.pricePerMonth || 0),
      status: percentage >= 80 ? "Optimal" : percentage >= 40 ? "Stable" : "Low",
      color: percentage >= 80 ? "text-emerald-500" : percentage >= 40 ? "text-blue-500" : "text-amber-500"
    };
  }, [hostel]);

  // Image Logic
  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `${process.env.REACT_APP_API_URL}/uploads/${path}`;
  };

  // ==========================================================================
  // HANDLERS
  // ==========================================================================

  const handleShare = () => {
    const url = `${window.location.origin}/student/hostels/${id}`;
    navigator.clipboard.writeText(url);
    toast.success("Public listing link copied!", {
      style: { borderRadius: '15px', background: '#333', color: '#fff' }
    });
  };

  // ==========================================================================
  // RENDER HELPERS
  // ==========================================================================

  if (loadingHostel || loadingRooms) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest text-xs italic">Syncing Asset Data...</p>
        </div>
      </div>
    );
  }

  if (hostelError || !hostel) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-6">
        <div className="bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] shadow-2xl max-w-md text-center border border-slate-100 dark:border-slate-700">
          <div className="w-20 h-20 bg-rose-50 dark:bg-rose-900/20 rounded-full flex items-center justify-center mx-auto mb-6"><AlertCircle className="text-rose-500" size={40} /></div>
          <h2 className="text-3xl font-black mb-2 tracking-tight uppercase italic">Access Error</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">This property does not exist or you do not have permission to manage it.</p>
          <button onClick={() => navigate("/owner/my-hostels")} className="bg-slate-900 dark:bg-blue-600 text-white px-8 py-4 rounded-2xl font-black transition-all w-full uppercase tracking-widest text-xs italic">Return to Portfolio</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-12 pb-24">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider mb-4 transition hover:translate-x-[-4px]"><ChevronLeft size={16} /> Back to Portfolio</button>
            <div className="flex items-center gap-4 mb-3">
               <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white">{hostel.name}</h1>
               <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${hostel.isActive ? 'bg-emerald-50 text-emerald-600 border border-emerald-500/20' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>{hostel.isActive ? 'Active' : 'Draft'}</span>
            </div>
            <div className="flex items-center gap-4 text-slate-500 font-medium text-sm">
               <span className="flex items-center gap-1.5"><MapPin size={16} className="text-blue-600" /> {hostel.location}</span>
               <span className="flex items-center gap-1.5 text-slate-400">•</span>
               <span className="font-bold text-blue-600 uppercase tracking-wide">{hostel.type}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={handleShare} className="p-3.5 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-blue-600 transition-all"><Share2 size={20} /></button>
            <button onClick={() => navigate(`/owner/hostel/${id}/edit`)} className="px-6 py-3.5 bg-slate-900 dark:bg-blue-600 text-white rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-sm hover:bg-slate-800 dark:hover:bg-blue-700"><Edit3 size={18} /> Edit Property</button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
           <QuickStat icon={<Bed />} label="Total Units" value={metrics.total} color="blue" />
           <QuickStat icon={<Users />} label="Residents" value={metrics.occupied} color="emerald" trend="+4%" />
           <QuickStat icon={<TrendingUp />} label="Monthly Rev" value={`₹${metrics.revenue.toLocaleString()}`} color="indigo" />
           <QuickStat icon={<Activity />} label="Occupancy Rate" value={`${metrics.percentage}%`} color="violet" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Visuals & Context */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Gallery */}
            <div className="group relative rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 aspect-video shadow-sm border border-slate-200 dark:border-slate-800">
               {hostel.images && hostel.images.length > 0 ? (
                 <img src={getImageUrl(hostel.images[activeImage])} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Hostel" />
               ) : (
                 <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 font-medium">
                    <Home size={48} className="mb-4 opacity-10" />
                    No property images
                 </div>
               )}
               
               <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-slate-900/60 to-transparent flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex gap-2">
                    <button onClick={(e) => { e.stopPropagation(); setActiveImage(prev => (prev - 1 + hostel.images.length) % hostel.images.length); }} className="p-2.5 bg-white/20 backdrop-blur-md rounded-lg text-white hover:bg-white/40"><ChevronLeft size={20} /></button>
                    <button onClick={(e) => { e.stopPropagation(); setActiveImage(prev => (prev + 1) % hostel.images.length); }} className="p-2.5 bg-white/20 backdrop-blur-md rounded-lg text-white hover:bg-white/40"><ChevronRight size={20} /></button>
                  </div>
                  <button onClick={() => setShowImageModal(true)} className="p-2.5 bg-white/20 backdrop-blur-md rounded-lg text-white hover:bg-blue-600 transition-colors"><Eye size={20} /></button>
               </div>
            </div>

            {/* Description & Amenities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-6 flex items-center gap-3"><Info size={16} className="text-blue-600" /> Property Description</h3>
                  <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed whitespace-pre-line text-base">
                    {hostel.description || "No description provided for this property."}
                  </p>
               </div>
               <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-6 flex items-center gap-3"><Star size={16} className="text-blue-600" /> Amenities</h3>
                  <div className="grid grid-cols-2 gap-3">
                     {['WiFi', 'Security', 'Food', 'AC', 'Laundry', 'Parking'].map(f => (
                        <div key={f} className={`flex items-center gap-2.5 p-3.5 rounded-xl border ${hostel.features?.includes(f) ? 'border-emerald-100 bg-emerald-50/50 text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-900/10 dark:text-emerald-400' : 'border-slate-100 text-slate-300 dark:border-slate-800 dark:text-slate-600'} font-bold text-[11px] uppercase tracking-wide`}>
                           {f === 'WiFi' && <Wifi size={14} />}
                           {f === 'Security' && <Shield size={14} />}
                           {f === 'Food' && <Coffee size={14} />}
                           {f === 'AC' && <Zap size={14} />}
                           {f === 'Laundry' && <Activity size={14} />}
                           {f === 'Parking' && <MapPin size={14} />}
                           {f}
                        </div>
                     ))}
                  </div>
               </div>
            </div>

          </div>

          {/* Management Sidebar */}
          <div className="space-y-8">
             
              {/* Occupancy Card */}
              <div className="bg-slate-900 dark:bg-slate-900 text-white rounded-3xl p-8 shadow-sm relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-12 -mr-12 -mt-12 bg-blue-500/10 rounded-full blur-3xl w-48 h-48 group-hover:scale-110 transition-transform" />
                 <div className="relative z-10">
                    <div className="flex items-center justify-between mb-8">
                       <h4 className="text-lg font-bold">Occupancy Overview</h4>
                       <LayoutDashboard size={18} className="text-blue-400" />
                    </div>
                    
                    <div className="flex items-center gap-5 mb-8">
                       <div className="text-4xl font-bold tracking-tight">{metrics.percentage}%</div>
                       <div className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${metrics.percentage > 80 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'}`}>{metrics.status}</div>
                    </div>
 
                    <div className="space-y-3 mb-8">
                       <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-white/40"><span>Occupied Units</span> <span>{metrics.occupied}</span></div>
                       <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                         <div className="h-full bg-blue-500 transition-all duration-700" style={{ width: `${metrics.percentage}%` }} />
                       </div>
                       <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-white/40"><span>Available Inventory</span> <span>{metrics.available}</span></div>
                    </div>
 
                    <div className="grid grid-cols-2 gap-3">
                       <button onClick={() => navigate('/owner/add-student')} className="bg-white/5 hover:bg-white/10 p-4 rounded-xl flex flex-col items-center gap-2 transition-all border border-white/5 group/btn">
                         <Plus size={18} className="group-hover/btn:scale-110 transition-transform text-blue-400" />
                         <span className="text-[10px] font-bold uppercase tracking-wider">Add Student</span>
                       </button>
                       <button onClick={() => navigate('/owner/manage-rooms')} className="bg-white/5 hover:bg-white/10 p-4 rounded-xl flex flex-col items-center gap-2 transition-all border border-white/5 group/btn">
                         <LayoutDashboard size={18} className="group-hover/btn:scale-110 transition-transform text-blue-400" />
                         <span className="text-[10px] font-bold uppercase tracking-wider">Manage Rooms</span>
                       </button>
                    </div>
                 </div>
              </div>

              {/* Secondary Actions */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-3">
                 <button onClick={() => navigate(`/owner/rules-config?hostelId=${id}`)} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl group hover:bg-slate-900 dark:hover:bg-blue-600 transition-all">
                   <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider group-hover:text-white"><Shield size={16} className="text-blue-600 group-hover:text-white" /> Regulations</div>
                   <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity text-white" />
                 </button>
                 <button onClick={() => navigate('/owner/view-complaints')} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl group hover:bg-slate-900 dark:hover:bg-blue-600 transition-all">
                   <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider group-hover:text-white"><AlertCircle size={16} className="text-rose-500 group-hover:text-white" /> Grievances</div>
                   <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity text-white" />
                 </button>
              </div>

              {/* Support Alert */}
              <div className="bg-blue-600 text-white rounded-3xl p-8 shadow-sm relative overflow-hidden">
                 <div className="relative z-10">
                    <h5 className="text-lg font-bold mb-2">Portfolio Support</h5>
                    <p className="text-xs font-medium text-blue-100 leading-relaxed mb-6">Need help optimizing your listing or managing residents? Our support team is here for you.</p>
                    <button className="text-[10px] font-bold uppercase tracking-wider underline decoration-2 underline-offset-4">Contact Support <ArrowRight size={12} className="inline ml-1" /></button>
                 </div>
              </div>

          </div>
        </div>

      </div>

      {/* Fullscreen Overlay */}
      {showImageModal && hostel.images?.length > 0 && (
        <div className="fixed inset-0 bg-slate-950/95 z-[100] flex items-center justify-center p-8 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-300" onClick={() => setShowImageModal(false)}>
           <button onClick={() => setShowImageModal(false)} className="absolute top-10 right-10 text-white p-4 bg-white/10 rounded-full hover:bg-white/20 transition-all"><X size={32} /></button>
           <img src={getImageUrl(hostel.images[activeImage])} className="max-w-7xl w-full h-auto max-h-[85vh] object-contain rounded-3xl shadow-2xl" alt="Preview" />
           <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-6">
              <button onClick={(e) => { e.stopPropagation(); setActiveImage(prev => (prev - 1 + hostel.images.length) % hostel.images.length); }} className="p-4 bg-white/10 rounded-2xl text-white hover:bg-white/20"><ChevronLeft size={32} /></button>
              <div className="text-white font-black text-xl italic tracking-widest">{activeImage + 1} <span className="text-white/20">/</span> {hostel.images.length}</div>
              <button onClick={(e) => { e.stopPropagation(); setActiveImage(prev => (prev + 1) % hostel.images.length); }} className="p-4 bg-white/10 rounded-2xl text-white hover:bg-white/20"><ChevronRight size={32} /></button>
           </div>
        </div>
      )}
    </div>
  );
};

// Internal Atomic Components
const QuickStat = ({ icon, label, value, color, trend }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
    indigo: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400",
    violet: "bg-violet-50 text-violet-600 dark:bg-violet-900/20 dark:text-violet-400"
  };
  
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all">
       <div className="flex items-center justify-between mb-4">
          <div className={`p-2.5 rounded-lg ${colors[color]}`}>{React.cloneElement(icon, { size: 18 })}</div>
          {trend && <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">{trend}</span>}
       </div>
       <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{value}</div>
       <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
    </div>
  );
};

export default HostelDetails;
