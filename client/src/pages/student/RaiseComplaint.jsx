/**
 * RaiseComplaint.jsx - Student Complaint Submission
 *
 * Migration Status:
 * - Migrated to React Query (useStudentRequests, useRaiseComplaint, useComplaints)
 * - Removed manual fetch and status logic
 * - Integrated with studentService.js
 * - Added "Grievance History" section for better UX
 * - Polished form with character counts and premium file upload styling
 */

import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../apiConfig";
import toast from 'react-hot-toast';
import {
  MessageSquare,
  Upload,
  X,
  Loader2,
  AlertCircle,
  CheckCircle,
  Home,
  Building2,
  Send,
  History,
  Clock,
  ArrowLeft,
  Paperclip,
  Trash2,
} from "lucide-react";
import { 
  useStudentRequests, 
  useRaiseComplaint, 
  useComplaints,
  useHostelDetail 
} from "../../hooks/useQueries";

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const MAX_MESSAGE_LENGTH = 500;

const COMPLAINT_TYPES = [
  { value: "maintenance", label: "Maintenance Issue" },
  { value: "cleanliness", label: "Cleanliness" },
  { value: "noise", label: "Noise Complaint" },
  { value: "security", label: "Security Concern" },
  { value: "facilities", label: "Facility Problem" },
  { value: "roommate", label: "Roommate Issue" },
  { value: "billing", label: "Billing/Payment" },
  { value: "others", label: "Others" },
];

const RaiseComplaint = () => {
  const navigate = useNavigate();

  // Queries
  const { data: statusData, isLoading: loadingStatus } = useStudentRequests();
  const { data: complaints = [], isLoading: loadingComplaints } = useComplaints();
  const mutation = useRaiseComplaint();

  const currentHostelId = statusData?.currentHostel;
  const { data: hostel } = useHostelDetail(currentHostelId);

  // Form State
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    type: "",
    room: "",
  });
  const [files, setFiles] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});

  // Auto-fill room if available
  useEffect(() => {
    const approved = statusData?.requests?.find(r => r.status === "Approved");
    if (approved?.roomNumber) {
      setFormData(prev => ({ ...prev, room: approved.roomNumber }));
    }
  }, [statusData]);

  // ==========================================================================
  // HANDLERS
  // ==========================================================================

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setValidationErrors(prev => {
      const { [name]: _, ...rest } = prev;
      return rest;
    });
  };

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files || []);
    const valid = selected.filter(f => {
      if (f.size > MAX_FILE_SIZE_BYTES) {
        toast.error(`${f.name} is too large`);
        return false;
      }
      return true;
    });
    setFiles(prev => [...prev, ...valid].slice(0, 3)); // Max 3 files
  };

  const validate = () => {
    const errors = {};
    if (!formData.type) errors.type = "Select issue type";
    if (!formData.room) errors.room = "Room # required";
    if (formData.subject.length < 5) errors.subject = "Subject too short";
    if (formData.message.length < 20) errors.message = "Please describe in detail (min 20 chars)";
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const submitData = new FormData();
      submitData.append("type", formData.type);
      submitData.append("room", formData.room);
      submitData.append("subject", formData.subject);
      submitData.append("message", formData.message);
      submitData.append("hostelId", currentHostelId);
      files.forEach(f => submitData.append("files", f));

      await mutation.mutateAsync(submitData);
      
      toast.success("Grievance lodged successfully");
      setFormData(prev => ({ ...prev, subject: "", message: "" }));
      setFiles([]);
    } catch (err) {
      toast.error(err.response?.data?.message || "Lodging failed");
    }
  };

  // ==========================================================================
  // RENDER HELPERS
  // ==========================================================================

  if (loadingStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  if (!currentHostelId) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6 flex items-center justify-center">
        <div className="max-w-md w-full bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] shadow-2xl text-center">
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300"><Building2 size={32} /></div>
          <h2 className="text-3xl font-black mb-2 tracking-tight">Access Restricted</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">Only active residents can raise complaints against hostels.</p>
          <button onClick={() => navigate("/student/hostels")} className="bg-slate-900 dark:bg-blue-600 text-white px-8 py-4 rounded-2xl font-black w-full uppercase tracking-widest text-xs">Browse Hostels</button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'resolved': return 'bg-emerald-500 text-white';
      case 'in-progress': return 'bg-amber-500 text-white';
      default: return 'bg-slate-500 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 sm:p-6 lg:p-12 pb-24">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12">
        
        {/* Left Side: Form */}
        <div className="flex-1">
          <div className="mb-10">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest mb-4 transition hover:translate-x-[-4px]"><ArrowLeft size={16} />Back</button>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-900 dark:text-white italic">Lodge Grievance</h1>
            <p className="text-slate-400 font-bold mt-1 uppercase text-[10px] tracking-widest">Regarding <span className="text-blue-600 dark:text-blue-400">{hostel?.name}</span></p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-8 lg:p-10 rounded-[2.5rem] shadow-2xl shadow-blue-900/5 border border-slate-100 dark:border-slate-700/50 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Issue Category</label>
                <select name="type" value={formData.type} onChange={handleInputChange} className={`w-full bg-slate-50 dark:bg-slate-900 border-2 ${validationErrors.type ? 'border-rose-500' : 'border-slate-100 dark:border-slate-800'} rounded-2xl px-5 py-3.5 font-bold text-sm focus:outline-none focus:border-blue-500 transition-colors`}>
                  <option value="">Select Category</option>
                  {COMPLAINT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
                {validationErrors.type && <p className="text-[10px] text-rose-500 font-bold mt-1 ml-2 uppercase italic">{validationErrors.type}</p>}
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Room Number</label>
                <input name="room" value={formData.room} onChange={handleInputChange} placeholder="e.g. 302" className={`w-full bg-slate-50 dark:bg-slate-900 border-2 ${validationErrors.room ? 'border-rose-500' : 'border-slate-100 dark:border-slate-800'} rounded-2xl px-5 py-3.5 font-bold text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-300 dark:placeholder:text-slate-600`} />
                {validationErrors.room && <p className="text-[10px] text-rose-500 font-bold mt-1 ml-2 uppercase italic">{validationErrors.room}</p>}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Subject</label>
              <input name="subject" value={formData.subject} onChange={handleInputChange} placeholder="Brief description of the issue" className={`w-full bg-slate-50 dark:bg-slate-900 border-2 ${validationErrors.subject ? 'border-rose-500' : 'border-slate-100 dark:border-slate-800'} rounded-2xl px-5 py-3.5 font-bold text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-300 dark:placeholder:text-slate-600`} />
              {validationErrors.subject && <p className="text-[10px] text-rose-500 font-bold mt-1 ml-2 uppercase italic">{validationErrors.subject}</p>}
            </div>

            <div>
              <div className="flex justify-between mb-2 ml-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Detailed Message</label>
                <span className={`text-[10px] font-black ${formData.message.length > MAX_MESSAGE_LENGTH ? 'text-rose-500' : 'text-slate-300'}`}>{formData.message.length}/{MAX_MESSAGE_LENGTH}</span>
              </div>
              <textarea name="message" value={formData.message} onChange={handleInputChange} rows={5} placeholder="Describe exactly what happened..." className={`w-full bg-slate-50 dark:bg-slate-900 border-2 ${validationErrors.message ? 'border-rose-500' : 'border-slate-100 dark:border-slate-800'} rounded-2xl px-5 py-4 font-bold text-sm focus:outline-none focus:border-blue-500 transition-colors resize-none placeholder:text-slate-300 dark:placeholder:text-slate-600`} />
              {validationErrors.message && <p className="text-[10px] text-rose-500 font-bold mt-1 ml-2 uppercase italic">{validationErrors.message}</p>}
            </div>

            <div>
               <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Evidence (Max 3 Files)</label>
               <div className="flex flex-wrap gap-3">
                  {files.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-xl text-xs font-bold border border-blue-100 dark:border-blue-900/50">
                      <Paperclip size={14} /> <span className="max-w-[100px] truncate">{f.name}</span>
                      <button type="button" onClick={() => setFiles(prev => prev.filter((_, idx) => idx !== i))} className="hover:text-rose-500 transition-colors"><X size={14} /></button>
                    </div>
                  ))}
                  {files.length < 3 && (
                    <label className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 text-slate-400 hover:text-blue-600 px-4 py-2 rounded-xl text-xs font-bold border-2 border-dashed border-slate-100 dark:border-slate-700 cursor-pointer transition-all">
                      <Upload size={14} /> <span>Add File</span>
                      <input type="file" multiple accept="image/*,.pdf" onChange={handleFileChange} className="hidden" />
                    </label>
                  )}
               </div>
            </div>

            <button type="submit" disabled={mutation.isPending} className="w-full bg-slate-900 dark:bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-slate-200 dark:shadow-none hover:translate-y-[-2px] active:scale-95 transition disabled:opacity-50 flex items-center justify-center gap-3 italic">
              {mutation.isPending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              {mutation.isPending ? "Syncing..." : "Submit Grievance"}
            </button>
          </form>
        </div>

        {/* Right Side: History */}
        <div className="lg:w-96">
           <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-black uppercase tracking-tighter italic flex items-center gap-3"><History size={20} className="text-blue-600" /> Recent History</h2>
              <div className="text-[10px] font-black text-slate-400">{complaints.length} Records</div>
           </div>

           <div className="space-y-4">
              {loadingComplaints ? (
                [1,2,3].map(i => <div key={i} className="h-24 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" />)
              ) : complaints.length > 0 ? (
                complaints.slice(0, 5).map(c => (
                  <div key={c._id} className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/50 transition hover:shadow-md group">
                    <div className="flex items-center justify-between mb-2">
                       <span className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${getStatusColor(c.status)}`}>{c.status || 'Pending'}</span>
                       <span className="text-[9px] font-bold text-slate-300">{new Date(c.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h3 className="font-black text-sm uppercase truncate mb-1 group-hover:text-blue-600 transition-colors">{c.subject}</h3>
                    <p className="text-xs font-medium text-slate-400 line-clamp-1">{c.message}</p>
                    <div className="mt-3 flex items-center gap-1 text-[9px] font-black text-slate-300 uppercase italic"><Clock size={10} /> {c.type}</div>
                  </div>
                ))
              ) : (
                <div className="bg-slate-100/50 dark:bg-slate-800/40 rounded-[2rem] p-10 text-center border-2 border-dashed border-slate-100 dark:border-slate-800">
                   <CheckCircle className="mx-auto mb-4 text-slate-200 dark:text-slate-700" size={32} />
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">Clean Slate<br/>No active complaints found</p>
                </div>
              )}
           </div>

           <div className="mt-8 p-6 bg-blue-50/50 dark:bg-blue-900/10 rounded-3xl border border-blue-100/50 dark:border-blue-900/30">
              <h4 className="text-xs font-black uppercase tracking-widest text-blue-800 dark:text-blue-400 mb-2">Urgent Matters?</h4>
              <p className="text-[10px] font-bold text-blue-600 dark:text-blue-500 leading-relaxed mb-4">If this is a security emergency or health hazard, please contact the warden directly via the internal intercom or mobile.</p>
              <button disabled className="text-[10px] font-black text-blue-400 tracking-widest uppercase opacity-40 italic">Emergency Protocol →</button>
           </div>
        </div>

      </div>
    </div>
  );
};

export default RaiseComplaint;
