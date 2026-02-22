const express = require("express");
const router = express.Router();
const hostelController = require("../controllers/hostelController");
const { cacheMiddleware } = require("../middleware/cache");

// Public hostel browsing — listing cached for 2 min, individual for 5 min
router.get("/", cacheMiddleware(120), hostelController.getAllPublicHostels);
router.get("/:id", cacheMiddleware(300), hostelController.getPublicHostelById);

module.exports = router;
