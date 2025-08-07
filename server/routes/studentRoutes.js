const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const { requireAuth, requireOwner } = require("../middleware/authMiddleware");

// Route to add a new student
router.post("/add", requireAuth, requireOwner, studentController.addStudent);
router.get(
  "/mine",
  requireAuth,
  requireOwner,
  studentController.getOwnerStudents
);

module.exports = router;
