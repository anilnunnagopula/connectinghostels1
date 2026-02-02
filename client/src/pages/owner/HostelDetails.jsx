import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  Bed,
  Users,
  Shield,
  Wifi,
  Coffee,
  ChevronLeft,
  ChevronRight,
  Phone,
  Loader2,
  CheckCircle2,
  ArrowRight,
  Info,
  LayoutDashboard,
  Edit3,
  TrendingUp,
  TrendingDown,
  Calendar,
  IndianRupee,
  Share2,
  Download,
  Printer,
  MoreVertical,
  AlertCircle,
  Star,
  Home,
  Zap,
  Clock,
  Activity,
  DollarSign,
  BarChart3,
  Eye,
  X,
} from "lucide-react";
import { API_BASE_URL } from "../../apiConfig";
import axios from "axios";

const HostelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hostel, setHostel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageLoading, setImageLoading] = useState({});

  useEffect(() => {
    const fetchHostelDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const url = `${API_BASE_URL}/api/owner/hostels/${id}`;
        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data && res.data.hostel) {
          setHostel(res.data.hostel);
        } else {
          setError("Invalid data received from server");
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load hostel details",
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchHostelDetails();
    } else {
      setError("No hostel ID provided");
      setLoading(false);
    }
  }, [id, navigate]);

  // Helper function to construct image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }
    return `${API_BASE_URL}/uploads/${imagePath}`;
  };

  // Calculate occupancy metrics
  const getOccupancyMetrics = () => {
    const total = hostel?.totalRooms || 0;
    const available = hostel?.availableRooms || 0;
    const occupied = total - available;
    const percentage = total > 0 ? (occupied / total) * 100 : 0;

    return {
      total,
      available,
      occupied,
      percentage: Math.round(percentage),
      status:
        percentage >= 80
          ? "Excellent"
          : percentage >= 60
            ? "Good"
            : percentage >= 40
              ? "Moderate"
              : "Low",
      color:
        percentage >= 80
          ? "text-green-600 dark:text-green-400"
          : percentage >= 60
            ? "text-blue-600 dark:text-blue-400"
            : percentage >= 40
              ? "text-yellow-600 dark:text-yellow-400"
              : "text-red-600 dark:text-red-400",
      bgColor:
        percentage >= 80
          ? "bg-green-50 dark:bg-green-900/20"
          : percentage >= 60
            ? "bg-blue-50 dark:bg-blue-900/20"
            : percentage >= 40
              ? "bg-yellow-50 dark:bg-yellow-900/20"
              : "bg-red-50 dark:bg-red-900/20",
    };
  };

  // Image navigation
  const nextImage = () => {
    if (hostel?.images?.length > 0) {
      setActiveImage((prev) => (prev + 1) % hostel.images.length);
    }
  };

  const prevImage = () => {
    if (hostel?.images?.length > 0) {
      setActiveImage(
        (prev) => (prev - 1 + hostel.images.length) % hostel.images.length,
      );
    }
  };

  // Share functionality
  const handleShare = async () => {
    const shareData = {
      title: hostel?.name,
      text: `Check out ${hostel?.name} - ₹${hostel?.pricePerMonth}/month`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <div className="relative">
            <Loader2 className="w-16 h-16 animate-spin text-blue-500 mx-auto mb-4" />
            <div className="absolute inset-0 blur-xl bg-blue-500/20 animate-pulse"></div>
          </div>
          <p className="text-slate-600 dark:text-slate-400 font-medium">
            Loading property details...
          </p>
          <p className="text-xs text-slate-400 mt-2">Please wait</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Error Loading Property
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">{error}</p>
            <div className="flex gap-3">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium transition"
              >
                Retry
              </button>
              <button
                onClick={() => navigate("/owner/my-hostels")}
                className="flex-1 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-white px-4 py-2.5 rounded-lg font-medium transition"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!hostel) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <Home className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <p className="text-xl font-bold text-slate-600 dark:text-slate-400 mb-4">
            Property not found
          </p>
          <button
            onClick={() => navigate("/owner/my-hostels")}
            className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition"
          >
            Back to My Hostels
          </button>
        </div>
      </div>
    );
  }

  const metrics = getOccupancyMetrics();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 pb-12">
      {/* Enhanced Top Navigation Bar */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors font-medium group"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="hidden sm:inline">Back to My Hostels</span>
              <span className="sm:hidden">Back</span>
            </button>

            <div className="flex items-center gap-2">
              {/* Action Buttons */}
              <button
                onClick={handleShare}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
                title="Share"
              >
                <Share2 className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>

              <button
                onClick={() => navigate(`/owner/hostel/${hostel._id}/edit`)}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition shadow-sm"
              >
                <Edit3 className="w-4 h-4" />
                Edit Property
              </button>

              <button
                onClick={() => navigate(`/owner/hostel/${hostel._id}/edit`)}
                className="sm:hidden p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
              >
                <Edit3 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Property Header with Stats Banner */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span
                  className={`px-4 py-1.5 rounded-full text-sm font-bold ${
                    hostel.type === "Girls"
                      ? "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300"
                      : hostel.type === "Boys"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                        : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                  }`}
                >
                  {hostel.type} Hostel
                </span>
                {hostel.isActive ? (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-bold">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Live
                  </span>
                ) : (
                  <span className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-full text-sm font-bold">
                    Draft
                  </span>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight mb-3 tracking-tight">
                {hostel.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-red-500" />
                  <span className="font-medium">
                    {hostel.address ||
                      hostel.location ||
                      "Location not specified"}
                  </span>
                </div>
                {hostel.contactNumber && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-blue-500" />
                    <span className="font-medium">{hostel.contactNumber}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats Cards */}
            <div className="flex gap-3">
              <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-md border border-slate-200 dark:border-slate-700 min-w-[140px]">
                <div className="text-slate-500 dark:text-slate-400 text-sm mb-1">
                  Occupancy
                </div>
                <div className={`text-3xl font-black ${metrics.color}`}>
                  {metrics.percentage}%
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {metrics.status}
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 shadow-lg text-white min-w-[140px]">
                <div className="text-blue-100 text-sm mb-1">Monthly Rent</div>
                <div className="text-3xl font-black">
                  ₹{(hostel.pricePerMonth || 0).toLocaleString()}
                </div>
                <div className="text-xs text-blue-100 mt-1">Starting from</div>
              </div>
            </div>
          </div>

          {/* Performance Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard
              icon={<Bed />}
              label="Total Rooms"
              value={metrics.total}
              color="blue"
            />
            <MetricCard
              icon={<CheckCircle2 />}
              label="Occupied"
              value={metrics.occupied}
              color="green"
              trend="+12%"
            />
            <MetricCard
              icon={<LayoutDashboard />}
              label="Available"
              value={metrics.available}
              color="orange"
            />
            <MetricCard
              icon={<Activity />}
              label="Capacity"
              value={`${metrics.percentage}%`}
              color="purple"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Images & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Enhanced Image Gallery with Modal */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-700">
              <div className="relative aspect-video bg-gradient-to-br from-blue-100 to-blue-50 dark:from-slate-700 dark:to-slate-600 group">
                {hostel.images && hostel.images.length > 0 ? (
                  <>
                    <img
                      src={getImageUrl(hostel.images[activeImage])}
                      className="w-full h-full object-cover transition-all duration-500"
                      alt={hostel.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = "none";
                        e.target.parentElement
                          .querySelector(".fallback-icon")
                          ?.classList.remove("hidden");
                      }}
                    />

                    {/* Image Controls */}
                    {hostel.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </button>

                        {/* Image Counter */}
                        <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm">
                          {activeImage + 1} / {hostel.images.length}
                        </div>
                      </>
                    )}

                    {/* Fullscreen Button */}
                    <button
                      onClick={() => setShowImageModal(true)}
                      className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2.5 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </>
                ) : null}

                <div
                  className={`fallback-icon w-full h-full flex flex-col items-center justify-center ${
                    hostel.images && hostel.images.length > 0 ? "hidden" : ""
                  }`}
                >
                  <Bed className="w-20 h-20 text-slate-300 dark:text-slate-600 mb-3" />
                  <p className="text-slate-400 dark:text-slate-500 font-medium">
                    No images available
                  </p>
                </div>
              </div>

              {/* Thumbnail Gallery */}
              {hostel.images?.length > 1 && (
                <div className="p-4 bg-slate-50 dark:bg-slate-900/50">
                  <div className="flex gap-3 overflow-x-auto no-scrollbar">
                    {hostel.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImage(idx)}
                        className={`flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          activeImage === idx
                            ? "border-blue-500 scale-105 shadow-lg"
                            : "border-transparent hover:border-slate-300 dark:hover:border-slate-600 opacity-60 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={getImageUrl(img)}
                          className="w-full h-full object-cover"
                          alt={`Thumbnail ${idx + 1}`}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = "none";
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Description Section */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Info className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Description
                </h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg whitespace-pre-line">
                {hostel.description ||
                  "You haven't added a description for this property yet. Add one to attract more students!"}
              </p>
            </div>

            {/* Amenities Grid */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Star className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Facilities & Amenities
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                <FacilityItem
                  icon={<Wifi />}
                  label="High-Speed Wi-Fi"
                  active={
                    hostel.amenities?.includes("wifi") || hostel.amenities?.wifi
                  }
                />
                <FacilityItem
                  icon={<Shield />}
                  label="24/7 Security"
                  active={
                    hostel.amenities?.includes("security") ||
                    hostel.amenities?.security
                  }
                />
                <FacilityItem
                  icon={<Coffee />}
                  label="Food & Mess"
                  active={
                    hostel.amenities?.includes("food") || hostel.amenities?.food
                  }
                />
                <FacilityItem
                  icon={<Eye />}
                  label="CCTV Surveillance"
                  active={true}
                />
                <FacilityItem
                  icon={<Users />}
                  label="Common Lounge"
                  active={true}
                />
                <FacilityItem
                  icon={<Zap />}
                  label="Laundry Service"
                  active={
                    hostel.amenities?.includes("laundry") ||
                    hostel.amenities?.laundry
                  }
                />
              </div>
            </div>
          </div>

          {/* Right Column: Management Panel */}
          <div className="space-y-6">
            {/* Quick Actions Card */}
            <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-800/50 rounded-2xl p-6 shadow-xl border border-slate-200 dark:border-slate-700 sticky top-24">
              {/* Revenue Card */}
              <div className="mb-6 p-5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-blue-100 text-sm font-medium">
                    Monthly Revenue
                  </span>
                  <TrendingUp className="w-5 h-5 text-blue-200" />
                </div>
                <div className="text-3xl font-black mb-1">
                  ₹
                  {(
                    (hostel.pricePerMonth || 0) * metrics.occupied
                  ).toLocaleString()}
                </div>
                <div className="text-blue-100 text-xs">
                  From {metrics.occupied} occupied rooms
                </div>
              </div>

              {/* Room Stats */}
              <div className="space-y-3 mb-6">
                <StatRow
                  icon={<LayoutDashboard className="w-5 h-5 text-slate-500" />}
                  label="Total Rooms"
                  value={metrics.total}
                />
                <StatRow
                  icon={<CheckCircle2 className="w-5 h-5 text-green-500" />}
                  label="Occupied"
                  value={metrics.occupied}
                  valueColor="text-green-600 dark:text-green-400"
                />
                <StatRow
                  icon={<Bed className="w-5 h-5 text-blue-500" />}
                  label="Available"
                  value={metrics.available}
                  valueColor="text-blue-600 dark:text-blue-400"
                />
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600 dark:text-slate-400">
                    Occupancy Rate
                  </span>
                  <span className={`font-bold ${metrics.color}`}>
                    {metrics.percentage}%
                  </span>
                </div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${metrics.percentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => navigate("/owner/add-student")}
                  className="w-full bg-gradient-to-r from-slate-900 to-slate-800 dark:from-blue-600 dark:to-blue-700 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all group"
                >
                  <Users className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Add New Student
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => navigate("/owner/manage-rooms")}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  Manage Rooms
                </button>

                <button
                  onClick={() => navigate(`/owner/hostel/${hostel._id}/edit`)}
                  className="w-full bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                >
                  <Edit3 className="w-5 h-5" />
                  Edit Property
                </button>
              </div>

              {/* Last Updated */}
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Last updated</span>
                  </div>
                  <span className="font-medium">
                    {hostel.updatedAt
                      ? new Date(hostel.updatedAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Support Card */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Need Help?</h3>
                  <p className="text-blue-100 text-sm leading-relaxed">
                    Our support team is available 24/7 to assist you with
                    property management.
                  </p>
                </div>
              </div>
              <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm py-3 rounded-xl font-semibold transition-all">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && hostel.images?.length > 0 && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setShowImageModal(false)}
        >
          <button
            className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full transition"
            onClick={() => setShowImageModal(false)}
          >
            <X className="w-8 h-8" />
          </button>

          <div
            className="relative max-w-6xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={getImageUrl(hostel.images[activeImage])}
              className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
              alt={hostel.name}
            />

            {hostel.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-4 rounded-full backdrop-blur-sm transition"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-4 rounded-full backdrop-blur-sm transition"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm">
              {activeImage + 1} / {hostel.images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Metric Card Component
const MetricCard = ({ icon, label, value, color, trend }) => {
  const colorClasses = {
    blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    green:
      "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    orange:
      "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
    purple:
      "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-md border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          {React.cloneElement(icon, { className: "w-5 h-5" })}
        </div>
        {trend && (
          <span className="text-xs font-bold text-green-600 dark:text-green-400">
            {trend}
          </span>
        )}
      </div>
      <div className="text-2xl font-black text-slate-900 dark:text-white mb-1">
        {value}
      </div>
      <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
        {label}
      </div>
    </div>
  );
};

// Stat Row Component
const StatRow = ({
  icon,
  label,
  value,
  valueColor = "text-slate-900 dark:text-white",
}) => (
  <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
    <div className="flex items-center gap-3">
      {icon}
      <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
        {label}
      </span>
    </div>
    <span className={`font-bold ${valueColor}`}>{value}</span>
  </div>
);

// Enhanced Facility Item Component
const FacilityItem = ({ icon, label, active }) => (
  <div
    className={`flex flex-col items-center gap-3 p-4 rounded-xl transition-all ${
      active
        ? "bg-blue-50 dark:bg-blue-900/20 opacity-100"
        : "bg-slate-100 dark:bg-slate-800 opacity-30 grayscale"
    }`}
  >
    <div
      className={`p-3 rounded-xl ${
        active
          ? "bg-blue-100 dark:bg-blue-800/30 text-blue-600 dark:text-blue-400"
          : "bg-slate-200 dark:bg-slate-700 text-slate-400"
      }`}
    >
      {React.cloneElement(icon, { className: "w-6 h-6" })}
    </div>
    <span
      className={`text-xs font-bold text-center ${
        active
          ? "text-slate-700 dark:text-slate-200"
          : "text-slate-500 dark:text-slate-400"
      }`}
    >
      {label}
    </span>
  </div>
);

export default HostelDetails;
