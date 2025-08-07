const Student = require("../models/Student");

exports.addStudent = async (req, res) => {
  try {
    const { name, email, phone, address, hostel, floor, room } = req.body;

    // Validation
    if (!name || !email || !phone || !hostel || !floor || !room) {
      return res
        .status(400)
        .json({ message: "Please fill in all required fields." });
    }

    const newStudent = new Student({
      name,
      email,
      phone,
      address,
      hostel,
      floor,
      room,
      owner: req.user.id, // Get owner from auth token
    });

    await newStudent.save();
    res
      .status(201)
      .json({ message: "Student added successfully", student: newStudent });
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ message: "Email or phone number already exists." });
    }
    console.error("Error adding student:", err);
    res.status(500).json({ message: "Failed to add student." });
  }
};

exports.getOwnerStudents = async (req, res) => {
  try {
    const ownerId = req.user.id;
    // We populate the 'hostel' field to get the hostel name for the frontend filter.
    const students = await Student.find({ owner: ownerId }).populate(
      "hostel",
      "name"
    );
    res.status(200).json({ students });
  } catch (err) {
    console.error("Error fetching owner's students:", err);
    res.status(500).json({ message: "Failed to fetch students." });
  }
};