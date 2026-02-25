/**
 * Admin Routes — All require auth + admin role.
 * Mount at: /api/admin
 */

const express = require("express");
const router = express.Router();
const { requireAuth, requireAdmin } = require("../middleware/authMiddleware");
const adminController = require("../controllers/adminController");

// Apply auth guard to every admin route
router.use(requireAuth, requireAdmin);

// Platform stats
router.get("/stats", adminController.getPlatformStats);

// User management
router.get("/users", adminController.listUsers);
router.put("/users/:id/ban", adminController.banUser);

// Hostel management (includes pending approval queue via ?status=pending)
router.get("/hostels", adminController.listHostels);
router.put("/hostels/:id/approve", adminController.approveHostel);
router.put("/hostels/:id/reject", adminController.rejectHostel);
router.put("/hostels/:id/verify", adminController.verifyHostel);
router.put("/hostels/:id/toggle-active", adminController.toggleHostelActive);
router.delete("/hostels/:id", adminController.deleteHostel);

// Complaint management
router.get("/complaints", adminController.listComplaints);
router.put("/complaints/:id/resolve", adminController.resolveComplaint);

module.exports = router;
