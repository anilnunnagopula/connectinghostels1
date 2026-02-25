/**
 * Billing Routes — Dues, Transactions, Invoices
 * Mount at: /api/billing
 */

const express = require("express");
const router = express.Router();
const billingController = require("../controllers/billingController");
const { requireAuth, requireOwner, requireStudent } = require("../middleware/authMiddleware");

// ============================================================================
// OWNER ROUTES
// ============================================================================

// Create a due for a student
router.post("/dues", requireAuth, requireOwner, billingController.createDue);

// List all dues for owner (paginated)
router.get("/owner/dues", requireAuth, requireOwner, billingController.getOwnerDues);

// Record a cash payment for a due
router.post("/dues/:id/record-cash", requireAuth, requireOwner, billingController.recordCashPayment);

// Apply late fee to a due (permanently writes fineAmount to DB)
router.post("/dues/:id/apply-late-fee", requireAuth, requireOwner, billingController.applyLateFee);

// ============================================================================
// STUDENT ROUTES
// ============================================================================

// Get student's dues (with computed late fee info)
router.get("/my-dues", requireAuth, requireStudent, billingController.getMyDues);

// Create Razorpay order for a due
router.post("/dues/:id/create-order", requireAuth, requireStudent, billingController.createDueOrder);

// Verify Razorpay payment for a due (idempotent)
router.post("/dues/:id/verify", requireAuth, requireStudent, billingController.verifyDuePayment);

// Get student's invoices
router.get("/my-invoices", requireAuth, requireStudent, billingController.getMyInvoices);

module.exports = router;
