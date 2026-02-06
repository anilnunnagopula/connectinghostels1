/**
 * DIAGNOSTIC & FIX SCRIPT
 *
 * This script:
 * 1. Checks your student documents
 * 2. Shows which students are missing the 'user' field
 * 3. Provides a migration to link existing students to users
 */

const mongoose = require("mongoose");
const Student = require("./models/Student");
const User = require("./models/User");
require("dotenv").config();

async function diagnoseAndFix() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // ===========================================================================
    // STEP 1: DIAGNOSE - Check student data
    // ===========================================================================
    console.log("\n📊 DIAGNOSTIC REPORT:");
    console.log("=".repeat(60));

    const allStudents = await Student.find({});
    console.log(`Total students: ${allStudents.length}`);

    const studentsWithUser = allStudents.filter((s) => s.user);
    const studentsWithoutUser = allStudents.filter((s) => !s.user);

    console.log(`✅ Students WITH user field: ${studentsWithUser.length}`);
    console.log(
      `❌ Students WITHOUT user field: ${studentsWithoutUser.length}`,
    );

    if (studentsWithoutUser.length > 0) {
      console.log("\n❌ PROBLEM FOUND:");
      console.log("These students don't have a 'user' field:");
      studentsWithoutUser.forEach((s) => {
        console.log(`  - ${s.name} (${s.email}) [ID: ${s._id}]`);
      });

      console.log("\n🔧 ATTEMPTING TO FIX...");

      // ===========================================================================
      // STEP 2: FIX - Link students to users by email
      // ===========================================================================
      let fixed = 0;
      let failed = 0;

      for (const student of studentsWithoutUser) {
        // Try to find a User with the same email
        const user = await User.findOne({ email: student.email });

        if (user) {
          // Link the student to the user
          student.user = user._id;
          await student.save();
          console.log(`  ✅ Linked ${student.name} to user ${user.email}`);
          fixed++;
        } else {
          console.log(
            `  ❌ No user found for ${student.name} (${student.email})`,
          );
          failed++;
        }
      }

      console.log("\n📊 FIX RESULTS:");
      console.log(`  ✅ Successfully fixed: ${fixed}`);
      console.log(`  ❌ Failed to fix: ${failed}`);

      if (failed > 0) {
        console.log("\n⚠️  WARNING:");
        console.log("Some students couldn't be linked to users.");
        console.log("These students need user accounts created first:");
        const stillBroken = await Student.find({ user: null });
        stillBroken.forEach((s) => {
          console.log(`  - ${s.name} (${s.email})`);
        });
      }
    } else {
      console.log("\n✅ ALL STUDENTS HAVE USER FIELD - No fix needed!");
    }

    // ===========================================================================
    // STEP 3: VERIFY NOTIFICATIONS
    // ===========================================================================
    console.log("\n📊 NOTIFICATION CHECK:");
    console.log("=".repeat(60));

    const Notification = require("./models/Notification");
    const notifications = await Notification.find({}).populate(
      "recipientStudent",
    );

    console.log(`Total notifications: ${notifications.length}`);

    const validNotifications = notifications.filter(
      (n) => n.recipientStudent && n.recipientStudent.user,
    );
    const invalidNotifications = notifications.filter(
      (n) => !n.recipientStudent || !n.recipientStudent.user,
    );

    console.log(
      `✅ Valid notifications (student has user): ${validNotifications.length}`,
    );
    console.log(
      `❌ Invalid notifications (student missing user): ${invalidNotifications.length}`,
    );

    if (invalidNotifications.length > 0) {
      console.log(
        "\n⚠️  These notifications won't show because students don't have user field:",
      );
      invalidNotifications.forEach((n) => {
        const studentName = n.recipientStudent
          ? n.recipientStudent.name
          : "DELETED STUDENT";
        console.log(`  - "${n.message.substring(0, 50)}..." → ${studentName}`);
      });
    }

    // ===========================================================================
    // FINAL SUMMARY
    // ===========================================================================
    console.log("\n" + "=".repeat(60));
    console.log("📋 FINAL STATUS:");
    console.log("=".repeat(60));

    const finalStudentsWithoutUser = await Student.countDocuments({
      user: null,
    });

    if (finalStudentsWithoutUser === 0) {
      console.log("✅ ALL STUDENTS ARE PROPERLY LINKED!");
      console.log("✅ Notifications should now work!");
      console.log("\n🎯 Next steps:");
      console.log("   1. Restart your server");
      console.log("   2. Log in as a student");
      console.log("   3. Visit the notifications page");
      console.log("   4. You should see notifications!");
    } else {
      console.log(`❌ ${finalStudentsWithoutUser} students still need fixing`);
      console.log("\n🎯 Manual fix required:");
      console.log("   1. Create user accounts for students without them");
      console.log("   2. Run this script again");
    }

    await mongoose.connection.close();
    console.log("\n✅ Database connection closed");
  } catch (error) {
    console.error("❌ Error:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Run the diagnostic and fix
diagnoseAndFix();

/**
 * HOW TO RUN THIS SCRIPT:
 *
 * 1. Save this file as: diagnose-notifications.js
 * 2. Run: node diagnose-notifications.js
 * 3. It will show you what's wrong and attempt to fix it
 * 4. If successful, restart your server and test notifications
 */
