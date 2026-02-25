import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute — Redirects unauthenticated users to /login.
 * Preserves the current path in `?returnTo=` so the user lands back
 * where they were after logging in.
 *
 * Usage:
 *   <Route path="/owner-dashboard" element={<ProtectedRoute role="owner"><OwnerDashboard /></ProtectedRoute>} />
 *
 * Props:
 *   - role: "owner" | "student" | "admin" — if provided, also checks role
 *   - children: the page component to render when authorized
 */
const ProtectedRoute = ({ children, role }) => {
  const { user, isAuthLoading } = useAuth();
  const location = useLocation();

  // While session is being restored from cookie, show nothing (avoids flash-redirect)
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Not logged in → redirect to login, preserving destination
  if (!user) {
    return <Navigate to={`/login?returnTo=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // Logged in but wrong role (e.g., student trying to access /owner/*)
  if (role && user.role !== role) {
    const fallback = user.role === "owner" ? "/owner-dashboard" : user.role === "student" ? "/student-dashboard" : "/";
    return <Navigate to={fallback} replace />;
  }

  return children;
};

export default ProtectedRoute;
