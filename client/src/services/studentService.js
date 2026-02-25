// services/studentService.js
// NOTE: 'api' already has baseURL set to process.env.REACT_APP_API_URL.
// All paths below are relative — do NOT prepend API_URL again.
import api from "../apiConfig";

export const studentService = {
  // ==================== DASHBOARD ====================
  getMetrics: async () => {
    const response = await api.get("/api/students/dashboard/metrics");
    return response.data;
  },

  // ==================== BOOKING REQUESTS ====================
  getMyRequests: async () => {
    const response = await api.get("/api/students/my-requests");
    return response.data; // { requests, studentStatus, currentHostel }
  },

  sendBookingRequest: async (data) => {
    const response = await api.post("/api/students/booking-request", data);
    return response.data;
  },

  cancelRequest: async (requestId) => {
    const response = await api.delete(`/api/students/booking-request/${requestId}`);
    return response.data;
  },

  // ==================== HOSTEL / ROOM ====================
  getMyHostel: async () => {
    const response = await api.get("/api/students/my-hostel");
    return response.data;
  },

  getHostelDetails: async (hostelId) => {
    const response = await api.get(`/api/hostels/${hostelId}`);
    return response.data.hostel || response.data;
  },

  // ==================== INTERESTED ====================
  getInterestedHostels: async () => {
    const response = await api.get("/api/students/interested");
    return response.data.hostels || response.data || [];
  },

  toggleInterested: async (hostelId) => {
    const response = await api.post(`/api/students/interested/${hostelId}`);
    return response.data;
  },

  removeInterested: async (hostelId) => {
    const response = await api.delete(`/api/students/interested/${hostelId}`);
    return response.data;
  },

  clearInterested: async () => {
    const response = await api.delete("/api/students/interested/all");
    return response.data;
  },

  // ==================== COMPLAINTS ====================
  getMyComplaints: async () => {
    const response = await api.get("/api/complaints/my");
    return response.data.complaints || response.data || [];
  },

  raiseComplaint: async (data) => {
    const response = await api.post("/api/complaints", data);
    return response.data;
  },

  // ==================== NOTIFICATIONS ====================
  getNotifications: async (page = 1, limit = 20) => {
    const response = await api.get("/api/student/notifications", {
      params: { page, limit },
    });
    return response.data;
  },

  markNotificationRead: async (id) => {
    const response = await api.patch(`/api/student/notifications/${id}/read`);
    return response.data;
  },

  // ==================== RECENTLY VIEWED ====================
  getRecentlyViewed: async () => {
    const response = await api.get("/api/students/recently-viewed");
    return response.data.data || response.data || [];
  },

  removeFromRecentlyViewed: async (hostelId) => {
    const response = await api.delete(`/api/students/recently-viewed/${hostelId}`);
    return response.data;
  },

  clearRecentlyViewed: async () => {
    const response = await api.delete("/api/students/recently-viewed/all");
    return response.data;
  },
};


export default studentService;
