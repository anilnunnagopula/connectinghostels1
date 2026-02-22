import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext(null);

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const navigate = useNavigate();

  // On mount: restore session from httpOnly cookie via /api/auth/profile.
  // Token is never stored in localStorage — it lives in the httpOnly cookie only.
  useEffect(() => {
    const restoreSession = async () => {
      // Restore user data from localStorage (not sensitive — no token here)
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          localStorage.removeItem("user");
        }
        setIsAuthLoading(false);
        return;
      }

      // No cached user — check if a valid cookie session exists
      try {
        const { data } = await axios.get(`${API_BASE}/api/auth/profile`, {
          withCredentials: true,
        });
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
      } catch {
        // No valid session
        setUser(null);
      } finally {
        setIsAuthLoading(false);
      }
    };

    restoreSession();
  }, []);

  /**
   * Called after a successful login/register/google-auth API response.
   * The server has already set the httpOnly cookie.
   * We only store non-sensitive user data in localStorage for UI rendering.
   */
  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);

    if (userData.role === "student") {
      navigate("/student-dashboard");
    } else if (userData.role === "owner") {
      navigate("/owner-dashboard");
    } else {
      navigate("/");
    }
  };

  const logout = async () => {
    try {
      // Clear the httpOnly cookie server-side
      await axios.post(`${API_BASE}/api/auth/logout`, {}, { withCredentials: true });
    } catch {
      // Continue logout even if the server call fails
    }
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const updateUser = (updatedData) => {
    const merged = { ...user, ...updatedData };
    localStorage.setItem("user", JSON.stringify(merged));
    setUser(merged);
  };

  const value = {
    user,
    isLoggedIn: !!user,
    isAuthLoading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
