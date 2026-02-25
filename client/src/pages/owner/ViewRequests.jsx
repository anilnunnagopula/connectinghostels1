/**
 * ViewRequests.jsx - Premium Lease Intake Console
 * 
 * Migration Status:
 * - Migrated to React Query (useOwnerRequests, useApproveRequest, useRejectRequest)
 * - Upgraded UI to professional "Request Queue" with high-contrast actions
 * - Improved student profile data display for the Phase 1 schema
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  User, 
  Clock, 
  Building, 
  Bed, 
  ArrowUpRight,
  Filter,
  Inbox,
  Check,
  X,
  ChevronRight,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useOwnerRequests, useApproveRequest, useRejectRequest } from "../../hooks/useQueries";

const ViewRequests = () => {
  const navigate = useNavigate();
  
  // Queries
  const { data, isLoading, error, refetch } = useOwnerRequests();
  const approveMutation = useApproveRequest();
  const rejectMutation = useRejectRequest();

  const requests = data?.requests || [];

  const handleApprove = async (requestId) => {
    const toastId = toast.loading("Executing Enrollment Protocol...");
    try {
      await approveMutation.mutateAsync({ requestId });
      toast.success("Lease Activated Successfully", { id: toastId });
    } catch (err) {
      toast.error(err?.response?.data?.error || "Approval Handshake Failed", { id: toastId });
    }
  };

  const handleReject = async (requestId) => {
    const toastId = toast.loading("Initiating Denial Sequence...");
    try {
      await rejectMutation.mutateAsync({ requestId });
      toast.success("Request Decommissioned", { id: toastId });
    } catch (err) {
      toast.error(err?.response?.data?.error || "Rejection Protocol Failed", { id: toastId });
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
        <p className="font-black uppercase tracking-widest text-sm italic">Queue Synchronization Failed</p>
        <button onClick={() => refetch()} className="px-8 py-3 bg-blue-600 text-white rounded-full font-black uppercase text-[10px] tracking-widest">Reconnect Feed</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-12 pb-32">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
           <div className="space-y-2">
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white">
                 Booking Requests
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm flex items-center gap-2">
                 <Inbox size={16} className="text-blue-600" /> Pending enrollment & tenant requests
              </p>
           </div>

           <div className="flex gap-4">
              <button className="px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-blue-600 rounded-xl font-bold text-xs transition-all shadow-sm flex items-center gap-2">
                 <Filter size={16} /> Filter Queue
              </button>
           </div>
        </div>

         <div className="space-y-4">
            {requests.length === 0 ? (
               <div className="p-20 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 shadow-sm">
                  <Inbox className="mx-auto text-slate-200 dark:text-slate-800 mb-6" size={80} />
                  <h2 className="text-2xl font-bold text-slate-400">Queue Empty</h2>
                  <p className="text-sm font-medium text-slate-400 mt-2">No pending admission requests at the moment</p>
               </div>
           ) : (
              <AnimatePresence>
                 {requests.map((req, i) => {
                    const studentName = req.student?.user?.name || req.student?.name || "Anonymous Client";
                    const isProcessing = (approveMutation.isPending && approveMutation.variables?.requestId === req._id) || 
                                       (rejectMutation.isPending && rejectMutation.variables?.requestId === req._id);
                    
                    return (
                       <motion.div 
                        key={req._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ delay: i * 0.05 }}
                        className="group bg-white dark:bg-slate-900 rounded-2xl p-6 lg:p-8 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all"
                       >
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                                                          <div className="flex items-center gap-5">
                                 <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 shrink-0 border border-slate-200 dark:border-slate-700 relative overflow-hidden group-hover:border-blue-500/30 transition-colors">
                                    <User size={28} />
                                    <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                 </div>
                                 <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                       <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                                          {studentName}
                                       </h3>
                                       <span className="px-2.5 py-0.5 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider rounded-full">New Request</span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                                       <span className="flex items-center gap-1.5">
                                          <Building size={14} className="text-blue-500" /> {req.hostel?.name}
                                       </span>
                                       <span className="flex items-center gap-1.5">
                                          <Bed size={14} className="text-purple-500" /> Room {req.roomNumber || "TBD"}
                                       </span>
                                       <span className="flex items-center gap-1.5">
                                          <Clock size={14} className="text-emerald-500" /> {new Date(req.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                                       </span>
                                    </div>
                                 </div>
                              </div>

                              <div className="flex items-center gap-3">
                                 <button 
                                   onClick={() => handleReject(req._id)}
                                   disabled={isProcessing}
                                   className="p-4 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all border border-slate-200 dark:border-slate-700"
                                 >
                                    {rejectMutation.isPending && rejectMutation.variables?.requestId === req._id ? <Loader2 size={20} className="animate-spin" /> : <X size={20} />}
                                 </button>
                                 <button 
                                   onClick={() => handleApprove(req._id)}
                                   disabled={isProcessing}
                                   className="px-8 py-4 bg-slate-900 dark:bg-blue-600 text-white rounded-xl font-bold text-xs transition-all shadow-sm flex items-center gap-2 hover:bg-slate-800 dark:hover:bg-blue-700 active:scale-95"
                                 >
                                    {approveMutation.isPending && approveMutation.variables?.requestId === req._id ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                                    Approve Request
                                 </button>
                              </div>

                          </div>
                                                    <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: {req._id}</p>
                              <button className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest flex items-center gap-1 hover:underline">
                                 View Profile Details <ChevronRight size={12} />
                              </button>
                           </div>
                       </motion.div>
                    );
                 })}
              </AnimatePresence>
           )}
        </div>

      </div>
    </div>
  );
};

export default ViewRequests;
