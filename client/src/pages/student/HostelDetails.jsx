import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../apiConfig";
import { addToRecentlyViewed } from "../../utils/viewHistoryUtils";
import LoginPrompt from "../../components/LoginPrompt";
import toast from "react-hot-toast";

import {
  MapPin,
  Building2,
  IndianRupee,
  Star,
  Heart,
  Share2,
  ArrowLeft,
  Wifi,
  Utensils,
  Tv,
  Wind,
  Loader2,
  CheckCircle,
  CheckCircle2,
  XCircle,
  Users,
  Bed,
  AlertCircle,
  Send,
  MessageSquare,
} from "lucide-react";
import { 
  useHostelDetail, 
  useStudentRequests, 
  useHostelReviews, 
  useToggleInterested, 
  useSubmitReview,
  useInterestedHostels
} from "../../hooks/useQueries";

// ============================================================================
// CONSTANTS
// ============================================================================

// Amenity icons mapping
const AMENITY_ICONS = {
  WiFi: <Wifi size={18} />,
  Food: <Utensils size={18} />,
  TV: <Tv size={18} />,
  AC: <Wind size={18} />,
  Laundry: <Building2 size={18} />,
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const HostelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // ==========================================================================
  // STATE & QUERIES
  // ==========================================================================

  const [selectedImage, setSelectedImage] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  
  // Review form state
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: "" });

  // Data Queries
  const { data: hostel, isLoading: hostelLoading, error: hostelError } = useHostelDetail(id);
  const { data: studentStatus, isLoading: statusLoading } = useStudentRequests();
  const { data: reviewsData, isLoading: reviewsLoading } = useHostelReviews(id);
  const { data: interestedHostels } = useInterestedHostels(!!token);

  // Mutations
  const toggleInterestMutation = useToggleInterested();
  const submitReviewMutation = useSubmitReview();

  // Derived Values
  const reviews = reviewsData?.reviews || [];
  const reviewStats = { 
    avgRating: reviewsData?.avgRating || 0, 
    ratingCount: reviewsData?.ratingCount || 0 
  };
  
  const isInterested = useMemo(() => {
    if (!interestedHostels) return false;
    return interestedHostels.some(h => (h._id || h.id) === id);
  }, [interestedHostels, id]);

  const requestStatus = useMemo(() => ({
    hasRequest: !!studentStatus?.requests?.find(req => req.status === "Pending"),
    isAdmitted: !!studentStatus?.currentHostel,
    checking: statusLoading
  }), [studentStatus, statusLoading]);

  // Adds to recently viewed history when hostel loads
  useEffect(() => {
    if (hostel) {
      addToRecentlyViewed(hostel);
    }
  }, [hostel]);

  // ==========================================================================
  // EVENT HANDLERS
  // ==========================================================================

  const handleGoBack = () => navigate(-1);

  const handleToggleInterested = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    toggleInterestMutation.mutate(id, {
      onError: (err) => {
        toast.error("Failed to update wishlist");
        console.error(err);
      }
    });
  };

  const handleRequestRoom = () => {
    if (!token) {
      setShowLoginPrompt(true);
      return;
    }
    navigate(`/booking-request/${id}`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: hostel?.name,
        text: `Check out ${hostel?.name} at ${hostel?.location}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied");
    }
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!token) { setShowLoginPrompt(true); return; }
    if (!reviewForm.rating) { toast.error("Please select a rating"); return; }

    submitReviewMutation.mutate(
      { hostelId: id, rating: reviewForm.rating, comment: reviewForm.comment },
      {
        onSuccess: () => {
          setReviewForm({ rating: 0, comment: "" });
          toast.success("Review submitted!");
        },
        onError: (err) => {
          toast.error(err.response?.data?.error || "Failed to submit review");
        }
      }
    );
  };

  const images = useMemo(() => {
    if (!hostel) return [];
    if (hostel.images && hostel.images.length > 0) return hostel.images;
    
    return [
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?fit=crop&w=1200&q=80",
    ];
  }, [hostel]);

  // ==========================================================================
  // RENDER HELPERS
  // ==========================================================================

  if (hostelLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-blue-600" />
          <p className="text-gray-600 dark:text-slate-400">Loading hostel details...</p>
        </div>
      </div>
    );
  }

  if (hostelError || !hostel) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-slate-900 p-4">
        <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-xl dark:bg-slate-800">
          <XCircle className="mx-auto mb-4 h-16 w-16 text-red-500" />
          <h2 className="mb-2 text-2xl font-bold text-gray-800 dark:text-white">Hostel Not Found</h2>
          <p className="mb-6 text-gray-600 dark:text-slate-400">{hostelError?.message || "Failed to load hostel"}</p>
          <button onClick={handleGoBack} className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white transition hover:from-blue-700 hover:to-purple-700">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Determine button state
  let buttonText = "Send Request";
  let buttonDisabled = false;
  let buttonClass = "w-full gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3.5 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:from-blue-700 hover:to-purple-700 flex items-center justify-center";
  let buttonIcon = <Send size={18} />;

  if (requestStatus.checking) {
    buttonText = "Checking...";
    buttonDisabled = true;
    buttonClass = "w-full gap-2 rounded-xl bg-gray-400 px-6 py-3.5 font-semibold text-white cursor-not-allowed flex items-center justify-center";
    buttonIcon = <Loader2 size={18} className="animate-spin" />;
  } else if (requestStatus.isAdmitted) {
    buttonText = "Already Admitted";
    buttonDisabled = true;
    buttonClass = "w-full gap-2 rounded-xl bg-green-500 px-6 py-3.5 font-semibold text-white cursor-not-allowed flex items-center justify-center";
    buttonIcon = <CheckCircle size={18} />;
  } else if (requestStatus.hasRequest) {
    buttonText = "Request Pending";
    buttonDisabled = true;
    buttonClass = "w-full gap-2 rounded-xl bg-yellow-500 px-6 py-3.5 font-semibold text-white cursor-not-allowed flex items-center justify-center";
    buttonIcon = <AlertCircle size={18} />;
  } else if (hostel.availableRooms <= 0) {
    buttonText = "Not Available";
    buttonDisabled = true;
    buttonClass = "w-full gap-2 rounded-xl bg-gray-300 px-6 py-3.5 font-semibold text-gray-500 cursor-not-allowed dark:bg-slate-700 flex items-center justify-center";
    buttonIcon = <XCircle size={18} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-20 md:pb-0">
      <div className="container mx-auto max-w-4xl px-4 py-6 pb-24 md:pb-8">
        <Link to="/student/hostels" className="mb-4 inline-flex items-center gap-1 text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-slate-400 dark:hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Back to listings
        </Link>

        <div className="mb-6 overflow-hidden rounded-2xl shadow-lg">
          <img
            src={images[0]}
            alt={hostel.name}
            className="h-64 w-full cursor-pointer object-cover transition-transform duration-300 hover:scale-105 md:h-80"
            onClick={() => { setSelectedImage(0); setShowImageModal(true); }}
          />
        </div>

        <div className="mb-6">
          <div className="mb-2 flex flex-wrap items-start justify-between gap-3">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">{hostel.name}</h1>
            <div className="flex items-center gap-2">
              <button onClick={handleShare} className="rounded-full bg-gray-100 p-2.5 transition hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700"><Share2 size={18} /></button>
              <button onClick={handleToggleInterested} disabled={toggleInterestMutation.isPending} className={`rounded-full p-2.5 transition ${isInterested ? "bg-red-500 text-white hover:bg-red-600" : "bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700"}`}>
                {toggleInterestMutation.isPending ? <Loader2 size={18} className="animate-spin" /> : <Heart size={18} fill={isInterested ? "white" : "none"} />}
              </button>
            </div>
          </div>
          <div className="flex items-center gap-1 text-gray-600 dark:text-slate-400"><MapPin className="h-4 w-4" /><span>{hostel.location}</span></div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-6 md:col-span-2">
            {hostel.description && (
              <div><h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">About</h2><p className="text-gray-600 dark:text-slate-400">{hostel.description}</p></div>
            )}
            <div>
              <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">Facilities & Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {hostel.features?.map((feature, index) => (
                  <div key={index} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-gray-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {AMENITY_ICONS[feature] || <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />}{feature}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">Hostel Information</h2>
              <div className="space-y-3 rounded-xl border border-gray-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
                <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-gray-600 dark:text-slate-400"><Building2 className="h-4 w-4 text-blue-500" />Type</span><span className="font-medium capitalize text-gray-900 dark:text-white">{hostel.type}</span></div>
                <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-gray-600 dark:text-slate-400"><Bed className="h-4 w-4 text-blue-500" />Floors</span><span className="font-medium text-gray-900 dark:text-white">{hostel.floors}</span></div>
                {hostel.capacity && (
                  <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-gray-600 dark:text-slate-400"><Users className="h-4 w-4 text-blue-500" />Capacity</span><span className="font-medium text-gray-900 dark:text-white">{hostel.capacity}</span></div>
                )}
              </div>
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                {images.slice(1, 4).map((img, index) => (
                  <div key={index} className="cursor-pointer overflow-hidden rounded-lg" onClick={() => { setSelectedImage(index+1); setShowImageModal(true); }}>
                    <img src={img} alt={`${hostel.name} ${index + 2}`} className="h-32 w-full object-cover transition-transform duration-300 hover:scale-105" />
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="space-y-4">
            <div className="sticky top-6 space-y-4 rounded-xl border border-gray-200 bg-white p-5 shadow-lg dark:border-slate-700 dark:bg-slate-800">
              <div className="mb-4">
                <div className="flex items-baseline gap-1">
                  <IndianRupee className="h-6 w-6 text-blue-600" />
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">{hostel.pricePerMonth?.toLocaleString("en-IN") || hostel.price?.replace("₹", "").replace("/mo", "")}</span>
                </div>
                <span className="text-sm text-gray-600 dark:text-slate-400">/month</span>
              </div>
              <div className="space-y-2 border-t border-gray-200 pt-4 text-sm dark:border-slate-700">
                <div className="flex justify-between"><span className="text-gray-600 dark:text-slate-400">Availability</span><span className={hostel.availableRooms > 0 ? "font-medium text-green-600" : "font-medium text-red-600"}>{hostel.availableRooms > 0 ? "Available" : "Full"}</span></div>
                <div className="flex justify-between"><span className="text-gray-600 dark:text-slate-400">Rooms Left</span><span className="font-medium text-gray-900 dark:text-white">{hostel.availableRooms || 0}</span></div>
              </div>
              <button onClick={handleRequestRoom} disabled={buttonDisabled} className={buttonClass}>{buttonIcon}{buttonText}</button>
              {!requestStatus.isAdmitted && !requestStatus.hasRequest && hostel.availableRooms > 0 && (
                <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400"><CheckCircle size={14} /><span>Ready to accept requests</span></div>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12 border-t border-gray-200 dark:border-slate-700 pt-8">
          <div className="flex items-center gap-3 mb-6">
            <MessageSquare className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Reviews & Ratings</h2>
            {reviewStats.ratingCount > 0 && (
              <span className="flex items-center gap-1 text-lg text-yellow-500 font-bold ml-2">
                <Star className="h-5 w-5 fill-yellow-400" />{reviewStats.avgRating} <span className="text-sm font-normal text-gray-500">({reviewStats.ratingCount})</span>
              </span>
            )}
          </div>

          {requestStatus.isAdmitted && (
            <form onSubmit={handleSubmitReview} className="mb-8 rounded-xl border border-blue-200 bg-blue-50 dark:bg-blue-900/10 dark:border-blue-800 p-6 space-y-4">
              <p className="font-semibold text-gray-900 dark:text-white">Share Your Experience</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} type="button" onClick={() => setReviewForm(p => ({ ...p, rating: n }))} className="focus:outline-none">
                    <Star className={`h-8 w-8 transition-colors ${n <= reviewForm.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300 dark:text-gray-600"}`} />
                  </button>
                ))}
              </div>
              <textarea rows={3} placeholder="Tell others what you think about this hostel..." value={reviewForm.comment} onChange={(e) => setReviewForm(p => ({ ...p, comment: e.target.value }))} className="w-full rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 text-gray-800 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              <button type="submit" disabled={submitReviewMutation.isPending || !reviewForm.rating} className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition shadow-md">
                {submitReviewMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}Submit My Review
              </button>
            </form>
          )}

          {reviewsLoading ? (
            <div className="py-10 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" /></div>
          ) : reviews.length === 0 ? (
            <div className="py-10 text-center bg-white dark:bg-slate-800 rounded-xl border border-dashed border-gray-300 dark:border-slate-700">
              <MessageSquare className="h-10 w-10 mx-auto text-gray-300 mb-2" />
              <p className="text-gray-500 dark:text-slate-400">No reviews yet. Be the first to share your feedback!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r._id} className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm hover:shadow-md transition">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center font-bold text-blue-600 text-sm">
                      {(r.student?.user?.name || r.student?.name || "S").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white capitalize">{r.student?.user?.name || r.student?.name || "Anonymous"}</p>
                      <div className="flex items-center gap-2">
                         <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((n) => (
                            <Star key={n} className={`h-3 w-3 ${n <= r.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                          ))}
                        </div>
                        <span className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>
                  {r.comment && <p className="text-gray-700 dark:text-slate-300 leading-relaxed pl-1">{r.comment}</p>}
                  {r.ownerReply && (
                    <div className="mt-4 ml-4 pl-4 border-l-2 border-blue-100 dark:border-blue-900/30 bg-blue-50/30 dark:bg-blue-900/5 p-3 rounded-r-lg">
                      <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1 uppercase tracking-wider">Owner Response</p>
                      <p className="text-sm text-gray-600 dark:text-slate-400 italic">"{r.ownerReply}"</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile fixed bottom bar */}
      <div className="md:hidden fixed bottom-14 left-0 right-0 z-40 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between shadow-2xl">
        <div>
          <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">Monthly Fee</p>
          <p className="text-xl font-bold text-blue-600">₹{hostel.pricePerMonth?.toLocaleString("en-IN") || hostel.price}</p>
        </div>
        <button onClick={handleRequestRoom} disabled={buttonDisabled} className={`${buttonDisabled ? "bg-gray-400" : "bg-blue-600 shadow-blue-200"} px-8 py-3 rounded-xl font-bold text-white transition-all transform active:scale-95`}>
          {buttonText}
        </button>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 p-4 md:p-10 backdrop-blur-md" onClick={() => setShowImageModal(false)}>
          <button onClick={() => setShowImageModal(false)} className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors z-70">
            <XCircle size={40} strokeWidth={1.5} />
          </button>
          <img src={images[selectedImage]} alt={hostel.name} className="max-h-full max-w-full rounded-xl shadow-2xl animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      {/* Login Prompt */}
      <LoginPrompt isOpen={showLoginPrompt} onClose={() => setShowLoginPrompt(false)} />
    </div>
  );
};

export default HostelDetails;