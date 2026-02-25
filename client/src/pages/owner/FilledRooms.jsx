/**
 * FilledRooms.jsx - Premium Occupancy Ledger
 * 
 * Migration Status:
 * - Migrated to React Query (useOwnerHostels, useOwnerStudents)
 * - Refined occupancy grouping logic for real-time fleet visibility
 * - Upgraded UI to professional "Asset Allocation" standard
 */

import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  CheckCircle, 
  Search, 
  RefreshCw, 
  Loader2, 
  Users, 
  BedDouble, 
  Building2, 
  Filter, 
  ChevronDown,
  ArrowUpRight,
  AlertCircle,
  ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useOwnerHostels, useOwnerStudents } from "../../hooks/useQueries";

const FilledRooms = () => {
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

  // Derived: occupancy matrix
  const matrix = useMemo(() => {
    const studentsInHostel = allStudents.filter(s => s.hostel?._id === selectedHostel);
    const rooms = studentsInHostel.reduce((acc, s) => {
      const roomKey = `${s.room}`;
      if (!acc[roomKey]) acc[roomKey] = { roomNo: s.room, residents: [] };
      acc[roomKey].residents.push({ name: s.name, id: s._id, category: s.category });
      return acc;
    }, {});

    return Object.values(rooms)
      .sort((a, b) => parseInt(a.roomNo) - parseInt(b.roomNo))
      .filter(r => 
        searchQuery === "" || 
        r.roomNo.toString().includes(searchQuery) || 
        r.residents.some(res => res.name?.toLowerCase().includes(searchQuery.toLowerCase()))
      );
  }, [allStudents, selectedHostel, searchQuery]);

  const stats = useMemo(() => {
    const studentsInHostel = allStudents.filter(s => s.hostel?._id === selectedHostel);
    return {
      totalFilled: matrix.length,
      totalResidents: studentsInHostel.length
    };
  }, [matrix, allStudents, selectedHostel]);

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
                 Occupancy Registry
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm flex items-center gap-2">
                 <ShieldCheck size={16} className="text-emerald-500" /> Active directory of assigned rooms and residents
              </p>
           </div>
           <div className="flex gap-4">
              <button 
                onClick={() => refetch()}
                className="p-3.5 bg-white dark:bg-slate-900 text-slate-400 hover:text-blue-600 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all"
              >
                 <RefreshCw size={20} />
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
                   className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-emerald-600 rounded-xl pl-12 pr-10 py-3.5 font-bold text-xs uppercase tracking-wide outline-none appearance-none cursor-pointer"
                 >
                    {hostels.map(h => <option key={h._id} value={h._id}>{h.name}</option>)}
                 </select>
                 <ChevronDown size={14} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
           </div>

           <div className="flex gap-4">
              <div className="px-6 py-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-5 min-w-[180px]">
                 <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-lg">{stats.totalFilled}</div>
                 <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Filled Units</p>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Active Count</p>
                 </div>
              </div>
              <div className="px-6 py-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-5 min-w-[180px]">
                 <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl flex items-center justify-center font-bold text-lg">{stats.totalResidents}</div>
                 <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Residents</p>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Total Population</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Search */}
        <div className="mb-10 relative max-w-xl">
           <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
           <input 
              type="text" 
              placeholder="Search by room or resident..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-emerald-600 rounded-xl pl-14 pr-8 py-3.5 font-bold text-xs uppercase tracking-wider outline-none shadow-sm transition-all"
           />
        </div>

        {/* Grid Display */}
        {matrix.length === 0 ? (
           <div className="py-24 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
              <BedDouble className="mx-auto text-slate-200 dark:text-slate-800 mb-6" size={64} />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Occupancy</h2>
              <p className="text-sm font-medium text-slate-400">The registry for this property is currently vacant.</p>
           </div>
        ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {matrix.map((room, i) => (
                 <motion.div 
                   key={room.roomNo}
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="group bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500/30 transition-all flex flex-col"
                 >
                    <div className="flex items-center justify-between mb-8">
                       <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl flex items-center justify-center text-lg font-bold border border-slate-100 dark:border-slate-700">
                          {room.roomNo}
                       </div>
                       <div className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 text-[9px] font-bold uppercase tracking-wider rounded-lg border border-emerald-500/20 flex items-center gap-1.5">
                          <CheckCircle size={10} /> Occupied
                       </div>
                    </div>

                    <div className="space-y-4 flex-1">
                       <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                          <Users size={12} /> Occupants
                       </p>
                       <div className="space-y-3">
                          {room.residents.map(res => (
                             <div key={res.id} className="flex items-center justify-between">
                                <span className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[150px]">{res.name}</span>
                                <span className="text-[8px] font-bold text-slate-400 uppercase">ID:{res.id.slice(-4)}</span>
                             </div>
                          ))}
                       </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                       <button className="w-full py-3 bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-emerald-600 rounded-xl text-[9px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all">
                          Inspect Unit <ArrowUpRight size={12} />
                       </button>
                    </div>
                 </motion.div>
              ))}
           </div>
        )}
      </div>
    </div>
  );
};

export default FilledRooms;
