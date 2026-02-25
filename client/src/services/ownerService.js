// services/ownerService.js
import api from "../apiConfig";

// NOTE: 'api' already has baseURL set to process.env.REACT_APP_API_URL (or http://localhost:5000).
// All paths below must be relative (start with /api/...) — do NOT prepend API_URL again.

/**
 * Owner Service - Centralized API calls for owner operations
 * Auth is handled via httpOnly cookie sent automatically by the api instance.
 */
export const ownerService = {
  // ==================== DASHBOARD ====================
  getDashboardMetrics: async () => {
    const response = await api.get(`/api/owner/dashboard/metrics`);
    return response.data;
  },

  // ==================== HOSTELS ====================
  getMyHostels: async () => {
    const response = await api.get(`/api/owner/hostels/my-hostels`);
    return response.data.hostels;
  },

  getHostelById: async (hostelId) => {
    const response = await api.get(`/api/owner/hostels/${hostelId}`);
    return response.data.hostel;
  },

  addHostel: async (formData) => {
    const response = await api.post(
      `/api/owner/hostels/add-hostel`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return response.data;
  },

  updateHostel: async (hostelId, data) => {
    const response = await api.put(`/api/owner/hostels/${hostelId}`, data);
    return response.data;
  },

  deleteHostel: async (hostelId) => {
    const response = await api.delete(`/api/owner/hostels/${hostelId}`);
    return response.data;
  },

  // ==================== ROOMS ====================
  getRooms: async (hostelId, { floor, status } = {}) => {
    const params = new URLSearchParams({ hostelId });
    if (floor !== undefined) params.set("floor", floor);
    if (status) params.set("status", status);
    const response = await api.get(`/api/owner/rooms?${params}`);
    return response.data.rooms;
  },

  getFloorSummary: async (hostelId) => {
    const response = await api.get(`/api/owner/rooms/summary?hostelId=${hostelId}`);
    return response.data.summary;
  },

  addRoom: async (roomData) => {
    const response = await api.post(`/api/owner/rooms`, roomData);
    return response.data;
  },

  updateRoom: async (roomId, roomData) => {
    const response = await api.put(`/api/owner/rooms/${roomId}`, roomData);
    return response.data;
  },

  updateRoomStatus: async (roomId, status) => {
    const response = await api.patch(`/api/owner/rooms/${roomId}/status`, { status });
    return response.data;
  },

  bulkUpdateRoomStatus: async (roomIds, status) => {
    const response = await api.post(`/api/owner/rooms/bulk`, { roomIds, status });
    return response.data;
  },

  deleteRoom: async (roomId) => {
    const response = await api.delete(`/api/owner/rooms/${roomId}`);
    return response.data;
  },

  generateRooms: async (hostelId, floors) => {
    const response = await api.post(`/api/owner/hostels/${hostelId}/generate-rooms`, { floors });
    return response.data;
  },

  addFloor: async (hostelId, floorData) => {
    const response = await api.post(`/api/owner/hostels/${hostelId}/floors`, floorData);
    return response.data;
  },

  deleteFloor: async (hostelId, floorNumber) => {
    const response = await api.delete(`/api/owner/hostels/${hostelId}/floors/${floorNumber}`);
    return response.data;
  },

  // ==================== STUDENTS ====================
  getMyStudents: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const url = queryParams
      ? `/api/students/mine?${queryParams}`
      : `/api/students/mine`;
    const response = await api.get(url);
    return response.data.students;
  },

  getStudentById: async (studentId) => {
    const response = await api.get(`/api/students/${studentId}`);
    return response.data.student;
  },

  addStudent: async (studentData) => {
    const response = await api.post(`/api/students`, studentData);
    return response.data;
  },

  updateStudent: async (studentId, studentData) => {
    const response = await api.put(`/api/students/${studentId}`, studentData);
    return response.data;
  },

  updateStudentStatus: async (studentId, status) => {
    const response = await api.patch(`/api/students/${studentId}/status`, { status });
    return response.data;
  },

  deleteStudent: async (studentId) => {
    const response = await api.delete(`/api/students/${studentId}`);
    return response.data;
  },

  // ==================== COMPLAINTS ====================
  getComplaints: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const url = queryParams
      ? `/api/complaints?${queryParams}`
      : `/api/complaints`;
    const response = await api.get(url);
    return response.data.complaints;
  },

  updateComplaintStatus: async (complaintId, status, notes = "") => {
    const response = await api.patch(
      `/api/complaints/${complaintId}/status`,
      { status, notes },
    );
    return response.data;
  },

  addComplaintNote: async (complaintId, note) => {
    const response = await api.post(
      `/api/complaints/${complaintId}/notes`,
      { note },
    );
    return response.data;
  },

  // ==================== REQUESTS ====================
  getRequests: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const url = queryParams
      ? `/api/owner/booking-requests/mine?${queryParams}`
      : `/api/owner/booking-requests/mine`;
    const response = await api.get(url);
    return response.data.requests;
  },

  approveRequest: async (requestId, notes = "") => {
    const response = await api.post(`/api/owner/booking-requests/${requestId}/approve`, { notes });
    return response.data;
  },

  rejectRequest: async (requestId, reason) => {
    const response = await api.post(`/api/owner/booking-requests/${requestId}/reject`, { reason });
    return response.data;
  },

  // ==================== RULES ====================
  getRules: async (hostelId) => {
    const response = await api.get(`/api/owner/rules/${hostelId}`);
    return response.data.rules;
  },

  addRule: async (ruleData) => {
    const response = await api.post(`/api/owner/rules`, ruleData);
    return response.data;
  },

  updateRule: async (ruleId, ruleData) => {
    const response = await api.put(`/api/owner/rules/${ruleId}`, ruleData);
    return response.data;
  },

  deleteRule: async (ruleId) => {
    const response = await api.delete(`/api/owner/rules/${ruleId}`);
    return response.data;
  },

  // ==================== PAYMENTS ====================
  getPaymentSettings: async () => {
    const response = await api.get(`/api/owner/payments/settings`);
    return response.data.settings;
  },

  updatePaymentSettings: async (settings) => {
    const response = await api.post(`/api/owner/payments/settings`, settings);
    return response.data;
  },

  getPaymentHistory: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const url = queryParams
      ? `/api/owner/payments/history?${queryParams}`
      : `/api/owner/payments/history`;
    const response = await api.get(url);
    return response.data.payments;
  },

  // ==================== REAL-TIME (PLACEHOLDER) ====================
  subscribeToRoomUpdates: (callback) => {
    return () => {};
  },

  subscribeToNotifications: (callback) => {
    return () => {};
  },

  subscribeToEvents: (eventType, callback) => {
    return () => {};
  },

  // ==================== PAYOUT METHODS ====================
  getPayoutMethods: async () => {
    const response = await api.get(`/api/owner/payout-methods`);
    return response.data; // { methods: [...] }
  },

  addPayoutMethod: async (data) => {
    const response = await api.post(`/api/owner/payout-methods`, data);
    return response.data;
  },

  deletePayoutMethod: async (methodId) => {
    const response = await api.delete(`/api/owner/payout-methods/${methodId}`);
    return response.data;
  },

  setDefaultPayoutMethod: async (methodId) => {
    const response = await api.put(`/api/owner/payout-methods/${methodId}/default`);
    return response.data;
  },

  // ==================== STUDENTS ====================
  addStudent: async (data) => {
    const response = await api.post(`/api/students`, data);
    return response.data; // { message, student, accountCreated }
  },

  getMyStudents: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const url = params ? `/api/students/mine?${params}` : `/api/students/mine`;
    const response = await api.get(url);
    return response.data.students; // array of students
  },

  updateStudent: async (id, data) => {
    const response = await api.put(`/api/students/${id}`, data);
    return response.data;
  },

  deleteStudent: async (id) => {
    const response = await api.delete(`/api/students/${id}`);
    return response.data;
  },
};

export default ownerService;
