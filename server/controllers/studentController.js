const Student = require("../models/Student");

// POST: /api/students/add
exports.addStudent = async (req, res) => {
  try {
    const student = new Student({ ...req.body, addedBy: req.user?.id || null });
    await student.save();
    res.status(201).json({ message: "✅ Student added!", student });
  } catch (err) {
    console.error("Add student error:", err);
    res.status(500).json({ error: "Failed to add student ❌" });
  }
};

// GET: /api/students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch students" });
  }
};
