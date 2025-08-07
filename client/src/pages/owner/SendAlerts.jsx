import React, { useState, useEffect } from "react";
import Select from "react-select";
import { FaPaperPlane } from "react-icons/fa";
import { Sparkles, Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// Constants for select-all options
const allStudentsOption = {
  value: "all-students",
  label: "Select All Students",
};
const allHostelsOption = { value: "all-hostels", label: "All Hostels" };

const messageTypes = [
  { value: "holiday", label: "Holiday Notice" },
  { value: "fee", label: "Fee Reminder" },
  { value: "welcome", label: "Welcome Message" },
  { value: "others", label: "Other hostel related Message" },
];

const SendAlerts = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [aiGenerating, setAiGenerating] = useState(false);

  // Dynamic data states
  const [allStudents, setAllStudents] = useState([]); // All students from all hostels
  const [hostels, setHostels] = useState([]);
  const [selectedHostel, setSelectedHostel] = useState(allHostelsOption);
  const [loading, setLoading] = useState(true);

  // Fetch all hostels and students for the logged-in owner
  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        throw new Error("Authentication token not found");
      }

      // Fetch hostels to populate the dropdown
      const hostelsRes = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/owner/my-hostels`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const hostelOptions = hostelsRes.data.hostels.map((hostel) => ({
        value: hostel._id,
        label: hostel.name,
      }));
      setHostels(hostelOptions);

      // Fetch students to populate the dropdown
      const studentsRes = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/students/mine`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const studentOptions = studentsRes.data.students.map((student) => ({
        value: student.phone,
        label: `${student.name} (Room ${student.room})`,
        hostelId: student.hostel._id, // Add hostelId for filtering
      }));
      setAllStudents(studentOptions);
    } catch (err) {
      console.error("❌ Error fetching data:", err.message);
      toast.error("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter students based on selected hostel
  const filteredStudents =
    selectedHostel && selectedHostel.value !== "all-hostels"
      ? allStudents.filter(
          (student) => student.hostelId === selectedHostel.value
        )
      : allStudents;

  // Logic for generating AI message template
  const generateTemplate = async () => {
    if (!selectedType) {
      toast.error("Please select a message type!");
      return;
    }

    setAiGenerating(true);

    let recipientName = "Students";
    if (selectedStudents.length === 1) {
      recipientName = selectedStudents[0].label.split(" (")[0];
    } else if (
      selectedStudents.length === filteredStudents.length &&
      selectedHostel.value !== "all-hostels"
    ) {
      recipientName = `All students of ${selectedHostel.label}`;
    }

    let hostelNameForPrompt =
      selectedHostel.value === "all-hostels"
        ? "your hostels"
        : selectedHostel.label;

    let prompt = "";
    switch (selectedType.value) {
      case "holiday":
        prompt = `Generate a concise holiday notice for ${recipientName} of ${hostelNameForPrompt}. Mention that the mess will be closed tomorrow due to holidays. Keep it friendly and informative.`;
        break;
      case "fee":
        prompt = `Write a polite fee reminder message for ${recipientName} of ${hostelNameForPrompt}. Ask them to clear their hostel fee dues for this month and kindly pay at the office.`;
        break;
      case "welcome":
        prompt = `Create a warm welcome message for ${recipientName} joining ${hostelNameForPrompt}. Express hope for a comfortable and successful stay.`;
        break;
      case "others":
        prompt = `Generate a general hostel-related message for ${recipientName} of ${hostelNameForPrompt}. The message should be adaptable for various announcements.`;
        break;
      default:
        prompt = `Generate a general message for ${recipientName} of ${hostelNameForPrompt}.`;
    }

    try {
      const chatHistory = [];
      chatHistory.push({ role: "user", parts: [{ text: prompt }] });
      const payload = { contents: chatHistory };
      const apiKey = process.env.REACT_APP_GEMINI_API_KEY || "";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (
        result.candidates &&
        result.candidates.length > 0 &&
        result.candidates[0].content &&
        result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0
      ) {
        const generatedText = result.candidates[0].content.parts[0].text;
        setMessage(generatedText);
        toast.success("✨ Template generated successfully!");
      } else {
        toast.error("❌ Failed to generate template. Please try again.");
        console.error("Gemini API response structure unexpected:", result);
      }
    } catch (err) {
      toast.error("❌ Error generating template. Please check your network.");
      console.error("Error calling Gemini API:", err);
    } finally {
      setAiGenerating(false);
    }
  };

  // Logic for selecting students
  const handleStudentSelectChange = (selectedOptions) => {
    // Check if "Select All" was just selected
    if (
      selectedOptions &&
      selectedOptions.some((option) => option.value === "all-students")
    ) {
      setSelectedStudents(filteredStudents);
      return;
    }
    // Filter out the "Select All" option
    setSelectedStudents(
      selectedOptions
        ? selectedOptions.filter((option) => option.value !== "all-students")
        : []
    );
  };

  // Logic for selecting hostels
  const handleHostelSelectChange = (selectedOption) => {
    setSelectedHostel(selectedOption);
    setSelectedStudents([]); // Clear student selection when hostel changes
  };

  // Logic for sending message
  const handleSend = async () => {
    if (!message || selectedStudents.length === 0) {
      toast.error("Please enter a message and select at least one student.");
      return;
    }

    const phoneNumbers = selectedStudents.map((s) => s.value);
    setAiGenerating(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/alerts/send`,
        { phoneNumbers, message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Alerts sent successfully ✅");
      setMessage("");
      setSelectedStudents([]);
      setSelectedType(null);
    } catch (err) {
      console.error("Error sending alerts:", err);
      toast.error(err.response?.data?.message || "Failed to send alerts.");
    } finally {
      setAiGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-xl text-gray-700 dark:text-gray-300">
          Loading data...
        </p>
      </div>
    );
  }

  // We need to re-generate the student options with select all every time
  // filteredStudents changes. This is the correct way to handle it.
  const studentOptionsWithSelectAll = [
    allStudentsOption,
    ...filteredStudents,
  ];

  const hostelOptionsWithSelectAll = [allHostelsOption, ...hostels];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white p-6 font-inter">
      <h1 className="text-3xl font-bold mb-6 text-blue-700 dark:text-blue-300">
        📩 Send Smart Alerts to Students
      </h1>
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        {/* Hostel Selection */}
        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
            Select Hostel
          </label>
          <Select
            options={hostelOptionsWithSelectAll}
            value={selectedHostel}
            onChange={handleHostelSelectChange}
            placeholder="Select a hostel..."
            isDisabled={loading}
            styles={{
              // ✅ Corrected: Set the menu background to a light gray
              control: (baseStyles) => ({
                ...baseStyles,
                backgroundColor: '#f3f4f6', // Light gray background
                borderRadius: "0.375rem",
              }),
              menu: (baseStyles) => ({
                ...baseStyles,
                backgroundColor: '#f3f4f6', // Light gray background
                borderRadius: "0.375rem",
              }),
              option: (baseStyles, state) => ({
                ...baseStyles,
                backgroundColor: state.isFocused ? '#dbeafe' : '#f3f4f6',
                color: '#1f2937',
                "&:active": {
                  backgroundColor: "#bfdbfe",
                },
              }),
            }}
          />
        </div>

        {/* Message Type Selection */}
        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
            Select Message Type
          </label>
          <Select
            options={messageTypes}
            value={selectedType}
            onChange={(type) => setSelectedType(type)}
            placeholder="Choose type (Holiday, Fee, Welcome...)"
            isDisabled={loading}
            styles={{
              // ✅ Corrected: Set the menu background to a light gray
              control: (baseStyles) => ({
                ...baseStyles,
                backgroundColor: '#f3f4f6', // Light gray background
                borderRadius: "0.375rem",
              }),
              menu: (baseStyles) => ({
                ...baseStyles,
                backgroundColor: '#f3f4f6', // Light gray background
                borderRadius: "0.375rem",
              }),
              option: (baseStyles, state) => ({
                ...baseStyles,
                backgroundColor: state.isFocused ? '#dbeafe' : '#f3f4f6',
                color: '#1f2937',
                "&:active": {
                  backgroundColor: "#bfdbfe",
                },
              }),
            }}
          />
        </div>

        {/* Student Selection */}
        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
            Select Students
          </label>
          <Select
            isMulti
            options={studentOptionsWithSelectAll}
            value={selectedStudents}
            onChange={handleStudentSelectChange}
            placeholder="Search and select students..."
            isDisabled={loading || filteredStudents.length === 0}
            styles={{
              // ✅ Corrected: Set the menu background to a light gray
              control: (baseStyles) => ({
                ...baseStyles,
                backgroundColor: '#f3f4f6', // Light gray background
                borderRadius: "0.375rem",
              }),
              menu: (baseStyles) => ({
                ...baseStyles,
                backgroundColor: '#f3f4f6', // Light gray background
                borderRadius: "0.375rem",
              }),
              option: (baseStyles, state) => ({
                ...baseStyles,
                backgroundColor: state.isFocused ? '#dbeafe' : '#f3f4f6',
                color: '#1f2937',
                "&:active": {
                  backgroundColor: "#bfdbfe",
                },
              }),
            }}
          />
        </div>

        <div className="flex items-center justify-between mb-2">
          <label className="font-semibold text-lg text-gray-700 dark:text-gray-300">
            Your Message
          </label>
          <button
            type="button"
            onClick={generateTemplate}
            className="text-sm text-blue-600 dark:text-yellow-300 flex items-center gap-1 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={aiGenerating}
          >
            {aiGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Generate Template
              </>
            )}
          </button>
        </div>
        <textarea
          className="w-full p-4 rounded-md bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white mb-4 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
          rows="5"
          placeholder="Type your message here or use AI to generate"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={aiGenerating}
        />
        {message && (
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md shadow mb-4">
            <h3 className="text-lg font-semibold mb-2 text-blue-700 dark:text-blue-300">
              🧾 Message Preview
            </h3>
            <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line">
              {message}
            </p>
          </div>
        )}
        <button
          onClick={handleSend}
          className="bg-blue-600 hover:bg-blue-700 transition px-6 py-3 rounded-md flex items-center gap-2 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed w-full"
          disabled={aiGenerating}
        >
          {aiGenerating ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <FaPaperPlane />
          )}
          {aiGenerating ? "Sending..." : "Send Alerts"}
        </button>
      </div>
    </div>
  );
};

export default SendAlerts;
