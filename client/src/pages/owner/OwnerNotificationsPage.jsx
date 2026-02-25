/**
 * OwnerNotificationsPage.jsx - Premium System Alerts Feed
 * 
 * Migration Status:
 * - Migrated to React Query (useNotifications)
 * - Standardized mark-read mutation with optimistic invalidation
 * - Upgraded UI to a professional "Activity Intelligence" standard
 */

import React from "react";
import { 
  Bell, 
  UserCheck, 
  CheckCircle2, 
  MessageSquare, 
  Check, 
  Loader2, 
  X, 
  Zap,
  Info,
  Clock,
  ShieldCheck,
  Inbox
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotifications } from "../../hooks/useQueries";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../apiConfig";
import toast from "react-hot-toast";

const iconMap = {
  booking: { icon: UserCheck, color: "text-purple-500", bg: "bg-purple-500/10" },
  success: { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  info: { icon: Bell, color: "text-blue-500", bg: "bg-blue-500/10" },
  complaint: { icon: MessageSquare, color: "text-rose-500", bg: "bg-rose-500/10" },
  default: { icon: Info, color: "text-slate-400", bg: "bg-slate-400/10" },
};

const OwnerNotificationsPage = () => {
  const queryClient = useQueryClient();

  // Queries
  const { data, isLoading } = useNotifications(1);
  const notifications = data?.notifications || data || [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Mutations
  const markReadMutation = useMutation({
    mutationFn: () => api.put("/api/notifications/mark-read", {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Intelligence Stream Synchronized");
    },
    onError: () => toast.error("Handshake Failed"),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-12 pb-32">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-16">
           <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter italic text-slate-950 dark:text-white leading-[0.9]">
                 System <br /> 
                 <span className="text-blue-600">Alerts</span>
              </h1>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                 <ShieldCheck size={16} className="text-blue-500" /> Real-time Administrative Identity & Activity Feed
              </p>
           </div>

           <div className="flex gap-4">
              {unreadCount > 0 && (
                 <button 
                  onClick={() => markReadMutation.mutate()}
                  disabled={markReadMutation.isPending}
                  className="px-8 py-5 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-[2rem] font-black uppercase tracking-widest text-[10px] italic flex items-center gap-3 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-slate-800"
                 >
                    {markReadMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} 
                    Synchronize Read State
                 </button>
              )}
           </div>
        </div>

        {/* Activity Feed */}
        <div className="space-y-4">
           {notifications.length === 0 ? (
              <div className="p-32 text-center bg-white dark:bg-slate-900 rounded-[5rem] border-4 border-dashed border-slate-100 dark:border-slate-800 shadow-2xl">
                 <Inbox className="mx-auto text-slate-100 dark:text-slate-800 mb-8" size={100} />
                 <h2 className="text-3xl font-black uppercase italic tracking-tighter text-slate-300">Identity Silent</h2>
                 <p className="text-xs font-bold text-slate-300 uppercase tracking-widest mt-4 italic">No activity protocols detected in the current session</p>
              </div>
           ) : (
              <AnimatePresence initial={false}>
                 {notifications.map((note, i) => {
                    const cfg = iconMap[note.type] || iconMap.default;
                    return (
                       <motion.div 
                        key={note._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`group p-8 rounded-[3rem] border transition-all duration-300 flex items-start gap-8 ${
                          note.isRead 
                          ? "bg-white dark:bg-slate-900 border-slate-50 dark:border-slate-800 opacity-60 hover:opacity-100" 
                          : "bg-white dark:bg-slate-900 border-blue-500/30 shadow-2xl shadow-blue-500/5 ring-4 ring-blue-500/5"
                        }`}
                       >
                          <div className={`p-5 rounded-[1.5rem] ${cfg.bg} ${cfg.color} shrink-0 group-hover:scale-110 transition-transform`}>
                             <cfg.icon size={28} />
                          </div>

                          <div className="flex-1 space-y-2">
                             <div className="flex items-center justify-between">
                                <span className={`text-[10px] font-black uppercase tracking-widest italic ${note.isRead ? 'text-slate-400' : 'text-blue-500'}`}>
                                   {note.type || 'System'} Update
                                </span>
                                <span className="flex items-center gap-2 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                                   <Clock size={12} /> {new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                             </div>
                             <p className={`text-lg font-black tracking-tighter italic leading-tight ${note.isRead ? 'text-slate-500' : 'text-slate-950 dark:text-white'}`}>
                                {note.message}
                             </p>
                             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest pt-2">
                                Event Reference: {note._id.slice(-8)}
                             </p>
                          </div>

                          {!note.isRead && (
                             <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                          )}
                       </motion.div>
                    );
                 })}
              </AnimatePresence>
           )}
        </div>

        {/* Footer Metrics */}
        <div className="mt-12 flex items-center justify-center gap-8 text-[10px] font-black uppercase tracking-widest text-slate-300 italic">
           <span className="flex items-center gap-2"><Zap size={14} className="text-blue-500" /> Active Uplink</span>
           <span className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Integrity Confirmed</span>
        </div>

      </div>
    </div>
  );
};

export default OwnerNotificationsPage;
