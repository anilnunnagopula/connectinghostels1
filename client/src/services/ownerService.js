// services/ownerService.js
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

/**
 * Get authentication token from localStorage
 */
const getToken = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Authentication token not found");
  }
  return token;
};

/**
 * Get authorization headers
 */
const getHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
});

/**
 * Owner Service - Centralized API calls for owner operations
 * Real-time ready architecture with event hooks
 */
export const ownerService = {
  // ==================== DASHBOARD ====================
  /**
   * Get dashboard metrics
   */
  getDashboardMetrics: async () => {
    const response = await axios.get(`${API_URL}/api/owner/dashboard/metrics`, {
      headers: getHeaders(),
    });
    return response.data;
  },

  // ==================== HOSTELS ====================
  /**
   * Get all owner's hostels
   */
  getMyHostels: async () => {
    const response = await axios.get(
      `${API_URL}/api/owner/hostels/my-hostels`,
      { headers: getHeaders() },
    );
    return response.data.hostels;
  },

  /**
   * Get single hostel by ID
   */
  getHostelById: async (hostelId) => {
    const response = await axios.get(
      `${API_URL}/api/owner/hostels/${hostelId}`,
      { headers: getHeaders() },
    );
    return response.data.hostel;
  },

  /**
   * Add new hostel
   */
  addHostel: async (formData) => {
    const response = await axios.post(
      `${API_URL}/api/owner/hostels/add-hostel`,
      formData,
      {
        headers: {
          ...getHeaders(),
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },

  /**
   * Update hostel
   */
  updateHostel: async (hostelId, data) => {
    const response = await axios.put(
      `${API_URL}/api/owner/hostels/${hostelId}`,
      data,
      { headers: getHeaders() },
    );
    return response.data;
  },

  /**
   * Delete hostel
   */
  deleteHostel: async (hostelId) => {
    const response = await axios.delete(
      `${API_URL}/api/owner/hostels/${hostelId}`,
      { headers: getHeaders() },
    );
    return response.data;
  },

  // ==================== ROOMS ====================
  /**
   * Get all rooms (optionally filter by hostelId)
   */
  getRooms: async (hostelId = null) => {
    // FIX: Backend has no dedicated rooms endpoint. Synthesize rooms from hostel details + student list.
    try {
      if (!hostelId) return [];

      // 1. Fetch Hostel Details (for totalRooms count)
      const hostelsRes = await axios.get(
        `${API_URL}/api/owner/hostels/my-hostels`,
        { headers: getHeaders() },
      );
      const targetHostel = hostelsRes.data.hostels.find(
        (h) => h._id === hostelId,
      );

      if (!targetHostel) return [];

      // 2. Fetch Students (to map occupancy)
      const studentsRes = await axios.get(`${API_URL}/api/students/mine`, {
        headers: getHeaders(),
      });
      const students = studentsRes.data.students || [];

      // 3. Synthesize Rooms
      const totalRooms = targetHostel.totalRooms || 0;
      const rooms = [];
      const roomsMap = {};

      // Map students to rooms
      const hostelStudents = students.filter(
        (s) => s.hostel && s.hostel._id === hostelId,
      );

      hostelStudents.forEach((student) => {
        const roomNum = student.room; // Schema has 'room' field
        if (roomNum) {
          if (!roomsMap[roomNum]) {
            roomsMap[roomNum] = {
              _id: `gen-${hostelId}-${roomNum}`,
              hostelId: hostelId,
              roomNumber: roomNum,
              capacity: 3, // Default cap
              status: "Occupied",
              isAvailable: false,
              assignedStudents: [],
            };
          }
          roomsMap[roomNum].assignedStudents.push(student);
        }
      });

      // Generate sequence
      for (let i = 1; i <= totalRooms; i++) {
        const roomNum = i.toString();
        if (roomsMap[roomNum]) {
          rooms.push(roomsMap[roomNum]);
        } else {
          rooms.push({
            _id: `gen-${hostelId}-${roomNum}`,
            hostelId: hostelId,
            roomNumber: roomNum,
            capacity: 3,
            status: "Available",
            isAvailable: true,
            assignedStudents: [],
          });
        }
      }

      return rooms;
    } catch (err) {
      console.error("Error synthesizing rooms:", err);
      throw err;
    }
  },

  /**
   * Get single room by ID
   */
  getRoomById: async (roomId) => {
    const response = await axios.get(`${API_URL}/api/owner/rooms/${roomId}`, {
      headers: getHeaders(),
    });
    return response.data.room;
  },

  /**
   * Add new room
   */
  addRoom: async (roomData) => {
    const response = await axios.post(`${API_URL}/api/owner/rooms`, roomData, {
      headers: getHeaders(),
    });
    return response.data;
  },

  /**
   * Update room
   */
  updateRoom: async (roomId, roomData) => {
    const response = await axios.put(
      `${API_URL}/api/owner/rooms/${roomId}`,
      roomData,
      { headers: getHeaders() },
    );
    return response.data;
  },

  /**
   * Toggle room status (Available/Occupied/Maintenance)
   */
  toggleRoomStatus: async (roomId, status) => {
    const response = await axios.patch(
      `${API_URL}/api/owner/rooms/${roomId}/status`,
      { status },
      { headers: getHeaders() },
    );
    return response.data;
  },

  /**
   * Toggle room availability (quick toggle)
   */
  toggleRoomAvailability: async (roomId) => {
    const response = await axios.patch(
      `${API_URL}/api/owner/rooms/${roomId}/toggle`,
      {},
      { headers: getHeaders() },
    );
    return response.data;
  },

  /**
   * Assign student to room
   */
  assignStudentToRoom: async (roomId, studentId) => {
    const response = await axios.post(
      `${API_URL}/api/owner/rooms/${roomId}/assign`,
      { studentId },
      { headers: getHeaders() },
    );
    return response.data;
  },

  /**
   * Unassign student from room
   */
  unassignStudentFromRoom: async (roomId, studentId) => {
    const response = await axios.post(
      `${API_URL}/api/owner/rooms/${roomId}/unassign`,
      { studentId },
      { headers: getHeaders() },
    );
    return response.data;
  },

  /**
   * Delete room
   */
  deleteRoom: async (roomId) => {
    const response = await axios.delete(
      `${API_URL}/api/owner/rooms/${roomId}`,
      { headers: getHeaders() },
    );
    return response.data;
  },

  // ==================== STUDENTS ====================
  /**
   * Get all owner's students
   */
  getMyStudents: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const url = queryParams
      ? `${API_URL}/api/students/mine?${queryParams}`
      : `${API_URL}/api/students/mine`;
    const response = await axios.get(url, { headers: getHeaders() });
    return response.data.students;
  },

  /**
   * Get single student by ID
   */
  getStudentById: async (studentId) => {
    const response = await axios.get(`${API_URL}/api/students/${studentId}`, {
      headers: getHeaders(),
    });
    return response.data.student;
  },

  /**
   * Add new student
   */
  addStudent: async (studentData) => {
    const response = await axios.post(`${API_URL}/api/students`, studentData, {
      headers: getHeaders(),
    });
    return response.data;
  },

  /**
   * Update student
   */
  updateStudent: async (studentId, studentData) => {
    const response = await axios.put(
      `${API_URL}/api/students/${studentId}`,
      studentData,
      { headers: getHeaders() },
    );
    return response.data;
  },

  /**
   * Update student status (Active/Vacated)
   */
  updateStudentStatus: async (studentId, status) => {
    const response = await axios.patch(
      `${API_URL}/api/students/${studentId}/status`,
      { status },
      { headers: getHeaders() },
    );
    return response.data;
  },

  /**
   * Delete student (soft delete)
   */
  deleteStudent: async (studentId) => {
    const response = await axios.delete(
      `${API_URL}/api/students/${studentId}`,
      { headers: getHeaders() },
    );
    return response.data;
  },

  // ==================== COMPLAINTS ====================
  /**
   * Get all complaints
   */
  getComplaints: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const url = queryParams
      ? `${API_URL}/api/complaints?${queryParams}`
      : `${API_URL}/api/complaints`;
    const response = await axios.get(url, { headers: getHeaders() });
    return response.data.complaints;
  },

  /**
   * Update complaint status
   */
  updateComplaintStatus: async (complaintId, status, notes = "") => {
    const response = await axios.patch(
      `${API_URL}/api/complaints/${complaintId}/status`,
      { status, notes },
      { headers: getHeaders() },
    );
    return response.data;
  },

  /**
   * Add note to complaint
   */
  addComplaintNote: async (complaintId, note) => {
    const response = await axios.post(
      `${API_URL}/api/complaints/${complaintId}/notes`,
      { note },
      { headers: getHeaders() },
    );
    return response.data;
  },

  // ==================== REQUESTS ====================
  /**
   * Get all requests (booking/room change/leave)
   */
  getRequests: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const url = queryParams
      ? `${API_URL}/api/requests?${queryParams}`
      : `${API_URL}/api/requests`;
    const response = await axios.get(url, { headers: getHeaders() });
    return response.data.requests;
  },

  /**
   * Approve request
   */
  approveRequest: async (requestId, notes = "") => {
    const response = await axios.post(
      `${API_URL}/api/requests/${requestId}/approve`,
      { notes },
      { headers: getHeaders() },
    );
    return response.data;
  },

  /**
   * Reject request
   */
  rejectRequest: async (requestId, reason) => {
    const response = await axios.post(
      `${API_URL}/api/requests/${requestId}/reject`,
      { reason },
      { headers: getHeaders() },
    );
    return response.data;
  },

  // ==================== RULES ====================
  /**
   * Get rules for hostel
   */
  getRules: async (hostelId) => {
    const response = await axios.get(`${API_URL}/api/owner/rules/${hostelId}`, {
      headers: getHeaders(),
    });
    return response.data.rules;
  },

  /**
   * Add rule
   */
  addRule: async (ruleData) => {
    const response = await axios.post(`${API_URL}/api/owner/rules`, ruleData, {
      headers: getHeaders(),
    });
    return response.data;
  },

  /**
   * Update rule
   */
  updateRule: async (ruleId, ruleData) => {
    const response = await axios.put(
      `${API_URL}/api/owner/rules/${ruleId}`,
      ruleData,
      { headers: getHeaders() },
    );
    return response.data;
  },

  /**
   * Delete rule
   */
  deleteRule: async (ruleId) => {
    const response = await axios.delete(
      `${API_URL}/api/owner/rules/${ruleId}`,
      { headers: getHeaders() },
    );
    return response.data;
  },

  // ==================== PAYMENTS ====================
  /**
   * Get payment settings
   */
  getPaymentSettings: async () => {
    const response = await axios.get(`${API_URL}/api/owner/payments/settings`, {
      headers: getHeaders(),
    });
    return response.data.settings;
  },

  /**
   * Update payment settings
   */
  updatePaymentSettings: async (settings) => {
    const response = await axios.post(
      `${API_URL}/api/owner/payments/settings`,
      settings,
      { headers: getHeaders() },
    );
    return response.data;
  },

  /**
   * Get payment history
   */
  getPaymentHistory: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const url = queryParams
      ? `${API_URL}/api/owner/payments/history?${queryParams}`
      : `${API_URL}/api/owner/payments/history`;
    const response = await axios.get(url, { headers: getHeaders() });
    return response.data.payments;
  },

  // ==================== REAL-TIME (PLACEHOLDER) ====================
  /**
   * Subscribe to room updates (WebSocket ready)
   * Currently returns unsubscribe function placeholder
   */
  subscribeToRoomUpdates: (callback) => {
    // TODO: Implement WebSocket connection
    console.log("🔌 WebSocket: Room updates subscription ready");

    // Placeholder: Return unsubscribe function
    return () => {
      console.log("🔌 WebSocket: Unsubscribed from room updates");
    };
  },

  /**
   * Subscribe to notification updates (WebSocket ready)
   */
  subscribeToNotifications: (callback) => {
    // TODO: Implement WebSocket connection
    console.log("🔌 WebSocket: Notification subscription ready");

    return () => {
      console.log("🔌 WebSocket: Unsubscribed from notifications");
    };
  },

  /**
   * Subscribe to general owner events (WebSocket ready)
   */
  subscribeToEvents: (eventType, callback) => {
    // TODO: Implement WebSocket connection
    console.log(`🔌 WebSocket: Subscribed to ${eventType}`);

    return () => {
      console.log(`🔌 WebSocket: Unsubscribed from ${eventType}`);
    };
  },
};

/**
 * Error handler wrapper for service calls
 * Handles common error scenarios (401, 403, 500, etc.)
 */
export const handleServiceError = (error) => {
  if (error.response) {
    const { status, data } = error.response;

    switch (status) {
      case 401:
        // Token expired or invalid
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        throw new Error("Session expired. Please login again.");

      case 403:
        throw new Error("Access denied. You do not have permission.");

      case 404:
        throw new Error(data.message || "Resource not found.");

      case 500:
        throw new Error("Server error. Please try again later.");

      default:
        throw new Error(data.message || "An error occurred.");
    }
  } else if (error.request) {
    throw new Error("Network error. Please check your connection.");
  } else {
    throw new Error(error.message || "An unexpected error occurred.");
  }
};

export default ownerService;
