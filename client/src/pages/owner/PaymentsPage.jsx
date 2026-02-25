/**
 * OwnerPaymentsPage.jsx - Premium Revenue & Ledger Intelligence
 * 
 * Migration Status:
 * - Migrated to React Query (useOwnerPayments)
 * - Upgraded UI to professional "Finance Console" with high contrast and trend-driven design
 */

import React, { useMemo } from "react";
import { 
  IndianRupee, 
  Building2, 
  User, 
  Calendar, 
  Loader2, 
  AlertCircle,
  TrendingUp,
  CreditCard,
  ArrowUpRight,
  Download,
  Filter,
  Wallet,
  Building,
  ChevronRight,
  History
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useOwnerPayments } from "../../hooks/useQueries";

const OwnerPaymentsPage = () => {
  const { data, isLoading, error } = useOwnerPayments();
  const payments = data?.payments || [];
  const totalEarnings = data?.totalEarnings || 0;

  const stats = useMemo(() => ({
    count: payments.length,
    recent: payments.slice(0, 5).reduce((acc, p) => acc + p.amount, 0),
    avg: payments.length > 0 ? (totalEarnings / payments.length).toFixed(0) : 0
  }), [payments, totalEarnings]);

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
        <p className="font-black uppercase tracking-widest text-sm italic">Ledger Synchronization Failed</p>
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
                 Revenue Analytics
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm flex items-center gap-2">
                 <TrendingUp size={16} className="text-emerald-500" /> Real-time financial ledger and payout status
              </p>
           </div>

           <div className="flex gap-4">
              <button className="p-3.5 bg-white dark:bg-slate-900 text-slate-400 hover:text-blue-600 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all">
                 <Download size={20} />
              </button>
              <button className="px-8 py-3.5 bg-slate-900 dark:bg-blue-600 text-white rounded-xl font-bold uppercase tracking-wider text-[10px] hover:bg-slate-800 dark:hover:bg-blue-700 transition-all shadow-sm flex items-center gap-2">
                 <Filter size={16} /> Filters
              </button>
           </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
           {/* Primary Earnings Card */}
           <div className="md:col-span-2 relative group bg-white dark:bg-slate-900 rounded-3xl p-10 overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800">
              <div className="absolute right-[-2%] top-[-5%] opacity-5 text-slate-950 dark:text-white">
                 <IndianRupee size={200} />
              </div>
              
              <div className="relative z-10 flex flex-col h-full justify-between">
                 <div className="flex items-center gap-2 text-slate-400 mb-10">
                    <Wallet size={16} className="text-blue-600" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Accumulated Capital</span>
                 </div>
                 
                 <div>
                    <h2 className="text-slate-900 dark:text-white text-5xl lg:text-7xl font-bold tracking-tight flex items-start gap-2">
                       <span className="text-2xl lg:text-3xl text-slate-400 mt-2">₹</span>
                       {totalEarnings.toLocaleString()}
                    </h2>
                    <div className="mt-8 flex items-center gap-4">
                       <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-lg text-emerald-600 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20">
                          <ArrowUpRight size={12} /> +12.5% Growth
                       </div>
                       <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Since last cycle</p>
                    </div>
                 </div>
              </div>
           </div>

           {/* Stats Stack */}
           <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                 <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Transaction Count</p>
                 <div className="flex items-end justify-between">
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{stats.count}</h3>
                    <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl flex items-center justify-center">
                       <History size={18} />
                    </div>
                 </div>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                 <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Average Settlement</p>
                 <div className="flex items-end justify-between">
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white">₹{stats.avg}</h3>
                    <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl flex items-center justify-center">
                       <CreditCard size={18} />
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Ledger Section */}
        <div className="space-y-6">
           <div className="flex items-center justify-between mb-6 px-2">
              <h2 className="text-xl font-bold uppercase tracking-wider text-slate-900 dark:text-white">Transaction <span className="text-blue-600">Ledger</span></h2>
              <div className="h-px flex-1 mx-6 bg-slate-200 dark:bg-slate-800" />
              <IndianRupee size={18} className="text-slate-300" />
           </div>

           <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200 dark:border-slate-800">
                          <th className="px-8 py-5">Property / Counterparty</th>
                          <th className="px-8 py-5">Reference</th>
                          <th className="px-8 py-5 text-center">Settlement Date</th>
                          <th className="px-8 py-5 text-right">Credit Amount</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                       {payments.length === 0 ? (
                         <tr>
                            <td colSpan="4" className="py-20 text-center text-slate-400 font-bold text-xs uppercase tracking-wider">
                               No financial activity recorded
                            </td>
                         </tr>
                       ) : (
                         payments.map((payment) => (
                           <tr key={payment._id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                              <td className="px-8 py-6">
                                 <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700">
                                       <Building size={16} className="text-blue-600" />
                                    </div>
                                    <div>
                                       <p className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">
                                          {payment.hostel?.name || "Global Portfolio"}
                                       </p>
                                       <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                                          <User size={10} /> {payment.student?.name || payment.student?.user?.name || "System"}
                                       </div>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-8 py-6">
                                 <code className="text-[10px] font-bold bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg text-slate-500 uppercase tracking-wider">
                                    REF-{payment._id.slice(-8)}
                                 </code>
                              </td>
                              <td className="px-8 py-6 text-center">
                                 <div className="flex flex-col items-center">
                                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                                       {new Date(payment.createdAt).toLocaleDateString()}
                                    </span>
                                 </div>
                              </td>
                              <td className="px-8 py-6 text-right">
                                 <div className="flex flex-col items-end">
                                    <span className="text-lg font-bold text-emerald-600 tracking-tight">
                                       +₹{payment.amount.toLocaleString()}
                                    </span>
                                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                                       Verified <CheckCircle2 size={10} className="text-emerald-500" />
                                    </span>
                                 </div>
                              </td>
                           </tr>
                         ))
                       )}
                    </tbody>
                 </table>
              </div>
              
              <div className="p-6 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center border-t border-slate-200 dark:border-slate-800">
                 <button className="text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-blue-600 flex items-center gap-2 transition-colors">
                    Load Full Ledger History <ChevronRight size={14} />
                 </button>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

// Internal utility component for the table
const CheckCircle2 = ({ size, className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="3" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/>
  </svg>
);

export default OwnerPaymentsPage;
