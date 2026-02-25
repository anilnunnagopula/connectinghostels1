/**
 * MyHostels.jsx - Premium Portfolio Manager
 * 
 * Migration Status:
 * - Migrated to React Query (useOwnerHostels, useDeleteHostel)
 * - Refined portfolio analytics and high-contrast grid system
 */

import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Building2, 
  Search, 
  Filter, 
  Grid2X2, 
  Rows3, 
  Plus, 
  ChevronDown,
  Loader2, 
  TrendingUp, 
  Bed, 
  Users, 
  ArrowUpRight, 
  MapPin, 
  ChevronRight,
  MoreVertical,
  Trash2,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useOwnerHostels, useDeleteHostel } from "../../hooks/useQueries";
import toast from "react-hot-toast";

const MyHostels = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [hostelToDelete, setHostelToDelete] = useState(null);

  // Queries
  const { data: hostelsData, isLoading, error, refetch } = useOwnerHostels();
  const hostels = hostelsData?.hostels || [];
  const deleteMutation = useDeleteHostel();

  // Stats
  const stats = useMemo(() => {
    const total = hostels.length;
    const rooms = hostels.reduce((acc, h) => acc + (h.totalRooms || 0), 0);
    const available = hostels.reduce((acc, h) => acc + (h.availableRooms || 0), 0);
    const occupancy = rooms > 0 ? (((rooms - available) / rooms) * 100).toFixed(0) : 0;
    
    return [
      { label: "Portfolio Assets", value: total, icon: Building2, color: "text-blue-500", bg: "bg-blue-500/10" },
      { label: "Inventory Depth", value: rooms, icon: Bed, color: "text-purple-500", bg: "bg-purple-500/10" },
      { label: "Active Revenue", value: `${occupancy}%`, icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10" },
      { label: "Total Residents", value: rooms - available, icon: Users, color: "text-amber-500", bg: "bg-amber-500/10" }
    ];
  }, [hostels]);

  // Filtering
  const filteredHostels = useMemo(() => {
    return hostels.filter(h => {
      const matchesSearch = h.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            h.location?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === "All" || h.type === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [hostels, searchQuery, filterCategory]);

  const handleDelete = async () => {
    if (!hostelToDelete) return;
    try {
      await deleteMutation.mutateAsync(hostelToDelete._id);
      toast.success("Asset Liquidated Successfully");
      setHostelToDelete(null);
    } catch (err) {
      toast.error("Decommissioning Protocol Failed");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-rose-500 gap-4">
        <AlertCircle size={48} />
        <p className="font-black uppercase tracking-widest text-sm italic">Portfolio Link Severed</p>
        <button onClick={() => refetch()} className="px-8 py-3 bg-blue-600 text-white rounded-full font-black uppercase text-[10px] tracking-widest">Reconnect Hub</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-12 pb-32">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
           <div className="space-y-2">
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white">
                 Hostel Portfolio
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm flex items-center gap-2">
                 <Building2 size={16} className="text-blue-600" /> Manage your properties and track performance
              </p>
           </div>

           <div className="flex gap-4">
              <button 
                onClick={() => navigate("/owner/add-hostel")}
                className="px-6 py-3 bg-slate-900 dark:bg-blue-600 text-white rounded-xl font-bold text-xs transition-all shadow-sm flex items-center gap-2 hover:bg-slate-800 dark:hover:bg-blue-700"
              >
                 <Plus size={18} /> Add New Hostel
              </button>
           </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
           {stats.map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm"
              >
                 <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 ${stat.bg} ${stat.color} rounded-xl`}>
                       <stat.icon size={20} />
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{stat.label}</div>
                 </div>
                 <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{stat.value}</h3>
              </motion.div>
           ))}
        </div>

        {/* Control Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 mb-10 flex flex-col lg:flex-row gap-4 items-center border border-slate-200 dark:border-slate-800 shadow-sm">
           <div className="flex-1 w-full relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Search hostels by name or location..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:border-blue-600 rounded-xl pl-14 pr-6 py-4 font-semibold text-slate-900 dark:text-white outline-none"
              />
           </div>
           
           <div className="flex gap-3 shrink-0 w-full lg:w-auto">
              <div className="relative flex-1 lg:min-w-[180px]">
                 <select 
                   value={filterCategory}
                   onChange={e => setFilterCategory(e.target.value)}
                   className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:border-blue-600 rounded-xl px-6 py-4 font-bold text-xs outline-none appearance-none cursor-pointer text-slate-600 dark:text-slate-300"
                 >
                    <option value="All">All Categories</option>
                    <option value="Boys">Boys Hostel</option>
                    <option value="Girls">Girls Hostel</option>
                     <option value="Co-ed">Co-ed</option>
                 </select>
                 <ChevronDown size={14} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-1.5 rounded-xl flex gap-1 border border-slate-200 dark:border-slate-700">
                 <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                 >
                    <Grid2X2 size={18} />
                 </button>
                 <button 
                   onClick={() => setViewMode('list')}
                   className={`p-2.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                 >
                    <Rows3 size={18} />
                 </button>
              </div>
           </div>
        </div>

        {/* Assets Display */}
        {filteredHostels.length === 0 ? (
           <div className="p-32 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 shadow-sm">
              <Building2 className="mx-auto text-slate-200 dark:text-slate-800 mb-8" size={80} />
              <h2 className="text-2xl font-bold text-slate-400">No Hostels Found</h2>
              <p className="text-sm font-medium text-slate-400 mt-2">Try adjusting your search or filters</p>
           </div>
        ) : viewMode === 'grid' ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredHostels.map((hostel) => (
                 <motion.div 
                  key={hostel._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col"
                 >
                    <div className="relative h-56 overflow-hidden">
                       <img 
                        src={hostel.images?.[0]?.url || "https://images.unsplash.com/photo-1555854817-5b2260d50c47?w=800&q=80"} 
                        alt={hostel.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                       <div className="absolute top-4 left-4 px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-[10px] font-bold uppercase tracking-wider text-white border border-white/20">
                          {hostel.category}
                       </div>
                       <button 
                        onClick={() => setHostelToDelete(hostel)}
                        className="absolute top-4 right-4 p-2 bg-rose-500/20 hover:bg-rose-500 text-white backdrop-blur-md rounded-lg transition-all border border-white/20"
                       >
                          <Trash2 size={16} />
                       </button>
                    </div>
                    
                    <div className="p-6 flex flex-col flex-1">
                       <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 leading-tight">
                          {hostel.name}
                       </h3>
                       
                       <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-6">
                          <MapPin size={12} className="text-blue-600" /> {hostel.locality}
                       </div>

                       <div className="grid grid-cols-2 gap-3 mb-6 mt-auto">
                          <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                             <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Total Units</p>
                             <p className="text-xs font-bold text-slate-900 dark:text-white">{hostel.totalRooms}</p>
                          </div>
                          <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                             <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Status</p>
                             <p className={`text-xs font-bold ${hostel.availableRooms > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                                {hostel.availableRooms} Vacant
                             </p>
                          </div>
                       </div>

                       <button 
                         onClick={() => navigate(`/owner/hostel/${hostel._id}/view`)}
                         className="w-full py-3 bg-slate-900 dark:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 hover:bg-slate-800 dark:hover:bg-blue-700"
                       >
                          View Properties <ChevronRight size={14} />
                       </button>
                    </div>
                 </motion.div>
              ))}
           </div>
        ) : (
           <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200 dark:border-slate-800">
                          <th className="px-6 py-4">Property Detail</th>
                          <th className="px-6 py-4">Location</th>
                          <th className="px-6 py-4 text-center">Category</th>
                          <th className="px-6 py-4 text-right">Inventory</th>
                          <th className="px-6 py-4 text-center">Health</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                       {filteredHostels.map(hostel => (
                          <tr key={hostel._id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer" onClick={() => navigate(`/owner/hostel/${hostel._id}/view`)}>
                             <td className="px-6 py-4">
                                <div className="flex items-center gap-4">
                                   <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700">
                                      <img src={hostel.images?.[0]?.url || "https://images.unsplash.com/photo-1555854817-5b2260d50c47?w=200&q=80"} alt="" className="w-full h-full object-cover" />
                                   </div>
                                   <div>
                                      <p className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">{hostel.name}</p>
                                      <p className="text-[9px] font-bold text-slate-400 uppercase">ID: {hostel._id.slice(-6)}</p>
                                   </div>
                                </div>
                             </td>
                             <td className="px-6 py-4">
                                <div className="flex flex-col">
                                   <span className="text-xs font-medium text-slate-600 dark:text-slate-300 truncate max-w-[200px]">{hostel.location}</span>
                                   <span className="text-[10px] font-bold text-blue-600 uppercase mt-0.5">{hostel.locality}</span>
                                </div>
                             </td>
                             <td className="px-6 py-4 text-center text-[10px] font-bold uppercase text-slate-500">
                                {hostel.category}
                             </td>
                             <td className="px-6 py-4 text-right">
                                <div className="flex flex-col items-end">
                                   <span className="text-sm font-bold text-slate-900 dark:text-white">{hostel.totalRooms} Units</span>
                                   <span className="text-[10px] font-bold text-slate-400 uppercase">{hostel.availableRooms} Vacant</span>
                                </div>
                             </td>
                             <td className="px-6 py-4">
                                <div className="flex justify-center">
                                   <div className={`w-2 h-2 rounded-full ${hostel.availableRooms > 0 ? 'bg-emerald-500 shadow-sm' : 'bg-rose-500 shadow-sm'}`} />
                                </div>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        )}
      </div>

      {/* Delete Modal */}
      <AnimatePresence>
        {hostelToDelete && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setHostelToDelete(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white dark:bg-slate-900 rounded-[4rem] p-12 max-w-xl w-full shadow-2xl border border-slate-100 dark:border-slate-800 text-center"
            >
              <div className="w-24 h-24 bg-rose-500/10 text-rose-500 rounded-[2rem] flex items-center justify-center mx-auto mb-10">
                <AlertCircle size={48} />
              </div>
              <h2 className="text-4xl font-black uppercase italic tracking-tighter text-slate-950 dark:text-white mb-4">Liquidate Asset?</h2>
              <p className="text-slate-500 font-bold text-sm leading-relaxed mb-12">
                This action initiates a permanent decommissioning of <span className="text-slate-950 dark:text-white italic">{hostelToDelete.name}</span>. All inventory, ledger entries, and resident data will be purged. This protocol is irreversible.
              </p>
              
              <div className="flex gap-4">
                 <button 
                  onClick={() => setHostelToDelete(null)}
                  className="flex-1 py-6 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-[2rem] text-[10px] font-black uppercase tracking-widest italic hover:bg-slate-200 transition-all border border-slate-200 dark:border-slate-700"
                 >
                    Abort Deletion
                 </button>
                 <button 
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                  className="flex-1 py-6 bg-rose-500 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-widest italic hover:bg-rose-600 shadow-xl shadow-rose-500/20 transition-all flex items-center justify-center gap-2"
                 >
                    {deleteMutation.isPending ? <Loader2 className="animate-spin" /> : <><Trash2 size={16} /> Confirm Liquidation</>}
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default MyHostels;
