import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Lock,
  MapPin,
  Camera,
  CreditCard,
} from "lucide-react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const googleMapsLibraries = ["places"];

const containerStyle = {
  width: "100%",
  height: "300px",
  borderRadius: "8px",
};

const defaultCenter = {
  lat: 17.385044, // Default to Hyderabad, India
  lng: 78.486671,
};

const baseURL = process.env.REACT_APP_API_URL;
const MAX_PROFILE_IMAGE_SIZE_MB = 2;
const MAX_PROFILE_IMAGE_SIZE_BYTES = MAX_PROFILE_IMAGE_SIZE_MB * 1024 * 1024;

const SettingsPage = () => {
  const navigate = useNavigate();

  // --- State Management ---
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("personal");

  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    username: "",
    email: "",
    phoneNumber: "",
  });
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [currentProfileImageUrl, setCurrentProfileImageUrl] = useState("");
  const [locationInfo, setLocationInfo] = useState({
    address: "",
    lat: null,
    lng: null,
  });
  const [passwordInfo, setPasswordInfo] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [payoutMethods, setPayoutMethods] = useState([]);
  const [newMethodForm, setNewMethodForm] = useState({
    type: "BANK_TRANSFER",
    details: {
      accountNumber: "",
      ifscCode: "",
      bankName: "",
      accountHolderName: "",
      upiId: "",
    },
    isDefault: false,
  });

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_Maps_API_KEY,
    libraries: googleMapsLibraries,
  });

  // --- Callbacks and Event Handlers ---
  const getToken = useCallback(() => localStorage.getItem("token"), []);

  const fetchUserProfile = useCallback(async () => {
    setLoading(true);
    const token = getToken();
    if (!token) {
      toast.error("Please log in to manage your profile.");
      navigate("/login");
      return;
    }
    try {
      const profileResponse = await axios.get(`${baseURL}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const fetchedUser = profileResponse.data;
      setUserProfile(fetchedUser);
      setPersonalInfo({
        name: fetchedUser.name || "",
        username: fetchedUser.username || "",
        email: fetchedUser.email || "",
        phoneNumber: fetchedUser.phoneNumber || "",
      });
      setLocationInfo({
        address: fetchedUser.address || "",
        lat: fetchedUser.location?.lat || null,
        lng: fetchedUser.location?.lng || null,
      });
      setCurrentProfileImageUrl(fetchedUser.profilePictureUrl || "");

      // API Endpoint updated for 'owner'
      const methodsResponse = await axios.get(
        `${baseURL}/api/owner/payout-methods`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPayoutMethods(methodsResponse.data);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to load profile data.";
      setError(errorMessage);
      toast.error(errorMessage);
      if (err.response?.status === 401 || err.response?.status === 403)
        navigate("/login");
    } finally {
      setLoading(false);
    }
  }, [navigate, getToken]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const handleSaveProfile = useCallback(
    async (sectionData) => {
      setSubmitting(true);
      try {
        const token = getToken();
        let updatedProfilePictureUrl = currentProfileImageUrl;

        if (activeTab === "personal" && profilePictureFile) {
          toast("Uploading profile image...", { icon: "⏳" });
          const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
          const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;
          const formData = new FormData();
          formData.append("file", profilePictureFile);
          formData.append("upload_preset", uploadPreset);

          const res = await axios.post(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            formData
          );
          updatedProfilePictureUrl = res.data.secure_url;
        }

        const payload = {
          name: personalInfo.name,
          username: personalInfo.username,
          phoneNumber: personalInfo.phoneNumber,
          profilePictureUrl: updatedProfilePictureUrl,
          address:
            activeTab === "location"
              ? locationInfo.address
              : userProfile.address,
          location:
            activeTab === "location"
              ? { lat: locationInfo.lat, lng: locationInfo.lng }
              : userProfile.location,
          ...(activeTab === "security" &&
            sectionData.newPassword && {
              currentPassword: sectionData.currentPassword,
              newPassword: sectionData.newPassword,
            }),
        };

        const res = await axios.put(`${baseURL}/api/auth/profile`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserProfile(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
        toast.success("Profile updated successfully!");
        if (activeTab === "personal") setProfilePictureFile(null);
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to save changes.";
        toast.error(errorMessage);
      } finally {
        setSubmitting(false);
      }
    },
    [
      getToken,
      activeTab,
      personalInfo,
      locationInfo,
      userProfile,
      profilePictureFile,
      currentProfileImageUrl,
    ]
  );

  const handleApiAction = useCallback(async (action) => {
    setSubmitting(true);
    try {
      await action();
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "An error occurred.";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  }, []);

  // --- Render Logic ---
  if (loading)
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p>Loading profile settings...</p>
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          <p>{error}</p>
        </div>
      </div>
    );
  if (!userProfile) return null;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 shadow-xl rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:underline mb-6"
        >
          <ArrowLeft size={20} className="mr-2" /> Back to Dashboard
        </button>
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">
          ⚙️ Owner Settings
        </h1>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-700 mb-6 overflow-x-auto">
          {["personal", "location", "payments", "security"].map((tab) => (
            <button
              key={tab}
              className={`flex items-center px-4 py-2 -mb-px text-sm font-medium leading-5 border-b-2 ${
                activeTab === tab
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "personal" && <User size={18} className="mr-2" />}
              {tab === "location" && <MapPin size={18} className="mr-2" />}
              {tab === "payments" && <CreditCard size={18} className="mr-2" />}
              {tab === "security" && <Lock size={18} className="mr-2" />}
              {tab.charAt(0).toUpperCase() + tab.slice(1)} Info
            </button>
          ))}
        </div>

        {/* Personal Info Tab */}
        {activeTab === "personal" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveProfile({});
            }}
            className="space-y-4"
          >
            {/* ... (UI for profile picture, name, username, email, phone) ... */}
          </form>
        )}

        {/* Location Info Tab */}
        {activeTab === "location" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveProfile({});
            }}
            className="space-y-4"
          >
            {/* ... (UI for address, auto-fetch button, Google Map) ... */}
          </form>
        )}

        {/* Payments Tab */}
        {activeTab === "payments" && (
          <div className="space-y-6">
            {/* ... (UI for adding and listing payout methods) ... */}
          </div>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveProfile(passwordInfo);
            }}
            className="space-y-4"
          >
            {/* ... (UI for current and new password) ... */}
          </form>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
