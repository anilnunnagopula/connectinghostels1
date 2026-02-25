import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../apiConfig";
import toast from "react-hot-toast";

// ─── Stat Card ───────────────────────────────────────────────────────────────
const StatCard = ({ label, value, color = "blue", badge }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    green: "bg-green-50 text-green-700 border-green-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    orange: "bg-orange-50 text-orange-700 border-orange-200",
    yellow: "bg-yellow-50 text-yellow-700 border-yellow-200",
  };
  return (
    <div className={`rounded-xl border p-5 relative ${colors[color]} dark:bg-opacity-10`}>
      {badge > 0 && (
        <span className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
          {badge}
        </span>
      )}
      <p className="text-sm font-medium opacity-70">{label}</p>
      <p className="text-3xl font-bold mt-1">{value ?? "—"}</p>
    </div>
  );
};

// ─── AdminDashboard ───────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [hostelFilter, setHostelFilter] = useState("all"); // "all" | "pending" | "active"

  // Pagination
  const [userPage, setUserPage] = useState(1);
  const [userPages, setUserPages] = useState(1);
  const [hostelPage, setHostelPage] = useState(1);
  const [hostelPages, setHostelPages] = useState(1);
  const [complaintPage, setComplaintPage] = useState(1);
  const [complaintPages, setComplaintPages] = useState(1);

  const fetchStats = useCallback(async () => {
    const { data } = await api.get("/api/admin/stats");
    setStats(data);
  }, []);

  const fetchUsers = useCallback(async (page = 1) => {
    const { data } = await api.get(`/api/admin/users?page=${page}&limit=15`);
    setUsers(data.users);
    setUserPages(data.pagination.pages);
    setUserPage(page);
  }, []);

  const fetchHostels = useCallback(
    async (page = 1, filter = hostelFilter) => {
      const statusParam = filter !== "all" ? `&status=${filter}` : "";
      const { data } = await api.get(
        `/api/admin/hostels?page=${page}&limit=15${statusParam}`
      );
      setHostels(data.hostels);
      setHostelPages(data.pagination.pages);
      setHostelPage(page);
    },
    [hostelFilter]
  );

  const fetchComplaints = useCallback(async (page = 1, status = "") => {
    const statusParam = status ? `&status=${status}` : "";
    const { data } = await api.get(
      `/api/admin/complaints?page=${page}&limit=15${statusParam}`
    );
    setComplaints(data.complaints);
    setComplaintPages(data.pagination?.pages || 1);
    setComplaintPage(page);
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchStats(), fetchUsers(), fetchHostels(1, "all"), fetchComplaints()]);
      } catch (err) {
        if (err.response?.status === 403) {
          toast.error("Admin access required");
          navigate("/");
        } else {
          toast.error("Failed to load admin data");
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [fetchStats, fetchUsers, fetchComplaints, navigate]); // eslint-disable-line react-hooks/exhaustive-deps

  const switchHostelFilter = (f) => {
    setHostelFilter(f);
    fetchHostels(1, f);
  };

  const handleBanUser = async (userId, currentlyBanned) => {
    try {
      const { data } = await api.put(`/api/admin/users/${userId}/ban`);
      toast.success(data.message);
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isBanned: data.isBanned } : u))
      );
    } catch {
      toast.error("Failed to update user status");
    }
  };

  const handleDeleteHostel = async (hostelId, hostelName) => {
    if (!window.confirm(`Delete hostel "${hostelName}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/api/admin/hostels/${hostelId}`);
      toast.success("Hostel deleted");
      setHostels((prev) => prev.filter((h) => h._id !== hostelId));
      fetchStats();
    } catch {
      toast.error("Failed to delete hostel");
    }
  };

  const handleToggleHostel = async (hostelId) => {
    try {
      const { data } = await api.put(`/api/admin/hostels/${hostelId}/toggle-active`);
      toast.success(data.message);
      setHostels((prev) =>
        prev.map((h) => (h._id === hostelId ? { ...h, isActive: data.isActive } : h))
      );
    } catch {
      toast.error("Failed to update hostel status");
    }
  };

  const handleApproveHostel = async (hostelId, hostelName) => {
    try {
      const { data } = await api.put(`/api/admin/hostels/${hostelId}/approve`);
      toast.success(data.message || `"${hostelName}" approved`);
      setHostels((prev) =>
        prev.map((h) => (h._id === hostelId ? { ...h, isActive: true } : h))
      );
      fetchStats();
    } catch {
      toast.error("Failed to approve hostel");
    }
  };

  const handleRejectHostel = async (hostelId, hostelName) => {
    const reason = window.prompt(
      `Reject hostel "${hostelName}"?\nOptional: enter a reason for the owner.`
    );
    if (reason === null) return; // cancelled
    try {
      const { data } = await api.put(`/api/admin/hostels/${hostelId}/reject`, { reason });
      toast.success(data.message || `"${hostelName}" rejected`);
      setHostels((prev) => prev.filter((h) => h._id !== hostelId));
      fetchStats();
    } catch {
      toast.error("Failed to reject hostel");
    }
  };

  const handleResolveComplaint = async (complaintId) => {
    try {
      const { data } = await api.put(`/api/admin/complaints/${complaintId}/resolve`);
      toast.success(data.message || "Complaint resolved");
      setComplaints((prev) =>
        prev.map((c) => (c._id === complaintId ? { ...c, status: "Resolved" } : c))
      );
    } catch {
      toast.error("Failed to resolve complaint");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <p className="text-slate-500 dark:text-slate-400 animate-pulse">Loading admin panel...</p>
      </div>
    );
  }

  const pendingCount = stats?.pendingHostels ?? 0;
  const openComplaintsCount = complaints.filter((c) => c.status !== "Resolved").length;
  const tabs = ["overview", "users", "hostels", "complaints"];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Platform management</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <div className="flex px-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-4 py-3 text-sm font-medium capitalize border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              {tab}
              {tab === "hostels" && pendingCount > 0 && (
                <span className="ml-1.5 bg-amber-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {pendingCount}
                </span>
              )}
              {tab === "complaints" && openComplaintsCount > 0 && (
                <span className="ml-1.5 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {openComplaintsCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        {/* ── OVERVIEW TAB ── */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Pending approval alert */}
            {pendingCount > 0 && (
              <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-xl px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="text-amber-500 text-xl">⚠</span>
                  <p className="text-sm font-medium text-amber-800">
                    {pendingCount} hostel{pendingCount > 1 ? "s" : ""} awaiting approval
                  </p>
                </div>
                <button
                  onClick={() => {
                    setActiveTab("hostels");
                    switchHostelFilter("pending");
                  }}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-colors"
                >
                  Review Now
                </button>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <StatCard label="Total Users" value={stats?.totalUsers} color="blue" />
              <StatCard label="Owners" value={stats?.totalOwners} color="green" />
              <StatCard label="Students" value={stats?.totalStudents} color="purple" />
              <StatCard label="Active Hostels" value={stats?.totalHostels} color="orange" />
              <StatCard
                label="Pending Approval"
                value={pendingCount}
                color="yellow"
              />
            </div>

            {/* Recent Payments */}
            <div>
              <h2 className="text-lg font-semibold mb-3">Recent Payments</h2>
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                {stats?.recentPayments?.length === 0 ? (
                  <p className="p-4 text-slate-500 text-sm">No payments yet.</p>
                ) : (
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-xs uppercase">
                      <tr>
                        <th className="px-4 py-3 text-left">Student</th>
                        <th className="px-4 py-3 text-left">Amount</th>
                        <th className="px-4 py-3 text-left">Status</th>
                        <th className="px-4 py-3 text-left">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                      {stats?.recentPayments?.map((p) => (
                        <tr key={p._id}>
                          <td className="px-4 py-3">{p.student?.name || "—"}</td>
                          <td className="px-4 py-3 font-medium">₹{p.amount}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700">
                              {p.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-500">
                            {new Date(p.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── USERS TAB ── */}
        {activeTab === "users" && (
          <div>
            <h2 className="text-lg font-semibold mb-3">All Users</h2>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-xs uppercase">
                  <tr>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Role</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {users.map((u) => (
                    <tr key={u._id} className={u.isBanned ? "opacity-50" : ""}>
                      <td className="px-4 py-3 font-medium">{u.name}</td>
                      <td className="px-4 py-3 text-slate-500">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700 capitalize">
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {u.isBanned ? (
                          <span className="px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-700">
                            Banned
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleBanUser(u._id, u.isBanned)}
                          className={`text-xs px-3 py-1 rounded-lg font-medium transition-colors ${
                            u.isBanned
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-red-100 text-red-700 hover:bg-red-200"
                          }`}
                        >
                          {u.isBanned ? "Unban" : "Ban"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-3 mt-4">
              <button
                onClick={() => fetchUsers(userPage - 1)}
                disabled={userPage === 1}
                className="px-3 py-1.5 text-sm rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-40"
              >
                Prev
              </button>
              <span className="text-sm text-slate-500">
                Page {userPage} of {userPages}
              </span>
              <button
                onClick={() => fetchUsers(userPage + 1)}
                disabled={userPage >= userPages}
                className="px-3 py-1.5 text-sm rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* ── COMPLAINTS TAB ── */}
        {activeTab === "complaints" && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">All Complaints</h2>
              <button
                onClick={() => fetchComplaints(1)}
                className="text-xs px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50"
              >
                Refresh
              </button>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-xs uppercase">
                  <tr>
                    <th className="px-4 py-3 text-left">Student</th>
                    <th className="px-4 py-3 text-left">Hostel</th>
                    <th className="px-4 py-3 text-left">Subject</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {complaints.map((c) => (
                    <tr key={c._id}>
                      <td className="px-4 py-3 font-medium">
                        {c.student?.name || "—"}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {c.hostel?.name || "—"}
                      </td>
                      <td className="px-4 py-3 max-w-xs truncate">
                        {c.subject || c.description?.slice(0, 50) || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            c.status === "Resolved"
                              ? "bg-green-100 text-green-700"
                              : c.status === "In Progress"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {c.status || "Open"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        {c.status !== "Resolved" ? (
                          <button
                            onClick={() => handleResolveComplaint(c._id)}
                            className="text-xs px-3 py-1 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 font-medium transition-colors"
                          >
                            Resolve
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400">Done</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {complaints.length === 0 && (
                <p className="p-6 text-center text-slate-500 text-sm">
                  No complaints found.
                </p>
              )}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-3 mt-4">
              <button
                onClick={() => fetchComplaints(complaintPage - 1)}
                disabled={complaintPage === 1}
                className="px-3 py-1.5 text-sm rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-40"
              >
                Prev
              </button>
              <span className="text-sm text-slate-500">
                Page {complaintPage} of {complaintPages}
              </span>
              <button
                onClick={() => fetchComplaints(complaintPage + 1)}
                disabled={complaintPage >= complaintPages}
                className="px-3 py-1.5 text-sm rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* ── HOSTELS TAB ── */}
        {activeTab === "hostels" && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">All Hostels</h2>
              {/* Filter pills */}
              <div className="flex gap-2">
                {["all", "pending", "active"].map((f) => (
                  <button
                    key={f}
                    onClick={() => switchHostelFilter(f)}
                    className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors capitalize ${
                      hostelFilter === f
                        ? f === "pending"
                          ? "bg-amber-500 text-white"
                          : "bg-blue-600 text-white"
                        : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    {f}
                    {f === "pending" && pendingCount > 0 && (
                      <span className="ml-1 bg-white text-amber-600 font-bold px-1 rounded-full">
                        {pendingCount}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-xs uppercase">
                  <tr>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Owner</th>
                    <th className="px-4 py-3 text-left">Type</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {hostels.map((h) => {
                    const isPending = !h.isActive;
                    return (
                      <tr
                        key={h._id}
                        className={isPending ? "bg-amber-50 dark:bg-amber-900/10" : ""}
                      >
                        <td className="px-4 py-3 font-medium">{h.name}</td>
                        <td className="px-4 py-3 text-slate-500">{h.ownerId?.name || "—"}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-full text-xs bg-purple-100 text-purple-700">
                            {h.type}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {h.isActive ? (
                            <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700">
                              Active
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-700">
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2 flex-wrap">
                            {isPending ? (
                              <>
                                <button
                                  onClick={() => handleApproveHostel(h._id, h.name)}
                                  className="text-xs px-3 py-1 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 font-medium transition-colors"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleRejectHostel(h._id, h.name)}
                                  className="text-xs px-3 py-1 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 font-medium transition-colors"
                                >
                                  Reject
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => handleToggleHostel(h._id)}
                                className="text-xs px-3 py-1 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 font-medium transition-colors"
                              >
                                Deactivate
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteHostel(h._id, h.name)}
                              className="text-xs px-3 py-1 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 font-medium transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {hostels.length === 0 && (
                <p className="p-6 text-center text-slate-500 text-sm">No hostels found.</p>
              )}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-3 mt-4">
              <button
                onClick={() => fetchHostels(hostelPage - 1, hostelFilter)}
                disabled={hostelPage === 1}
                className="px-3 py-1.5 text-sm rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-40"
              >
                Prev
              </button>
              <span className="text-sm text-slate-500">
                Page {hostelPage} of {hostelPages}
              </span>
              <button
                onClick={() => fetchHostels(hostelPage + 1, hostelFilter)}
                disabled={hostelPage >= hostelPages}
                className="px-3 py-1.5 text-sm rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
