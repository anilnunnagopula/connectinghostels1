import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../apiConfig";
import ownerService from "../services/ownerService";
import studentService from "../services/studentService";

// ─────────────────────────────────────────────────────────────────────────────
// HOSTELS (public)
// ─────────────────────────────────────────────────────────────────────────────

export const useHostels = (filters = {}) => {
  const { locality, type, search, page = 1, limit = 12 } = filters;
  return useQuery({
    queryKey: ["hostels", filters],
    queryFn: async () => {
      const params = { page, limit };
      if (locality) params.locality = locality;
      if (type && type !== "All") params.type = type;
      if (search) params.search = search;
      const { data } = await api.get("/api/hostels", { params });
      return data; // { hostels, pagination }
    },
    staleTime: 2 * 60 * 1000,
    placeholderData: (prev) => prev,
  });
};

export const useHostelDetail = (id) => {
  return useQuery({
    queryKey: ["hostel", id],
    queryFn: async () => {
      const { data } = await api.get(`/api/hostels/${id}`);
      return data.hostel || data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// STUDENT — queries
// ─────────────────────────────────────────────────────────────────────────────

export const useStudentMetrics = () => {
  return useQuery({
    queryKey: ["student-metrics"],
    queryFn: () => studentService.getMetrics(),
    staleTime: 60_000,
    retry: false,
  });
};

export const useStudentRequests = () => {
  return useQuery({
    queryKey: ["student-requests"],
    queryFn: () => studentService.getMyRequests(),
    staleTime: 30_000,
    retry: false,
  });
};

export const useNotifications = (page = 1) => {
  return useQuery({
    queryKey: ["notifications", page],
    queryFn: async () => {
      const { data } = await api.get("/api/student/notifications", {
        params: { page, limit: 20 },
      });
      return data;
    },
    staleTime: 0,
    refetchInterval: 30_000,
    retry: false,
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// STUDENT — mutations
// ─────────────────────────────────────────────────────────────────────────────

export const useCancelRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (requestId) => studentService.cancelRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student-requests"] });
    },
  });
};

export const useSendBookingRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => studentService.sendBookingRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student-requests"] });
    },
  });
};


// ─────────────────────────────────────────────────────────────────────────────
// REVIEWS
// ─────────────────────────────────────────────────────────────────────────────

export const useHostelReviews = (hostelId) => {
  return useQuery({
    queryKey: ["reviews", hostelId],
    queryFn: async () => {
      const { data } = await api.get(`/api/reviews/hostel/${hostelId}`);
      return data; // { reviews, avgRating, ratingCount }
    },
    enabled: !!hostelId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useSubmitReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reviewData) => api.post("/api/reviews", reviewData),
    onSuccess: (_, { hostelId }) => {
      queryClient.invalidateQueries({ queryKey: ["reviews", hostelId] });
    },
  });
};

export const useHostelRules = (hostelId) => {
  return useQuery({
    queryKey: ["rules", hostelId],
    queryFn: async () => {
      const { data } = await api.get(`/api/rules/hostel/${hostelId}`);
      return data.rules || data;
    },
    enabled: !!hostelId,
    staleTime: 10 * 60 * 1000,
  });
};


export const useInterestedHostels = (enabled = true) => {
  return useQuery({
    queryKey: ["interested"],
    enabled: !!enabled,
    queryFn: async () => {
      try {
        const { data } = await api.get("/api/students/interested");
        return Array.isArray(data.hostels) ? data.hostels : Array.isArray(data) ? data : [];
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          return [];
        }
        throw err;
      }
    },
    staleTime: 30_000,
    retry: false,
  });
};

export const useToggleInterested = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (hostelId) => api.post(`/api/students/interested/${hostelId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interested"] });
    },
  });
};

export const useRemoveInterested = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (hostelId) => api.delete(`/api/students/interested/${hostelId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interested"] });
    },
  });
};

export const useClearInterested = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.delete("/api/students/interested/all"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interested"] });
    },
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// OWNER — queries
// ─────────────────────────────────────────────────────────────────────────────

export const useOwnerMetrics = () => {
  return useQuery({
    queryKey: ["owner-metrics"],
    queryFn: () => ownerService.getDashboardMetrics(),
    staleTime: 60_000,
    retry: false,
  });
};

export const useOwnerHostels = () => {
  return useQuery({
    queryKey: ["owner-hostels"],
    // ownerService.getMyHostels() returns just the array; we wrap it so
    // consumers can do  data?.hostels  consistently.
    queryFn: async () => {
      const { data } = await api.get("/api/owner/hostels/my-hostels");
      return data; // { hostels: [...] }
    },
    staleTime: 2 * 60 * 1000,
  });
};

export const useOwnerHostelDetail = (id) => {
  return useQuery({
    queryKey: ["owner-hostel", id],
    queryFn: () => ownerService.getHostelById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useAddHostel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => ownerService.addHostel(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner-hostels"] });
      queryClient.invalidateQueries({ queryKey: ["owner-metrics"] });
    },
  });
};

export const useUpdateHostel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => ownerService.updateHostel(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["owner-hostels"] });
      queryClient.invalidateQueries({ queryKey: ["owner-hostel", id] });
    },
  });
};

export const useDeleteHostel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => ownerService.deleteHostel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner-hostels"] });
      queryClient.invalidateQueries({ queryKey: ["owner-metrics"] });
    },
  });
};

export const useOwnerRooms = (hostelId, options = {}) => {
  return useQuery({
    queryKey: ["owner-rooms", hostelId, options],
    // ownerService.getRooms() returns just the array; wrap to { rooms: [...] }
    queryFn: async () => {
      const rooms = await ownerService.getRooms(hostelId, options);
      return { rooms };
    },
    enabled: !!hostelId,
    staleTime: 30_000,
  });
};

export const useOwnerRequests = () => {
  return useQuery({
    queryKey: ["owner-requests"],
    queryFn: () => ownerService.getRequests(),
    staleTime: 0,          // always fresh — owner needs live data
    refetchInterval: 30_000,
    retry: false,
  });
};


export const useAddRoom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => ownerService.addRoom(data),
    onSuccess: (_, { hostelId }) => {
      queryClient.invalidateQueries({ queryKey: ["owner-rooms", hostelId] });
      queryClient.invalidateQueries({ queryKey: ["floor-summary", hostelId] });
      queryClient.invalidateQueries({ queryKey: ["owner-metrics"] });
    },
  });
};

export const useUpdateRoom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => ownerService.updateRoom(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["owner-rooms"] });
      queryClient.invalidateQueries({ queryKey: ["floor-summary"] });
    },
  });
};

export const useDeleteRoom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => ownerService.deleteRoom(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner-rooms"] });
      queryClient.invalidateQueries({ queryKey: ["floor-summary"] });
      queryClient.invalidateQueries({ queryKey: ["owner-metrics"] });
    },
  });
};

export const useUpdateRoomStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => ownerService.updateRoomStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner-rooms"] });
      queryClient.invalidateQueries({ queryKey: ["floor-summary"] });
    },
  });
};

export const useBulkRoomStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ids, status }) => ownerService.bulkUpdateRoomStatus(ids, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner-rooms"] });
      queryClient.invalidateQueries({ queryKey: ["floor-summary"] });
    },
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// OWNER — mutations
// ─────────────────────────────────────────────────────────────────────────────

export const useApproveRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ requestId, notes }) => ownerService.approveRequest(requestId, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner-requests"] });
      queryClient.invalidateQueries({ queryKey: ["owner-metrics"] });
    },
  });
};

export const useRejectRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ requestId, reason }) => ownerService.rejectRequest(requestId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner-requests"] });
    },
  });
};

export const useFloorSummary = (hostelId) => {
  return useQuery({
    queryKey: ["floor-summary", hostelId],
    queryFn: () => ownerService.getFloorSummary(hostelId),
    enabled: !!hostelId,
    staleTime: 60_000,
  });
};

export const useAddFloor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ hostelId, data }) => ownerService.addFloor(hostelId, data),
    onSuccess: (_, { hostelId }) => {
      queryClient.invalidateQueries({ queryKey: ["owner-rooms", hostelId] });
      queryClient.invalidateQueries({ queryKey: ["floor-summary", hostelId] });
    },
  });
};

export const useDeleteFloor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ hostelId, floorNumber }) => ownerService.deleteFloor(hostelId, floorNumber),
    onSuccess: (_, { hostelId }) => {
      queryClient.invalidateQueries({ queryKey: ["owner-rooms", hostelId] });
      queryClient.invalidateQueries({ queryKey: ["floor-summary", hostelId] });
    },
  });
};

export const useOwnerRules = () => {
  return useQuery({
    queryKey: ["owner-rules"],
    queryFn: async () => {
      const { data } = await api.get("/api/rules/mine");
      return data.rules || data;
    },
    staleTime: 60_000,
  });
};

export const useAddOwnerRule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => api.post("/api/rules", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner-rules"] });
    },
  });
};

export const useBulkAddOwnerRule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (text) => api.post("/api/rules/bulk", { text }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner-rules"] });
    },
  });
};

export const useUpdateOwnerRule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, text }) => api.put(`/api/rules/${id}`, { text }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner-rules"] });
    },
  });
};

export const useDeleteOwnerRule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/api/rules/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner-rules"] });
    },
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// STUDENT — payment history
// ─────────────────────────────────────────────────────────────────────────────

export const useStudentPayments = (page = 1) => {
  return useQuery({
    queryKey: ["student-payments", page],
    queryFn: async () => {
      const { data } = await api.get("/api/payments/my-payments", { params: { page, limit: 20 } });
      return data; // { payments, pagination }
    },
    staleTime: 60_000,
    retry: false,
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// OWNER — payment history / earnings
// ─────────────────────────────────────────────────────────────────────────────

export const useOwnerPayments = () => {
  return useQuery({
    queryKey: ["owner-payments"],
    queryFn: async () => {
      const { data } = await api.get("/api/owner/payment-history/payments");
      return data; // { payments, totalEarnings }
    },
    staleTime: 60_000,
    retry: false,
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// AUTH / PROFILE
// ─────────────────────────────────────────────────────────────────────────────

export const useUserProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await api.get("/api/auth/profile");
      return data.user || data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (profileData) => api.put("/api/auth/profile", profileData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPLAINTS
// ─────────────────────────────────────────────────────────────────────────────

export const useComplaints = () => {
  return useQuery({
    queryKey: ["complaints"],
    queryFn: () => studentService.getMyComplaints(),
    staleTime: 60_000,
  });
};

export const useRaiseComplaint = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (complaintData) => studentService.raiseComplaint(complaintData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["complaints"] });
    },
  });
};

export const useOwnerComplaints = () => {
  return useQuery({
    queryKey: ["owner-complaints"],
    queryFn: async () => {
      const { data } = await api.get("/api/complaints/mine");
      return data.complaints || data;
    },
    staleTime: 30_000,
  });
};

export const useResolveComplaint = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/api/complaints/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner-complaints"] });
    },
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// ROOMMATES
// ─────────────────────────────────────────────────────────────────────────────

export const useRoommates = () => {
  return useQuery({
    queryKey: ["roommates"],
    queryFn: async () => {
      const { data } = await api.get("/api/students/my-roommates");
      return data.roommates || data;
    },
    staleTime: 10 * 60 * 1000,
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// RECENTLY VIEWED
// ─────────────────────────────────────────────────────────────────────────────

export const useRecentlyViewed = () => {
  return useQuery({
    queryKey: ["recently-viewed"],
    queryFn: () => studentService.getRecentlyViewed(),
    staleTime: 60_000,
  });
};

export const useRemoveRecentlyViewed = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (hostelId) => studentService.removeFromRecentlyViewed(hostelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recently-viewed"] });
    },
  });
};

export const useClearRecentlyViewed = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => studentService.clearRecentlyViewed(),
    onSuccess: () => {
      queryClient.setQueryData(["recently-viewed"], []);
    },
  });
};

export const useOwnerStudents = (filters = {}) => {
  return useQuery({
    queryKey: ["owner-students", filters],
    queryFn: () => ownerService.getMyStudents(filters),
    staleTime: 5 * 60 * 1000,
  });
};

export const useAddStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => ownerService.addStudent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner-students"] });
      queryClient.invalidateQueries({ queryKey: ["owner-metrics"] });
    },
  });
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => ownerService.updateStudent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner-students"] });
    },
  });
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => ownerService.deleteStudent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner-students"] });
      queryClient.invalidateQueries({ queryKey: ["owner-metrics"] });
    },
  });
};
export const usePayoutMethods = () => {
  return useQuery({
    queryKey: ["payout-methods"],
    queryFn: () => ownerService.getPayoutMethods(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useAddPayoutMethod = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => ownerService.addPayoutMethod(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payout-methods"] });
    },
  });
};

export const useDeletePayoutMethod = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => ownerService.deletePayoutMethod(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payout-methods"] });
    },
  });
};

export const useSetDefaultPayoutMethod = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => ownerService.setDefaultPayoutMethod(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payout-methods"] });
    },
  });
};
