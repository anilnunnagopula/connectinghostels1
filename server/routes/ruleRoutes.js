const express = require("express");
const router = express.Router();
const ruleController = require("../controllers/ruleController");
const { requireAuth, requireOwner } = require("../middleware/authMiddleware");

// --- PUBLIC/STUDENT ROUTES (Just requireAuth) ---

// Route for students to see rules of a specific hostel
router.get("/hostel/:hostelId", requireAuth, ruleController.getHostelRules);

// --- OWNER ONLY ROUTES (requireOwner) ---

router.post("/bulk", requireAuth, requireOwner, ruleController.bulkAddRule);
router.get("/mine", requireAuth, requireOwner, ruleController.getOwnerRules);
router.post("/", requireAuth, requireOwner, ruleController.addRule);
router.put("/:id", requireAuth, requireOwner, ruleController.updateRule);
router.delete("/:id", requireAuth, requireOwner, ruleController.deleteRule);

module.exports = router;
