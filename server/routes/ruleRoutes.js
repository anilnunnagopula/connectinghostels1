const express = require("express");
const router = express.Router();
const ruleController = require("../controllers/ruleController");
const { requireAuth, requireOwner } = require("../middleware/authMiddleware");

// Route to get all rules for the authenticated owner
router.get("/mine", requireAuth, requireOwner, ruleController.getOwnerRules);

// Route to add a new rule
router.post("/", requireAuth, requireOwner, ruleController.addRule);

// Route to update a specific rule
router.put("/:id", requireAuth, requireOwner, ruleController.updateRule);

// Route to delete a specific rule
router.delete("/:id", requireAuth, requireOwner, ruleController.deleteRule);

module.exports = router;
