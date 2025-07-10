import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify"; // assuming you're using it

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
  const [hostels, setHostels] = useState([
    { _id: "sample123", name: "GreenView Hostel" },
  ]);

  useEffect(() => {
    // Set default hostel name in studentData if not already selected
    setStudentData((prev) => ({
      ...prev,
      hostel: "GreenView Hostel",
    }));

    // 🧠 Optional: If you wanna try fetching real hostels later, keep this:
    /*
    const fetchHostels = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/hostels/mine", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
  
        if (res.data.length > 0) {
          setHostels(res.data);
          setStudentData((prev) => ({
            ...prev,
            hostel: res.data[0].name,
          }));
        }
      } catch (err) {
        console.error("⚠️ Failed to fetch hostels:", err);
      }
    };
  
    fetchHostels();
    */
  }, []);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/students/add",
        studentData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("🎉 Student added successfully!");
      setStudentData({
        name: "",
        email: "",
        phone: "",
        address: "",
        hostel: "",
        floor: "",
        room: "",
      });
    } catch (error) {
      console.error("Add student error:", error.response?.data);
      toast.error("❌ Failed to add student");
    } finally {
      setLoading(false);
    }
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
          <label className="block text-sm font-medium">Address</label>
          <input
            type="text"
            name="address"
            value={studentData.address}
            onChange={handleChange}
            className="input"
            placeholder="Enter the student address(optional)"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium">Hostel Name</label>
          <select
            name="hostel"
            value={studentData.hostel}
            onChange={handleChange}
            className="input"
          >
            <option value="">-- Select Hostel --</option>
            {hostels.map((h) => (
              <option key={h._id} value={h.name}>
                {h.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium">Floor Number</label>
            <input
              type="number"
              name="floor"
              value={studentData.floor}
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
          disabled={loading}
          className={`w-full ${
            loading ? "bg-gray-400" : "bg-blue-600"
          } text-white py-2 rounded transition`}
        >
          {loading ? "Adding..." : "Add Student"}
        </button>
      </form>
    </div>
  );
};

export default AddStudent;
