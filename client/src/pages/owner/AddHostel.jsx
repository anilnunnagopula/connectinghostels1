import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Loader2,
  Sparkles,
  LocateFixed,
  Upload,
  X,
  CheckCircle,
  Building,
  Phone,
  MapPin,
  IndianRupee,
  Bed,
  FileText,
} from "lucide-react";
import axios from "axios";

const AddHostel = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    rooms: "",
    facilities: "",
    category: "",
    description: "",
    location: "",
    pricePerMonth: "",
  });

  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [video, setVideo] = useState(null);
  const [currentStep, setCurrentStep] = useState(1); // Step indicator

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    // Create previews
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleVideoChange = (e) => {
    setVideo(e.target.files[0]);
  };

  const handleGenerateDescription = async () => {
    setAiLoading(true);
    try {
      const prompt = `Generate a concise and appealing hostel description based on the following details:
        Hostel Name: ${formData.name || "A great hostel"}
        Facilities: ${formData.facilities || "WiFi, Mess, AC rooms"}
        Category: ${formData.category || "for students"}
        Location: ${formData.location || "in a peaceful environment"}

        Keep it under 100 words. Focus on benefits for students/working professionals.`;

      const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
      const payload = { contents: chatHistory };
      const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
        const generatedText = result.candidates[0].content.parts[0].text;
        setFormData({ ...formData, description: generatedText });
        alert("✨ Description generated successfully!");
      } else {
        alert("❌ Failed to generate description. Please try again.");
      }
    } catch (err) {
      alert("❌ Error generating description. Please try again.");
      console.error("Gemini API error:", err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      setLocationLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData({
            ...formData,
            location: `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`,
          });
          alert("📍 Current location fetched!");
          setLocationLoading(false);
        },
        (error) => {
          alert("❌ Error getting location. Please enable location services.");
          setLocationLoading(false);
        },
      );
    } else {
      alert("⚠️ Geolocation is not supported by your browser.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (
      !formData.name ||
      !formData.contact ||
      !formData.rooms ||
      !formData.facilities ||
      !formData.category ||
      !formData.description ||
      !formData.location ||
      images.length === 0
    ) {
      alert(
        "Please fill in all required fields and upload at least one image.",
      );
      setLoading(false);
      return;
    }

    const data = new FormData();

    // ===== STRICT BACKEND MAPPING =====
    data.append("name", formData.name);
    data.append("contactNumber", formData.contact); // ✅ FIX
    data.append("totalRooms", formData.rooms); // ✅ FIX
    data.append("amenities", formData.facilities); // ✅ FIX
    data.append("category", formData.category); // OR category
    data.append("description", formData.description);
    data.append("pricePerMonth", formData.pricePerMonth);

    // TEMP mapping (until UI split later)
    data.append("address", formData.location); // ✅ REQUIRED
    data.append("locality", "Other"); // ✅ REQUIRED ENUM

    // Images
    images.forEach((image) => {
      data.append("images", image);
    });

    if (video) {
      data.append("video", video);
    }


    try {
      const authToken = localStorage.getItem("token");
      if (!authToken) {
        alert("Authentication token not found. Please log in again.");
        return;
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/owner/hostels/add-hostel`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authToken}`,
          },
        },
      );

      // Success animation/message
      alert("✅ Hostel added successfully!");
      navigate("/owner/my-hostels");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to add hostel. Please try again.";
      alert(`❌ ${errorMessage}`);
      console.error("Error adding hostel:", err);
    } finally {
      setLoading(false);
    }
  };

  // Form step validation
  const canProceedToStep2 =
    formData.name && formData.contact && formData.category;
  const canProceedToStep3 =
    canProceedToStep2 && formData.rooms && formData.location;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-3">
            <Building className="text-blue-500" />
            Add New Hostel
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Fill in the details to list your hostel property
          </p>
        </div>

        {/* Step Indicator */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                    currentStep >= step
                      ? "bg-blue-500 text-white"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-500"
                  }`}
                >
                  {currentStep > step ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    step
                  )}
                </div>
                {step < 3 && (
                  <div
                    className={`flex-1 h-1 mx-2 transition-colors ${
                      currentStep > step
                        ? "bg-blue-500"
                        : "bg-slate-200 dark:bg-slate-700"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs font-medium text-slate-600 dark:text-slate-400">
            <span>Basic Info</span>
            <span>Details</span>
            <span>Media</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 space-y-5">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">
                Basic Information
              </h3>

              {/* Hostel Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  <Building className="inline w-4 h-4 mr-1" />
                  Hostel Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
                  placeholder="e.g. Sunrise Girls Hostel"
                  required
                />
              </div>

              {/* Contact & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    <Phone className="inline w-4 h-4 mr-1" />
                    Contact Number *
                  </label>
                  <input
                    type="tel"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
                    placeholder="9876543210"
                    minLength={10}
                    maxLength={10}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Girls">Girls</option>
                    <option value="Boys">Boys</option>
                    <option value="Co-Live">Co-Live</option>
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                disabled={!canProceedToStep2}
                className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                  canProceedToStep2
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed"
                }`}
              >
                Next Step →
              </button>
            </div>
          )}

          {/* Step 2: Details */}
          {currentStep === 2 && (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 space-y-5">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">
                Hostel Details
              </h3>

              {/* Rooms & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    <Bed className="inline w-4 h-4 mr-1" />
                    Total Rooms *
                  </label>
                  <input
                    type="number"
                    name="rooms"
                    value={formData.rooms}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    <IndianRupee className="inline w-4 h-4 mr-1" />
                    Price/Month
                  </label>
                  <input
                    type="number"
                    name="pricePerMonth"
                    value={formData.pricePerMonth}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
                    placeholder="8000"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    <MapPin className="inline w-4 h-4 mr-1" />
                    Location *
                  </label>
                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    disabled={locationLoading}
                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    {locationLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Getting...
                      </>
                    ) : (
                      <>
                        <LocateFixed className="w-4 h-4" />
                        Use Current
                      </>
                    )}
                  </button>
                </div>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
                  placeholder="e.g. Mangalpally, Hyderabad"
                  required
                />
              </div>

              {/* Facilities */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Facilities *
                </label>
                <textarea
                  name="facilities"
                  value={formData.facilities}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
                  placeholder="WiFi, Mess, AC Rooms, Study Area, etc"
                  rows="3"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    <FileText className="inline w-4 h-4 mr-1" />
                    Description *
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateDescription}
                    disabled={aiLoading}
                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    {aiLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        AI Generate
                      </>
                    )}
                  </button>
                </div>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
                  placeholder="Describe your hostel..."
                  rows="4"
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="flex-1 py-3 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white rounded-lg font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  disabled={!canProceedToStep3}
                  className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
                    canProceedToStep3
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed"
                  }`}
                >
                  Next Step →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Media Upload */}
          {currentStep === 3 && (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 space-y-5">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">
                Upload Media
              </h3>

              {/* Images Upload */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  <Upload className="inline w-4 h-4 mr-1" />
                  Hostel Images * ({images.length} selected)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 dark:file:bg-blue-900/30 file:text-blue-700 dark:file:text-blue-300 file:font-semibold hover:file:bg-blue-100 dark:hover:file:bg-blue-900/50 cursor-pointer"
                  required
                />

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Video Upload */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Hostel Video (Optional) {video && `(${video.name})`}
                </label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 dark:file:bg-blue-900/30 file:text-blue-700 dark:file:text-blue-300 file:font-semibold hover:file:bg-blue-100 dark:hover:file:bg-blue-900/50 cursor-pointer"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="flex-1 py-3 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white rounded-lg font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={loading || images.length === 0}
                  className={`flex-1 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${
                    loading || images.length === 0
                      ? "bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                  {loading ? "Submitting..." : "Submit Hostel"}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddHostel;
