/**
 * ViewComplaints.jsx - Premium Incident Resolution Center
 * 
 * Migration Status:
 * - Migrated to React Query (useOwnerComplaints, useOwnerHostels, useResolveComplaint)
 * - Removed inline api calls
 * - Upgraded UI to professional "Incident Dashboard" with high contrast and status-driven design
 */

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CircleAlert,
  Trash2,
  Home,
  User,
  BedDouble,
  Calendar,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Hash,
  MessageSquare,
  ShieldCheck,
  Building2,
  ArrowRight,
  Filter,
} from "lucide-react";
import toast from 'react-hot-toast';
import { 
  useOwnerHostels, 
  useOwnerComplaints, 
  useResolveComplaint 
} from "../../hooks/useQueries";

const ViewComplaints = () => {
  // Queries
  const { data: hostelsData, isLoading: hostelsLoading } = useOwnerHostels();
  const rawHostels = hostelsData?.hostels || [];

  const { data: complaintsData, isLoading: complaintsLoading } = useOwnerComplaints();
  const complaints = complaintsData || [];

  // Mutations
  const resolveMutation = useResolveComplaint();

  // Local State
  const [selectedHostelId, setSelectedHostelId] = useState("");

  // Derived
  const hostels = useMemo(() => rawHostels, [rawHostels]);
  const effectiveHostelId = selectedHostelId || (hostels.length > 0 ? hostels[0]._id : "");

  const filteredComplaints = useMemo(() => {
    if (!effectiveHostelId) return complaints;
    return complaints.filter((c) => c.hostel._id === effectiveHostelId || c.hostel === effectiveHostelId);
  }, [complaints, effectiveHostelId]);

  const stats = useMemo(() => {
    return {
      total: filteredComplaints.length,
      high: filteredComplaints.filter(c => c.type?.toLowerCase().includes('urgent') || c.type?.toLowerCase().includes('safety')).length,
      maint: filteredComplaints.filter(c => c.type?.toLowerCase().includes('maintenance')).length
    };
  }, [filteredComplaints]);

  // Handlers
  const handleResolve = async (id) => {
    if (!window.confirm("Initialize Incident Resolution Protocol? (This will archive the record)")) return;
    try {
      await resolveMutation.mutateAsync(id);
      toast.success("Incident Resolution Synchronized", { 
        style: { borderRadius: '15px', background: '#333', color: '#fff' } 
      });
    } catch (err) {
      toast.error("Handshake Protocol Failed");
    }
  };

  const loading = hostelsLoading || complaintsLoading;

  if (loading && complaints.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
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
                   Resident Complaints
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm flex items-center gap-2">
                   <CircleAlert size={16} className="text-rose-500" /> Manage and resolve resident issues promptly
                </p>
             </div>

             <div className="flex flex-col sm:flex-row gap-4">
                <div className="px-6 py-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-5 shadow-sm min-w-[200px]">
                   <div className="w-12 h-12 bg-rose-50 dark:bg-rose-900/20 text-rose-600 rounded-xl flex items-center justify-center font-bold">{stats.total}</div>
                   <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Cases</p>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Active Queue</p>
                   </div>
                </div>
                <div className="px-6 py-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-5 shadow-sm min-w-[200px]">
                   <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl flex items-center justify-center font-bold">0</div>
                   <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">Resolved</p>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Past 24h</p>
                   </div>
                </div>
             </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 mb-10">
             <div className="flex flex-col lg:flex-row gap-6 lg:items-center">
                <div className="flex-1 space-y-2">
                   <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">Select Property</label>
                   <div className="relative group">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"><Building2 size={18} /></div>
                      <select 
                        value={effectiveHostelId} 
                        onChange={e => setSelectedHostelId(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-600 rounded-xl pl-12 pr-10 py-3.5 font-bold text-xs uppercase tracking-wide outline-none appearance-none cursor-pointer"
                      >
                         {hostels.map(h => <option key={h._id} value={h._id}>{h.name}</option>)}
                      </select>
                   </div>
                </div>
                
                <div className="min-w-[250px] space-y-2">
                   <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">Priority Level</label>
                   <div className="relative">
                      <Filter className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-600 rounded-xl pl-12 pr-10 py-3.5 font-bold text-xs uppercase tracking-wide outline-none appearance-none cursor-not-allowed opacity-50">
                         <option>All Priorities</option>
                      </select>
                   </div>
                </div>
             </div>
          </div>

          {/* Incident Grid */}
          {filteredComplaints.length === 0 ? (
            <div className="py-24 flex flex-col items-center justify-center text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
               <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/10 rounded-full flex items-center justify-center mb-6 text-emerald-500"><ShieldCheck size={32} /></div>
               <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">System Clear</h3>
               <p className="text-sm font-medium text-slate-400">No active complaints detected for this property.</p>
            </div>
          ) : (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <AnimatePresence mode="popLayout">
                  {filteredComplaints.map((c) => (
                    <motion.div
                      key={c._id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm hover:border-blue-500/30 transition-all flex flex-col"
                    >
                      {/* Priority Tag */}
                      <div className="absolute top-4 right-4 px-3 py-1 bg-rose-50 text-rose-600 dark:bg-rose-900/20 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-rose-500/20">
                         {c.type || 'Standard'}
                      </div>

                      <div className="flex flex-col flex-1">
                         <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-blue-600 border border-slate-100 dark:border-slate-700">
                               <User size={20} />
                            </div>
                            <div>
                               <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Reporter</p>
                               <h4 className="text-lg font-bold text-slate-900 dark:text-white">{c.student?.name || 'Anonymous Resident'}</h4>
                            </div>
                         </div>

                         <div className="flex-1">
                            <div className="flex items-center gap-6 mb-6">
                               <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                                  <BedDouble size={14} className="text-purple-500" /> Room {c.room || 'N/A'}
                               </div>
                               <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                                  <Calendar size={14} className="text-emerald-500" /> {new Date(c.createdAt).toLocaleDateString()}
                               </div>
                            </div>
                            
                            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800/50 relative mb-8">
                               <MessageSquare className="absolute -top-2 -left-2 text-blue-500/10" size={24} />
                               <h5 className="text-sm font-bold text-slate-900 dark:text-white mb-2">{c.subject}</h5>
                               <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">{c.message}</p>
                            </div>
                         </div>

                         <div className="flex gap-3">
                            <button 
                             onClick={() => handleResolve(c._id)}
                             className="flex-1 py-3.5 bg-slate-900 dark:bg-blue-600 text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-slate-800 dark:hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                            >
                               <CheckCircle2 size={16} /> Resolve Incident
                            </button>
                            <button className="p-3.5 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-xl hover:text-blue-600 transition-colors">
                               <ArrowRight size={18} />
                            </button>
                         </div>
                      </div>
                    </motion.div>
                  ))}
               </AnimatePresence>
            </div>
          )}

       </div>
    </div>
  );
};

export default ViewComplaints;
