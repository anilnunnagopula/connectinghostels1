import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Lock, Camera } from "lucide-react";

const baseURL = process.env.REACT_APP_API_URL;
const MAX_PROFILE_IMAGE_SIZE_MB = 2;
const MAX_PROFILE_IMAGE_SIZE_BYTES = MAX_PROFILE_IMAGE_SIZE_MB * 1024 * 1024;

const StudentSettingsPage = () => {
  const navigate = useNavigate();

  // --- State Management (Simplified for Student) ---
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
  const [passwordInfo, setPasswordInfo] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
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
        username: fetchedUser.username || "", // Assuming students can have usernames
        email: fetchedUser.email || "",
        phoneNumber: fetchedUser.phoneNumber || "",
      });
      setCurrentProfileImageUrl(fetchedUser.profilePictureUrl || "");
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
          ...(activeTab === "security" &&
            sectionData.newPassword && {
              currentPassword: sectionData.currentPassword,
              newPassword: sectionData.newPassword,
            }),
        };

        const res = await axios.put(`${baseURL}/api/auth/profile`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Update user in localStorage to reflect changes across the app
        const updatedUser = {
          ...JSON.parse(localStorage.getItem("user")),
          ...res.data,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        setUserProfile(res.data); // Update local state
        toast.success("Profile updated successfully!");
        if (activeTab === "personal") setProfilePictureFile(null);
        if (activeTab === "security")
          setPasswordInfo({
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: "",
          });
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
      profilePictureFile,
      currentProfileImageUrl,
    ]
  );

  // --- Form Input Handlers ---
  const handlePersonalInfoChange = (e) =>
    setPersonalInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handlePasswordInfoChange = (e) =>
    setPasswordInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleProfilePictureFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > MAX_PROFILE_IMAGE_SIZE_BYTES) {
      toast.error(`Image is too large (max ${MAX_PROFILE_IMAGE_SIZE_MB}MB).`);
      return;
    }
    setProfilePictureFile(file);
  };

  // --- Render Logic ---
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading profile...</p>
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
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
          ⚙️ Student Settings
        </h1>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-700 mb-6">
          {["personal", "security"].map((tab) => (
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
              {tab === "security" && <Lock size={18} className="mr-2" />}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
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
            className="space-y-6"
          >
            <div className="flex flex-col items-center">
              <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-blue-500 bg-slate-200 flex items-center justify-center">
                <img
                  src={
                    profilePictureFile
                      ? URL.createObjectURL(profilePictureFile)
                      : currentProfileImageUrl ||
                        `https://ui-avatars.com/api/?name=${personalInfo.name}&background=random`
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                <label
                  htmlFor="profilePicture"
                  className="absolute bottom-0 right-0 p-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full cursor-pointer"
                >
                  <Camera size={18} />
                  <input
                    type="file"
                    id="profilePicture"
                    accept="image/*"
                    onChange={handleProfilePictureFileChange}
                    className="hidden"
                    disabled={submitting}
                  />
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={personalInfo.name}
                onChange={handlePersonalInfoChange}
                disabled={submitting}
                className="w-full p-2 rounded bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={personalInfo.email}
                disabled
                className="w-full p-2 rounded bg-slate-200 dark:bg-slate-600 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={personalInfo.phoneNumber}
                onChange={handlePersonalInfoChange}
                disabled={submitting}
                className="w-full p-2 rounded bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md font-semibold disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </form>
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
            <div>
              <label className="block text-sm font-medium mb-1">
                Current Password
              </label>
              <input
                type="password"
                name="currentPassword"
                value={passwordInfo.currentPassword}
                onChange={handlePasswordInfoChange}
                required
                disabled={submitting}
                className="w-full p-2 rounded bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                value={passwordInfo.newPassword}
                onChange={handlePasswordInfoChange}
                required
                disabled={submitting}
                className="w-full p-2 rounded bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmNewPassword"
                value={passwordInfo.confirmNewPassword}
                onChange={handlePasswordInfoChange}
                required
                disabled={submitting}
                className="w-full p-2 rounded bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md font-semibold disabled:opacity-50"
            >
              {submitting ? "Updating..." : "Update Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default StudentSettingsPage;
