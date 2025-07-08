const express = require("express");
const router = express.Router();
const {
  addStudent,
  getAllStudents,
} = require("../controllers/studentController");

const { requireAuth, requireOwner } = require("../middleware/authMiddleware");

// 👇 only owners with valid token can add students
router.post("/add", requireAuth, requireOwner, addStudent);

// 👇 anyone logged in can fetch (optional: restrict this too)
router.get("/", requireAuth, getAllStudents);

module.exports = router;
