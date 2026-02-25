/**
 * SettingsPage.jsx - Premium Identity & Security Command Center
 * 
 * Migration Status:
 * - Migrated to React Query (useUserProfile, useUpdateProfile, usePayoutMethods + Payout Mutations)
 * - Removed manual fetch and state synchronization for profile and payout data
 * - Upgraded UI to professional "Identity Matrix" with high-contrast tabbed navigation
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Lock, 
  MapPin, 
  CreditCard, 
  Plus, 
  Trash2, 
  Loader2, 
  Camera, 
  ChevronRight,
  ShieldCheck,
  Building2,
  Phone,
  Mail,
  CheckCircle2,
  AlertTriangle,
  Info,
  Banknote,
  Smartphone,
  Check,
  X,
  Eye,
  EyeOff
} from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "../../apiConfig";
import { 
  useUserProfile, 
  useUpdateProfile, 
  usePayoutMethods, 
  useAddPayoutMethod, 
  useDeletePayoutMethod, 
  useSetDefaultPayoutMethod 
} from "../../hooks/useQueries";

const SettingsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("personal");

  // Queries
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const { data: payoutData, isLoading: payoutLoading } = usePayoutMethods();
  const payoutMethods = payoutData?.methods || [];

  // Mutations
  const updateProfile = useUpdateProfile();
  const addPayout = useAddPayoutMethod();
  const deletePayout = useDeletePayoutMethod();
  const setDefaultPayout = useSetDefaultPayoutMethod();

  // Local Form States
  const [personalForm, setPersonalForm] = useState({ name: "", username: "", phoneNumber: "" });
  const [locationForm, setLocationForm] = useState({ address: "" });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [newPayoutForm, setNewPayoutForm] = useState({ type: "BANK_TRANSFER", details: { accountNumber: "", ifscCode: "", bankName: "", accountHolderName: "", upiId: "" }, isDefault: false });
  
  const [profilePreview, setProfilePreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  // Sync profile data to local forms on load
  useEffect(() => {
    if (profile) {
      setPersonalForm({
        name: profile.name || "",
        username: profile.username || "",
        phoneNumber: profile.phoneNumber || "",
      });
      setLocationForm({ address: profile.address || "" });
      setProfilePreview(profile.profilePictureUrl || "");
    }
  }, [profile]);

  // Handlers
  const handleProfileImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const toastId = toast.loading("Uploading Identity Key...");
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || "connecting_hostels");
      
      const res = await api.post(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );
      
      const newUrl = res.data.secure_url;
      await updateProfile.mutateAsync({ profilePictureUrl: newUrl });
      setProfilePreview(newUrl);
      toast.success("Identity Key Synchronized", { id: toastId });
    } catch (err) {
      toast.error("Handshake Protocol Failed", { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  const handleUpdatePersonal = async (e) => {
    e.preventDefault();
    try {
      await updateProfile.mutateAsync(personalForm);
      toast.success("Identity Matrix Updated");
    } catch (err) {
      toast.error("Authorization Sync Failed");
    }
  };

  const handleUpdateLocation = async (e) => {
    e.preventDefault();
    try {
      await updateProfile.mutateAsync(locationForm);
      toast.success("Geospatial Coordinates Secured");
    } catch (err) {
      toast.error("Location Mapping Failed");
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return toast.error("Password Parity Mismatch");
    }
    try {
      await updateProfile.mutateAsync({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      toast.success("Encryption Key Rotated");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Rotation Protocol Failed");
    }
  };

  const handleAddPayout = async (e) => {
    e.preventDefault();
    try {
      await addPayout.mutateAsync(newPayoutForm);
      toast.success("Financial Channel Integrated");
      setNewPayoutForm({ type: "BANK_TRANSFER", details: { accountNumber: "", ifscCode: "", bankName: "", accountHolderName: "", upiId: "" }, isDefault: false });
    } catch (err) {
      toast.error("Bridge Connection Terminated");
    }
  };

  const isMutating = updateProfile.isPending || addPayout.isPending || deletePayout.isPending || setDefaultPayout.isPending || uploading;

  if (profileLoading) {
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
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 mb-12">
           <div className="space-y-2">
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white">
                 System Identity
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm flex items-center gap-2">
                 <ShieldCheck size={16} className="text-blue-500" /> Administrative protocol & access config
              </p>
           </div>

             <div className="bg-white dark:bg-slate-900 rounded-2xl p-2 flex gap-1 border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto scrollbar-hide">
                {[
                   { id: "personal", icon: User, label: "Identity" },
                   { id: "location", icon: MapPin, label: "Geospatial" },
                   { id: "payments", icon: CreditCard, label: "Finance" },
                   { id: "security", icon: Lock, label: "Encryption" }
                ].map(tab => (
                   <button
                     key={tab.id}
                     onClick={() => setActiveTab(tab.id)}
                     className={`px-6 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                       activeTab === tab.id 
                       ? "bg-slate-900 dark:bg-blue-600 text-white shadow-sm" 
                       : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                     }`}
                   >
                     <tab.icon size={14} /> {tab.label}
                   </button>
                ))}
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
             
             {/* Left Column - Contextual Profile & Info */}
             <div className="lg:col-span-4 space-y-8">
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                   <div className="relative inline-block group mx-auto mb-8">
                      <div className="w-32 h-32 lg:w-40 lg:h-40 bg-slate-100 dark:bg-slate-800 rounded-3xl overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl relative">
                         {profilePreview ? (
                            <img src={profilePreview} alt="profile" className="w-full h-full object-cover" />
                         ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300"><User size={48} /></div>
                         )}
                         {uploading && (
                            <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center backdrop-blur-sm">
                               <Loader2 className="text-white animate-spin" size={32} />
                            </div>
                         )}
                      </div>
                      <label className="absolute bottom-2 right-2 p-3 bg-blue-600 text-white rounded-xl cursor-pointer hover:scale-110 active:scale-95 transition-all shadow-lg">
                         <Camera size={18} />
                         <input type="file" className="hidden" onChange={handleProfileImageChange} disabled={isMutating} />
                      </label>
                   </div>
                   
                   <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{profile.name}</h3>
                   <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-8 border border-slate-100 dark:border-slate-700">
                      <ShieldCheck size={12} className="text-blue-500" /> Verified Property Owner
                   </div>

                   <div className="space-y-4 text-left">
                      <div className="flex items-center gap-4 text-slate-500">
                         <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-700"><Mail size={16} /></div>
                         <div className="overflow-hidden">
                            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Master Endpoint</p>
                            <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{profile.email}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-4 text-slate-500">
                         <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-700"><Phone size={16} /></div>
                         <div>
                            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Communication Link</p>
                            <p className="text-xs font-semibold text-slate-900 dark:text-white">{profile.phoneNumber || 'Not Linked'}</p>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="bg-slate-900 dark:bg-blue-600 rounded-3xl p-8 text-white shadow-sm relative overflow-hidden group border border-slate-800">
                   <div className="absolute right-[-5%] top-[-5%] opacity-10 group-hover:scale-110 transition-transform duration-1000 rotate-12">
                      <ShieldCheck size={160} />
                   </div>
                   <div className="relative z-10">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider mb-4 opacity-60">Identity Status</h4>
                      <p className="text-lg font-bold leading-tight mb-4">Your administrative credentials are fully encrypted.</p>
                      <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider bg-white/10 px-5 py-2.5 rounded-lg hover:bg-white/20 transition-all backdrop-blur-md border border-white/10">
                         Security Audit <ChevronRight size={14} />
                      </button>
                   </div>
                </div>
             </div>

             {/* Right Column - Form Area */}
             <div className="lg:col-span-8">
                <AnimatePresence mode="wait">
                    {activeTab === 'personal' && (
                       <motion.form 
                         key="personal"
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         exit={{ opacity: 0, y: -10 }}
                         onSubmit={handleUpdatePersonal}
                         className="space-y-8"
                       >
                          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Identity Configuration</h2>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">Legal Identity</label>
                                <input 
                                  type="text" 
                                  value={personalForm.name}
                                  onChange={e => setPersonalForm({...personalForm, name: e.target.value})}
                                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-blue-600 rounded-xl px-6 py-4 font-semibold text-sm text-slate-900 dark:text-white outline-none shadow-sm transition-all"
                                />
                             </div>
                             <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">Administrative Alias</label>
                                <input 
                                  type="text" 
                                  value={personalForm.username}
                                  onChange={e => setPersonalForm({...personalForm, username: e.target.value})}
                                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-blue-600 rounded-xl px-6 py-4 font-semibold text-sm text-slate-900 dark:text-white outline-none shadow-sm transition-all"
                                />
                             </div>
                             <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">Primary Contact Protocol</label>
                                <input 
                                  type="tel" 
                                  value={personalForm.phoneNumber}
                                  onChange={e => setPersonalForm({...personalForm, phoneNumber: e.target.value})}
                                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-blue-600 rounded-xl px-6 py-4 font-semibold text-sm text-slate-900 dark:text-white outline-none shadow-sm transition-all"
                                />
                             </div>
                          </div>
                          
                          <button 
                           disabled={isMutating}
                           className="px-10 py-4 bg-slate-900 dark:bg-blue-600 text-white rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-slate-800 dark:hover:bg-blue-700 active:scale-95 transition-all shadow-sm flex items-center justify-center gap-2"
                          >
                             {isMutating ? <Loader2 className="animate-spin" size={16} /> : <><CheckCircle2 size={16} /> Secure Metadata</>}
                          </button>
                       </motion.form>
                    )}

                    {activeTab === 'location' && (
                       <motion.form 
                         key="location"
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         exit={{ opacity: 0, y: -10 }}
                         onSubmit={handleUpdateLocation}
                         className="space-y-8"
                       >
                          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Geospatial Mapping</h2>
                          
                          <div className="space-y-2">
                             <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">Primary Operational Base</label>
                             <textarea 
                               rows="4"
                               value={locationForm.address}
                               onChange={e => setLocationForm({...locationForm, address: e.target.value})}
                               className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-blue-600 rounded-2xl px-6 py-5 font-semibold text-sm text-slate-900 dark:text-white outline-none shadow-sm transition-all resize-none"
                               placeholder="Enter full administrative address..."
                             />
                          </div>
                          
                          <button 
                           disabled={isMutating}
                           className="px-10 py-4 bg-slate-900 dark:bg-blue-600 text-white rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-slate-800 dark:hover:bg-blue-700 active:scale-95 transition-all shadow-sm flex items-center justify-center gap-2"
                          >
                             {isMutating ? <Loader2 className="animate-spin" size={16} /> : <><MapPin size={16} /> Update Coordinates</>}
                          </button>
                       </motion.form>
                    )}

                    {activeTab === 'payments' && (
                       <motion.div 
                         key="payments"
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         exit={{ opacity: 0, y: -10 }}
                         className="space-y-12"
                       >
                          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Finance Integrations</h2>
                          
                          {/* Existing Methods */}
                          <div className="space-y-6">
                             <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">Active Financial Channels</h3>
                             {payoutLoading ? (
                                <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-blue-500" /></div>
                             ) : payoutMethods.length === 0 ? (
                                <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                                   <AlertTriangle className="mx-auto text-amber-500 mb-4" />
                                   <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">No Payout Channels Synced</p>
                                </div>
                             ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                   {payoutMethods.map(method => (
                                      <div key={method._id} className="group bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative">
                                         <div className="flex items-center gap-4 mb-6">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${method.isDefault ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 border border-slate-100 dark:border-slate-700'}`}>
                                               {method.type === 'BANK_TRANSFER' ? <Banknote size={18} /> : <Smartphone size={18} />}
                                            </div>
                                            <div>
                                               <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-tight">{method.type.replace('_', ' ')}</h4>
                                               <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{method.isDefault ? 'Primary Terminal' : 'Backup Channel'}</p>
                                            </div>
                                         </div>
                                         
                                         <div className="space-y-1 mb-6">
                                            {method.type === 'BANK_TRANSFER' ? (
                                               <>
                                                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{method.details.bankName}</p>
                                                  <p className="text-[9px] font-medium text-slate-400 uppercase tracking-wider">Acct ending in {method.details.accountNumber.slice(-4)}</p>
                                               </>
                                            ) : (
                                               <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{method.details.upiId}</p>
                                            )}
                                         </div>

                                         <div className="flex gap-2">
                                            {!method.isDefault && (
                                               <button 
                                                 onClick={() => setDefaultPayout.mutate(method._id)}
                                                 className="flex-1 py-2 px-3 bg-slate-50 dark:bg-slate-800 text-slate-500 text-[9px] font-bold uppercase tracking-wider rounded-lg hover:bg-slate-900 dark:hover:bg-blue-600 hover:text-white transition-all border border-slate-100 dark:border-slate-700"
                                               >
                                                  Set Primary
                                               </button>
                                            )}
                                            <button 
                                              onClick={() => deletePayout.mutate(method._id)}
                                              className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-rose-600 border border-slate-100 dark:border-slate-700 rounded-lg transition-all"
                                            >
                                               <Trash2 size={16} />
                                            </button>
                                         </div>
                                      </div>
                                   ))}
                                </div>
                             )}
                          </div>

                          {/* Add New */}
                          <div className="space-y-6">
                             <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">Integrate New Channel</h3>
                             <div className="bg-slate-900 rounded-3xl p-10 lg:p-12 shadow-sm relative overflow-hidden border border-slate-800">
                                <div className="flex gap-3 mb-8">
                                   {['BANK_TRANSFER', 'UPI'].map(type => (
                                      <button 
                                       key={type}
                                       onClick={() => setNewPayoutForm({...newPayoutForm, type})}
                                       className={`px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border ${
                                         newPayoutForm.type === type 
                                         ? "bg-white text-slate-900 border-white shadow-sm" 
                                         : "bg-white/5 text-white/40 border-white/5 hover:border-white/20"
                                       }`}
                                      >
                                         {type.replace('_', ' ')}
                                      </button>
                                   ))}
                                </div>

                                <form onSubmit={handleAddPayout} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                   {newPayoutForm.type === 'BANK_TRANSFER' ? (
                                      <>
                                         <div className="space-y-2">
                                            <label className="text-[9px] font-bold uppercase tracking-wider text-white/30 ml-1">Institution Name</label>
                                            <input 
                                              type="text" 
                                              placeholder="HDFC, SBI, etc."
                                              value={newPayoutForm.details.bankName}
                                              onChange={e => setNewPayoutForm({...newPayoutForm, details: {...newPayoutForm.details, bankName: e.target.value}})}
                                              className="w-full bg-white/10 border border-transparent focus:border-white/20 rounded-xl px-5 py-3.5 font-bold text-white outline-none placeholder:text-white/20 backdrop-blur-sm"
                                            />
                                         </div>
                                         <div className="space-y-2">
                                            <label className="text-[9px] font-bold uppercase tracking-wider text-white/30 ml-1">Account Sequence</label>
                                            <input 
                                              type="text" 
                                              placeholder="00000000000"
                                              value={newPayoutForm.details.accountNumber}
                                              onChange={e => setNewPayoutForm({...newPayoutForm, details: {...newPayoutForm.details, accountNumber: e.target.value}})}
                                              className="w-full bg-white/10 border border-transparent focus:border-white/20 rounded-xl px-5 py-3.5 font-bold text-white outline-none placeholder:text-white/20 backdrop-blur-sm"
                                            />
                                         </div>
                                         <div className="space-y-2">
                                            <label className="text-[9px] font-bold uppercase tracking-wider text-white/30 ml-1">Network Code (IFSC)</label>
                                            <input 
                                              type="text" 
                                              placeholder="HDFC0001234"
                                              value={newPayoutForm.details.ifscCode}
                                              onChange={e => setNewPayoutForm({...newPayoutForm, details: {...newPayoutForm.details, ifscCode: e.target.value}})}
                                              className="w-full bg-white/10 border border-transparent focus:border-white/20 rounded-xl px-5 py-3.5 font-bold text-white outline-none placeholder:text-white/20 backdrop-blur-sm"
                                            />
                                         </div>
                                         <div className="space-y-2">
                                            <label className="text-[9px] font-bold uppercase tracking-wider text-white/30 ml-1">Identity Holder</label>
                                            <input 
                                              type="text" 
                                              placeholder="Legal Name on Account"
                                              value={newPayoutForm.details.accountHolderName}
                                              onChange={e => setNewPayoutForm({...newPayoutForm, details: {...newPayoutForm.details, accountHolderName: e.target.value}})}
                                              className="w-full bg-white/10 border border-transparent focus:border-white/20 rounded-xl px-5 py-3.5 font-bold text-white outline-none placeholder:text-white/20 backdrop-blur-sm"
                                            />
                                         </div>
                                      </>
                                   ) : (
                                      <div className="md:col-span-2 space-y-2">
                                         <label className="text-[9px] font-bold uppercase tracking-wider text-white/30 ml-1">Virtual Payment Address (UPI)</label>
                                         <input 
                                           type="text" 
                                           placeholder="user@upi-provider"
                                           value={newPayoutForm.details.upiId}
                                           onChange={e => setNewPayoutForm({...newPayoutForm, details: {...newPayoutForm.details, upiId: e.target.value}})}
                                           className="w-full bg-white/10 border border-transparent focus:border-white/20 rounded-xl px-5 py-3.5 font-bold text-white outline-none placeholder:text-white/20 backdrop-blur-sm"
                                         />
                                      </div>
                                   )}
                                </form>
                                
                                <button 
                                 onClick={handleAddPayout}
                                 disabled={isMutating}
                                 className="w-full py-4 bg-white text-slate-900 rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-slate-50 active:scale-95 transition-all shadow-sm flex items-center justify-center gap-2"
                                >
                                   {isMutating ? <Loader2 className="animate-spin" size={16} /> : <><Plus size={16} /> Secure Channel</>}
                                </button>
                             </div>
                          </div>
                       </motion.div>
                    )}

                    {activeTab === 'security' && (
                       <motion.form 
                         key="security"
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         exit={{ opacity: 0, y: -10 }}
                         onSubmit={handleUpdatePassword}
                         className="space-y-8"
                       >
                          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Encryption Rotation</h2>
                          
                          <div className="space-y-6">
                             <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">Current Access Key</label>
                                <div className="relative">
                                   <input 
                                     type={showPass ? "text" : "password"} 
                                     value={passwordForm.currentPassword}
                                     onChange={e => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                                     className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-blue-600 rounded-xl px-6 py-4 font-semibold text-sm text-slate-900 dark:text-white outline-none shadow-sm transition-all"
                                   />
                                   <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400">{showPass ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                                </div>
                             </div>
                             
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                   <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">New Encryption Seq</label>
                                   <input 
                                     type="password" 
                                     value={passwordForm.newPassword}
                                     onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                                     className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-blue-600 rounded-xl px-6 py-4 font-semibold text-sm text-slate-900 dark:text-white outline-none shadow-sm transition-all"
                                   />
                                </div>
                                <div className="space-y-2">
                                   <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">Confirm Rotation</label>
                                   <input 
                                     type="password" 
                                     value={passwordForm.confirmPassword}
                                     onChange={e => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                                     className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-blue-600 rounded-xl px-6 py-4 font-semibold text-sm text-slate-900 dark:text-white outline-none shadow-sm transition-all"
                                   />
                                </div>
                             </div>
                          </div>
                          
                          <div className="p-6 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-900/20 flex gap-4">
                             <AlertTriangle size={20} className="text-amber-500 shrink-0 mt-0.5" />
                             <div className="space-y-1">
                                <h5 className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Pre-Rotation Briefing</h5>
                                <p className="text-[10px] text-amber-700/70 dark:text-amber-500/70 font-medium leading-relaxed">Identity rotation will terminate all active administrative sessions across auxiliary terminals. Ensure new credentials are recorded in secondary secure storage.</p>
                             </div>
                          </div>
                          
                          <button 
                           disabled={isMutating}
                           className="px-10 py-4 bg-slate-900 dark:bg-blue-600 text-white rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-slate-800 dark:hover:bg-blue-700 active:scale-95 transition-all shadow-sm flex items-center justify-center gap-2"
                          >
                             {isMutating ? <Loader2 className="animate-spin" size={16} /> : <><Lock size={16} /> Rotate Access Protocol</>}
                          </button>
                       </motion.form>
                    )}
                </AnimatePresence>
             </div>
          </div>

       </div>
    </div>
  );
};

export default SettingsPage;
