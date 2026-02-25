/**
 * RulesAndRegulations.jsx - Premium Charter & Policy Management
 * 
 * Migration Status:
 * - Migrated to React Query (useOwnerRules, useOwnerHostels + Mutations)
 * - Removed inline api calls
 * - Upgraded UI to professional "Charter" design with high contrast and dark mode optimization
 */

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldAlert, 
  Plus, 
  Trash2, 
  Pencil, 
  Check, 
  X, 
  Loader2, 
  Globe, 
  Building2, 
  Info,
  ChevronRight,
  ClipboardList,
  AlertTriangle,
  Gavel
} from "lucide-react";
import toast from 'react-hot-toast';
import { 
  useOwnerHostels, 
  useOwnerRules, 
  useAddOwnerRule, 
  useBulkAddOwnerRule, 
  useUpdateOwnerRule, 
  useDeleteOwnerRule 
} from "../../hooks/useQueries";

const RulesAndRegulations = () => {
  // Queries
  const { data: hostelsData, isLoading: loadingHostels } = useOwnerHostels();
  const rawHostels = hostelsData?.hostels || [];
  
  const { data: rulesData, isLoading: rulesLoading } = useOwnerRules();
  const rules = rulesData || [];

  // Mutations
  const addMutation = useAddOwnerRule();
  const bulkAddMutation = useBulkAddOwnerRule();
  const updateMutation = useUpdateOwnerRule();
  const deleteMutation = useDeleteOwnerRule();

  // Local State
  const [selectedHostelId, setSelectedHostelId] = useState("all");
  const [newRuleText, setNewRuleText] = useState("");
  const [editingRuleId, setEditingRuleId] = useState(null);
  const [editingRuleText, setEditingRuleText] = useState("");

  // Derived
  const filteredRules = useMemo(() => {
    if (selectedHostelId === "all") return rules;
    return rules.filter(r => r.hostelId === selectedHostelId);
  }, [rules, selectedHostelId]);

  const activeHostelName = useMemo(() => {
    if (selectedHostelId === "all") return "Global Charter";
    return rawHostels.find(h => h._id === selectedHostelId)?.name || "Select Property";
  }, [selectedHostelId, rawHostels]);

  // Handlers
  const handleAdd = async () => {
    if (!newRuleText.trim()) return toast.error("Entry cannot be empty");
    
    try {
      if (selectedHostelId === "all") {
        await bulkAddMutation.mutateAsync(newRuleText.trim());
        toast.success("Global Protocol Propagated");
      } else {
        await addMutation.mutateAsync({ text: newRuleText.trim(), hostelId: selectedHostelId });
        toast.success("Local Rule Registered");
      }
      setNewRuleText("");
    } catch (err) {
      toast.error("Handshake Failed");
    }
  };

  const handleUpdate = async (id) => {
    if (!editingRuleText.trim()) return;
    try {
      await updateMutation.mutateAsync({ id, text: editingRuleText.trim() });
      toast.success("Charter Updated");
      setEditingRuleId(null);
    } catch (err) {
      toast.error("Update Sequence Terminated");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Commence Rule Deletion Protocol?")) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Rule Purged");
    } catch (err) {
      toast.error("Purge Protocol Failed");
    }
  };

  const isMutating = addMutation.isPending || bulkAddMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  if (loadingHostels || (rulesLoading && rules.length === 0)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-12">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-12">
           <div className="space-y-3">
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white">
                 Charter Enforcement
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm flex items-center gap-2">
                 <ShieldAlert size={16} className="text-blue-500" /> Property policy & regulation matrix
              </p>
           </div>
           
           <div className="relative group min-w-[300px]">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                <Building2 size={18} />
              </div>
              <select 
                value={selectedHostelId} 
                onChange={e => setSelectedHostelId(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-blue-600 rounded-xl pl-12 pr-10 py-3.5 font-bold text-xs uppercase tracking-wider outline-none shadow-sm appearance-none cursor-pointer"
              >
                 <option value="all">Global Matrix (All)</option>
                 {rawHostels.map(h => <option key={h._id} value={h._id}>{h.name}</option>)}
              </select>
              <ChevronRight size={14} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none" />
           </div>
        </div>

        {/* Action Board */}
        <div className="bg-slate-900 dark:bg-blue-600 rounded-3xl p-8 lg:p-10 mb-10 shadow-sm relative overflow-hidden group border border-slate-800">
           <div className="absolute right-[-2%] top-[-5%] opacity-5 group-hover:scale-110 transition-transform duration-1000 rotate-12 text-white">
              <Gavel size={200} />
           </div>
           
           <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6 text-white/60">
                 <Plus size={18} className="text-white" />
                 <span className="text-[10px] font-bold uppercase tracking-wider">Initialize New Protocol</span>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4">
                 <div className="flex-1 relative">
                    <input 
                      type="text" 
                      placeholder={selectedHostelId === 'all' ? "Propagate global rule to all assets..." : `Configure rule for ${activeHostelName}...`}
                      value={newRuleText}
                      onChange={e => setNewRuleText(e.target.value)}
                      className="w-full bg-white/10 border border-transparent focus:border-white/30 rounded-xl px-6 py-4 text-white font-semibold text-sm outline-none placeholder:text-white/30 backdrop-blur-sm"
                    />
                 </div>
                 <button 
                  onClick={handleAdd}
                  disabled={isMutating}
                  className="px-8 py-4 bg-white text-slate-900 rounded-xl font-bold uppercase tracking-wider text-[10px] hover:bg-slate-50 active:scale-95 transition-all shadow-sm flex items-center justify-center gap-2 min-w-[180px]"
                 >
                    {isMutating ? <Loader2 className="animate-spin" size={16} /> : <><Check size={16} /> Deploy Rule</>}
                 </button>
              </div>
              
              <div className="mt-4 flex items-center gap-3 text-white/50 text-[10px] font-bold uppercase tracking-wider">
                 <Info size={12} /> 
                 {selectedHostelId === 'all' ? "Global rules apply to every property in your portfolio." : "This protocol will be limited to the selected property."}
              </div>
           </div>
        </div>

        {/* Matrix List */}
        <div className="space-y-4">
           <div className="flex items-center justify-between mb-8 px-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Active Matrix <span className="text-blue-500">({filteredRules.length})</span></h2>
              <div className="h-px flex-1 mx-6 bg-slate-200 dark:bg-slate-800" />
              <Globe size={18} className="text-slate-300" />
           </div>

           <AnimatePresence mode="popLayout">
              {filteredRules.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-20 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800"
                >
                   <div className="w-16 h-16 bg-slate-50 dark:bg-slate-950 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-200">
                      <ClipboardList size={28} />
                   </div>
                   <p className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">No Protocols Found in Current Sector</p>
                </motion.div>
              ) : (
                filteredRules.map((rule, idx) => (
                  <motion.div 
                    key={rule._id}
                    layoutProps={{ transition: { duration: 0.2 } }}
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ scale: 0.98, opacity: 0 }}
                    className="group bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center gap-6"
                  >
                     <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center font-bold text-slate-400 shrink-0 border border-slate-100 dark:border-slate-700">
                        {String(idx + 1).padStart(2, '0')}
                     </div>
                     
                     <div className="flex-1">
                        {editingRuleId === rule._id ? (
                           <div className="flex gap-2">
                             <input 
                              autoFocus
                              value={editingRuleText}
                              onChange={e => setEditingRuleText(e.target.value)}
                              className="flex-1 bg-slate-50 dark:bg-slate-950 border border-blue-500 rounded-xl px-5 py-3 font-semibold text-sm text-slate-900 dark:text-white outline-none"
                             />
                             <button onClick={() => handleUpdate(rule._id)} className="p-3 bg-emerald-500 text-white rounded-xl shadow-sm"><Check size={18} /></button>
                             <button onClick={() => setEditingRuleId(null)} className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-xl"><X size={18} /></button>
                           </div>
                        ) : (
                          <div className="space-y-1">
                             {selectedHostelId === 'all' && rule.hostelId && (
                                <p className="text-[9px] font-bold uppercase text-blue-500 tracking-wider">
                                   {rawHostels.find(h => h._id === rule.hostelId)?.name || 'Local Asset'}
                                </p>
                             )}
                             <p className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                                {rule.text}
                             </p>
                          </div>
                        )}
                     </div>

                     {!editingRuleId && (
                        <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button 
                            onClick={() => { setEditingRuleId(rule._id); setEditingRuleText(rule.text); }}
                            className="p-4 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-2xl transition-all"
                           >
                              <Pencil size={18} />
                           </button>
                           <button 
                            onClick={() => handleDelete(rule._id)}
                            className="p-4 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-2xl transition-all"
                           >
                              <Trash2 size={18} />
                           </button>
                        </div>
                     )}
                  </motion.div>
                ))
              )}
           </AnimatePresence>
        </div>

        {/* Footer Info */}
        <div className="mt-16 p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 flex items-start gap-6 shadow-sm">
           <AlertTriangle size={24} className="text-amber-500 shrink-0" />
           <div className="space-y-2">
              <h4 className="font-bold uppercase tracking-wider text-[10px] text-slate-900 dark:text-white">Binding Clause</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                 All protocols established in this matrix are legally binding for residents of the specified properties. Residents will be notified automatically upon global charter updates.
              </p>
           </div>
        </div>

      </div>
    </div>
  );
};

export default RulesAndRegulations;
