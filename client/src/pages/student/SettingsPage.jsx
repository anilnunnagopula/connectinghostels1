/**
 * SettingsPage.jsx - Student Profile & Settings Management
 *
 * Migration Status:
 * - Migrated to React Query (useUserProfile, useUpdateProfile)
 * - Removed manual fetch and status logic
 * - Integrated with auth service via useUserProfile
 * - Enhanced UI for a high-contrast, professional account management experience
 * - Simplified Cloudinary integration
 */

import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../apiConfig";
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  User,
  Lock,
  Camera,
  Loader2,
  AlertCircle,
  Mail,
  Phone,
  CheckCircle,
  ChevronRight,
  ShieldCheck,
  Smartphone,
  CreditCard,
  LogOut,
  Save,
} from "lucide-react";
import { useUserProfile, useUpdateProfile } from "../../hooks/useQueries";

const CLOUDINARY_CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;
const MAX_FILE_SIZE_MB = 2;

const TABS = {
  PERSONAL: "personal",
  SECURITY: "security",
  PREFERENCES: "preferences"
};

const SettingsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(TABS.PERSONAL);

  // Queries
  const { data: user, isLoading: loadingProfile } = useUserProfile();
  const updateMutation = useUpdateProfile();

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phoneNumber: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  const [profilePreview, setProfilePreview] = useState("");
  const [profileFile, setProfileFile] = useState(null);

  // Sync form with user data
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || "",
        username: user.username || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || ""
      }));
      setProfilePreview(user.profilePictureUrl || "");
    }
  }, [user]);

  // ==========================================================================
  // HANDLERS
  // ==========================================================================

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      toast.error("Image too large (max 2MB)");
      return;
    }
    setProfileFile(file);
    setProfilePreview(URL.createObjectURL(file));
  };

  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    const res = await api.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      data
    );
    return res.data.secure_url;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      let profileUrl = profilePreview;
      
      if (profileFile) {
        toast.loading("Uploading image...", { id: "upload" });
        profileUrl = await uploadToCloudinary(profileFile);
        toast.dismiss("upload");
      }

      const payload = {
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        profilePictureUrl: profileUrl,
      };

      if (activeTab === TABS.SECURITY && formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          toast.error("Passwords do not match");
          return;
        }
        payload.currentPassword = formData.currentPassword;
        payload.newPassword = formData.newPassword;
      }

      await updateMutation.mutateAsync(payload);
      toast.success("Settings updated successfully");
      
      // Clear security fields
      setFormData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));
      setProfileFile(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
      toast.dismiss("upload");
    }
  };

  // ==========================================================================
  // RENDER HELPERS
  // ==========================================================================

  if (loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  const tabClass = (tab) => `
    flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all
    ${activeTab === tab 
      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl shadow-slate-200 dark:shadow-none translate-x-2 italic' 
      : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'}
  `;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 sm:p-6 lg:p-12 pb-24">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12">
        
        {/* Sidebar Nav */}
        <div className="lg:w-80 flex flex-col gap-2">
           <div className="mb-8">
              <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest mb-4 transition hover:translate-x-[-4px]"><ArrowLeft size={16} />Back</button>
              <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-900 dark:text-white italic">Settings</h1>
           </div>

           <button onClick={() => setActiveTab(TABS.PERSONAL)} className={tabClass(TABS.PERSONAL)}><User size={18} /> Profile Details</button>
           <button onClick={() => setActiveTab(TABS.SECURITY)} className={tabClass(TABS.SECURITY)}><Lock size={18} /> Password & Security</button>
           <button disabled className="flex items-center gap-3 px-6 py-4 text-slate-200 cursor-not-allowed font-black text-xs uppercase tracking-widest italic"><Smartphone size={18} /> App Sync (BETA)</button>
           <button disabled className="flex items-center gap-3 px-6 py-4 text-slate-200 cursor-not-allowed font-black text-xs uppercase tracking-widest italic"><CreditCard size={18} /> Billing History</button>
           
           <div className="mt-auto pt-10">
              <button 
                onClick={() => {
                  localStorage.clear();
                  navigate("/login");
                }}
                className="flex items-center gap-3 px-6 py-4 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 rounded-2xl font-black text-xs uppercase tracking-widest transition-colors"
              >
                <LogOut size={18} /> Terminate Session
              </button>
           </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <form onSubmit={handleSave} className="bg-white dark:bg-slate-800 p-8 lg:p-12 rounded-[3rem] shadow-2xl shadow-blue-900/5 border border-slate-100 dark:border-slate-700/50">
            
            {activeTab === TABS.PERSONAL && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col sm:flex-row items-center gap-8 mb-10 pb-10 border-b border-slate-50 dark:border-slate-700/50">
                   <div className="relative group">
                      <div className="w-32 h-32 rounded-[2.5rem] bg-slate-100 dark:bg-slate-900 overflow-hidden border-4 border-white dark:border-slate-700 shadow-xl group-hover:scale-105 transition-transform duration-500">
                        {profilePreview ? (
                          <img src={profilePreview} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-600 font-black text-4xl">{formData.name?.charAt(0)}</div>
                        )}
                      </div>
                      <label className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-3 rounded-2xl shadow-lg cursor-pointer hover:scale-110 active:scale-90 transition-all">
                        <Camera size={20} />
                        <input type="file" onChange={handleFileChange} className="hidden" accept="image/*" />
                      </label>
                   </div>
                   <div className="text-center sm:text-left">
                      <h2 className="text-2xl font-black uppercase tracking-tight italic mb-1">{formData.username || "Resident"}</h2>
                      <p className="text-slate-400 font-bold text-xs uppercase tracking-widest flex items-center gap-2 justify-center sm:justify-start"><ShieldCheck size={14} className="text-blue-500" /> Verified Authority Player</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Legal Name</label>
                    <div className="relative">
                      <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-blue-500 rounded-2xl pl-14 pr-6 py-4 font-bold text-sm transition-all focus:outline-none placeholder:text-slate-300" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Verified Email</label>
                    <div className="relative">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-200" size={18} />
                      <input value={formData.email} disabled className="w-full bg-slate-100 dark:bg-slate-800/50 border-2 border-transparent rounded-2xl pl-14 pr-6 py-4 font-bold text-sm text-slate-400 cursor-not-allowed" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Contact Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-blue-500 rounded-2xl pl-14 pr-6 py-4 font-bold text-sm transition-all focus:outline-none placeholder:text-slate-300" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === TABS.SECURITY && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-10 flex items-center gap-4 p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
                   <div className="p-3 bg-blue-500 text-white rounded-2xl"><ShieldCheck size={24} /></div>
                   <div>
                      <p className="font-black text-xs uppercase tracking-widest">Protection Matrix</p>
                      <p className="text-[10px] font-bold text-slate-400">Update your credentials to maintain sanctuary integrity.</p>
                   </div>
                </div>

                <div className="space-y-6 max-w-md">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Current Password</label>
                    <input type="password" name="currentPassword" value={formData.currentPassword} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-blue-500 rounded-2xl px-6 py-4 font-bold text-sm transition-all focus:outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">New Password (6+ characters)</label>
                    <input type="password" name="newPassword" value={formData.newPassword} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-blue-500 rounded-2xl px-6 py-4 font-bold text-sm transition-all focus:outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Confirm New Phase</label>
                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-blue-500 rounded-2xl px-6 py-4 font-bold text-sm transition-all focus:outline-none" />
                  </div>
                </div>
              </div>
            )}

            <div className="mt-12 pt-10 border-t border-slate-50 dark:border-slate-700/50 flex flex-col sm:flex-row items-center justify-between gap-6">
               <p className="text-[10px] font-black text-slate-300 uppercase italic tracking-tighter">Connecting Hostels © Protocol 2.5</p>
               <button type="submit" disabled={updateMutation.isPending} className="bg-slate-900 dark:bg-blue-600 text-white px-10 py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-xs shadow-2xl shadow-slate-200 dark:shadow-none hover:translate-y-[-2px] active:scale-95 transition-all flex items-center gap-3 italic">
                 {updateMutation.isPending ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                 {updateMutation.isPending ? "Syncing Logic..." : "Synchronize Data"}
               </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default SettingsPage;
