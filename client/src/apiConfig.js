import axios from "axios";

export const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

/**
 * Pre-configured axios instance.
 * - withCredentials: true  → sends httpOnly auth cookie automatically on every request
 * - baseURL               → no need to manually prefix every call with the server URL
 *
 * Usage: import api from '../apiConfig';
 *        api.get('/api/students/my-requests')
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Intercept 401 responses globally — clear stale local data and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
