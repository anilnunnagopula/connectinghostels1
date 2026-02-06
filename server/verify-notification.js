/**
 * VERIFY NOTIFICATION - Check if notification exists and is linked correctly
 */

const mongoose = require("mongoose");
const Notification = require("./models/Notification");
const Student = require("./models/Student");
const User = require("./models/User");
require("dotenv").config();

async function verifyNotification() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Find the most recent notification (the one just sent)
    const notification = await Notification.findOne()
      .sort({ createdAt: -1 })
      .populate("recipientStudent");

    if (!notification) {
      console.log("❌ No notifications found!");
      await mongoose.connection.close();
      return;
    }

    console.log("\n📊 MOST RECENT NOTIFICATION:");
    console.log("=".repeat(60));
    console.log("Message:", notification.message.substring(0, 50) + "...");
    console.log("Type:", notification.type);
    console.log("Created:", notification.createdAt);
    console.log("RecipientStudent ID:", notification.recipientStudent._id);
    console.log("RecipientStudent Name:", notification.recipientStudent.name);
    console.log("RecipientStudent Email:", notification.recipientStudent.email);

    // Check if this student has a user field
    const student = notification.recipientStudent;
    console.log("\n📊 STUDENT INFO:");
    console.log("=".repeat(60));
    console.log("Student ID:", student._id);
    console.log("Student Name:", student.name);
    console.log("Student Email:", student.email);
    console.log("Student User Field:", student.user || "❌ NULL (PROBLEM!)");

    if (!student.user) {
      console.log("\n❌ PROBLEM FOUND!");
      console.log("This student doesn't have a 'user' field!");
      console.log("They cannot log in or see notifications.");
      console.log("\nSOLUTION:");
      console.log("1. Run: node create-user-accounts.js");
      console.log(
        "2. OR send notifications to students who have user accounts",
      );
    } else {
      console.log("\n✅ Student has user field!");

      // Get the user
      const user = await User.findById(student.user);
      if (!user) {
        console.log("❌ But the user doesn't exist in database!");
      } else {
        console.log("✅ User exists:");
        console.log("   User ID:", user._id);
        console.log("   User Email:", user.email);
        console.log("   User Role:", user.role);

        console.log("\n🔍 TESTING NOTIFICATION FETCH:");
        console.log("If this student logs in with:");
        console.log("   Email:", user.email);
        console.log("   (They should have set a password during registration)");
        console.log("\nThe backend will:");
        console.log("1. Get user._id from token:", user._id);
        console.log("2. Find student where student.user =", user._id);
        console.log(
          "3. Find notifications where recipientStudent =",
          student._id,
        );
        console.log("4. Return this notification!");

        // Simulate the fetch
        const testStudent = await Student.findOne({ user: user._id });
        if (!testStudent) {
          console.log("\n❌ PROBLEM: Can't find student with user:", user._id);
        } else {
          console.log("\n✅ Student found by user ID!");

          const testNotifications = await Notification.find({
            recipientStudent: testStudent._id,
          });

          console.log(
            `✅ Found ${testNotifications.length} notification(s) for this student!`,
          );

          if (testNotifications.length > 0) {
            console.log("\n✅✅✅ EVERYTHING IS CORRECT!");
            console.log(
              "The student SHOULD see notifications when they log in.",
            );
            console.log("\nIf they still don't see it:");
            console.log("1. Check they're logging in with:", user.email);
            console.log(
              "2. Check frontend is calling: /api/student/notifications",
            );
            console.log("3. Check browser console for errors");
            console.log("4. Share the frontend console logs with me");
          }
        }
      }
    }

    await mongoose.connection.close();
    console.log("\n✅ Done!");
  } catch (error) {
    console.error("❌ Error:", error);
    await mongoose.connection.close();
  }
}

verifyNotification();
