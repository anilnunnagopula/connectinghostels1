/**
 * AddStudent.jsx - Master Enrollment Interface for Owners
 * 
 * Migration Status:
 * - Migrated to React Query (useOwnerHostels, useAddStudent)
 * - Standardized multi-step enrollment "wizard" flow
 * - Upgraded UI to professional "Digital Identity Onboarding" standard
 */

import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Loader2, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  Layers, 
  DoorOpen, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Smartphone, 
  Info,
  CheckCircle2,
  Zap,
  Globe,
  PlusCircle,
  Hash
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from 'react-hot-toast';
import { useOwnerHostels, useAddStudent } from "../../hooks/useQueries";

const AddStudent = () => {
  const navigate = useNavigate();

  // Queries
  const { data: hostelsData, isLoading: loadingHostels } = useOwnerHostels();
  const hostels = hostelsData?.hostels || [];
  const addStudentMutation = useAddStudent();

  // Form State
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    hostel: "",
    floor: "",
    room: "",
  });

  // Sync default hostel
  useMemo(() => {
    if (hostels.length > 0 && !formData.hostel) {
      setFormData(prev => ({ ...prev, hostel: hostels[0]._id }));
    }
  }, [hostels, formData.hostel]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email || !formData.hostel || !formData.room) {
      return toast.error("Critical fields missing from enrollment profile");
    }

    const toastId = toast.loading("Enrolling student...");
    try {
      const result = await addStudentMutation.mutateAsync(formData);
      if (result?.accountCreated) {
        toast.success("Student enrolled! A new account was created — they can log in and reset their password.", { id: toastId, duration: 6000 });
      } else {
        toast.success("Student enrolled successfully!", { id: toastId });
      }
      navigate("/owner/my-students");
    } catch (error) {
      toast.error(error.response?.data?.message || "Enrollment failed", { id: toastId });
    }
  };

  if (loadingHostels) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  const steps = [
    { id: 1, label: "Identity", icon: User },
    { id: 2, label: "Allocation", icon: Building2 },
    { id: 3, label: "Verification", icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-12 pb-32">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
           <div className="space-y-2">
              <button 
                onClick={() => navigate(-1)}
                className="text-xs font-bold text-blue-600 flex items-center gap-2 hover:translate-x-[-4px] transition-transform"
              >
                <ArrowLeft size={16} /> Back to Students
              </button>
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white">
                 Add New Student
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm flex items-center gap-2">
                 <User size={16} className="text-blue-600" /> Enroll a new resident to your property
              </p>
           </div>

           {/* Progress Tracker */}
           <div className="flex items-center gap-4 bg-white dark:bg-slate-900 px-6 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              {steps.map((s, i) => (
                <div key={s.id} className="flex items-center gap-3">
                   <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs transition-all ${step >= s.id ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                      {step > s.id ? <CheckCircle2 size={16} /> : s.id}
                   </div>
                   {i < steps.length - 1 && <div className={`w-4 h-[1px] ${step > s.id ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-800'}`} />}
                </div>
              ))}
           </div>
        </div>

        {/* Wizard Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/[0.03] blur-[100px] pointer-events-none" />
           
           <form onSubmit={handleSubmit} className="p-10 lg:p-16">
              
              <AnimatePresence mode="wait">
                 {step === 1 && (
                    <motion.div 
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-10"
                    >
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-2">
                             <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">
                                Full Name
                             </label>
                             <div className="relative group">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"><User size={18} /></div>
                                <input 
                                  name="name" 
                                  value={formData.name} 
                                  onChange={handleChange} 
                                  placeholder="Enter student name" 
                                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:border-blue-600 rounded-xl pl-12 pr-5 py-4 font-semibold text-sm outline-none transition-all"
                                  required 
                                />
                             </div>
                          </div>
                          <div className="space-y-2">
                             <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">
                                Phone Number
                             </label>
                             <div className="relative group">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"><Phone size={18} /></div>
                                <input 
                                  name="phone" 
                                  value={formData.phone} 
                                  onChange={handleChange} 
                                  placeholder="Enter mobile number" 
                                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:border-blue-600 rounded-xl pl-12 pr-5 py-4 font-semibold text-sm outline-none transition-all"
                                  required 
                                />
                             </div>
                          </div>
                       </div>

                       <div className="p-5 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800 flex items-start gap-3 mb-2">
                          <Info className="text-blue-500 shrink-0 mt-0.5" size={16} />
                          <p className="text-[11px] font-medium text-blue-700 dark:text-blue-400 leading-relaxed">
                             Enter the student's email. If they have an existing account it will be linked. For walk-in students, a new account is auto-created — they can log in and reset their password later.
                          </p>
                       </div>

                       <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">
                             Email Address <span className="text-red-500">*</span>
                          </label>
                          <div className="relative group">
                             <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"><Mail size={18} /></div>
                             <input 
                               name="email" 
                               value={formData.email} 
                               onChange={handleChange} 
                               placeholder="student@email.com" 
                               required
                               className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:border-blue-600 rounded-xl pl-12 pr-5 py-4 font-semibold text-sm outline-none transition-all"
                             />
                          </div>
                       </div>

                       <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">
                             Current Address
                          </label>
                          <div className="relative group">
                             <textarea 
                               name="address" 
                               value={formData.address} 
                               onChange={handleChange} 
                               placeholder="Enter full address" 
                               rows="3"
                               className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:border-blue-600 rounded-xl px-5 py-4 font-semibold text-sm outline-none transition-all resize-none"
                             />
                          </div>
                       </div>

                       <div className="pt-6">
                          <button 
                            type="button" 
                            disabled={!formData.name || !formData.phone || !formData.email}
                            onClick={() => setStep(2)}
                            className="w-full py-4 bg-slate-900 dark:bg-blue-600 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-800 dark:hover:bg-blue-700 transition-all disabled:opacity-50"
                          >
                             Continue to Room Allocation <ArrowRight size={18} />
                          </button>
                       </div>
                    </motion.div>
                 )}

                 {step === 2 && (
                    <motion.div 
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-10"
                    >
                       <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800 flex items-center gap-6">
                          <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-sm"><Building2 size={24} /></div>
                          <div className="flex-1">
                             <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">Room Allocation</h4>
                             <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Please select the hostel and room details for this resident.</p>
                          </div>
                       </div>

                       <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">
                             Selected Hostel
                          </label>
                          <div className="relative group">
                             <select 
                               name="hostel" 
                               value={formData.hostel} 
                               onChange={handleChange} 
                               className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:border-blue-600 rounded-xl px-5 py-4 font-semibold text-sm outline-none transition-all appearance-none cursor-pointer"
                             >
                                {hostels.map(h => <option key={h._id} value={h._id}>{h.name}</option>)}
                             </select>
                             <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs font-bold">CHANGE</div>
                          </div>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-2">
                             <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">
                                Floor Number
                             </label>
                             <div className="relative group">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"><Hash size={18} /></div>
                                <input 
                                  type="number" 
                                  name="floor" 
                                  value={formData.floor} 
                                  onChange={handleChange} 
                                  placeholder="Floor" 
                                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:border-blue-600 rounded-xl pl-12 pr-5 py-4 font-semibold text-sm outline-none transition-all"
                                  required 
                                />
                             </div>
                          </div>
                          <div className="space-y-2">
                             <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">
                                Room Number
                             </label>
                             <div className="relative group">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"><Hash size={18} /></div>
                                <input 
                                  type="text" 
                                  name="room" 
                                  value={formData.room} 
                                  onChange={handleChange} 
                                  placeholder="Room" 
                                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:border-blue-600 rounded-xl pl-12 pr-5 py-4 font-semibold text-sm outline-none transition-all"
                                  required 
                                />
                             </div>
                          </div>
                       </div>

                       <div className="pt-6 flex flex-col md:flex-row gap-4">
                          <button 
                            type="button" 
                            onClick={() => setStep(1)}
                            className="flex-1 py-4 bg-white dark:bg-slate-800 text-slate-600 dark:text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-50"
                          >
                             <ArrowLeft size={16} /> Identity Info
                          </button>
                          <button 
                            type="button" 
                            onClick={() => setStep(3)}
                            disabled={!formData.hostel || !formData.room}
                            className="flex-[2] py-4 bg-slate-900 dark:bg-blue-600 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-800 dark:hover:bg-blue-700 transition-all disabled:opacity-50"
                          >
                             Review & Verify <ArrowRight size={18} />
                          </button>
                       </div>
                    </motion.div>
                 )}

                 {step === 3 && (
                    <motion.div 
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-10"
                    >
                       <div className="bg-slate-900 dark:bg-slate-800 text-white p-8 lg:p-10 rounded-2xl relative overflow-hidden shadow-lg">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-8 flex items-center gap-2"><ShieldCheck size={16} /> Enrollment Summary</h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                             <div className="space-y-6">
                                <div>
                                   <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Student Name</p>
                                   <p className="text-xl font-bold">{formData.name}</p>
                                </div>
                                <div>
                                   <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Phone Number</p>
                                   <p className="text-lg font-bold text-blue-400">{formData.phone}</p>
                                </div>
                             </div>
                             <div className="space-y-6">
                                <div>
                                   <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Assigned Hostel</p>
                                   <p className="text-sm font-bold">{hostels.find(h => h._id === formData.hostel)?.name}</p>
                                </div>
                                <div>
                                   <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Room Allocation</p>
                                   <p className="text-xl font-bold text-emerald-400">Room {formData.room} (Floor {formData.floor})</p>
                                </div>
                             </div>
                          </div>
                       </div>

                       <div className="p-6 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start gap-4">
                          <Info className="text-blue-500 shrink-0 mt-1" size={18} />
                          <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider leading-relaxed">By enrolling this student, you confirm that the provided details are correct and the room is ready for occupancy.</p>
                       </div>

                       <div className="pt-6 flex flex-col md:flex-row gap-4">
                          <button 
                            type="button" 
                            onClick={() => setStep(2)}
                            className="flex-1 py-4 bg-white dark:bg-slate-800 text-slate-600 dark:text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-50"
                          >
                             <ArrowLeft size={16} /> Room Allocation
                          </button>
                          <button 
                            type="submit" 
                            disabled={addStudentMutation.isPending}
                            className="flex-[2] py-4 bg-blue-600 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-sm disabled:opacity-50"
                          >
                             {addStudentMutation.isPending ? <Loader2 className="animate-spin" /> : <ShieldCheck size={18} />}
                             Complete Enrollment
                          </button>
                       </div>
                    </motion.div>
                 )}
              </AnimatePresence>

           </form>
        </div>

      </div>
    </div>
  );
};

export default AddStudent;
