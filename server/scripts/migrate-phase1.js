/**
 * Phase 1 Migration Script — ConnectingHostels
 *
 * Performs a direct cutover for the Phase 1 schema redesign.
 * Run once on dev/staging, verify integrity, then run on production.
 *
 * Usage:
 *   node server/scripts/migrate-phase1.js
 *
 * What this does:
 *   1. Creates OwnerProfile for every existing owner User
 *   2. Migrates Student.owner → Student.currentOwner
 *   3. Fixes Student.currentRoom: looks up Room by hostel+roomNumber
 *   4. Creates Booking records from all Approved BookingRequests
 *   5. Recalculates Hostel.stats from actual Room documents
 *   6. Moves User.interestedHostels + recentlyViewed → Student
 *
 * Safe to re-run: all operations are idempotent (upserts / existence checks).
 */

require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");

// Import models (will use updated schemas)
const User          = require("../models/User");
const OwnerProfile  = require("../models/OwnerProfile");
const Student       = require("../models/Student");
const Hostel        = require("../models/Hostel");
const Room          = require("../models/Room");
const BookingRequest = require("../models/BookingRequest");
const Booking       = require("../models/Booking");

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

async function run() {
  console.log("🔌 Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected\n");

  // ─────────────────────────────────────────────────────────────────────────
  // STEP 1: Create OwnerProfile for every owner User
  // ─────────────────────────────────────────────────────────────────────────
  console.log("📋 Step 1: Creating OwnerProfiles...");
  const owners = await User.find({ role: "owner" }).lean();
  let created = 0, skipped = 0;

  for (const owner of owners) {
    const exists = await OwnerProfile.findOne({ user: owner._id }).lean();
    if (exists) { skipped++; continue; }

    await OwnerProfile.create({
      user: owner._id,
      // Migrate hostelName if it existed on old User docs
      businessName: owner.hostelName || undefined,
    });
    created++;
  }
  console.log(`   ✅ Created: ${created} | Skipped (already existed): ${skipped}\n`);

  // ─────────────────────────────────────────────────────────────────────────
  // STEP 2: Migrate Student.owner → Student.currentOwner
  //         and fix Student.currentRoom from raw Number to Room ObjectId
  // ─────────────────────────────────────────────────────────────────────────
  console.log("📋 Step 2: Migrating Student placement fields...");

  // Use .find() with { isDeleted: false } to bypass soft-delete pre-hook
  const students = await Student.find({ isDeleted: false }).lean();
  let roomFixed = 0, roomMissing = 0, ownerMigrated = 0;

  for (const student of students) {
    const update = {};

    // Migrate owner → currentOwner
    if (student.owner && !student.currentOwner) {
      update.currentOwner = student.owner;
      ownerMigrated++;
    }

    // Fix currentRoom: if student has a rawRoomNumber but no currentRoom ObjectId
    // and they have a currentHostel, look up the Room document
    if (
      student.currentHostel &&
      student.roomNumber &&
      !student.currentRoom
    ) {
      const room = await Room.findOne({
        hostel: student.currentHostel,
        roomNumber: String(student.roomNumber),
        isDeleted: false,
      }).lean();

      if (room) {
        update.currentRoom = room._id;
        roomFixed++;
      } else {
        console.warn(
          `   ⚠️  No Room found for student=${student._id} ` +
          `hostel=${student.currentHostel} roomNumber=${student.roomNumber}`
        );
        roomMissing++;
      }
    }

    if (Object.keys(update).length > 0) {
      await Student.updateOne({ _id: student._id }, { $set: update });
    }
  }
  console.log(`   ✅ owner→currentOwner migrated: ${ownerMigrated}`);
  console.log(`   ✅ currentRoom fixed: ${roomFixed}`);
  console.log(`   ⚠️  currentRoom missing (no Room doc): ${roomMissing}\n`);

  // ─────────────────────────────────────────────────────────────────────────
  // STEP 3: Move User.interestedHostels + recentlyViewed → Student
  // ─────────────────────────────────────────────────────────────────────────
  console.log("📋 Step 3: Migrating User.interestedHostels + recentlyViewed → Student...");

  // Read raw User docs including removed fields via lean + strict:false trick
  const usersWithPrefs = await mongoose.connection
    .collection("users")
    .find({
      $or: [
        { interestedHostels: { $exists: true, $ne: [] } },
        { recentlyViewed: { $exists: true, $ne: [] } },
      ],
    })
    .toArray();

  let prefsMigrated = 0;
  for (const user of usersWithPrefs) {
    const student = await Student.findOne({ user: user._id });
    if (!student) continue;

    const update = {};
    if (user.interestedHostels?.length && !student.interestedHostels?.length) {
      update.interestedHostels = user.interestedHostels;
    }
    if (user.recentlyViewed?.length && !student.recentlyViewed?.length) {
      update.recentlyViewed = user.recentlyViewed;
    }
    if (Object.keys(update).length > 0) {
      await Student.updateOne({ _id: student._id }, { $set: update });
      // Remove from User collection (raw update to bypass strict schema)
      await mongoose.connection.collection("users").updateOne(
        { _id: user._id },
        { $unset: { interestedHostels: "", recentlyViewed: "", hostelName: "" } }
      );
      prefsMigrated++;
    }
  }
  console.log(`   ✅ Users with prefs migrated: ${prefsMigrated}\n`);

  // ─────────────────────────────────────────────────────────────────────────
  // STEP 4: Create Booking records from Approved BookingRequests
  // ─────────────────────────────────────────────────────────────────────────
  console.log("📋 Step 4: Creating Booking records from approved BookingRequests...");

  const approvedRequests = await mongoose.connection
    .collection("bookingrequests")
    .find({ status: "Approved" })
    .toArray();

  let bookingsCreated = 0, bookingsSkipped = 0;

  for (const req of approvedRequests) {
    const exists = await Booking.findOne({ bookingRequest: req._id }).lean();
    if (exists) { bookingsSkipped++; continue; }

    // Find the student to get currentRoom
    const student = await Student.findById(req.student).lean();

    // Find the room (from the request or student)
    let roomId = req.room || student?.currentRoom || null;

    // If still no room ref, attempt lookup by roomNumber
    if (!roomId && req.hostel && req.roomNumber) {
      const room = await Room.findOne({
        hostel: req.hostel,
        roomNumber: String(req.roomNumber),
        isDeleted: false,
      }).lean();
      roomId = room?._id || null;
    }

    if (!roomId) {
      console.warn(
        `   ⚠️  Cannot create Booking for request=${req._id}: no room resolved`
      );
      continue;
    }

    // Get rent from hostel
    const hostel = await Hostel.findById(req.hostel).select("pricePerMonth").lean();

    await Booking.create({
      student:        req.student,
      hostel:         req.hostel,
      room:           roomId,
      owner:          req.owner,
      bookingRequest: req._id,
      startDate:      req.updatedAt || req.createdAt,
      monthlyRent:    hostel?.pricePerMonth || 0,
      status:         student?.status === "Active" ? "active" : "completed",
    });
    bookingsCreated++;
  }
  console.log(`   ✅ Bookings created: ${bookingsCreated} | Skipped (already existed): ${bookingsSkipped}\n`);

  // ─────────────────────────────────────────────────────────────────────────
  // STEP 5: Recalculate Hostel.stats from actual Room documents
  // ─────────────────────────────────────────────────────────────────────────
  console.log("📋 Step 5: Recalculating Hostel.stats...");

  const hostels = await Hostel.find({ isDeleted: false }).lean();
  let statsUpdated = 0;

  for (const hostel of hostels) {
    const [totalRooms, occupiedRooms, availableRooms] = await Promise.all([
      Room.countDocuments({ hostel: hostel._id, isDeleted: false }),
      Room.countDocuments({ hostel: hostel._id, status: "occupied", isDeleted: false }),
      Room.countDocuments({ hostel: hostel._id, status: "available", isDeleted: false }),
    ]);

    await Hostel.updateOne(
      { _id: hostel._id },
      {
        $set: {
          "stats.totalRooms":       totalRooms,
          "stats.occupiedRooms":    occupiedRooms,
          "stats.availableRooms":   availableRooms,
          "stats.lastCalculatedAt": new Date(),
        },
      }
    );
    statsUpdated++;
  }
  console.log(`   ✅ Hostel stats recalculated: ${statsUpdated}\n`);

  // ─────────────────────────────────────────────────────────────────────────
  // STEP 6: Update active Students to reference their Booking
  // ─────────────────────────────────────────────────────────────────────────
  console.log("📋 Step 6: Linking Student.activeBooking...");
  const activeBookings = await Booking.find({ status: "active" }).lean();
  let linked = 0;
  for (const booking of activeBookings) {
    await Student.updateOne(
      { _id: booking.student, activeBooking: null },
      { $set: { activeBooking: booking._id } }
    );
    linked++;
  }
  console.log(`   ✅ Active bookings linked to students: ${linked}\n`);

  // ─────────────────────────────────────────────────────────────────────────
  // INTEGRITY CHECK
  // ─────────────────────────────────────────────────────────────────────────
  console.log("🔍 Running integrity check...");

  const activeStudents = await Student.countDocuments({ status: "Active", isDeleted: false });
  const studentsWithRoom = await Student.countDocuments({ status: "Active", currentRoom: { $ne: null }, isDeleted: false });
  const studentsWithBooking = await Student.countDocuments({ status: "Active", activeBooking: { $ne: null }, isDeleted: false });

  console.log(`   Active students:             ${activeStudents}`);
  console.log(`   With currentRoom ObjectId:   ${studentsWithRoom} (${activeStudents > 0 ? ((studentsWithRoom/activeStudents)*100).toFixed(1) : 0}%)`);
  console.log(`   With activeBooking:          ${studentsWithBooking} (${activeStudents > 0 ? ((studentsWithBooking/activeStudents)*100).toFixed(1) : 0}%)`);

  if (roomMissing > 0) {
    console.log(`\n   ⚠️  WARNING: ${roomMissing} students could not have currentRoom resolved.`);
    console.log(`      These students were admitted before Room documents existed.`);
    console.log(`      Create Room documents for them manually via the owner dashboard.`);
  }

  console.log("\n✅ Phase 1 migration complete.");
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
