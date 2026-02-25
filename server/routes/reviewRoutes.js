/**
 * Review Routes
 * Mount at: /api/reviews
 */
const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const { requireAuth, requireStudent, requireOwner, requireAdmin } = require("../middleware/authMiddleware");

// Public
router.get("/hostel/:hostelId", reviewController.getHostelReviews);

// Student
router.post("/", requireAuth, requireStudent, reviewController.createReview);

// Owner
router.put("/:id/reply", requireAuth, requireOwner, reviewController.replyToReview);

// Admin
router.delete("/:id", requireAuth, requireAdmin, reviewController.deleteReview);

module.exports = router;
