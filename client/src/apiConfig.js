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

// ==================== CSRF TOKEN MANAGEMENT ====================
// Fetches a fresh CSRF token from the server and caches it in-memory.
// The token is attached to all state-mutating requests (POST, PUT, PATCH, DELETE).
let csrfToken = null;

const fetchCsrfToken = async () => {
  if (csrfToken) return csrfToken;
  try {
    const { data } = await axios.get(`${API_BASE_URL}/api/csrf`, { withCredentials: true });
    csrfToken = data.csrfToken;
  } catch {
    // If CSRF endpoint fails (e.g. server down), proceed without token — server will reject
    csrfToken = null;
  }
  return csrfToken;
};

// Attach CSRF token to all mutating requests
api.interceptors.request.use(async (config) => {
  const mutating = ["post", "put", "patch", "delete"];
  if (mutating.includes(config.method?.toLowerCase())) {
    const token = await fetchCsrfToken();
    if (token) {
      config.headers["x-csrf-token"] = token;
    }
  }
  return config;
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
    // If CSRF token is stale (403 from csrf-csrf), clear cached token so next request re-fetches
    if (error.response?.status === 403 && error.response?.data?.code === "INVALID_CSRF_TOKEN") {
      csrfToken = null;
    }
    return Promise.reject(error);
  },
);

export default api;
