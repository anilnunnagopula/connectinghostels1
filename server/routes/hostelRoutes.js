const express = require("express");
const router = express.Router();
const hostelController = require("../controllers/hostelController");

// Public hostel browsing
router.get("/", hostelController.getAllPublicHostels);
router.get("/:id", hostelController.getPublicHostelById);

module.exports = router;
