// File: SendAlerts.jsx (Smart Template + Preview + Message Type)

import React, { useState } from "react";
import Select from "react-select";
import { FaPaperPlane } from "react-icons/fa";
import { Sparkles } from "lucide-react";

const studentOptions = [
  { value: "919876543210", label: "Rahul Sharma (Room 101)" },
  { value: "918765432109", label: "Sneha Reddy (Room 202)" },
  { value: "919999888877", label: "Amit Verma (Room 303)" },
];

const messageTypes = [
  { value: "holiday", label: "Holiday Notice" },
  { value: "fee", label: "Fee Reminder" },
  { value: "welcome", label: "Welcome Message" },
  { value: "others", label: "other hostel related Message" },
];

const SendAlerts = () => {
  const [message, setMessage] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedType, setSelectedType] = useState(null);

  const generateTemplate = () => {
    const name =
      selectedStudents.length === 1
        ? selectedStudents[0].label.split(" (")[0]
        : "Students";

    if (!selectedType) {
      alert("Please select a message type!");
      return;
    }

    let template = "";
    switch (selectedType.value) {
      case "holiday":
        template = `Hi ${name}! This is to inform you that the mess will be closed tomorrow due to Dasara holidays.`;
        break;
      case "fee":
        template = `Hi ${name}, this is a reminder to clear your hostel fee dues for this month. Kindly pay at the office.`;
        break;
      case "welcome":
        template = `Hi ${name}, welcome to Anil Boys Hostel! We hope you have a comfortable and successful stay.`;
        break;
      default:
        template = `Hi ${name}, this is a general message.`;
    }

    setMessage(template);
  };

  const handleSend = () => {
    if (!message || selectedStudents.length === 0) {
      alert("Please enter a message and select at least one student.");
      return;
    }

    selectedStudents.forEach((student) => {
      console.log(`Sending WhatsApp message to ${student.label}: ${message}`);
    });

    alert("Alerts sent successfully ✅");
    setMessage("");
    setSelectedStudents([]);
    setSelectedType(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white p-6">
      <h1 className="text-3xl font-bold mb-6">
        📩 Send Smart Alerts to Students
      </h1>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Select Message Type</label>
        <Select
          options={messageTypes}
          value={selectedType}
          onChange={(type) => setSelectedType(type)}
          placeholder="Choose type (Holiday, Fee, Welcome...)"
          className="text-black"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Select Students</label>
        <Select
          isMulti
          options={studentOptions}
          value={selectedStudents}
          onChange={(selected) => setSelectedStudents(selected)}
          placeholder="Search and select students..."
          className="text-black"
        />
      </div>

      <div className="flex items-center justify-between mb-2">
        <label className="font-semibold text-lg">Your Message</label>
        <button
          type="button"
          onClick={generateTemplate}
          className="text-sm text-blue-600 dark:text-yellow-300 flex items-center gap-1 hover:underline"
        >
          <Sparkles className="w-4 h-4" /> Generate Template
        </button>
      </div>

      <textarea
        className="w-full p-4 rounded-md bg-gray-200 dark:bg-gray-800 text-black dark:text-white mb-4"
        rows="5"
        placeholder="Type your message here or use AI to generate"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      {message && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow mb-4">
          <h3 className="text-lg font-semibold mb-2">🧾 Message Preview</h3>
          <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line">
            {message}
          </p>
        </div>
      )}

      <button
        onClick={handleSend}
        className="bg-blue-600 hover:bg-blue-700 transition px-6 py-3 rounded-md flex items-center gap-2 text-white"
      >
        <FaPaperPlane /> Send Alerts
      </button>
    </div>
  );
};

export default SendAlerts;
