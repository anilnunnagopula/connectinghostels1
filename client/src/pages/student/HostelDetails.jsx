// /**
//  * HostelDetails.jsx - Updated Version
//  *
//  * CHANGES FROM ORIGINAL:
//  * 1. Removed booking modal (replaced with dedicated page)
//  * 2. "Request Room" button now navigates to /booking-request/:hostelId
//  * 3. Added check for existing requests and admission status
//  * 4. Button shows appropriate states: Available / Already Requested / Already Admitted / Not Available
//  *
//  * This is a MINIMAL CHANGE version - only the booking flow is modified
//  */

// import React, { useEffect, useState, useCallback, useMemo } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { addToRecentlyViewed } from "../../utils/viewHistoryUtils";
// import LoginPrompt from "../../components/LoginPrompt";

// import {
//   MapPin,
//   Building2,
//   IndianRupee,
//   Star,
//   Heart,
//   Share2,
//   ArrowLeft,
//   Wifi,
//   Utensils,
//   Tv,
//   Wind,
//   Loader2,
//   CheckCircle,
//   XCircle,
//   Users,
//   Bed,
//   AlertCircle,
// } from "lucide-react";

// // ============================================================================
// // CONSTANTS
// // ============================================================================

// const API_BASE_URL = process.env.REACT_APP_API_URL;

// // Amenity icons mapping
// const AMENITY_ICONS = {
//   WiFi: <Wifi size={20} />,
//   Food: <Utensils size={20} />,
//   TV: <Tv size={20} />,
//   AC: <Wind size={20} />,
//   Laundry: <Building2 size={20} />,
// };

// // ============================================================================
// // UTILITY FUNCTIONS
// // ============================================================================

// const getToken = () => localStorage.getItem("token");

// // ============================================================================
// // MAIN COMPONENT
// // ============================================================================

// const HostelDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   // ==========================================================================
//   // STATE MANAGEMENT
//   // ==========================================================================

//   const [state, setState] = useState({
//     hostel: null,
//     loading: true,
//     error: null,
//     isInterested: false,
//     savingInterest: false,
//   });

//   const [selectedImage, setSelectedImage] = useState(0);
//   const [showImageModal, setShowImageModal] = useState(false);
//   const [showLoginPrompt, setShowLoginPrompt] = useState(false); // ADD THIS

//   // NEW: Request status checking
//   const [requestStatus, setRequestStatus] = useState({
//     hasRequest: false,
//     isAdmitted: false,
//     checking: true,
//   });

//   // ==========================================================================
//   // DATA FETCHING
//   // ==========================================================================
// const isAuthenticated = () => {
//   const token = localStorage.getItem("token");
//   const userObj = localStorage.getItem("user");
//   if (token) return true;
//   if (userObj) {
//     try {
//       const parsed = JSON.parse(userObj);
//       return !!parsed.token;
//     } catch {
//       return false;
//     }
//   }
//   return false;
// };
//   /**
//    * Fetches hostel details from API or localStorage
//    */
//   const fetchHostelDetails = useCallback(async () => {
//     try {
//       setState((prev) => ({ ...prev, loading: true, error: null }));

//       const token = getToken();

//       try {
//         const response = await axios.get(
//           `${API_BASE_URL}/api/hostels/${id}`,
//           token ? { headers: { Authorization: `Bearer ${token}` } } : {},
//         );

//         setState((prev) => ({
//           ...prev,
//           hostel: response.data.data || response.data,
//           loading: false,
//           error: null,
//         }));
//         return;
//       } catch (apiError) {
//         console.log("API fetch failed, trying localStorage...");
//       }

//       // Fallback: Try localStorage
//       const storedHostels = localStorage.getItem("hostelData");
//       if (storedHostels) {
//         const hostels = JSON.parse(storedHostels);
//         const found = hostels.find((h) => h.id === parseInt(id));

//         if (found) {
//           setState({
//             hostel: found,
//             loading: false,
//             error: null,
//             isInterested: false,
//             savingInterest: false,
//           });
//         } else {
//           setState((prev) => ({
//             ...prev,
//             hostel: null,
//             loading: false,
//             error: "Hostel not found",
//           }));
//         }
//       } else {
//         setState((prev) => ({
//           ...prev,
//           hostel: null,
//           loading: false,
//           error: "No hostel data available",
//         }));
//       }
//     } catch (error) {
//       console.error("Error fetching hostel details:", error);
//       setState((prev) => ({
//         ...prev,
//         hostel: null,
//         loading: false,
//         error: error.message || "Failed to load hostel details",
//       }));
//     }
//   }, [id]);

//   /**
//    * NEW: Check if student has existing request or is admitted
//    */
//   const checkRequestStatus = useCallback(async () => {
//     const token = getToken();
//     if (!token) {
//       setRequestStatus({
//         hasRequest: false,
//         isAdmitted: false,
//         checking: false,
//       });
//       return;
//     }

//     try {
//       const response = await axios.get(
//         `${API_BASE_URL}/api/students/my-requests`,
//         { headers: { Authorization: `Bearer ${token}` } },
//       );

//       const { requests = [], currentHostel = null } = response.data || {};

//       setRequestStatus({
//         hasRequest: requests.some((req) => req.status === "Pending"),
//         isAdmitted: Boolean(currentHostel),
//         checking: false,
//       });
//     } catch (err) {
//       // 🎯 IMPORTANT PART
//       if (
//         err.response?.status === 404 &&
//         err.response?.data?.error === "Student profile not found."
//       ) {
//         // Treat as valid state, not failure
//         setRequestStatus({
//           hasRequest: false,
//           isAdmitted: false,
//           checking: false,
//         });
//         return;
//       }

//       console.error("Error checking request status:", err);
//       setRequestStatus({
//         hasRequest: false,
//         isAdmitted: false,
//         checking: false,
//       });
//     }
//   }, []);

//   useEffect(() => {
//     fetchHostelDetails();
//     checkRequestStatus();
//   }, [fetchHostelDetails, checkRequestStatus]);

//   // Adds to recently viewed page
//   useEffect(() => {
//     if (state.hostel) {
//       addToRecentlyViewed(state.hostel);
//     }
//   }, [state.hostel]);

//   // ==========================================================================
//   // EVENT HANDLERS
//   // ==========================================================================

//   /**
//    * Navigates back to previous page
//    */
//   const handleGoBack = useCallback(() => {
//     navigate(-1);
//   }, [navigate]);

//   /**
//    * Toggles interested/wishlist status
//    */
//   /**
//    * FIXED handleToggleInterested function for HostelDetails.jsx
//    *
//    * Replace your existing handleToggleInterested function with this one
//    */

//   const handleToggleInterested = useCallback(async () => {
//     const token = getToken();
//     if (!token) {
//       navigate("/login");
//       return;
//     }

//     setState((prev) => ({ ...prev, savingInterest: true }));

//     try {
//       // ✅ FIX: Use _id instead of id (MongoDB uses _id)
//       const hostelId = state.hostel._id || state.hostel.id;

//       if (!hostelId) {
//         throw new Error("Hostel ID not found");
//       }

//       await axios.post(
//         `${API_BASE_URL}/api/students/interested/${hostelId}`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } },
//       );

//       setState((prev) => ({
//         ...prev,
//         isInterested: !prev.isInterested,
//         savingInterest: false,
//       }));
//     } catch (error) {
//       console.error("Failed to update interest:", error);
//       setState((prev) => ({ ...prev, savingInterest: false }));

//       // Fallback: Use localStorage
//       const interested = JSON.parse(
//         localStorage.getItem("interestedHostels") || "[]",
//       );
//       // ✅ FIX: Check both _id and id
//       const hostelId = state.hostel._id || state.hostel.id;
//       const index = interested.findIndex((h) => (h._id || h.id) === hostelId);

//       if (index > -1) {
//         interested.splice(index, 1);
//         setState((prev) => ({ ...prev, isInterested: false }));
//       } else {
//         interested.push(state.hostel);
//         setState((prev) => ({ ...prev, isInterested: true }));
//       }

//       localStorage.setItem("interestedHostels", JSON.stringify(interested));
//       setState((prev) => ({ ...prev, savingInterest: false }));
//     }
//   }, [state.hostel, navigate]);

//   /**
//    * UPDATED: Navigate to booking request page
//    */
//   const handleRequestRoom = useCallback(() => {
//     const token = getToken();
//     // if (!token) {
//     //   navigate("/login");
//     //   return;
//     // }
//     if (!token) {
//       setShowLoginPrompt(true);
//       return;
//     }

//     // Navigate to dedicated booking page
//     navigate(`/booking-request/${id}`);
//   }, [id, navigate]);

//   /**
//    * Handles share functionality
//    */
//   const handleShare = useCallback(() => {
//     if (navigator.share) {
//       navigator.share({
//         title: state.hostel?.name,
//         text: `Check out ${state.hostel?.name} at ${state.hostel?.location}`,
//         url: window.location.href,
//       });
//     } else {
//       navigator.clipboard.writeText(window.location.href);
//       alert("Link copied to clipboard!");
//     }
//   }, [state.hostel]);

//   /**
//    * Opens image modal
//    */
//   const handleImageClick = useCallback((index) => {
//     setSelectedImage(index);
//     setShowImageModal(true);
//   }, []);

//   /**
//    * Closes image modal
//    */
//   const handleCloseModal = useCallback(() => {
//     setShowImageModal(false);
//   }, []);

//   // ==========================================================================
//   // COMPUTED VALUES
//   // ==========================================================================

//   /**
//    * Generates image gallery from hostel data
//    */
//   const images = useMemo(() => {
//     if (!state.hostel) return [];

//     if (state.hostel.images && state.hostel.images.length > 0) {
//       return state.hostel.images;
//     }

//     return [
//       "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?fit=crop&w=1200&q=80",
//       "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?fit=crop&w=1200&q=80",
//       "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?fit=crop&w=1200&q=80",
//     ];
//   }, [state.hostel]);

//   // ==========================================================================
//   // RENDER HELPERS
//   // ==========================================================================

//   /**
//    * Renders loading state
//    */
//   const renderLoading = () => (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
//       <div className="text-center">
//         <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
//         <p className="text-gray-600 dark:text-gray-400">
//           Loading hostel details...
//         </p>
//       </div>
//     </div>
//   );

//   /**
//    * Renders error state
//    */
//   const renderError = () => (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
//       <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md text-center">
//         <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
//         <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">
//           Hostel Not Found
//         </h2>
//         <p className="text-gray-600 dark:text-gray-400 mb-6">{state.error}</p>
//         <button
//           onClick={handleGoBack}
//           className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
//         >
//           Go Back
//         </button>
//       </div>
//     </div>
//   );

//   /**
//    * Renders image gallery
//    */
//   const renderImageGallery = () => (
//     <div className="grid grid-cols-4 gap-2 mb-6">
//       <div
//         className="col-span-4 md:col-span-3 cursor-pointer overflow-hidden rounded-lg"
//         onClick={() => handleImageClick(0)}
//       >
//         <img
//           src={images[0]}
//           alt={state.hostel.name}
//           className="w-full h-96 object-cover hover:scale-105 transition-transform duration-300"
//         />
//       </div>
//       <div className="col-span-4 md:col-span-1 grid grid-cols-2 md:grid-cols-1 gap-2">
//         {images.slice(1, 3).map((img, index) => (
//           <div
//             key={index}
//             className="cursor-pointer overflow-hidden rounded-lg"
//             onClick={() => handleImageClick(index + 1)}
//           >
//             <img
//               src={img}
//               alt={`${state.hostel.name} ${index + 2}`}
//               className="w-full h-44 object-cover hover:scale-105 transition-transform duration-300"
//             />
//           </div>
//         ))}
//       </div>
//     </div>
//   );

//   /**
//    * Renders image modal
//    */
//   const renderImageModal = () => {
//     if (!showImageModal) return null;

//     return (
//       <div
//         className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
//         onClick={handleCloseModal}
//       >
//         <div className="relative max-w-4xl w-full">
//           <button
//             onClick={handleCloseModal}
//             className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition"
//           >
//             <XCircle size={24} />
//           </button>
//           <img
//             src={images[selectedImage]}
//             alt={state.hostel.name}
//             className="w-full h-auto rounded-lg"
//           />
//         </div>
//       </div>
//     );
//   };

//   /**
//    * Renders hostel header with actions
//    */
//   const renderHeader = () => (
//     <div className="flex items-start justify-between mb-6">
//       <div className="flex-1">
//         <button
//           onClick={handleGoBack}
//           className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition"
//         >
//           <ArrowLeft size={20} />
//           <span>Back</span>
//         </button>
//         <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-800 dark:text-white">
//           {state.hostel.name}
//         </h1>
//         <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
//           <div className="flex items-center gap-1">
//             <MapPin size={18} />
//             <span>{state.hostel.location}</span>
//           </div>
//           <div className="flex items-center gap-1">
//             <Building2 size={18} />
//             <span>{state.hostel.type}</span>
//           </div>
//         </div>
//       </div>
//       <div className="flex gap-2">
//         <button
//           onClick={handleShare}
//           className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
//           aria-label="Share"
//         >
//           <Share2 size={20} />
//         </button>
//         <button
//           onClick={handleToggleInterested}
//           disabled={state.savingInterest}
//           className={`p-3 rounded-full transition ${
//             state.isInterested
//               ? "bg-red-500 text-white"
//               : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
//           }`}
//           aria-label="Add to wishlist"
//         >
//           {state.savingInterest ? (
//             <Loader2 size={20} className="animate-spin" />
//           ) : (
//             <Heart size={20} fill={state.isInterested ? "white" : "none"} />
//           )}
//         </button>
//       </div>
//     </div>
//   );

//   /**
//    * UPDATED: Renders price and booking section with request status
//    */
//   const renderPriceSection = () => {
//     // Determine button state
//     let buttonText = "Request Room";
//     let buttonDisabled = false;
//     let buttonClass = "bg-blue-600 hover:bg-blue-700 text-white";
//     let buttonIcon = null;

//     if (requestStatus.checking) {
//       buttonText = "Checking...";
//       buttonDisabled = true;
//       buttonClass = "bg-gray-400 cursor-not-allowed text-white";
//       buttonIcon = <Loader2 size={20} className="animate-spin" />;
//     } else if (requestStatus.isAdmitted) {
//       buttonText = "Already Admitted";
//       buttonDisabled = true;
//       buttonClass = "bg-green-500 cursor-not-allowed text-white";
//       buttonIcon = <CheckCircle size={20} />;
//     } else if (requestStatus.hasRequest) {
//       buttonText = "Request Pending";
//       buttonDisabled = true;
//       buttonClass = "bg-yellow-500 cursor-not-allowed text-white";
//       buttonIcon = <AlertCircle size={20} />;
//     } else if (state.hostel.availableRooms <= 0) {
//       buttonText = "Not Available";
//       buttonDisabled = true;
//       buttonClass =
//         "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed";
//       buttonIcon = <XCircle size={20} />;
//     }

//     return (
//       <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
//         <div className="flex items-center justify-between">
//           <div>
//             <p className="text-gray-600 dark:text-gray-400 text-sm">
//               Price per month
//             </p>
//             <div className="flex items-center gap-2 text-3xl font-bold text-gray-900 dark:text-white">
//               <IndianRupee size={28} />
//               <span>
//                 {state.hostel.price?.replace("₹", "").replace("/mo", "")}
//               </span>
//             </div>
//           </div>
//           <div className="flex flex-col gap-2">
//             <button
//               onClick={handleRequestRoom}
//               disabled={buttonDisabled}
//               className={`px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 ${buttonClass}`}
//             >
//               {buttonIcon}
//               {buttonText}
//             </button>
//             {!requestStatus.isAdmitted &&
//               !requestStatus.hasRequest &&
//               state.hostel.availableRooms > 0 && (
//                 <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm">
//                   <CheckCircle size={16} />
//                   <span>
//                     Available ({state.hostel.availableRooms} rooms left)
//                   </span>
//                 </div>
//               )}
//             {requestStatus.hasRequest && (
//               <p className="text-xs text-yellow-600 dark:text-yellow-400 text-center">
//                 View status in dashboard
//               </p>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   /**
//    * Renders hostel details section
//    */
//   const renderDetails = () => (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//       <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
//         <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
//           Hostel Information
//         </h2>
//         <div className="space-y-3">
//           <div className="flex items-center gap-3">
//             <Building2 className="text-blue-500" size={20} />
//             <span className="text-gray-600 dark:text-gray-400">Type:</span>
//             <span className="font-semibold text-gray-900 dark:text-white">
//               {state.hostel.type}
//             </span>
//           </div>
//           <div className="flex items-center gap-3">
//             <Bed className="text-blue-500" size={20} />
//             <span className="text-gray-600 dark:text-gray-400">Floors:</span>
//             <span className="font-semibold text-gray-900 dark:text-white">
//               {state.hostel.floors}
//             </span>
//           </div>
//           <div className="flex items-center gap-3">
//             <Users className="text-blue-500" size={20} />
//             <span className="text-gray-600 dark:text-gray-400">Capacity:</span>
//             <span className="font-semibold text-gray-900 dark:text-white">
//               {state.hostel.capacity || "N/A"}
//             </span>
//           </div>
//         </div>
//       </div>

//       <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
//         <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
//           Amenities & Features
//         </h2>
//         <div className="grid grid-cols-2 gap-3">
//           {state.hostel.features?.map((feature, index) => (
//             <div
//               key={index}
//               className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
//             >
//               {AMENITY_ICONS[feature] || (
//                 <CheckCircle size={16} className="text-green-500" />
//               )}
//               <span className="text-sm">{feature}</span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );

//   // ==========================================================================
//   // MAIN RENDER
//   // ==========================================================================

//   if (state.loading) {
//     return renderLoading();
//   }

//   if (state.error || !state.hostel) {
//     return renderError();
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white">
//       <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
//         {renderHeader()}
//         {renderImageGallery()}
//         {renderPriceSection()}
//         {renderDetails()}
//       </div>
//       {renderImageModal()}
//     </div>
//   );
// };;
// <LoginPrompt
//   isOpen={LoginPrompt}
//   onClose={() => setShowLoginPrompt(false)}
// />;
// export default HostelDetails;

// /**
//  * ============================================================================
//  * CHANGES SUMMARY
//  * ============================================================================
//  *
//  * REMOVED:
//  * ❌ Booking modal (showBookingModal, bookingRoom, isSubmittingBooking states)
//  * ❌ handleSubmitRequest function
//  * ❌ renderBookingModal function
//  *
//  * ADDED:
//  * ✅ requestStatus state (hasRequest, isAdmitted, checking)
//  * ✅ checkRequestStatus function
//  * ✅ Button state logic based on request/admission status
//  * ✅ Navigate to /booking-request/:hostelId on button click
//  * ✅ Visual feedback for different button states
//  *
//  * BENEFITS:
//  * 1. Cleaner separation of concerns (details vs booking)
//  * 2. Dedicated page for complex booking form
//  * 3. Better UX with proper request status visibility
//  * 4. Prevents duplicate requests at UI level
//  * 5. Shows appropriate messaging for each state
//  */
/**
 * HostelDetails.jsx - Modernized Version
 *
 * CHANGES FROM ORIGINAL:
 * 1. Updated UI to match Index.tsx modern design
 * 2. Improved layout and component structure
 * 3. Enhanced visual feedback and animations
 * 4. Better responsive design
 * 5. All existing endpoints and functionality preserved
 */

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { addToRecentlyViewed } from "../../utils/viewHistoryUtils";
import LoginPrompt from "../../components/LoginPrompt";

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
} from "lucide-react";

// ============================================================================
// CONSTANTS
// ============================================================================

const API_BASE_URL = process.env.REACT_APP_API_URL;

// Amenity icons mapping
const AMENITY_ICONS = {
  WiFi: <Wifi size={18} />,
  Food: <Utensils size={18} />,
  TV: <Tv size={18} />,
  AC: <Wind size={18} />,
  Laundry: <Building2 size={18} />,
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const getToken = () => localStorage.getItem("token");

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const HostelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // ==========================================================================
  // STATE MANAGEMENT
  // ==========================================================================

  const [state, setState] = useState({
    hostel: null,
    loading: true,
    error: null,
    isInterested: false,
    savingInterest: false,
  });

  const [selectedImage, setSelectedImage] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Request status checking
  const [requestStatus, setRequestStatus] = useState({
    hasRequest: false,
    isAdmitted: false,
    checking: true,
  });

  // ==========================================================================
  // DATA FETCHING
  // ==========================================================================

  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    const userObj = localStorage.getItem("user");
    if (token) return true;
    if (userObj) {
      try {
        const parsed = JSON.parse(userObj);
        return !!parsed.token;
      } catch {
        return false;
      }
    }
    return false;
  };

  /**
   * Fetches hostel details from API or localStorage
   */
  const fetchHostelDetails = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const token = getToken();

      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/hostels/${id}`,
          token ? { headers: { Authorization: `Bearer ${token}` } } : {},
        );

        setState((prev) => ({
          ...prev,
          hostel: response.data.data || response.data,
          loading: false,
          error: null,
        }));
        return;
      } catch (apiError) {
        console.log("API fetch failed, trying localStorage...");
      }

      // Fallback: Try localStorage
      const storedHostels = localStorage.getItem("hostelData");
      if (storedHostels) {
        const hostels = JSON.parse(storedHostels);
        const found = hostels.find((h) => h.id === parseInt(id));

        if (found) {
          setState({
            hostel: found,
            loading: false,
            error: null,
            isInterested: false,
            savingInterest: false,
          });
        } else {
          setState((prev) => ({
            ...prev,
            hostel: null,
            loading: false,
            error: "Hostel not found",
          }));
        }
      } else {
        setState((prev) => ({
          ...prev,
          hostel: null,
          loading: false,
          error: "No hostel data available",
        }));
      }
    } catch (error) {
      console.error("Error fetching hostel details:", error);
      setState((prev) => ({
        ...prev,
        hostel: null,
        loading: false,
        error: error.message || "Failed to load hostel details",
      }));
    }
  }, [id]);

  /**
   * Check if student has existing request or is admitted
   */
  const checkRequestStatus = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setRequestStatus({
        hasRequest: false,
        isAdmitted: false,
        checking: false,
      });
      return;
    }

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/students/my-requests`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const { requests = [], currentHostel = null } = response.data || {};

      setRequestStatus({
        hasRequest: requests.some((req) => req.status === "Pending"),
        isAdmitted: Boolean(currentHostel),
        checking: false,
      });
    } catch (err) {
      if (
        err.response?.status === 404 &&
        err.response?.data?.error === "Student profile not found."
      ) {
        setRequestStatus({
          hasRequest: false,
          isAdmitted: false,
          checking: false,
        });
        return;
      }

      console.error("Error checking request status:", err);
      setRequestStatus({
        hasRequest: false,
        isAdmitted: false,
        checking: false,
      });
    }
  }, []);

  useEffect(() => {
    fetchHostelDetails();
    checkRequestStatus();
  }, [fetchHostelDetails, checkRequestStatus]);

  // Adds to recently viewed page
  useEffect(() => {
    if (state.hostel) {
      addToRecentlyViewed(state.hostel);
    }
  }, [state.hostel]);

  // ==========================================================================
  // EVENT HANDLERS
  // ==========================================================================

  /**
   * Navigates back to previous page
   */
  const handleGoBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  /**
   * Toggles interested/wishlist status
   */
  const handleToggleInterested = useCallback(async () => {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    setState((prev) => ({ ...prev, savingInterest: true }));

    try {
      const hostelId = state.hostel._id || state.hostel.id;

      if (!hostelId) {
        throw new Error("Hostel ID not found");
      }

      await axios.post(
        `${API_BASE_URL}/api/students/interested/${hostelId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setState((prev) => ({
        ...prev,
        isInterested: !prev.isInterested,
        savingInterest: false,
      }));
    } catch (error) {
      console.error("Failed to update interest:", error);
      setState((prev) => ({ ...prev, savingInterest: false }));

      // Fallback: Use localStorage
      const interested = JSON.parse(
        localStorage.getItem("interestedHostels") || "[]",
      );
      const hostelId = state.hostel._id || state.hostel.id;
      const index = interested.findIndex((h) => (h._id || h.id) === hostelId);

      if (index > -1) {
        interested.splice(index, 1);
        setState((prev) => ({ ...prev, isInterested: false }));
      } else {
        interested.push(state.hostel);
        setState((prev) => ({ ...prev, isInterested: true }));
      }

      localStorage.setItem("interestedHostels", JSON.stringify(interested));
      setState((prev) => ({ ...prev, savingInterest: false }));
    }
  }, [state.hostel, navigate]);

  /**
   * Navigate to booking request page
   */
  const handleRequestRoom = useCallback(() => {
    const token = getToken();
    if (!token) {
      setShowLoginPrompt(true);
      return;
    }

    // Navigate to dedicated booking page
    navigate(`/booking-request/${id}`);
  }, [id, navigate]);

  /**
   * Handles share functionality
   */
  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: state.hostel?.name,
        text: `Check out ${state.hostel?.name} at ${state.hostel?.location}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  }, [state.hostel]);

  /**
   * Opens image modal
   */
  const handleImageClick = useCallback((index) => {
    setSelectedImage(index);
    setShowImageModal(true);
  }, []);

  /**
   * Closes image modal
   */
  const handleCloseModal = useCallback(() => {
    setShowImageModal(false);
  }, []);

  // ==========================================================================
  // COMPUTED VALUES
  // ==========================================================================

  /**
   * Generates image gallery from hostel data
   */
  const images = useMemo(() => {
    if (!state.hostel) return [];

    if (state.hostel.images && state.hostel.images.length > 0) {
      return state.hostel.images;
    }

    return [
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?fit=crop&w=1200&q=80",
    ];
  }, [state.hostel]);

  // ==========================================================================
  // RENDER HELPERS
  // ==========================================================================

  /**
   * Renders loading state
   */
  const renderLoading = () => (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-blue-600" />
        <p className="text-gray-600 dark:text-gray-400">
          Loading hostel details...
        </p>
      </div>
    </div>
  );

  /**
   * Renders error state
   */
  const renderError = () => (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-xl dark:bg-gray-800">
        <XCircle className="mx-auto mb-4 h-16 w-16 text-red-500" />
        <h2 className="mb-2 text-2xl font-bold text-gray-800 dark:text-white">
          Hostel Not Found
        </h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">{state.error}</p>
        <button
          onClick={handleGoBack}
          className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white transition hover:from-blue-700 hover:to-purple-700"
        >
          Go Back
        </button>
      </div>
    </div>
  );

  /**
   * Renders image modal
   */
  const renderImageModal = () => {
    if (!showImageModal) return null;

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
        onClick={handleCloseModal}
      >
        <div className="relative w-full max-w-4xl">
          <button
            onClick={handleCloseModal}
            className="absolute -top-12 right-0 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            <XCircle size={24} />
          </button>
          <img
            src={images[selectedImage]}
            alt={state.hostel.name}
            className="h-auto w-full rounded-2xl"
          />
        </div>
      </div>
    );
  };

  // ==========================================================================
  // MAIN RENDER
  // ==========================================================================

  if (state.loading) {
    return renderLoading();
  }

  if (state.error || !state.hostel) {
    return renderError();
  }

  // Determine button state
  let buttonText = "Send Request";
  let buttonDisabled = false;
  let buttonClass =
    "w-full gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3.5 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:from-blue-700 hover:to-purple-700";
  let buttonIcon = <Send size={18} />;

  if (requestStatus.checking) {
    buttonText = "Checking...";
    buttonDisabled = true;
    buttonClass =
      "w-full gap-2 rounded-xl bg-gray-400 px-6 py-3.5 font-semibold text-white cursor-not-allowed";
    buttonIcon = <Loader2 size={18} className="animate-spin" />;
  } else if (requestStatus.isAdmitted) {
    buttonText = "Already Admitted";
    buttonDisabled = true;
    buttonClass =
      "w-full gap-2 rounded-xl bg-green-500 px-6 py-3.5 font-semibold text-white cursor-not-allowed";
    buttonIcon = <CheckCircle size={18} />;
  } else if (requestStatus.hasRequest) {
    buttonText = "Request Pending";
    buttonDisabled = true;
    buttonClass =
      "w-full gap-2 rounded-xl bg-yellow-500 px-6 py-3.5 font-semibold text-white cursor-not-allowed";
    buttonIcon = <AlertCircle size={18} />;
  } else if (state.hostel.availableRooms <= 0) {
    buttonText = "Not Available";
    buttonDisabled = true;
    buttonClass =
      "w-full gap-2 rounded-xl bg-gray-300 px-6 py-3.5 font-semibold text-gray-500 cursor-not-allowed dark:bg-gray-700";
    buttonIcon = <XCircle size={18} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto max-w-4xl px-4 py-6 pb-24 md:pb-8">
        {/* Back Button */}
        <Link
          to="/browse"
          className="mb-4 inline-flex items-center gap-1 text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Back to listings
        </Link>

        {/* Hero Image */}
        <div className="mb-6 overflow-hidden rounded-2xl shadow-lg">
          <img
            src={images[0]}
            alt={state.hostel.name}
            className="h-64 w-full cursor-pointer object-cover transition-transform duration-300 hover:scale-105 md:h-80"
            onClick={() => handleImageClick(0)}
          />
        </div>

        {/* Header with Actions */}
        <div className="mb-6">
          <div className="mb-2 flex flex-wrap items-start justify-between gap-3">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">
              {state.hostel.name}
            </h1>
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="rounded-full bg-gray-100 p-2.5 transition hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                aria-label="Share"
              >
                <Share2 size={18} />
              </button>
              <button
                onClick={handleToggleInterested}
                disabled={state.savingInterest}
                className={`rounded-full p-2.5 transition ${
                  state.isInterested
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                }`}
                aria-label="Add to wishlist"
              >
                {state.savingInterest ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Heart size={18} fill={state.isInterested ? "white" : "none"} />
                )}
              </button>
            </div>
          </div>
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
            <MapPin className="h-4 w-4" />
            <span>{state.hostel.location}</span>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Left Column - Details */}
          <div className="space-y-6 md:col-span-2">
            {/* About Section */}
            {state.hostel.description && (
              <div>
                <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  About
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {state.hostel.description}
                </p>
              </div>
            )}

            {/* Facilities */}
            <div>
              <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
                Facilities & Amenities
              </h2>
              <div className="flex flex-wrap gap-2">
                {state.hostel.features?.map((feature, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  >
                    {AMENITY_ICONS[feature] || (
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                    )}
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            {/* Hostel Information */}
            <div>
              <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
                Hostel Information
              </h2>
              <div className="space-y-3 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Building2 className="h-4 w-4 text-blue-500" />
                    Type
                  </span>
                  <span className="font-medium capitalize text-gray-900 dark:text-white">
                    {state.hostel.type}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Bed className="h-4 w-4 text-blue-500" />
                    Floors
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {state.hostel.floors}
                  </span>
                </div>
                {state.hostel.capacity && (
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Users className="h-4 w-4 text-blue-500" />
                      Capacity
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {state.hostel.capacity}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Images (if available) */}
            {images.length > 1 && (
              <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                {images.slice(1, 4).map((img, index) => (
                  <div
                    key={index}
                    className="cursor-pointer overflow-hidden rounded-lg"
                    onClick={() => handleImageClick(index + 1)}
                  >
                    <img
                      src={img}
                      alt={`${state.hostel.name} ${index + 2}`}
                      className="h-32 w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Pricing & Booking */}
          <div className="space-y-4">
            <div className="sticky top-6 space-y-4 rounded-xl border border-gray-200 bg-white p-5 shadow-lg dark:border-gray-700 dark:bg-gray-800">
              {/* Price */}
              <div className="mb-4">
                <div className="flex items-baseline gap-1">
                  <IndianRupee className="h-6 w-6 text-blue-600" />
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    {state.hostel.price?.replace("₹", "").replace("/mo", "") ||
                      state.hostel.price}
                  </span>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  /month
                </span>
              </div>

              {/* Availability Info */}
              <div className="space-y-2 border-t border-gray-200 pt-4 text-sm dark:border-gray-700">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Availability
                  </span>
                  <span
                    className={
                      state.hostel.availableRooms > 0
                        ? "font-medium text-green-600"
                        : "font-medium text-red-600"
                    }
                  >
                    {state.hostel.availableRooms > 0 ? "Available" : "Full"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Rooms Left
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {state.hostel.availableRooms || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Type</span>
                  <span className="font-medium capitalize text-gray-900 dark:text-white">
                    {state.hostel.type}
                  </span>
                </div>
              </div>

              {/* Request Button */}
              <button
                onClick={handleRequestRoom}
                disabled={buttonDisabled}
                className={buttonClass}
              >
                {buttonIcon}
                {buttonText}
              </button>

              {/* Status Messages */}
              {!requestStatus.isAdmitted &&
                !requestStatus.hasRequest &&
                state.hostel.availableRooms > 0 && (
                  <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                    <CheckCircle size={14} />
                    <span>Ready to accept requests</span>
                  </div>
                )}
              {requestStatus.hasRequest && (
                <p className="text-center text-xs text-yellow-600 dark:text-yellow-400">
                  View status in your dashboard
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {renderImageModal()}

      {/* Login Prompt */}
      <LoginPrompt
        isOpen={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
      />
    </div>
  );
};

export default HostelDetails;

/**
 * ============================================================================
 * MODERNIZATION SUMMARY
 * ============================================================================
 *
 * UPDATED STYLING:
 * ✅ Modern card-based layout matching Index.tsx
 * ✅ Improved spacing and typography
 * ✅ Better responsive grid system
 * ✅ Enhanced button states with gradients
 * ✅ Cleaner color scheme and shadows
 * ✅ Improved dark mode support
 * ✅ Better visual hierarchy
 *
 * PRESERVED:
 * ✅ All existing API endpoints
 * ✅ All functionality (wishlist, requests, etc.)
 * ✅ Request status checking
 * ✅ Image modal
 * ✅ Login prompts
 * ✅ localStorage fallbacks
 *
 * BENEFITS:
 * 1. Consistent design language with Index.tsx
 * 2. Better mobile responsiveness
 * 3. Improved user experience
 * 4. Modern, professional appearance
 * 5. All existing features intact
 */