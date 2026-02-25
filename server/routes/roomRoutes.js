const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/roomController");
const { requireAuth, requireOwner } = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validators/authValidators");
const {
  createRoomRules,
  updateRoomRules,
  updateStatusRules,
  roomIdRules,
  listRoomsRules,
} = require("../middleware/validators/roomValidators");

const auth = [requireAuth, requireOwner];

// ── Room CRUD ──────────────────────────────────────────────────────────────
router.get("/",          ...auth, listRoomsRules,    validate, ctrl.getRooms);          // GET  ?hostelId=
router.get("/summary",   ...auth,                              ctrl.getFloorSummary); // GET  ?hostelId=
router.post("/",         ...auth, createRoomRules,   validate, ctrl.addRoom);           // POST
router.post("/bulk",     ...auth,                              ctrl.bulkUpdateStatus);// POST bulk status
router.put("/:id",       ...auth, roomIdRules, updateRoomRules,   validate, ctrl.updateRoom);    // PUT
router.patch("/:id/status", ...auth, updateStatusRules, validate, ctrl.updateRoomStatus); // PATCH status
router.delete("/:id",    ...auth, roomIdRules,        validate, ctrl.deleteRoom);       // DELETE

module.exports = router;
