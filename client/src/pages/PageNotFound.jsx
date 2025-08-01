import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * Custom hook to check user authentication status from localStorage.
 * @returns {{isLoggedIn: boolean, user: object|null}}
 */
const useAuth = () => {
  const userString = localStorage.getItem("user");

  if (userString) {
    try {
      const user = JSON.parse(userString);
      // Ensure user object and role exist
      if (user && user.role) {
        return { isLoggedIn: true, user: user };
      }
    } catch (e) {
      console.error("Error parsing user data from localStorage:", e);
      // Clear corrupted data
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }

  return { isLoggedIn: false, user: null };
};

const PageNotFound = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();

  const handleRedirect = () => {
    if (isLoggedIn && user) {
      // Navigate to the correct dashboard based on the user's role
      if (user.role === "student") {
        navigate("/student-dashboard");
      } else if (user.role === "owner") {
        navigate("/owner-dashboard");
      } else {
        // Fallback for any other roles or if the role is missing
        navigate("/");
      }
    } else {
      // If not logged in, navigate to the main landing page
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 text-center px-4">
      <h1 className="text-4xl font-bold text-red-600 animate-bounce">
        404 - Oops! Page Not Found{" "}
        <span role="img" aria-label="confused face">
          😵‍💫
        </span>
      </h1>

      <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-md">
        Either the page doesn’t exist, or it’s still under construction.
      </p>

      {/* Dynamic message for logged-in users */}
      {isLoggedIn && user && (
        <p className="mt-2 font-semibold text-blue-600 dark:text-blue-400 max-w-md">
          It looks like you're lost. Let's get you back to your dashboard.
        </p>
      )}

      <button
        onClick={handleRedirect}
        className="mt-8 px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
      >
        {isLoggedIn ? "Go to My Dashboard" : "Go Back Home"}
      </button>

      <div className="mt-12 text-sm text-slate-500 dark:text-slate-400">
        <p>If you believe this is an error, feel free to contact support.</p>
      </div>
    </div>
  );
};

export default PageNotFound;
