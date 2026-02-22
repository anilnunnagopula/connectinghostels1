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

// Hostel management
router.get("/hostels", adminController.listHostels);
router.delete("/hostels/:id", adminController.deleteHostel);
router.put("/hostels/:id/toggle-active", adminController.toggleHostelActive);

module.exports = router;
