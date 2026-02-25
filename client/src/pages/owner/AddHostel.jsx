/**
 * AddHostel.jsx - Premium Property Enrollment & Edit Wizard
 * 
 * Migration Status:
 * - Migrated to React Query (useAddHostel, useUpdateHostel, useOwnerHostelDetail)
 * - Refined multi-step intelligence with AI-assisted copywriting
 * - Added support for "Edit Protocol" (pre-filling data if ID is present)
 * - Upgraded UI to professional "Digital Asset Registry" standard
 */

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  Building2, 
  Sparkles, 
  LocateFixed, 
  Upload, 
  X, 
  CheckCircle2, 
  IndianRupee, 
  Bed, 
  Loader2, 
  ChevronRight, 
  ChevronLeft,
  ShieldCheck,
  Video,
  Zap,
  Star,
  MapPin
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useAddHostel, useUpdateHostel, useOwnerHostelDetail } from "../../hooks/useQueries";

const AddHostel = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    rooms: "",
    floors: "",
    facilities: "",
    type: "",
    description: "",
    location: "",
    locality: "",
    pricePerMonth: "",
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [video, setVideo] = useState(null);
  
  const [aiLoading, setAiLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  // Queries & Mutations
  const { data: existingHostel, isLoading: loadingHostel } = useOwnerHostelDetail(id);
  const addHostelMutation = useAddHostel();
  const updateHostelMutation = useUpdateHostel();

  // Pre-fill data if editing
  useEffect(() => {
    if (isEditing && existingHostel) {
      setFormData({
        name: existingHostel.name || "",
        contact: existingHostel.contactNumber || "",
        rooms: existingHostel.totalRooms || "",
        floors: existingHostel.floors || "",
        facilities: existingHostel.amenities || "",
        type: existingHostel.type || "",
        description: existingHostel.description || "",
        location: existingHostel.address || "",
        locality: existingHostel.locality || "",
        pricePerMonth: existingHostel.pricePerMonth || "",
      });
      if (existingHostel.images) {
        setExistingImages(existingHostel.images);
      }
    }
  }, [isEditing, existingHostel]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages([...images, ...files]);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...previews]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const removeExistingImage = (img) => {
    setExistingImages(existingImages.filter(i => i !== img));
  };

  const handleGenerateDescription = async () => {
    if (!formData.name || !formData.category) {
      return toast.error("Provide Basic Identity First");
    }
    setAiLoading(true);
    const toastId = toast.loading("Synthesizing Property Copy...");
    try {
      const prompt = `Generate a cinematic and premium hostel description:
        Name: ${formData.name}
        Facilities: ${formData.facilities || "Comprehensive modern amenities"}
        Category: ${formData.category}
        Locality: ${formData.locality}
        Focus on luxury, security, and academic environment. Keep it under 80 words.`;

      const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
      const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: chatHistory }),
      });

      const result = await res.json();
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        setFormData({ ...formData, description: text.trim() });
        toast.success("Intelligence Synchronized", { id: toastId });
      } else {
        throw new Error();
      }
    } catch (err) {
      toast.error("AI Node Connection Failure", { id: toastId });
    } finally {
      setAiLoading(false);
    }
  };

  const handleUseLocation = () => {
    if (navigator.geolocation) {
      setLocationLoading(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFormData({
            ...formData,
            location: `GPS: ${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`,
          });
          toast.success("Geospatial Lock Confirmed");
          setLocationLoading(false);
        },
        () => {
          toast.error("Locational Handshake Refused");
          setLocationLoading(false);
        }
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0 && existingImages.length === 0) return toast.error("Visual Assets Required");

    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("contactNumber", formData.contact);
    payload.append("totalRooms", formData.rooms);
    payload.append("floors", formData.floors || 1);
    payload.append("amenities", formData.facilities);
    payload.append("type", formData.type);
    payload.append("description", formData.description);
    payload.append("pricePerMonth", formData.pricePerMonth);
    payload.append("address", formData.location);
    payload.append("locality", formData.locality);
    
    // In update, we might need to send list of existing images to keep
    if (isEditing) {
        payload.append("existingImages", JSON.stringify(existingImages));
    }

    images.forEach(img => payload.append("images", img));
    if (video) payload.append("video", video);

    const toastId = toast.loading(isEditing ? "Executing Asset Update..." : "Executing Enrollment Protocol...");
    try {
      if (isEditing) {
          await updateHostelMutation.mutateAsync({ id, formData: payload });
          toast.success("Asset State Synchronized", { id: toastId });
      } else {
          await addHostelMutation.mutateAsync(payload);
          toast.success("Property Registered in Portfolio", { id: toastId });
      }
      navigate("/owner/my-hostels");
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || "Protocol failure", { id: toastId });
    }
  };

  if (isEditing && loadingHostel) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  const steps = [
    { title: "Identity", sub: "Brand & Category", icon: Building2 },
    { title: "Inventory", sub: "Units & Pricing", icon: Bed },
    { title: "Geospatial", sub: "Location & Area", icon: MapPin },
    { title: "Intelligence", sub: "Branding & Copy", icon: Sparkles },
    { title: "Assets", sub: "Visual Evidence", icon: Upload }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-12 pb-32">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
           <div className="space-y-2">
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white">
                 {isEditing ? "Edit Hostel" : "Add New Hostel"}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm flex items-center gap-2">
                 <ShieldCheck size={16} className="text-blue-600" /> 
                 {isEditing ? "Update your property details and assets" : "Register a new property to your portfolio"}
              </p>
           </div>
        </div>

        {/* Wizard Progress */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 mb-10 border border-slate-200 dark:border-slate-800 shadow-sm">
           <div className="flex flex-wrap lg:flex-nowrap items-center justify-between gap-4">
              {steps.map((step, i) => (
                 <div key={i} className="flex-1 min-w-[100px] relative">
                    <div className="flex items-center gap-3">
                       <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                         currentStep > i + 1 
                         ? "bg-emerald-500 text-white shadow-sm" 
                         : currentStep === i + 1 
                         ? "bg-blue-600 text-white shadow-sm" 
                         : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                       }`}>
                          {currentStep > i + 1 ? <CheckCircle2 size={18} /> : i + 1}
                       </div>
                       <div className="hidden lg:block">
                          <p className={`text-[10px] font-bold uppercase tracking-wider leading-none mb-1 ${currentStep === i + 1 ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                             {step.title}
                          </p>
                          <p className="text-[9px] font-medium text-slate-400 uppercase truncate">{step.sub}</p>
                       </div>
                    </div>
                    {i < steps.length - 1 && (
                       <div className="absolute top-5 left-[calc(100%+8px)] w-[calc(100%-48px)] h-[1px] bg-slate-200 dark:bg-slate-800 hidden lg:block">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: currentStep > i + 1 ? "100%" : "0%" }}
                            className="h-full bg-emerald-500"
                          />
                       </div>
                    )}
                 </div>
              ))}
           </div>
        </div>

        {/* Form Body */}
        <div className="mb-12">
           <AnimatePresence mode="wait">
              {currentStep === 1 && (
                 <motion.div 
                  key="step1" 
                  initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                  className="space-y-8"
                 >
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Basic Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Hostel Name</label>
                          <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-blue-600 rounded-xl px-6 py-4 font-semibold text-slate-900 dark:text-white outline-none shadow-sm transition-all" placeholder="Enter hostel name" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Contact Number</label>
                          <input type="tel" name="contact" value={formData.contact} onChange={handleChange} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-blue-600 rounded-xl px-6 py-4 font-semibold text-slate-900 dark:text-white outline-none shadow-sm transition-all" placeholder="Enter mobile number" />
                       </div>
                        <div className="space-y-2">
                           <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Hostel Type</label>
                           <div className="relative">
                              <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-blue-600 rounded-xl px-6 py-4 font-semibold text-slate-900 dark:text-white outline-none shadow-sm transition-all appearance-none cursor-pointer">
                                 <option value="">Select Type</option>
                                 <option value="Boys">Boys Hostel</option>
                                 <option value="Girls">Girls Hostel</option>
                                 <option value="Co-ed">Co-ed (Mixed)</option>
                              </select>
                              <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs font-bold">CHANGE</div>
                           </div>
                        </div>
                    </div>
                 </motion.div>
              )}

              {currentStep === 2 && (
                 <motion.div 
                  key="step2" 
                  initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                  className="space-y-8"
                 >
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Inventory & Pricing</h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                           <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Total Rooms</label>
                           <input type="number" name="rooms" value={formData.rooms} onChange={handleChange} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-blue-600 rounded-xl px-6 py-4 font-semibold text-slate-900 dark:text-white outline-none shadow-sm transition-all" placeholder="0" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Number of Floors</label>
                           <input type="number" name="floors" value={formData.floors} onChange={handleChange} min="1" max="50" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-blue-600 rounded-xl px-6 py-4 font-semibold text-slate-900 dark:text-white outline-none shadow-sm transition-all" placeholder="e.g. 3" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Price Per Month (₹)</label>
                           <input type="number" name="pricePerMonth" value={formData.pricePerMonth} onChange={handleChange} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-blue-600 rounded-xl px-6 py-4 font-semibold text-slate-900 dark:text-white outline-none shadow-sm transition-all" placeholder="8500" />
                        </div>
                       <div className="md:col-span-2 space-y-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Amenities (comma separated)</label>
                          <textarea name="facilities" value={formData.facilities} onChange={handleChange} rows="3" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-blue-600 rounded-xl px-6 py-4 font-semibold text-slate-900 dark:text-white outline-none shadow-sm transition-all resize-none" placeholder="WiFi, Laundry, Mess, Biometrics, Gym..." />
                       </div>
                    </div>
                 </motion.div>
              )}

              {currentStep === 3 && (
                 <motion.div 
                  key="step3" 
                  initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                  className="space-y-8"
                 >
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Location Details</h2>
                    <div className="space-y-6">
                       <div className="space-y-2">
                          <div className="flex items-center justify-between px-1">
                             <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Full Address</label>
                             <button type="button" onClick={handleUseLocation} disabled={locationLoading} className="text-[10px] font-bold uppercase tracking-wider text-blue-600 flex items-center gap-1.5 hover:text-blue-700">
                                {locationLoading ? <Loader2 size={12} className="animate-spin" /> : <LocateFixed size={12} />} Get Current Location
                             </button>
                          </div>
                          <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-blue-600 rounded-xl px-6 py-4 font-semibold text-slate-900 dark:text-white outline-none shadow-sm transition-all" placeholder="Enter full address" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Locality</label>
                          <div className="relative">
                             <select name="locality" value={formData.locality} onChange={handleChange} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-blue-600 rounded-xl px-6 py-4 font-semibold text-slate-900 dark:text-white outline-none shadow-sm transition-all appearance-none cursor-pointer">
                                <option value="">Select Locality</option>
                                <option value="Mangalpally">Mangalpally</option>
                                <option value="Ibrahimpatnam">Ibrahimpatnam</option>
                                <option value="Sheriguda">Sheriguda</option>
                                <option value="Other">Other</option>
                             </select>
                             <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs font-bold">CHANGE</div>
                          </div>
                       </div>
                    </div>
                 </motion.div>
              )}

              {currentStep === 4 && (
                 <motion.div 
                  key="step4" 
                  initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                  className="space-y-8"
                 >
                    <div className="flex items-center justify-between">
                       <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Property Description</h2>
                       <button type="button" onClick={handleGenerateDescription} disabled={aiLoading} className="px-5 py-2.5 bg-slate-900 dark:bg-blue-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 transition-all hover:bg-slate-800 dark:hover:bg-blue-700">
                          {aiLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />} AI Generate
                       </button>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">About the Property</label>
                       <textarea name="description" value={formData.description} onChange={handleChange} rows="6" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-blue-600 rounded-xl px-6 py-4 font-semibold text-slate-900 dark:text-white outline-none shadow-sm transition-all resize-none leading-relaxed" placeholder="Describe the living experience..." />
                    </div>
                 </motion.div>
              )}

              {currentStep === 5 && (
                 <motion.div 
                  key="step5" 
                  initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                  className="space-y-8"
                 >
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Media Assets</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-6">
                          <div className="relative group">
                             <input type="file" multiple accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                             <div className="bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center transition-all group-hover:bg-slate-100/50 dark:group-hover:bg-slate-800">
                                <Upload className="mx-auto text-blue-600 mb-4" size={40} />
                                <p className="text-sm font-bold text-slate-900 dark:text-white">Upload Images</p>
                                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mt-1">JPG, PNG (Max 5MB each)</p>
                             </div>
                          </div>

                          <div className="relative group">
                             <input type="file" accept="video/*" onChange={(e) => setVideo(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                             <div className="bg-slate-900 dark:bg-slate-800 text-white rounded-2xl p-10 text-center transition-all group-hover:bg-slate-800">
                                <Video className="mx-auto text-emerald-400 mb-4" size={40} />
                                <p className="text-sm font-bold">{video ? 'Video Selected' : 'Add Property Video'}</p>
                                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mt-1">{video ? video.name : 'Optional walk-through tour'}</p>
                             </div>
                          </div>
                       </div>

                       <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm max-h-[400px] overflow-y-auto">
                          <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-4">Selected Assets ({images.length + existingImages.length})</h3>
                          <div className="grid grid-cols-2 gap-3">
                             {existingImages.map((src, i) => (
                                <div key={`ex-${i}`} className="relative group rounded-xl overflow-hidden aspect-square border border-slate-100 dark:border-slate-800">
                                   <img src={src.startsWith('http') ? src : `${process.env.REACT_APP_API_URL}/uploads/${src}`} alt="" className="w-full h-full object-cover" />
                                   <button onClick={() => removeExistingImage(src)} className="absolute top-1.5 right-1.5 p-1.5 bg-rose-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all"><X size={12} /></button>
                                </div>
                             ))}
                             {imagePreviews.map((src, i) => (
                                <div key={i} className="relative group rounded-xl overflow-hidden aspect-square border border-emerald-500/50">
                                   <img src={src} alt="" className="w-full h-full object-cover" />
                                   <button onClick={() => removeImage(i)} className="absolute top-1.5 right-1.5 p-1.5 bg-rose-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all"><X size={12} /></button>
                                </div>
                             ))}
                          </div>
                       </div>
                    </div>
                 </motion.div>
              )}
           </AnimatePresence>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
           <button 
             onClick={() => currentStep > 1 && setCurrentStep(prev => prev - 1)}
             className={`px-6 py-3 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${currentStep === 1 ? 'opacity-20 cursor-not-allowed' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
           >
              <ChevronLeft size={16} /> Back
           </button>
           
           <div className="flex gap-4">
              {currentStep < 5 ? (
                 <button 
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  className="px-8 py-3 bg-slate-900 dark:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 hover:bg-slate-800 dark:hover:bg-blue-700"
                 >
                    Next Step <ChevronRight size={16} />
                 </button>
              ) : (
                 <button 
                  onClick={handleSubmit}
                  disabled={addHostelMutation.isPending || updateHostelMutation.isPending || (images.length === 0 && existingImages.length === 0)}
                  className={`px-8 py-3 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 ${isEditing ? 'bg-blue-600' : 'bg-emerald-600'}`}
                 >
                    {(addHostelMutation.isPending || updateHostelMutation.isPending) ? <Loader2 className="animate-spin" /> : <><Zap size={16} /> {isEditing ? "Update Hostel" : "Add Hostel"}</>}
                 </button>
              )}
           </div>
        </div>

      </div>
    </div>
  );
};

export default AddHostel;
