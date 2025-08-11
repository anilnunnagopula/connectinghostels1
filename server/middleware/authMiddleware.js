const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided ❌" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // ✅ Correct
    req.user = decoded; // Now req.user.id and req.user.role are available
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token ❌" });
  }
};

const requireOwner = (req, res, next) => {
  if (req.user?.role !== "owner") {
    return res.status(403).json({ error: "Only owners allowed 🚫" });
  }
  next();
};
const requireStudent = (req, res, next) => {
  if (req.user && req.user.role === "student") {
    next();
  } else {
    return res.status(403).json({ message: "Access denied. Students only." });
  }
};

module.exports = { requireAuth, requireOwner, requireStudent };
