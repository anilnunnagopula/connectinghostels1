/**
 * OwnerDashboard.jsx - Premium Administrative Command Center
 * 
 * Migration Status:
 * - Migrated to React Query (useOwnerMetrics)
 * - Refined Chart integration with high-contrast aesthetics
 * - Upgraded UI to professional "Enterprise Portfolio" standard
 */

import React, { useState, useEffect, useMemo } from "react";
import {
  Building2,
  BedDouble,
  Users,
  PlusCircle,
  Bell,
  CreditCard,
  Settings,
  Send,
  ScrollText,
  GitPullRequest,
  UserPlus,
  Loader2,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Zap,
  LayoutDashboard,
  LayoutGrid
} from "lucide-react";
import { FaRestroom } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { useOwnerMetrics } from "../../hooks/useQueries";

// Import reusable components (Assuming they exist and are standard)
import StatCard from "../../components/dashboard/StatCard";
import ActionCard from "../../components/dashboard/ActionCard";
import EmptyState from "../../components/dashboard/EmptyState";

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Queries
  const { data: metricsData, isLoading: loading } = useOwnerMetrics();

  useEffect(() => {
    const ownerData = localStorage.getItem("user");
    if (ownerData) setUser(JSON.parse(ownerData));
  }, []);

  const stats = useMemo(() => ({
    totalHostels: metricsData?.totalHostels || 0,
    roomsFilled: metricsData?.roomsFilled || 0,
    totalStudents: metricsData?.studentsCount || 0,
    complaints: metricsData?.complaintsCount || 0,
    availableRooms: metricsData?.availableRooms || 0,
    totalRevenue: metricsData?.totalEarnings || 0,
  }), [metricsData]);

  const monthlyRevenue = useMemo(() => {
    const payments = metricsData?.recentPayments || [];
    const monthMap = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toLocaleString("default", { month: "short" });
      monthMap[key] = 0;
    }
    payments.forEach((p) => {
      if (p.status !== "captured" && p.status !== "paid") return;
      const d = new Date(p.createdAt);
      const key = d.toLocaleString("default", { month: "short" });
      if (key in monthMap) monthMap[key] += p.amount || 0;
    });
    return Object.entries(monthMap).map(([month, revenue]) => ({ month, revenue: revenue / 100 }));
  }, [metricsData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-12 pb-32">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
           <motion.div 
             initial={{ opacity: 0, y: -20 }}
             animate={{ opacity: 1, y: 0 }}
             className="space-y-2"
           >
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white">
                 Owner Dashboard
              </h1>
              <div className="flex items-center gap-3">
                 <p className="text-slate-500 dark:text-slate-400 font-medium text-sm flex items-center gap-2">
                    <LayoutDashboard size={16} className="text-blue-600" /> Welcome back, {user?.name || "Owner"}
                 </p>
                 <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
              </div>
           </motion.div>

           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             className="flex gap-4"
           >
              <div className="px-6 py-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                 <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl flex items-center justify-center">
                    <TrendingUp size={20} />
                 </div>
                 <div>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Earnings</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">₹{(stats.totalRevenue / 100).toLocaleString("en-IN")}</p>
                 </div>
              </div>
           </motion.div>
        </div>

        {/* KPI Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
           {[
             { label: "Total Hostels", val: stats.totalHostels, icon: Building2, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20", route: "/owner/my-hostels" },
             { label: "Occupied Rooms", val: stats.roomsFilled, icon: BedDouble, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20", route: "/owner/filled-rooms" },
             { label: "Total Students", val: stats.totalStudents, icon: Users, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-900/20", route: "/owner/my-students" },
             { label: "Available Rooms", val: stats.availableRooms, icon: FaRestroom, color: "text-rose-600", bg: "bg-rose-50 dark:bg-rose-900/20", route: "/owner/available-rooms" },
           ].map((kpi, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.05 }}
               onClick={() => navigate(kpi.route)}
               className="group bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer transition-all hover:border-blue-500/50 hover:shadow-md"
             >
                <div className={`w-12 h-12 ${kpi.bg} ${kpi.color} rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                   <kpi.icon size={24} />
                </div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">{kpi.label}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{kpi.val}</p>
             </motion.div>
           ))}
        </div>

        {/* Charts & Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
           
           <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
              <div className="absolute top-8 right-8 flex items-center gap-4">
                 <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Revenue Trend</span>
                 </div>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-3">
                 <Zap className="text-blue-600" size={18} /> Revenue Analytics
              </h3>
              <div className="h-72 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyRevenue}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "#1e293b" : "#f1f5f9"} />
                       <XAxis 
                         dataKey="month" 
                         axisLine={false} 
                         tickLine={false} 
                         tick={{ fill: "#64748b", fontSize: 11, fontWeight: 600 }} 
                       />
                       <YAxis 
                         axisLine={false} 
                         tickLine={false} 
                         tick={{ fill: "#64748b", fontSize: 11, fontWeight: 600 }} 
                         tickFormatter={(v) => `₹${v}`}
                       />
                       <Tooltip 
                         cursor={{ fill: "transparent" }}
                         contentStyle={{ backgroundColor: "#1e293b", border: "none", borderRadius: "1rem", padding: "1rem", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}
                         itemStyle={{ color: "#fff", fontWeight: 700 }}
                         labelStyle={{ color: "#94a3b8", fontSize: "12px", marginBottom: "4px" }}
                       />
                       <Bar dataKey="revenue" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={36} />
                    </BarChart>
                 </ResponsiveContainer>
              </div>
           </div>

           <div className="bg-slate-900 p-8 rounded-3xl shadow-sm relative overflow-hidden flex flex-col justify-between border border-slate-800">
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/5 blur-[80px] rounded-full" />
              <div>
                 <h3 className="text-lg font-bold text-white mb-1">Occupancy Rate</h3>
                 <p className="text-xs text-slate-400 mb-8 font-medium">Real-time capacity tracking</p>
                 <div className="h-56 relative">
                    <ResponsiveContainer width="100%" height="100%">
                       <PieChart>
                          <Pie
                             data={[
                               { name: "Filled", value: stats.roomsFilled },
                               { name: "Available", value: stats.availableRooms },
                             ]}
                             cx="50%"
                             cy="50%"
                             innerRadius={65}
                             outerRadius={85}
                             paddingAngle={6}
                             dataKey="value"
                             stroke="none"
                          >
                             <Cell fill="#3b82f6" />
                             <Cell fill="rgba(255,255,255,0.08)" />
                          </Pie>
                       </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                       <p className="text-3xl font-bold text-white">
                          {stats.roomsFilled + stats.availableRooms > 0 ? Math.round((stats.roomsFilled / (stats.roomsFilled + stats.availableRooms)) * 100) : 0}%
                       </p>
                       <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Occupied</p>
                    </div>
                 </div>
              </div>
              <button 
                onClick={() => navigate("/owner/manage-rooms")}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                 Manage Inventory <LayoutGrid size={14} />
              </button>
           </div>

        </div>

        {/* Quick Actions Grid */}
        <div className="space-y-8">
           <div className="flex items-center gap-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Quick Actions</h2>
              <div className="h-[1px] flex-1 bg-slate-200 dark:bg-slate-800" />
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: PlusCircle, title: "Add Hostel", desc: "Register a new property", route: "/owner/add-hostel", color: "bg-blue-600" },
                { icon: UserPlus, title: "Add Student", desc: "Enroll a new resident", route: "/owner/add-student", color: "bg-emerald-600" },
                { icon: GitPullRequest, title: "View Requests", desc: "Manage booking queue", route: "/owner/view-requests", color: "bg-purple-600" },
                { icon: Send, title: "Send Alerts", desc: "Broadcast notifications", route: "/owner/send-alerts", color: "bg-amber-600" },
                { icon: Bell, title: "Notifications", desc: "View system alerts", route: "/owner/notifications", color: "bg-rose-600" },
                { icon: ScrollText, title: "Hostel Rules", desc: "Update regulations", route: "/owner/rules-and-regulations", color: "bg-indigo-600" },
                { icon: CreditCard, title: "Payments", desc: "Revenue & ledger", route: "/owner/payment-settings", color: "bg-teal-600" },
                { icon: Settings, title: "Settings", desc: "Profile & account", route: "/owner/profile-settings", color: "bg-slate-600" },
              ].map((action, i) => (
                <motion.div 
                   key={i}
                   whileHover={{ y: -4 }}
                   whileActive={{ scale: 0.98 }}
                   onClick={() => navigate(action.route)}
                   className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col min-h-[180px]"
                >
                   <div className={`w-10 h-10 ${action.color} text-white rounded-xl flex items-center justify-center shadow-md mb-6 transition-transform group-hover:rotate-6`}>
                      <action.icon size={20} />
                   </div>
                   <div className="space-y-1">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">{action.title}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{action.desc}</p>
                   </div>
                   <div className="mt-auto flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight size={16} className="text-blue-600" />
                   </div>
                </motion.div>
              ))}
           </div>
        </div>

      </div>
    </div>
  );
};

const isDarkMode = document.documentElement.classList.contains('dark');

export default OwnerDashboard;
