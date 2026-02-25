import React, { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Search, Map, LayoutGrid, CheckCircle } from "lucide-react";
import { GoogleMap, useLoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { useHostels, useInterestedHostels, useToggleInterested } from "../hooks/useQueries";
import { SkeletonHostelCard } from "../components/ui/SkeletonCard";
import LoginPrompt from "../components/LoginPrompt";
import { useAuth } from "../context/AuthContext";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const LOCALITIES = ["Mangalpally", "Ibrahimpatnam", "Sheriguda", "Other"];

const LOCALITY_CENTERS = {
  Mangalpally:   { lat: 17.358, lng: 78.522 },
  Ibrahimpatnam: { lat: 17.126, lng: 78.640 },
  Sheriguda:     { lat: 17.347, lng: 78.567 },
  Other:         { lat: 17.385, lng: 78.487 },
};

const getImageUrl = (hostel) => {
  if (!hostel.images || hostel.images.length === 0)
    return "https://placehold.co/400x300?text=No+Image";
  const img = hostel.images[0];
  if (img.startsWith("http")) return img;
  return `${API_BASE_URL}/${img}`;
};

const isAuthenticated = () => !!localStorage.getItem("token") || !!localStorage.getItem("user");

// ─── Map View ─────────────────────────────────────────────────────────────────
const HostelMap = ({ hostels, localityCenter, onMarkerClick }) => {
  const [activeMarker, setActiveMarker] = useState(null);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "",
  });

  if (!isLoaded)
    return (
      <div className="flex items-center justify-center h-[500px] bg-gray-100 dark:bg-slate-800 rounded-xl">
        <p className="text-gray-500">Loading map…</p>
      </div>
    );

  return (
    <GoogleMap
      mapContainerClassName="w-full rounded-xl overflow-hidden"
      mapContainerStyle={{ height: "500px" }}
      center={localityCenter}
      zoom={13}
    >
      {hostels.map((h) => {
        const pos = h.coordinates?.lat
          ? { lat: h.coordinates.lat, lng: h.coordinates.lng }
          : localityCenter;
        return (
          <Marker
            key={h._id}
            position={pos}
            title={h.name}
            onClick={() => setActiveMarker(activeMarker === h._id ? null : h._id)}
          />
        );
      })}
      {activeMarker && (() => {
        const h = hostels.find((x) => x._id === activeMarker);
        if (!h) return null;
        const pos = h.coordinates?.lat
          ? { lat: h.coordinates.lat, lng: h.coordinates.lng }
          : localityCenter;
        return (
          <InfoWindow position={pos} onCloseClick={() => setActiveMarker(null)}>
            <div className="max-w-[180px]">
              <p className="font-semibold text-sm">{h.name}</p>
              <p className="text-xs text-gray-600">₹{h.pricePerMonth}/mo</p>
              <button
                onClick={() => onMarkerClick(h._id)}
                className="mt-1 text-xs text-blue-600 underline"
              >
                View details
              </button>
            </div>
          </InfoWindow>
        );
      })()}
    </GoogleMap>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const HostelListings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [locality, setLocality] = useState("Mangalpally");
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("None");
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'map'
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const { data, isLoading, isError } = useHostels({ locality, type: typeFilter, search: searchTerm, page });
  const { data: interestedData } = useInterestedHostels(!!user);
  const toggleMutation = useToggleInterested();

  const hostels = useMemo(() => data?.hostels || [], [data?.hostels]);
  const pagination = data?.pagination;

  const interestedIds = useMemo(() => {
    const list = Array.isArray(interestedData) ? interestedData : [];
    return new Set(list.map((h) => h._id || h.id || h));
  }, [interestedData]);

  const sortedHostels = useMemo(() => {
    const arr = [...hostels];
    if (sortOrder === "asc") arr.sort((a, b) => a.pricePerMonth - b.pricePerMonth);
    if (sortOrder === "desc") arr.sort((a, b) => b.pricePerMonth - a.pricePerMonth);
    return arr;
  }, [hostels, sortOrder]);

  const handleHostelClick = useCallback((hostelId) => {
    if (!isAuthenticated()) { setShowLoginPrompt(true); return; }
    navigate(`/student/hostels/${hostelId}`);
  }, [navigate]);

  const handleToggleFavorite = useCallback((e, hostel) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated()) { setShowLoginPrompt(true); return; }
    toggleMutation.mutate(hostel._id);
  }, [toggleMutation]);

  const localityCenter = LOCALITY_CENTERS[locality] || LOCALITY_CENTERS.Other;

  return (
    <>
      <div className="min-h-screen px-4 sm:px-6 py-6 bg-slate-50 dark:bg-slate-900">

        {/* ── Filter Bar ── */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-5 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-2 items-center">
            {/* Locality */}
            <select
              value={locality}
              onChange={(e) => { setLocality(e.target.value); setPage(1); }}
              className="px-3 py-2 border rounded-md dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              {LOCALITIES.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>

            {/* Type */}
            <select
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
              className="px-3 py-2 border rounded-md dark:bg-slate-800 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Types</option>
              <option value="Boys">Boys</option>
              <option value="Girls">Girls</option>
              <option value="Co-ed">Co-ed</option>
            </select>

            {/* Price sort */}
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-3 py-2 border rounded-md dark:bg-slate-800 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="None">Sort by Price</option>
              <option value="asc">Low → High</option>
              <option value="desc">High → Low</option>
            </select>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:flex-none sm:w-56">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search hostels…"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                className="w-full pl-9 pr-3 py-2 border rounded-md dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            {/* View toggle */}
            <div className="flex rounded-md border dark:border-slate-700 overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 transition-colors ${viewMode === "grid" ? "bg-blue-600 text-white" : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"}`}
                title="Grid view"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={`p-2 transition-colors ${viewMode === "map" ? "bg-blue-600 text-white" : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"}`}
                title="Map view"
              >
                <Map size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Unauthenticated banner ── */}
        {!isAuthenticated() && !isLoading && (
          <div className="mb-5 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700 rounded-xl p-4">
            <p className="text-sm text-indigo-800 dark:text-indigo-300">
              <strong>Browse freely!</strong> Login to save favourites and request rooms.
            </p>
          </div>
        )}

        {/* ── Map View ── */}
        {viewMode === "map" && (
          <div className="mb-6">
            <HostelMap
              hostels={sortedHostels}
              localityCenter={localityCenter}
              onMarkerClick={handleHostelClick}
            />
          </div>
        )}

        {/* ── Grid View / Skeletons / Error ── */}
        {viewMode === "grid" && (
          <>
            {isLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <SkeletonHostelCard key={i} />
                ))}
              </div>
            ) : isError ? (
              <div className="text-center mt-10 p-6 border rounded-2xl mx-auto max-w-md bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Could not load hostels
                </h3>
                <p className="text-gray-600 dark:text-slate-400 mb-4 text-sm">
                  Please log in or try again.
                </p>
                <button
                  onClick={() => navigate("/login")}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Login / Sign Up
                </button>
              </div>
            ) : sortedHostels.length === 0 ? (
              <div className="text-center text-slate-500 dark:text-slate-400 text-xl mt-10">
                No hostels found in {locality}. Try a different location or filter.
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {sortedHostels.map((hostel) => {
                  const isLiked = interestedIds.has(hostel._id);
                  const imgSrc = getImageUrl(hostel);

                  return (
                    <div key={hostel._id} className="relative group">
                      {/* Favourite button */}
                      <button
                        onClick={(e) => handleToggleFavorite(e, hostel)}
                        className="absolute top-3 left-3 z-20 p-2 bg-white/90 dark:bg-slate-800/90 rounded-full shadow-md hover:scale-110 transition-transform"
                        title={isAuthenticated() ? "Toggle favourite" : "Login to save"}
                        disabled={toggleMutation.isPending}
                      >
                        <Heart
                          size={20}
                          className={isLiked ? "fill-red-500 text-red-500" : "text-slate-400"}
                        />
                      </button>

                      {/* Card */}
                      <div
                        onClick={() => handleHostelClick(hostel._id)}
                        className="cursor-pointer bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-transparent hover:border-blue-500 h-full"
                      >
                        <div className="relative">
                          <img
                            src={imgSrc}
                            alt={hostel.name}
                            onError={(e) => { e.target.src = "https://placehold.co/400x300?text=No+Image"; }}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <span
                            className={`absolute top-2 right-2 px-2 py-1 text-xs font-semibold rounded-full text-white ${hostel.availableRooms > 0 ? "bg-green-500" : "bg-red-500"}`}
                          >
                            {hostel.availableRooms > 0 ? "Available" : "Full"}
                          </span>
                          {hostel.isVerified && (
                            <span className="absolute top-9 right-2 bg-green-600 text-white text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
                              <CheckCircle size={10} /> Verified
                            </span>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                            {hostel.name}
                          </h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {hostel.locality}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {hostel.amenities?.slice(0, 3).map((tag, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 text-[10px] rounded-full bg-blue-50 text-blue-700 dark:bg-slate-700 dark:text-blue-300"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-3">
                            ₹{hostel.pricePerMonth}
                            <span className="text-xs font-normal text-slate-500">/month</span>
                          </p>
                          <button className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm">
                            View & Request
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ── Map view hostel list (below map) ── */}
        {viewMode === "map" && sortedHostels.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-4">
            {sortedHostels.map((hostel) => (
              <button
                key={hostel._id}
                onClick={() => handleHostelClick(hostel._id)}
                className="text-left bg-white dark:bg-slate-800 rounded-xl p-3 shadow hover:shadow-md transition-shadow border border-transparent hover:border-blue-500"
              >
                <p className="font-semibold text-slate-900 dark:text-white text-sm truncate">{hostel.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{hostel.locality}</p>
                <p className="text-sm font-bold text-blue-600 dark:text-blue-400 mt-1">
                  ₹{hostel.pricePerMonth}<span className="font-normal text-slate-500 text-xs">/mo</span>
                </p>
              </button>
            ))}
          </div>
        )}

        {/* ── Server-side Pagination ── */}
        {pagination && pagination.pages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-10 pb-10">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg bg-white dark:bg-slate-800 shadow disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-slate-700 transition text-sm"
            >
              Prev
            </button>
            <span className="dark:text-white text-sm font-medium">
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, pagination.pages))}
              disabled={page >= pagination.pages}
              className="px-4 py-2 rounded-lg bg-white dark:bg-slate-800 shadow disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-slate-700 transition text-sm"
            >
              Next
            </button>
          </div>
        )}
      </div>

      <LoginPrompt isOpen={showLoginPrompt} onClose={() => setShowLoginPrompt(false)} />
    </>
  );
};

export default HostelListings;
