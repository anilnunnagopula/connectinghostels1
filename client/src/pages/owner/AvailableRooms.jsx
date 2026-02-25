/**
 * AvailableRooms.jsx - Premium Vacancy Directory
 * 
 * Migration Status:
 * - Migrated to React Query (useOwnerHostels, useOwnerStudents)
 * - Refined occupancy calculation for real-time fleet availability
 * - Upgraded UI to professional "Yield Analytics" standard
 */

import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  BedDouble, 
  Search, 
  RefreshCw, 
  Loader2, 
  Plus, 
  Building2, 
  Filter, 
  ChevronDown,
  ArrowUpRight,
  Zap,
  ShieldCheck,
  TrendingUp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useOwnerHostels, useOwnerStudents } from "../../hooks/useQueries";

const AvailableRooms = () => {
  const navigate = useNavigate();
  const [selectedHostel, setSelectedHostel] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Queries
  const { data: hostelsData, isLoading: hostelsLoading } = useOwnerHostels();
  const hostels = hostelsData?.hostels || [];
  
  const { data: studentsData, isLoading: studentsLoading, refetch } = useOwnerStudents();
  const allStudents = studentsData || [];

  // Sync default hostel
  useMemo(() => {
    if (hostels.length > 0 && !selectedHostel) {
      setSelectedHostel(hostels[0]._id);
    }
  }, [hostels, selectedHostel]);

  // Derived: vacancy matrix
  const availableRooms = useMemo(() => {
    if (!selectedHostel) return [];
    
    const selectedHostelData = hostels.find(h => h._id === selectedHostel);
    const totalRooms = selectedHostelData?.totalRooms || 0;
    
    const occupiedRoomNumbers = new Set(
      allStudents
        .filter(s => s.hostel?._id === selectedHostel)
        .map(s => s.room.toString())
    );

    const available = [];
    for (let i = 1; i <= totalRooms; i++) {
        if (!occupiedRoomNumbers.has(i.toString())) {
            available.push({
                roomNo: i,
                category: selectedHostelData?.category || "Standard Unit",
                price: selectedHostelData?.pricePerMonth
            });
        }
    }

    return available.filter(r => 
        searchQuery === "" || r.roomNo.toString().includes(searchQuery)
    );
  }, [allStudents, selectedHostel, hostels, searchQuery]);

  const stats = useMemo(() => {
    const selectedHostelData = hostels.find(h => h._id === selectedHostel);
    const total = selectedHostelData?.totalRooms || 0;
    const vacant = availableRooms.length;
    const occupancy = total > 0 ? (((total - vacant) / total) * 100).toFixed(0) : 0;
    
    return {
      vacant,
      total,
      occupancy
    };
  }, [availableRooms, hostels, selectedHostel]);

  if (hostelsLoading || studentsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-12 pb-32">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-12">
           <div className="space-y-3">
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white">
                 Inventory Directory
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm flex items-center gap-2">
                 <Zap size={16} className="text-blue-500" /> Real-time status of vacant rooms and units
              </p>
           </div>

           <div className="flex gap-4">
              <button 
                onClick={() => navigate("/owner/add-student")}
                className="px-8 py-3.5 bg-slate-900 dark:bg-blue-600 text-white rounded-xl font-bold uppercase tracking-wider text-[10px] hover:bg-slate-800 dark:hover:bg-blue-700 transition-all shadow-sm flex items-center gap-2"
              >
                 <Plus size={16} /> Deploy Resident
              </button>
           </div>
        </div>

        {/* Property & Stats Bar */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 mb-10 flex flex-col lg:flex-row gap-8 lg:items-center">
           <div className="flex-1 space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">Select Property</label>
              <div className="relative group">
                 <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                 <select 
                   value={selectedHostel} 
                   onChange={e => setSelectedHostel(e.target.value)}
                   className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-600 rounded-xl pl-12 pr-10 py-3.5 font-bold text-xs uppercase tracking-wide outline-none appearance-none cursor-pointer"
                 >
                    {hostels.map(h => <option key={h._id} value={h._id}>{h.name}</option>)}
                 </select>
                 <ChevronDown size={14} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
           </div>

           <div className="flex flex-wrap gap-4">
              <div className="px-6 py-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-5 min-w-[180px]">
                 <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl flex items-center justify-center font-bold text-lg">{stats.vacant}</div>
                 <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Yield Ready</p>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Vacant Units</p>
                 </div>
              </div>
              <div className="px-6 py-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-5 min-w-[180px]">
                 <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-lg">{stats.occupancy}%</div>
                 <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">Occupancy</p>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Active Rate</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Search */}
        <div className="mb-10 relative max-w-xl">
           <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
           <input 
              type="text" 
              placeholder="Search by room number..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-blue-600 rounded-xl pl-14 pr-8 py-3.5 font-bold text-xs uppercase tracking-wider outline-none shadow-sm transition-all"
           />
        </div>

        {/* Grid Display */}
        {availableRooms.length === 0 ? (
           <div className="py-24 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
              <ShieldCheck className="mx-auto text-slate-200 dark:text-slate-800 mb-6" size={64} />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Inventory Full</h2>
              <p className="text-sm font-medium text-slate-400">No vacant units detected for this property.</p>
           </div>
        ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {availableRooms.map((room, i) => (
                 <motion.div 
                   key={room.roomNo}
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="group bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500/30 transition-all flex flex-col"
                 >
                    <div className="flex items-center justify-between mb-8">
                       <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl flex items-center justify-center text-lg font-bold border border-slate-100 dark:border-slate-700">
                          {room.roomNo}
                       </div>
                       <div className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 text-[9px] font-bold uppercase tracking-wider rounded-lg border border-blue-500/20 flex items-center gap-1.5">
                          <TrendingUp size={10} /> Yield Ready
                       </div>
                    </div>

                    <div className="space-y-4 mb-8 flex-1">
                       <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Asset Category</p>
                          <p className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">{room.category}</p>
                       </div>
                       <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Fee Schema</p>
                          <p className="text-xl font-bold text-emerald-600 tracking-tight">₹{room.price}<span className="text-[10px] text-slate-400 ml-1 font-medium">/Mo</span></p>
                       </div>
                    </div>

                    <button 
                      onClick={() => navigate("/owner/add-student")}
                      className="w-full py-3.5 bg-slate-900 dark:bg-blue-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-slate-800 dark:hover:bg-blue-700 transition-all"
                    >
                       <Plus size={14} /> Assign Resident
                    </button>
                 </motion.div>
              ))}
           </div>
        )}
      </div>
    </div>
  );
};

export default AvailableRooms;
