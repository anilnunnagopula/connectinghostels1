import React, { useState } from "react";

const AddStudent = () => {
  const [studentData, setStudentData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    hostel: "",
    floor: "",
    room: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudentData({ ...studentData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Student Added:", studentData);
    // Later: Send this data to backend!
    alert("✅ Student added successfully!");
  };

  return (
    <div className="min-h-screen p-2 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white">
      <h2 className="text-2xl font-bold mb-6">🧑‍🎓 Add New Student</h2>

      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto space-y-3 bg-white dark:bg-gray-800 p-6 rounded-xl shadow"
      >
        <div>
          <label className="block text-sm font-medium">Full Name*</label>
          <input
            type="text"
            name="name"
            value={studentData.name}
            onChange={handleChange}
            className="input"
            placeholder="e.g. Anil Rebel"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={studentData.email}
            onChange={handleChange}
            className="input"
            placeholder="e.g. anilnunnagopula@email.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Phone Number</label>
          <input
            type="number"
            name="phone"
            value={studentData.phone}
            onChange={handleChange}
            className="input"
            placeholder="10-digit number"
            minLength={10}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Phone Number</label>
          <input
            type="text"
            name="adress"
            value={studentData.address}
            onChange={handleChange}
            className="input"
            placeholder="Enter the student address(optional)"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium">Hostel Name</label>
          <input
            type="text"
            name="hostel"
            value={studentData.hostel}
            onChange={handleChange}
            className="input"
            placeholder="e.g. Sunrise Hostel (this field->if u have more than 1 hostel)"
            required
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium">Floor Number</label>
            <input
              type="number"
              name="floor"
              value={studentData.floorNo}
              onChange={handleChange}
              className="input"
              placeholder="Enter floor number you want"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium">Room Number</label>
            <input
              type="number"
              name="room"
              value={studentData.room}
              onChange={handleChange}
              className="input"
              placeholder="e.g. 101"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Add Student
        </button>
      </form>
    </div>
  );
};

export default AddStudent;
