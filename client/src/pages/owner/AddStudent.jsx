import React, { useState, useEffect } from "react";
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
  CheckCircle,
  X,
  PlusCircle,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../apiConfig";

const AddStudent = () => {
  const navigate = useNavigate();

  // States matching reference patterns
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    hostel: "",
    floor: "",
    room: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [hostels, setHostels] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);

  // Fetch Logic
  useEffect(() => {
    const fetchOwnerHostels = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Authentication token not found.");

        const res = await axios.get(
          `${API_BASE_URL}/api/owner/hostels/my-hostels`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        console.log("Target URL:", `${API_BASE_URL}/api/students`);

        setHostels(res.data.hostels);
        if (res.data.hostels.length > 0) {
          setFormData((prev) => ({ ...prev, hostel: res.data.hostels[0]._id }));
        }
      } catch (err) {
        console.error("⚠️ Failed to fetch hostels:", err);
        toast.error("Failed to load your hostels.");
      } finally {
        setFetchLoading(false);
      }
    };
    fetchOwnerHostels();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation matching reference pattern
    if (
      !formData.name ||
      !formData.phone ||
      !formData.hostel ||
      !formData.room
    ) {
      toast.error("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE_URL}/api/students`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success("✅ Student added successfully!");
      navigate("/owner/my-students"); // Consistent navigation pattern
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to add student";
      toast.error(`❌ ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  // Step Validation Logic
  const canProceedToStep2 = formData.name && formData.phone;

  if (fetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  if (hostels.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl text-center max-w-md">
          <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
            No Hostels Found
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            You need to list a hostel property before you can manage students.
          </p>
          <button
            onClick={() => navigate("/owner/add-hostel")}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all"
          >
            Add Your First Hostel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header - Pattern Reused from AddHostel */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-3">
            <PlusCircle className="text-blue-500" />
            Enroll New Student
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Assign a student to a room and floor in your property
          </p>
        </div>

        {/* Step Indicator - Pattern Reused from AddHostel */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 mb-6 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            {[1, 2].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
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
                {step < 2 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${currentStep > step ? "bg-blue-500" : "bg-slate-200 dark:bg-slate-700"}`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs font-medium text-slate-500 uppercase tracking-wider">
            <span>Personal Info</span>
            <span>Room Allocation</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 space-y-5 animate-in fade-in slide-in-from-bottom-4">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">
                Personal Information
              </h3>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  <User className="inline w-4 h-4 mr-1" /> Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white outline-none"
                  placeholder="e.g. John Doe"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    <Mail className="inline w-4 h-4 mr-1" /> Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white outline-none"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    <Phone className="inline w-4 h-4 mr-1" /> Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white outline-none"
                    placeholder="10-digit number"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  <MapPin className="inline w-4 h-4 mr-1" /> Permanent Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white outline-none"
                  rows="2"
                  placeholder="Street, City, State..."
                />
              </div>

              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                disabled={!canProceedToStep2}
                className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
                  canProceedToStep2
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed"
                }`}
              >
                Continue to Allocation <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Step 2: Allocation */}
          {currentStep === 2 && (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 space-y-5 animate-in fade-in slide-in-from-bottom-4">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">
                Room Allocation
              </h3>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  <Building2 className="inline w-4 h-4 mr-1" /> Select Hostel *
                </label>
                <select
                  name="hostel"
                  value={formData.hostel}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white outline-none appearance-none"
                >
                  {hostels.map((h) => (
                    <option key={h._id} value={h._id}>
                      {h.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    <Layers className="inline w-4 h-4 mr-1" /> Floor No *
                  </label>
                  <input
                    type="number"
                    name="floor"
                    value={formData.floor}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white outline-none"
                    placeholder="e.g. 2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    <DoorOpen className="inline w-4 h-4 mr-1" /> Room No *
                  </label>
                  <input
                    type="number"
                    name="room"
                    value={formData.room}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white outline-none"
                    placeholder="e.g. 204"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="flex-1 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-white rounded-lg font-semibold hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-[2] py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <CheckCircle className="w-5 h-5" />
                  )}
                  {loading ? "Registering..." : "Confirm Enrollment"}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddStudent;
