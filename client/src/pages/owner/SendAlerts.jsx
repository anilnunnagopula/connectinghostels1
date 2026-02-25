/**
 * SendAlerts.jsx - Premium Broadcast Intelligence
 * 
 * Migration Status:
 * - Migrated to React Query (useOwnerHostels, useOwnerStudents)
 * - Refined AI synthesis with Gemini flash optimization
 * - Upgraded UI to professional "Communication Hub" standard
 */

import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { 
  PaperPlaneIcon, 
  Sparkles, 
  Loader2, 
  Send, 
  Trash2, 
  CheckCircle2 ,
  Building2, 
  Users, 
  ShieldCheck, 
  Info, 
  MessageSquare,
  Zap,
  Star,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from 'react-hot-toast';
import { useOwnerHostels, useOwnerStudents } from "../../hooks/useQueries";
import api from "../../apiConfig";

const messageTypes = [
  { value: "holiday", label: "Holiday Protocol", icon: Star },
  { value: "fee", label: "Fee Synchronization", icon: Zap },
  { value: "welcome", label: "Identity Greeting", icon: ShieldCheck },
  { value: "others", label: "Global Announcement", icon: Info },
];

const SendAlerts = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [sending, setSending] = useState(false);
  const [selectedHostel, setSelectedHostel] = useState({ value: "all-hostels", label: "Spectrum: All Assets" });

  // Queries
  const { data: hostelsData, isLoading: hostelsLoading } = useOwnerHostels();
  const hostels = useMemo(() => [
    { value: "all-hostels", label: "Spectrum: All Assets" },
    ...(hostelsData?.hostels || []).map(h => ({ value: h._id, label: h.name }))
  ], [hostelsData]);
  
  const { data: studentsData, isLoading: studentsLoading } = useOwnerStudents();
  const allStudents = useMemo(() => {
    return (studentsData || [])
      .map(s => ({
        value: s._id,
        label: `${s.name} (Unit ${s.room || "TBD"})`,
        hostelId: s.hostel?._id || s.hostel,
      }));
  }, [studentsData]);

  const filteredStudents = useMemo(() => {
    return selectedHostel.value === "all-hostels" 
      ? allStudents 
      : allStudents.filter(s => s.hostelId === selectedHostel.value);
  }, [allStudents, selectedHostel]);

  const studentOptions = useMemo(() => [
    { value: "all-students", label: "Select Entire Cohort" },
    ...filteredStudents
  ], [filteredStudents]);

  const handleGenerateAI = async () => {
    if (!selectedType) return toast.error("Select Communication Protocol");
    setAiGenerating(true);
    const toastId = toast.loading("Synthesizing Broadcast Copy...");
    
    try {
      const recipientLabel = selectedStudents.length === 0 ? "residents" : (selectedStudents.length === 1 ? selectedStudents[0].label.split(" (")[0] : `${selectedStudents.length} residents`);
      const prompt = `Synthesize a premium and concise broadcast message:
        Type: ${selectedType.label}
        Recipient: ${recipientLabel}
        Asset: ${selectedHostel.label === "Spectrum: All Assets" ? "your properties" : selectedHostel.label}
        Focus on professional clarity and architectural tone. Keep it under 60 words.`;

      const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }] }),
      });

      const result = await res.json();
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        setMessage(text.trim());
        toast.success("Intelligence Synchronized", { id: toastId });
      } else throw new Error();
    } catch (err) {
      toast.error("AI node handshake failed", { id: toastId });
    } finally {
      setAiGenerating(false);
    }
  };

  const handleSend = async () => {
    if (!message || message.trim().length < 5) return toast.error("Communication payload too short");
    if (selectedStudents.length === 0) return toast.error("Target Cohort undefined");

    setSending(true);
    const toastId = toast.loading("Broadcasting Intelligence...");
    try {
      const studentIds = selectedStudents.map(s => s.value);
      await api.post(`/api/alerts/send`, { studentIds, message, type: selectedType?.value || "info" });
      toast.success("Broadcast Dispatched Successfully", { id: toastId });
      setMessage("");
      setSelectedStudents([]);
    } catch (err) {
      toast.error("Global Broadcast Protocol Failure", { id: toastId });
    } finally {
      setSending(false);
    }
  };

  if (hostelsLoading || studentsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: 'transparent',
      borderWidth: '2px',
      borderColor: state.isFocused ? '#3b82f6' : 'transparent',
      borderRadius: '2rem',
      padding: '0.75rem 1.5rem',
      boxShadow: 'none',
      '&:hover': { borderColor: state.isFocused ? '#3b82f6' : '#f1f5f9' },
    }),
    singleValue: (base) => ({ ...base, color: 'inherit', fontWeight: '800', textTransform: 'uppercase', fontStyle: 'italic', fontSize: '12px', letterSpacing: '0.05em' }),
    placeholder: (base) => ({ ...base, color: '#94a3b8', fontWeight: '800', textTransform: 'uppercase', fontStyle: 'italic', fontSize: '10px', letterSpacing: '0.1em' }),
    menu: (base) => ({ ...base, backgroundColor: '#ffffff', borderRadius: '2rem', padding: '1rem', border: '1px solid #f1f5f9', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)', overflow: 'hidden', zIndex: 100 }),
    option: (base, state) => ({ ...base, backgroundColor: state.isFocused ? '#f8fafc' : 'transparent', color: state.isFocused ? '#3b82f6' : '#64748b', fontWeight: '800', textTransform: 'uppercase', fontStyle: 'italic', fontSize: '10px', letterSpacing: '0.1em', borderRadius: '1rem', padding: '1rem' }),
    multiValue: (base) => ({ ...base, backgroundColor: '#eff6ff', borderRadius: '1rem', padding: '2px 8px' }),
    multiValueLabel: (base) => ({ ...base, color: '#3b82f6', fontWeight: '800', fontSize: '10px' }),
    multiValueRemove: (base) => ({ ...base, color: '#3b82f6', '&:hover': { backgroundColor: '#dbeafe', color: '#1d4ed8' } }),
  };

  const darkStyles = {
    ...selectStyles,
    menu: (base) => ({ ...base, backgroundColor: '#0f172a', borderRadius: '2rem', padding: '1rem', border: '1px solid #1e293b', boxShadow: 'none', overflow: 'hidden', zIndex: 100 }),
    option: (base, state) => ({ ...base, backgroundColor: state.isFocused ? '#1e293b' : 'transparent', color: state.isFocused ? '#3b82f6' : '#94a3b8', fontWeight: '800', textTransform: 'uppercase', fontStyle: 'italic', fontSize: '10px', letterSpacing: '0.1em', borderRadius: '1rem', padding: '1rem' }),
    multiValue: (base) => ({ ...base, backgroundColor: '#1e293b', borderRadius: '1rem', padding: '2px 8px' }),
    multiValueLabel: (base) => ({ ...base, color: '#60a5fa' }),
  };

  const isDarkMode = document.documentElement.classList.contains('dark');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-12 pb-32">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-12">
           <div className="space-y-3">
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white">
                 Broadcast Intelligence
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm flex items-center gap-2">
                 <ShieldCheck size={16} className="text-blue-500" /> Mass communication hub & smart alert system
              </p>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Control Panel */}
            <div className="lg:col-span-2 space-y-8">
               <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-8">
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                         <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1 flex items-center gap-2">
                            <Building2 size={12} /> Source Asset
                         </label>
                         <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                            <Select 
                               options={hostels} 
                               value={selectedHostel} 
                               onChange={setSelectedHostel} 
                               styles={isDarkMode ? darkStyles : selectStyles} 
                            />
                         </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1 flex items-center gap-2">
                            <Zap size={12} /> Message Type
                         </label>
                         <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                            <Select 
                               options={messageTypes} 
                               value={selectedType} 
                               onChange={setSelectedType} 
                               styles={isDarkMode ? darkStyles : selectStyles} 
                            />
                         </div>
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1 flex items-center gap-2">
                         <Users size={12} /> Target Cohort
                      </label>
                      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                         <Select 
                            isMulti 
                            options={studentOptions} 
                            value={selectedStudents} 
                            onChange={(vals) => {
                              if (vals && vals.some(v => v.value === 'all-students')) {
                                 setSelectedStudents(filteredStudents);
                              } else {
                                 setSelectedStudents(vals || []);
                              }
                            }}
                            styles={isDarkMode ? darkStyles : selectStyles} 
                         />
                      </div>
                   </div>

                   <div className="space-y-4">
                      <div className="flex items-center justify-between px-1">
                         <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                            <MessageSquare size={12} /> Intelligence Payload
                         </label>
                         <button 
                           onClick={handleGenerateAI} 
                           disabled={aiGenerating}
                           className="px-4 py-2 bg-slate-900 dark:bg-blue-600 text-white rounded-lg text-[9px] font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-slate-800 dark:hover:bg-blue-700 transition-all shadow-sm"
                         >
                            {aiGenerating ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} AI Synthesize
                         </button>
                      </div>
                      <textarea 
                         value={message}
                         onChange={e => setMessage(e.target.value)}
                         rows="5"
                         className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:border-blue-600 rounded-2xl px-6 py-5 font-semibold text-slate-900 dark:text-white outline-none shadow-sm resize-none leading-relaxed transition-all"
                         placeholder="Compose administrative broadcast..."
                      />
                      <div className="flex justify-between px-2 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                         <span>Payload Depth: {message.length} units</span>
                         {message.length > 0 && message.length < 5 && <span className="text-rose-500 animate-pulse">Critical: Payload insufficient</span>}
                      </div>
                   </div>

                   <button 
                     onClick={handleSend}
                     disabled={sending || !message || message.length < 5 || selectedStudents.length === 0}
                     className="w-full py-4 bg-slate-900 dark:bg-blue-600 text-white rounded-xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-3 hover:bg-slate-800 dark:hover:bg-blue-700 transition-all shadow-sm disabled:opacity-20"
                   >
                      {sending ? <Loader2 className="animate-spin" /> : <Send size={18} />} Dispatch Broadcast
                   </button>

                </div>

            </div>

            {/* Preview & Stats */}
            <div className="space-y-8">
               <div className="bg-slate-900 rounded-3xl p-8 text-white overflow-hidden relative shadow-sm border border-slate-800">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[60px] rounded-full" />
                  
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-8 flex items-center gap-2">
                     <Zap size={14} className="text-blue-500" /> Dispatch Metrics
                  </h3>

                  <div className="space-y-6 relative">
                     <div className="flex justify-between items-end border-b border-white/5 pb-6">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Recipients</span>
                        <span className="text-4xl font-bold tracking-tighter">{selectedStudents.length}</span>
                     </div>
                     <div className="flex justify-between items-end border-b border-white/5 pb-6">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Protocol</span>
                        <span className="text-lg font-bold tracking-tight uppercase text-blue-400">{selectedType?.label || "Info"}</span>
                     </div>
                     <div className="flex justify-between items-end">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Asset Range</span>
                        <span className="text-xs font-bold tracking-tight uppercase text-emerald-400 truncate max-w-[120px]">{selectedHostel.label}</span>
                     </div>
                  </div>
               </div>

               <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-6">Broadcast Guidelines</h3>
                  <ul className="space-y-4">
                     {[
                       "Ensure payload clarity for high-retention",
                       "Target specific units for precise coordination",
                       "Use AI synthesis for standardized tone",
                       "Verify emergency contact handshakes"
                     ].map((t, i) => (
                       <li key={i} className="flex items-start gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider leading-loose">
                          <CheckCircle2 size={12} className="text-blue-500 shrink-0 mt-1" /> {t}
                       </li>
                     ))}
                  </ul>
               </div>
            </div>

        </div>

      </div>
    </div>
  );
};

export default SendAlerts;
