/**
 * OwnerProfile.jsx - Business Intelligence Identity Dashboard
 * 
 * Migration Status:
 * - Migrated to React Query (useUserProfile, useOwnerMetrics)
 * - Refined as a read-only premium "Business Intelligence" overview
 * - Standardized UI to professional "Asset Manager" identity standard
 */

import React, { useMemo } from "react";
import { 
  User, 
  Mail, 
  Phone, 
  Building2, 
  ShieldCheck, 
  IndianRupee, 
  Users, 
  BedDouble, 
  MapPin, 
  Settings2,
  Share2,
  TrendingUp,
  Briefcase,
  Globe,
  Loader2,
  ArrowRight,
  Target
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useUserProfile, useOwnerMetrics } from "../../hooks/useQueries";

const OwnerProfile = () => {
  const navigate = useNavigate();

  // Queries
  const { data: user, isLoading: loadingUser } = useUserProfile();
  const { data: metrics, isLoading: loadingMetrics } = useOwnerMetrics();

  const businessStats = useMemo(() => [
    { label: "Asset Fleet", val: metrics?.totalHostels || 0, icon: Building2, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Active Residents", val: metrics?.studentsCount || 0, icon: Users, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Total Yield", val: `₹${((metrics?.totalEarnings || 0) / 100).toLocaleString("en-IN")}`, icon: IndianRupee, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Portfolio Health", val: "Optimal", icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-500/10" },
  ], [metrics]);

  if (loadingUser || loadingMetrics) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-12 pb-32">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
           <motion.div 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             className="space-y-2"
           >
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white">
                 Strategic Identity
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm flex items-center gap-2">
                 <ShieldCheck size={16} className="text-blue-500" /> Verified principal asset holder
              </p>
           </motion.div>

           <div className="flex gap-4">
              <button 
                onClick={() => navigate("/owner/profile-settings")}
                className="px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-blue-600 rounded-xl font-bold text-xs transition-all shadow-sm flex items-center gap-2"
              >
                 <Settings2 size={16} /> Configure Settings
              </button>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
           
           {/* Left Column: Core Identity */}
           <div className="space-y-8">
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/5 blur-[80px] rounded-full group-hover:bg-blue-600/10 transition-colors" />
                 
                 <div className="relative z-10 text-center space-y-8">
                    <div className="w-32 h-32 mx-auto rounded-3xl overflow-hidden border-4 border-slate-50 dark:border-slate-800 shadow-xl">
                       <img 
                         src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=6366f1&color=fff&size=512`} 
                         className="w-full h-full object-cover" 
                         alt="Principal" 
                       />
                    </div>
                    <div>
                       <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{user?.name}</h2>
                       <p className="text-[10px] font-bold uppercase tracking-wider text-blue-500">Chief Operations Officer</p>
                    </div>

                    <div className="pt-8 border-t border-slate-100 dark:border-slate-800 space-y-5 text-left">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400"><Mail size={16} /></div>
                          <div>
                             <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Email Address</p>
                             <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user?.email}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400"><Phone size={16} /></div>
                          <div>
                             <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Phone Number</p>
                             <p className="text-sm font-semibold text-slate-900 dark:text-white">{user?.phone || "Not Logged"}</p>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="bg-slate-900 dark:bg-blue-600 text-white rounded-3xl p-8 shadow-sm relative overflow-hidden">
                 <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-6 flex items-center gap-2">
                    <Briefcase size={18} /> Corporate Bio
                 </h3>
                 <p className="text-xs font-medium text-white/70 leading-relaxed">
                    Managing a portfolio of {metrics?.totalHostels || 0} premium assets. Specialized in high-density residential logistics and youth hospitality scalability.
                 </p>
              </div>
           </div>

           {/* Right Column: Portfolio Metrics */}
           <div className="lg:col-span-2 space-y-8">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {businessStats.map((stat, i) => (
                    <motion.div 
                       key={i}
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ delay: i * 0.05 }}
                       className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm group hover:border-blue-500/30 transition-all"
                    >
                       <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-all`}>
                          <stat.icon size={24} />
                       </div>
                       <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">{stat.label}</p>
                       <p className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{stat.val}</p>
                    </motion.div>
                 ))}
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
                 <div className="flex items-center justify-between mb-10">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-3">
                       <Target className="text-blue-500" size={18} /> Active Operations
                    </h3>
                    <button 
                       onClick={() => navigate("/owner/my-hostels")}
                       className="text-[10px] font-bold uppercase tracking-wider text-blue-600 hover:underline flex items-center gap-1"
                    >
                       View All Assets <ArrowRight size={14} />
                    </button>
                 </div>

                 <div className="space-y-4">
                    <div className="p-6 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center justify-between group cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                       <div className="flex items-center gap-5">
                          <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center font-bold">CH</div>
                          <div>
                             <h4 className="text-sm font-bold text-slate-900 dark:text-white">ConnectingHostel HQ</h4>
                             <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Primary administrative node</p>
                          </div>
                       </div>
                       <div className="px-5 py-1.5 bg-emerald-500 text-white text-[9px] font-bold uppercase tracking-wider rounded-full">Active</div>
                    </div>
                    
                    <div className="p-10 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-center space-y-3">
                       <Globe className="mx-auto text-slate-200 dark:text-slate-800" size={32} />
                       <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Portfolio Span: 100% Domestic</p>
                    </div>
                 </div>
              </div>

           </div>

        </div>

      </div>
    </div>
  );
};

export default OwnerProfile;
