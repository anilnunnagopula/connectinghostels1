/**
 * MyHostelRules.jsx - Student View for Hostel Rules
 *
 * Migration Status:
 * - Migrated to React Query (useStudentRequests, useHostelRules)
 * - Removed manual fetch and API_BASE_URL
 * - Polished UI with structured numbering and premium alert states
 * - Unified navigation with RaiseComplaint
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  ClipboardList,
  Loader2,
  Building2,
  Home,
  AlertCircle,
  Info,
  ChevronRight,
  ArrowLeft,
  MessageSquare,
} from "lucide-react";
import { useStudentRequests, useHostelRules } from "../../hooks/useQueries";

const MyHostelRules = () => {
  const navigate = useNavigate();

  // 1. Get current hostel assignment
  const { 
    data: statusData, 
    isLoading: loadingStatus, 
    error: statusError,
    refetch: refetchStatus
  } = useStudentRequests();

  const currentHostelId = statusData?.currentHostel;
  const hostelName = statusData?.requests?.find(r => r.hostel?._id === currentHostelId || r.hostel?.id === currentHostelId)?.hostel?.name || "Your Hostel";

  // 2. Get specific rules for this hostel
  const {
    data: rules = [],
    isLoading: loadingRules,
    error: rulesError,
    refetch: refetchRules
  } = useHostelRules(currentHostelId);

  // ==========================================================================
  // RENDER HELPERS
  // ==========================================================================

  const handleRetry = () => {
    refetchStatus();
    if (currentHostelId) refetchRules();
  };

  if (loadingStatus || (currentHostelId && loadingRules)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px]">Retrieving Regulations...</p>
        </div>
      </div>
    );
  }

  if (statusError || !currentHostelId) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6 flex items-center justify-center">
        <div className="max-w-md w-full bg-white dark:bg-slate-800 shadow-2xl rounded-3xl p-10 text-center border border-slate-100 dark:border-slate-700">
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300"><Building2 size={32} /></div>
          <h2 className="text-3xl font-black mb-2 tracking-tight">No Active Building</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">You must be checked into a hostel to view its specific rules & regulations.</p>
          <button onClick={() => navigate("/student/hostels")} className="bg-slate-900 dark:bg-blue-600 text-white px-8 py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 w-full shadow-xl shadow-slate-200 dark:shadow-none hover:scale-105 uppercase tracking-wide text-xs"><Home size={18} />Browse Available Rooms</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 sm:p-6 lg:p-12 pb-24">
      <div className="max-w-3xl mx-auto">
        {/* Header Section */}
        <div className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest mb-4 transition hover:translate-x-[-4px]"><ArrowLeft size={16} />Back to Stay</button>
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white flex items-center gap-4 tracking-tighter uppercase italic">
              Code of Conduct
            </h1>
            <p className="text-slate-400 dark:text-slate-500 font-bold mt-2 flex items-center gap-2 uppercase text-[10px] tracking-widest">
              Official Guidelines for <span className="text-blue-600 dark:text-blue-400 italic font-black">{hostelName}</span>
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 px-6 py-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center min-w-[120px]">
            <span className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-1">Clause Count</span>
            <p className="text-3xl font-black text-blue-600 tracking-tighter">{rules.length}</p>
          </div>
        </div>

        {/* Professionalism Alert */}
        <div className="mb-10 bg-indigo-600 text-white p-6 rounded-3xl flex gap-4 shadow-xl shadow-indigo-200 dark:shadow-none relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 -mr-8 -mt-8 bg-white/20 rounded-full blur-2xl group-hover:scale-110 transition-transform" />
           <div className="bg-white/20 rounded-xl p-3 h-fit flex-shrink-0"><Info size={24} /></div>
           <div>
              <p className="font-black text-xs uppercase tracking-widest mb-1 text-indigo-100">Resident Agreement</p>
              <p className="text-sm font-medium leading-relaxed">
                Strict adherence to these rules ensures a safe and comfortable environment. 
                Violations may lead to disciplinary action or termination of residency.
              </p>
           </div>
        </div>

        {/* Rules Grid */}
        <div className="space-y-4">
          {rules.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-16 text-center border-2 border-dashed border-slate-100 dark:border-slate-800">
              <ClipboardList className="w-16 h-16 text-slate-200 dark:text-slate-700 mx-auto mb-6" />
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">Standard Guidelines Apply</h3>
              <p className="text-slate-400 font-medium">The owner has not uploaded custom building rules yet. Standard safety protocols apply.</p>
            </div>
          ) : (
            rules.map((rule, index) => (
              <div
                key={rule._id || index}
                className="group bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-transparent hover:border-blue-100 dark:hover:border-blue-900 transition-all hover:shadow-md flex items-center gap-6"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-slate-50 dark:bg-slate-700/50 text-slate-400 group-hover:bg-blue-600 group-hover:text-white rounded-xl flex items-center justify-center font-black text-lg transition-colors border border-slate-100 dark:border-slate-700 group-hover:border-blue-600">
                  {index + 1}
                </div>
                <div className="flex-grow">
                  <p className="text-slate-700 dark:text-slate-200 font-bold leading-relaxed group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                    {rule.text}
                  </p>
                </div>
                <ChevronRight className="text-slate-200 dark:text-slate-700 group-hover:text-blue-400 transition-colors" size={20} />
              </div>
            ))
          )}
        </div>

        {/* Help Segment */}
        <div className="mt-16 bg-slate-900 text-white rounded-[2rem] p-8 lg:p-10 shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-12 -mr-12 -mt-12 bg-blue-500/10 rounded-full blur-3xl w-48 h-48" />
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <h4 className="text-2xl font-black mb-2 uppercase tracking-tight italic">Clarity needed?</h4>
                <p className="text-slate-400 font-medium text-sm max-w-sm">If you need clarification or wish to report a violation, our grievance system is available 24/7.</p>
              </div>
              <button
                onClick={() => navigate("/student/raise-complaint")}
                className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all shadow-lg active:scale-95 flex items-center gap-2"
              >
                <MessageSquare size={16} /> Lodge Grievance
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default MyHostelRules;
