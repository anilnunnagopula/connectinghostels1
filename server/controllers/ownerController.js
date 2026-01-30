const mongoose = require("mongoose");
const Hostel = require("../models/Hostel");
const Complaint = require("../models/Complaint");
const Student = require("../models/Student");

exports.getOwnerDashboardMetrics = async (req, res) => {
  try {
    const ownerId = req.user.id; // from JWT decoded user

    // ========== FIX 1: Use 'ownerId' field (not 'owner') ==========
    // Your Hostel schema uses 'ownerId', not 'owner'
    const totalHostels = await Hostel.countDocuments({ ownerId });

    // ========== FIX 2: Calculate rooms from Hostel schema fields ==========
    // Your schema has totalRooms and availableRooms fields
    const hostels = await Hostel.find({ ownerId, isActive: true }).select(
      "totalRooms availableRooms pricePerMonth type locality",
    );

    // Calculate total rooms across all hostels
    const totalRooms = hostels.reduce((sum, h) => sum + (h.totalRooms || 0), 0);

    // Calculate available rooms across all hostels
    const availableRooms = hostels.reduce(
      (sum, h) => sum + (h.availableRooms || 0),
      0,
    );

    // Calculate filled rooms
    const roomsFilled = totalRooms - availableRooms;

    // ========== Students Count ==========
    // Make sure Student model uses 'ownerId' field as well
    const totalStudents = await Student.countDocuments({ ownerId });

    // ========== Complaints Count ==========
    // Get pending complaints (adjust field name based on your schema)
    const complaintsCount = await Complaint.countDocuments({
      ownerId,
      status: "Pending", // or use: { $in: ['Pending', 'In-Progress'] }
    });

    // ========== BONUS: Additional Metrics ==========

    // Calculate occupancy rate
    const occupancyRate =
      totalRooms > 0 ? ((roomsFilled / totalRooms) * 100).toFixed(1) : 0;

    // Calculate estimated monthly revenue
    const monthlyRevenue = hostels.reduce((sum, h) => {
      const filled = (h.totalRooms || 0) - (h.availableRooms || 0);
      return sum + filled * (h.pricePerMonth || 0);
    }, 0);

    // Hostel breakdown by type
    const hostelsByType = {
      Boys: hostels.filter((h) => h.type === "Boys").length,
      Girls: hostels.filter((h) => h.type === "Girls").length,
      "Co-Live": hostels.filter((h) => h.type === "Co-Live").length,
    };

    // Hostel breakdown by locality
    const hostelsByLocality = hostels.reduce((acc, h) => {
      acc[h.locality] = (acc[h.locality] || 0) + 1;
      return acc;
    }, {});

    // ========== Pending Requests (if you have BookingRequest model) ==========
    // Uncomment when you have BookingRequest model
    /*
    const BookingRequest = require("../models/BookingRequest");
    const pendingRequestsCount = await BookingRequest.countDocuments({
      ownerId,
      status: "pending"
    });
    */
    const pendingRequestsCount = 0; // Placeholder

    // ========== RESPONSE ==========
    res.status(200).json({
      success: true,
      // Core metrics (matching frontend expectations)
      totalHostels,
      roomsFilled,
      studentsCount: totalStudents,
      complaintsCount,
      availableRooms,

      // Additional metrics
      totalRooms,
      occupancyRate,
      monthlyRevenue,
      pendingRequestsCount,

      // Breakdowns
      hostelsByType,
      hostelsByLocality,

      // Raw hostel data (if needed)
      hostels: hostels.map((h) => ({
        id: h._id,
        totalRooms: h.totalRooms,
        availableRooms: h.availableRooms,
        type: h.type,
        locality: h.locality,
      })),
    });
  } catch (err) {
    console.error("🚨 Error in dashboard metrics:", err);
    res.status(500).json({
      success: false,
      error: "Server error",
      message: err.message,
    });
  }
};

// ========== OPTIONAL: Get notifications for dashboard ==========
exports.getOwnerNotifications = async (req, res) => {
  try {
    const ownerId = req.user.id;

    // This is a placeholder - implement based on your Notification model
    // Example structure:
    /*
    const Notification = require("../models/Notification");
    const notifications = await Notification.find({ ownerId })
      .sort({ createdAt: -1 })
      .limit(10);
    */

    res.status(200).json({
      success: true,
      notifications: [], // Placeholder
    });
  } catch (err) {
    console.error("❌ Error fetching notifications:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
    });
  }
};

// ========== OPTIONAL: Get stats for a specific hostel ==========
exports.getHostelQuickStats = async (req, res) => {
  try {
    const { hostelId } = req.params;
    const ownerId = req.user.id;

    // Find hostel and verify ownership
    const hostel = await Hostel.findOne({ _id: hostelId, ownerId });

    if (!hostel) {
      return res.status(404).json({
        success: false,
        message: "Hostel not found or unauthorized",
      });
    }

    // Calculate hostel-specific metrics
    const roomsFilled = hostel.totalRooms - hostel.availableRooms;
    const occupancyRate =
      hostel.totalRooms > 0
        ? ((roomsFilled / hostel.totalRooms) * 100).toFixed(1)
        : 0;

    // Get student count for this hostel
    const studentsCount = await Student.countDocuments({
      hostelId,
    });

    // Get complaints for this hostel
    const complaintsCount = await Complaint.countDocuments({
      hostelId,
      status: "Pending",
    });

    res.status(200).json({
      success: true,
      stats: {
        hostelName: hostel.name,
        totalRooms: hostel.totalRooms,
        availableRooms: hostel.availableRooms,
        roomsFilled,
        occupancyRate,
        studentsCount,
        complaintsCount,
        monthlyRevenue: roomsFilled * (hostel.pricePerMonth || 0),
      },
    });
  } catch (err) {
    console.error("❌ Error fetching hostel stats:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch hostel statistics",
    });
  }
};
