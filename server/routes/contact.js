// backend/routes/contact.js
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Save to DB (MongoDB, Firebase, etc)
    // OR send via email (e.g. using nodemailer)
    console.log("📩 Contact form submitted:", { name, email, message });

    return res.status(200).json({ message: "Message received" });
  } catch (err) {
    console.error("Contact error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
