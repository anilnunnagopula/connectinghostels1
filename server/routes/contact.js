const express = require("express");
const router = express.Router();
const logger = require("../middleware/logger");

router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    logger.info(`Contact form: ${name} <${email}>`);
    return res.status(200).json({ message: "Message received" });
  } catch (err) {
    logger.error("Contact route error: " + err.message);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
