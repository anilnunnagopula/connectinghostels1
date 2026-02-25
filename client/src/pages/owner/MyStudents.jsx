/**
 * MyStudents.jsx - Premium Resident Registry
 * 
 * Migration Status:
 * - Migrated to React Query (useOwnerHostels, useOwnerStudents)
 * - Refined student filtering and profile card logic
 * - Upgraded UI to professional "Identity Ledger" standard
 */

import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  UserRound, 
  User,
  Hash,
  Phone, 
  GraduationCap, 
  Home, 
  Loader2, 
  Search, 
  Filter, 
  ChevronDown, 
  Building2, 
  Mail, 
  ArrowUpRight,
  ShieldCheck,
  Smartphone,
  CheckCircle2,
  Trash2,
  Inbox,
  PlusCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useOwnerHostels, useOwnerStudents } from "../../hooks/useQueries";
import toast from "react-hot-toast";

const MyStudents = () => {
  const navigate = useNavigate();
  const [selectedHostel, setSelectedHostel] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Queries
  const { data: hostelsData, isLoading: hostelsLoading } = useOwnerHostels();
  const hostels = hostelsData?.hostels || [];
  
  const { data: studentsData, isLoading: studentsLoading, refetch } = useOwnerStudents();
  const students = studentsData || [];

  // Sync default hostel
  useMemo(() => {
    if (hostels.length > 0 && !selectedHostel) {
      setSelectedHostel(hostels[0]._id);
    }
  }, [hostels, selectedHostel]);

  // Filtering
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesHostel = !selectedHostel || s.hostel?._id === selectedHostel;
      const matchesSearch = s.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.phone?.includes(searchQuery);
      return matchesHostel && matchesSearch;
    });
  }, [students, selectedHostel, searchQuery]);

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
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
           <div className="space-y-2">
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white">
                 Resident Directory
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm flex items-center gap-2">
                 <ShieldCheck size={16} className="text-blue-600" /> Manage and view all enrolled students
              </p>
           </div>

           <div className="flex gap-4">
              <button 
                onClick={() => navigate("/owner/add-student")}
                className="px-6 py-3 bg-slate-900 dark:bg-blue-600 text-white rounded-xl font-bold text-xs transition-all shadow-sm flex items-center gap-2 hover:bg-slate-800 dark:hover:bg-blue-700"
              >
                 <PlusCircle size={18} /> Add Student
              </button>
           </div>
        </div>

        {/* Controls Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 mb-10 flex flex-col lg:flex-row gap-6 items-center border border-slate-200 dark:border-slate-800 shadow-sm">
           <div className="flex-1 w-full relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Search students by name, email or phone..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:border-blue-600 rounded-xl pl-14 pr-6 py-4 font-semibold text-slate-900 dark:text-white outline-none"
              />
           </div>
           
           <div className="flex gap-4 shrink-0 w-full lg:w-auto">
              <div className="relative flex-1 lg:min-w-[240px]">
                 <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                 <select 
                   value={selectedHostel} 
                   onChange={e => setSelectedHostel(e.target.value)}
                   className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:border-blue-600 rounded-xl pl-12 pr-10 py-4 font-bold text-sm outline-none appearance-none cursor-pointer text-slate-600 dark:text-slate-300"
                 >
                    <option value="">All Hostels</option>
                    {hostels.map(h => <option key={h._id} value={h._id}>{h.name}</option>)}
                 </select>
                 <ChevronDown size={14} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
           </div>
        </div>

        {/* Empty State */}
        {filteredStudents.length === 0 ? (
           <div className="p-20 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 shadow-sm">
              <Inbox className="mx-auto text-slate-200 dark:text-slate-800 mb-6" size={80} />
              <h2 className="text-2xl font-bold text-slate-400">No Students Found</h2>
              <p className="text-sm font-medium text-slate-400 mt-2">Adjust your filters or add a new student to the directory</p>
           </div>
        ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredStudents.map((student, i) => (
                 <motion.div 
                   key={student._id}
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: i * 0.05 }}
                   whileHover={{ y: -4 }}
                   className="group bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
                 >
                    {/* Background ID Accent */}
                    <div className="absolute -right-4 -top-4 text-8xl font-black text-slate-50 dark:text-slate-800/50 opacity-0 group-hover:opacity-100 transition-opacity select-none italic">
                       {i + 1}
                    </div>

                    {/* Profile Trigger */}
                     <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 border border-blue-100 dark:border-blue-800">
                           <User size={24} />
                        </div>
                        <div>
                           <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                              {student.name}
                           </h3>
                           <p className="text-[10px] font-bold text-slate-400 mt-1 flex items-center gap-1.5 uppercase tracking-wider">
                              <Hash size={10} className="text-blue-500" /> RES-{student._id.slice(-6)}
                           </p>
                        </div>
                     </div>
                    <div className="flex items-center gap-5 mb-8 relative">
                       <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors shrink-0">
                          <UserRound size={32} />
                       </div>
                       <div>
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 truncate max-w-[180px]">
                             {student.name}
                          </h3>
                          <div className="flex items-center gap-2">
                             <span className="px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider rounded-full border border-emerald-500/10">Active Resident</span>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-4 relative mb-8">
                       <div className="flex items-center gap-3">
                          <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-400"><Home size={16} /></div>
                          <div>
                             <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Hostel</p>
                             <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{student.hostel?.name || "Unassigned"}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-3">
                          <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-400"><Smartphone size={16} /></div>
                          <div>
                             <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Phone</p>
                             <p className="text-xs font-semibold text-slate-900 dark:text-white">{student.phone || "N/A"}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-3">
                          <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-400"><GraduationCap size={16} /></div>
                          <div>
                             <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Room</p>
                             <p className="text-xs font-bold text-blue-600 dark:text-blue-400">Unit {student.room}</p>
                          </div>
                       </div>
                    </div>

                    <div className="flex gap-3 relative">
                       <button 
                        onClick={() => navigate(`/owner/student/${student._id}`)}
                        className="flex-1 py-4 bg-slate-900 dark:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 hover:bg-slate-800 dark:hover:bg-blue-700"
                       >
                          Manage Student <ArrowUpRight size={14} />
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

export default MyStudents;
