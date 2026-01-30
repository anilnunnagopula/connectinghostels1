import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  Search,
  Filter,
  Grid3x3,
  List,
  Plus,
  Loader2,
  Building,
  Bed,
  Users,
  TrendingUp,
} from "lucide-react";
import axios from "axios";
import HostelCard from "../../components/dashboard/HostelCard"; // Adjust path as needed
import EmptyState from "../../components/dashboard/EmptyState";

const MyHostels = () => {
  const navigate = useNavigate();
  const [hostels, setHostels] = useState([]);
  const [filteredHostels, setFilteredHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [hostelToDelete, setHostelToDelete] = useState(null);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    totalRooms: 0,
    occupiedRooms: 0,
    availableRooms: 0,
  });

  // Fetch hostels
  const fetchHostels = async () => {
    setLoading(true);
    setError(null);
    try {
      const authToken = localStorage.getItem("token");
      if (!authToken) {
        throw new Error("Authentication token not found.");
      }

      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/owner/hostels/my-hostels`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );

      setHostels(res.data.hostels);
      setFilteredHostels(res.data.hostels);
      calculateStats(res.data.hostels);
    } catch (err) {
      console.error("❌ Error fetching hostels:", err);
      setError("Failed to fetch hostels. Please try again.");

      if (err.response && err.response.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  const calculateStats = (hostelData) => {
    const total = hostelData.length;
    const totalRooms = hostelData.reduce(
      (sum, h) => sum + (h.totalRooms || 0),
      0,
    );
    const availableRooms = hostelData.reduce(
      (sum, h) => sum + (h.availableRooms || 0),
      0,
    );
    const occupiedRooms = totalRooms - availableRooms;

    setStats({
      total,
      totalRooms,
      occupiedRooms,
      availableRooms,
    });
  };

  useEffect(() => {
    fetchHostels();
  }, []);

  // Search and filter logic
  useEffect(() => {
    let result = hostels;

    // Filter by type
    if (filterType !== "All") {
      result = result.filter((h) => h.type === filterType);
    }

    // Search by name or location
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (h) =>
          h.name?.toLowerCase().includes(query) ||
          h.location?.toLowerCase().includes(query) ||
          h.address?.toLowerCase().includes(query),
      );
    }

    setFilteredHostels(result);
  }, [searchQuery, filterType, hostels]);

  // Delete handler
  const handleDeleteClick = (hostelId) => {
    setHostelToDelete(hostelId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    // TODO: Implement actual delete API call
    alert("⚠️ Delete functionality will be implemented soon");
    setShowDeleteModal(false);
    setHostelToDelete(null);

    // Uncomment when API is ready:
    /*
    try {
      const authToken = localStorage.getItem("token");
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/owner/hostels/${hostelToDelete}`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      fetchHostels();
      setShowDeleteModal(false);
      setHostelToDelete(null);
    } catch (err) {
      console.error("Error deleting hostel:", err);
      alert("Failed to delete hostel.");
    }
    */
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-lg text-slate-700 dark:text-slate-300">
            Loading your hostels...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <p className="text-xl text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchHostels}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (hostels.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 sm:p-6">
        <EmptyState
          icon={<Building className="w-16 h-16 text-slate-400" />}
          title="No Hostels Yet"
          message="Get started by adding your first hostel property. You can manage rooms, students, and bookings all in one place."
          actionLabel="Add Your First Hostel"
          onAction={() => navigate("/owner/add-hostel")}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Home className="text-blue-500" />
            My Hostels
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Manage your hostel properties
          </p>
        </div>
        <button
          onClick={() => navigate("/owner/add-hostel")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors shadow-md hover:shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Add Hostel
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Total Hostels
              </p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
                {stats.total}
              </p>
            </div>
            <Building className="w-10 h-10 text-blue-500 opacity-50" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Total Rooms
              </p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
                {stats.totalRooms}
              </p>
            </div>
            <Bed className="w-10 h-10 text-purple-500 opacity-50" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Occupied
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                {stats.occupiedRooms}
              </p>
            </div>
            <Users className="w-10 h-10 text-green-500 opacity-50" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Available
              </p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 mt-1">
                {stats.availableRooms}
              </p>
            </div>
            <TrendingUp className="w-10 h-10 text-orange-500 opacity-50" />
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow border border-slate-200 dark:border-slate-700 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
            />
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
            >
              <option value="All">All Types</option>
              <option value="Boys">Boys</option>
              <option value="Girls">Girls</option>
              <option value="Co-Live">Co-Live</option>
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2.5 rounded-lg transition-colors ${
                viewMode === "grid"
                  ? "bg-blue-500 text-white"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
              }`}
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2.5 rounded-lg transition-colors ${
                viewMode === "list"
                  ? "bg-blue-500 text-white"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">
          Showing {filteredHostels.length} of {hostels.length} hostels
        </p>
      </div>

      {/* Hostels Grid/List */}
      {filteredHostels.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-12 text-center border border-slate-200 dark:border-slate-700">
          <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-lg text-slate-600 dark:text-slate-400">
            No hostels match your search criteria
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setFilterType("All");
            }}
            className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {filteredHostels.map((hostel) => (
            <HostelCard
              key={hostel._id}
              hostel={hostel}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-md w-full shadow-xl">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
              Delete Hostel?
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              This action cannot be undone. All data associated with this hostel
              will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyHostels;
