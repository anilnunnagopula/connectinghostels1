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
  Plus,
  Trash2,
  Save,
  Loader2,
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

const OwnerSettingsPage = () => {
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
      const [profileResponse, methodsResponse] = await Promise.all([
        axios.get(`${baseURL}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${baseURL}/api/owner/payout-methods`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

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

      setPayoutMethods(methodsResponse.data.methods || []);
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

  const handleAddPayoutMethod = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await axios.post(`${baseURL}/api/owner/payout-methods`, newMethodForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Payout method added successfully!");
      fetchUserProfile(); // Re-fetch all data
      setNewMethodForm({
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
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add method.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePayoutMethod = async (methodId) => {
    if (!window.confirm("Are you sure you want to delete this payout method?"))
      return;

    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await axios.delete(`${baseURL}/api/owner/payout-methods/${methodId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Payout method deleted successfully!");
      fetchUserProfile(); // Re-fetch all data
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete method.");
    }
  };

  const handleSetDefaultPayoutMethod = async (methodId) => {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await axios.put(
        `${baseURL}/api/owner/payout-methods/${methodId}/default`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Default payout method updated.");
      fetchUserProfile(); // Re-fetch all data
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to set as default.");
    }
  };

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
            {/* --- Personal Info UI (placeholder) --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={personalInfo.name}
                  onChange={(e) =>
                    setPersonalInfo({ ...personalInfo, name: e.target.value })
                  }
                  className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={personalInfo.username}
                  onChange={(e) =>
                    setPersonalInfo({
                      ...personalInfo,
                      username: e.target.value,
                    })
                  }
                  className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={personalInfo.email}
                  onChange={(e) =>
                    setPersonalInfo({ ...personalInfo, email: e.target.value })
                  }
                  className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500"
                  disabled
                />
              </div>
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={personalInfo.phoneNumber}
                  onChange={(e) =>
                    setPersonalInfo({
                      ...personalInfo,
                      phoneNumber: e.target.value,
                    })
                  }
                  className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 text-white py-2.5 rounded-md hover:bg-blue-700 transition font-semibold disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
              ) : (
                "Save Changes"
              )}
            </button>
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
            {/* --- Location Info UI (placeholder) --- */}
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={locationInfo.address}
                onChange={(e) =>
                  setLocationInfo({ ...locationInfo, address: e.target.value })
                }
                className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 text-white py-2.5 rounded-md hover:bg-blue-700 transition font-semibold disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
              ) : (
                "Save Location"
              )}
            </button>
          </form>
        )}

        {/* Payments Tab */}
        {activeTab === "payments" && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4 text-slate-800 dark:text-white flex items-center gap-2">
              <Plus size={20} />
              Add New Payout Method
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddPayoutMethod();
              }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-lg"
            >
              <div>
                <label className="block text-sm font-medium mb-1">
                  Method Type
                </label>
                <select
                  name="type"
                  value={newMethodForm.type}
                  onChange={(e) =>
                    setNewMethodForm({ ...newMethodForm, type: e.target.value })
                  }
                  disabled={submitting}
                  className="w-full p-2 rounded bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                  <option value="UPI">UPI</option>
                </select>
              </div>
              {newMethodForm.type === "BANK_TRANSFER" ? (
                <>
                  <div>
                    <label className="block text-sm mb-1">Account Number</label>
                    <input
                      type="text"
                      name="accountNumber"
                      value={newMethodForm.details.accountNumber}
                      onChange={(e) =>
                        setNewMethodForm({
                          ...newMethodForm,
                          details: {
                            ...newMethodForm.details,
                            accountNumber: e.target.value,
                          },
                        })
                      }
                      required
                      disabled={submitting}
                      className="w-full p-2 rounded bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">IFSC Code</label>
                    <input
                      type="text"
                      name="ifscCode"
                      value={newMethodForm.details.ifscCode}
                      onChange={(e) =>
                        setNewMethodForm({
                          ...newMethodForm,
                          details: {
                            ...newMethodForm.details,
                            ifscCode: e.target.value,
                          },
                        })
                      }
                      required
                      disabled={submitting}
                      className="w-full p-2 rounded bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Bank Name</label>
                    <input
                      type="text"
                      name="bankName"
                      value={newMethodForm.details.bankName}
                      onChange={(e) =>
                        setNewMethodForm({
                          ...newMethodForm,
                          details: {
                            ...newMethodForm.details,
                            bankName: e.target.value,
                          },
                        })
                      }
                      required
                      disabled={submitting}
                      className="w-full p-2 rounded bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">
                      Account Holder Name
                    </label>
                    <input
                      type="text"
                      name="accountHolderName"
                      value={newMethodForm.details.accountHolderName}
                      onChange={(e) =>
                        setNewMethodForm({
                          ...newMethodForm,
                          details: {
                            ...newMethodForm.details,
                            accountHolderName: e.target.value,
                          },
                        })
                      }
                      required
                      disabled={submitting}
                      className="w-full p-2 rounded bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-sm mb-1">UPI ID</label>
                  <input
                    type="text"
                    name="upiId"
                    value={newMethodForm.details.upiId}
                    onChange={(e) =>
                      setNewMethodForm({
                        ...newMethodForm,
                        details: {
                          ...newMethodForm.details,
                          upiId: e.target.value,
                        },
                      })
                    }
                    required
                    disabled={submitting}
                    className="w-full p-2 rounded bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
              <div className="md:col-span-2 flex items-center">
                <input
                  type="checkbox"
                  name="isDefault"
                  id="isDefault"
                  checked={newMethodForm.isDefault}
                  onChange={(e) =>
                    setNewMethodForm({
                      ...newMethodForm,
                      isDefault: e.target.checked,
                    })
                  }
                  disabled={submitting}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                />
                <label htmlFor="isDefault" className="ml-2 text-sm">
                  Set as default payout method
                </label>
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-600 text-white py-2.5 rounded-md hover:bg-blue-700 transition font-semibold disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                  ) : (
                    "Add Payout Method"
                  )}
                </button>
              </div>
            </form>
            <h3 className="text-xl font-semibold mt-8 mb-4 flex items-center gap-2">
              Your Payout Methods
              <span className="text-sm font-normal text-slate-500">
                ({payoutMethods.length})
              </span>
            </h3>
            {payoutMethods.length === 0 ? (
              <p className="text-slate-500">No payout methods added yet.</p>
            ) : (
              <div className="space-y-4">
                {payoutMethods.map((method) => (
                  <div
                    key={method._id}
                    className="bg-slate-100 dark:bg-slate-700 rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center"
                  >
                    <div>
                      <p className="font-bold">
                        {method.type === "BANK_TRANSFER"
                          ? "Bank Transfer"
                          : "UPI"}
                      </p>
                      {method.type === "BANK_TRANSFER" ? (
                        <>
                          <p className="text-sm text-slate-600 dark:text-slate-300">
                            Account: ****
                            {method.details.accountNumber.slice(-4)}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-300">
                            Bank: {method.details.bankName}
                          </p>
                        </>
                      ) : (
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          ID: {method.details.upiId}
                        </p>
                      )}
                      {method.isDefault && (
                        <span className="mt-1 inline-block bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-semibold">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="flex space-x-2 mt-3 md:mt-0 self-end md:self-center">
                      {!method.isDefault && (
                        <button
                          onClick={() =>
                            handleSetDefaultPayoutMethod(method._id)
                          }
                          disabled={submitting}
                          className="bg-slate-200 dark:bg-slate-600 text-xs px-3 py-1.5 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500 transition disabled:opacity-50"
                        >
                          Set Default
                        </button>
                      )}
                      <button
                        onClick={() => handleDeletePayoutMethod(method._id)}
                        disabled={submitting}
                        className="bg-red-100 dark:bg-red-900/50 text-red-600 px-3 py-1.5 rounded-md text-xs hover:bg-red-200 dark:hover:bg-red-900 transition disabled:opacity-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
            {/* --- UI for current and new password --- */}
            <div>
              <label
                htmlFor="currentPassword"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={passwordInfo.currentPassword}
                onChange={(e) =>
                  setPasswordInfo({
                    ...passwordInfo,
                    currentPassword: e.target.value,
                  })
                }
                className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordInfo.newPassword}
                onChange={(e) =>
                  setPasswordInfo({
                    ...passwordInfo,
                    newPassword: e.target.value,
                  })
                }
                className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="confirmNewPassword"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmNewPassword"
                name="confirmNewPassword"
                value={passwordInfo.confirmNewPassword}
                onChange={(e) =>
                  setPasswordInfo({
                    ...passwordInfo,
                    confirmNewPassword: e.target.value,
                  })
                }
                className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 text-white py-2.5 rounded-md hover:bg-blue-700 transition font-semibold disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
              ) : (
                "Change Password"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default OwnerSettingsPage;
