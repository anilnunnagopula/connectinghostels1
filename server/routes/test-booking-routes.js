/**
 * TEST SCRIPT - Run this to verify bookingRoutes.js is correct
 *
 * Usage: node test-booking-routes.js
 */

console.log("🧪 Testing bookingRoutes.js...\n");

try {
  // Test 1: Can we require the file?
  console.log("Test 1: Loading bookingRoutes.js...");
  const bookingRoutes = require("./routes/bookingRoutes");
  console.log("✅ File loaded successfully\n");

  // Test 2: Does it export the correct structure?
  console.log("Test 2: Checking exports...");
  console.log("Exports type:", typeof bookingRoutes);
  console.log("Has studentRouter?", !!bookingRoutes.studentRouter);
  console.log("Has ownerRouter?", !!bookingRoutes.ownerRouter);

  if (!bookingRoutes.studentRouter || !bookingRoutes.ownerRouter) {
    console.log("❌ PROBLEM: Missing routers!");
    console.log("Expected: { studentRouter, ownerRouter }");
    console.log("Got:", Object.keys(bookingRoutes));
    process.exit(1);
  }
  console.log("✅ Correct exports\n");

  // Test 3: Are they Express routers?
  console.log("Test 3: Verifying router types...");
  console.log(
    "studentRouter type:",
    bookingRoutes.studentRouter.constructor.name,
  );
  console.log("ownerRouter type:", bookingRoutes.ownerRouter.constructor.name);

  if (bookingRoutes.studentRouter.constructor.name !== "router") {
    console.log("⚠️  Warning: studentRouter might not be an Express router");
  }
  if (bookingRoutes.ownerRouter.constructor.name !== "router") {
    console.log("⚠️  Warning: ownerRouter might not be an Express router");
  }
  console.log("✅ Routers appear valid\n");

  // Test 4: Check if controller exists
  console.log("Test 4: Checking if bookingController exists...");
  try {
    const controller = require("./controllers/bookingController");
    console.log("✅ Controller found");
    console.log("Controller exports:", Object.keys(controller).join(", "));

    const requiredFunctions = [
      "createBookingRequest",
      "getStudentRequests",
      "cancelBookingRequest",
      "getOwnerBookingRequests",
      "approveBookingRequest",
      "rejectBookingRequest",
    ];

    const missing = requiredFunctions.filter((fn) => !controller[fn]);
    if (missing.length > 0) {
      console.log(
        "❌ PROBLEM: Missing controller functions:",
        missing.join(", "),
      );
      process.exit(1);
    }
    console.log("✅ All required controller functions present\n");
  } catch (err) {
    console.log("❌ PROBLEM: Can't load bookingController.js");
    console.log("Error:", err.message);
    process.exit(1);
  }

  // Test 5: Check middleware
  console.log("Test 5: Checking if authMiddleware exists...");
  try {
    const middleware = require("./middleware/authMiddleware");
    console.log("✅ Middleware found");
    console.log("Middleware exports:", Object.keys(middleware).join(", "));

    if (!middleware.requireStudent) {
      console.log("❌ PROBLEM: Missing requireStudent middleware!");
      console.log("You need to add this function to authMiddleware.js");
      process.exit(1);
    }
    console.log("✅ All required middleware present\n");
  } catch (err) {
    console.log("❌ PROBLEM: Can't load authMiddleware.js");
    console.log("Error:", err.message);
    process.exit(1);
  }

  console.log("🎉 ALL TESTS PASSED!");
  console.log("\nYour bookingRoutes.js is configured correctly.");
  console.log(
    "If the server still doesn't work, the issue is in server.js mounting.\n",
  );
} catch (err) {
  console.log("❌ FATAL ERROR:", err.message);
  console.log("\nFull error:");
  console.log(err);
  process.exit(1);
}
