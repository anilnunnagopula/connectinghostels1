import React, { useState, useEffect } from "react";
import Select from "react-select";
import { FaPaperPlane } from "react-icons/fa";
import { Sparkles, Loader2 } from "lucide-react"; // Import Loader2 for loading spinner

const allStudentsOption = { value: "all", label: "Select All Students" };

const initialStudentOptions = [
  { value: "919876543210", label: "Rahul Sharma (Room 101)" },
  { value: "918765432109", label: "Sneha Reddy (Room 202)" },
  { value: "919999888877", label: "Amit Verma (Room 303)" },
];

const studentOptionsWithSelectAll = [
  allStudentsOption,
  ...initialStudentOptions,
];

const messageTypes = [
  { value: "holiday", label: "Holiday Notice" },
  { value: "fee", label: "Fee Reminder" },
  { value: "welcome", label: "Welcome Message" },
  { value: "others", label: "Other hostel related Message" },
];

const SendAlerts = () => {
  const [message, setMessage] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [aiGenerating, setAiGenerating] = useState(false); // New state for AI loading
  const [isDarkMode, setIsDarkMode] = useState(false); // State for dark mode

  // Placeholder for dynamic hostel name (replace with actual data from owner's profile)
  const [hostelName, setHostelName] = useState("Your Hostel Name"); // This should come from props or context

  // Effect to apply dark mode class to body based on state (for demonstration)
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    // In a real app, you'd likely read user preference from localStorage or a global context
    // and provide a toggle button in a header/settings component.
  }, [isDarkMode]);

  const generateTemplate = async () => {
    // Made async to handle API call
    if (!selectedType) {
      alert("Please select a message type!");
      return;
    }

    setAiGenerating(true); // Start AI loading

    const recipientName =
      selectedStudents.length === 1 && selectedStudents[0].value !== "all"
        ? selectedStudents[0].label.split(" (")[0] // Get name for single student
        : "Students"; // Generic for multiple or no students selected

    let prompt = "";
    switch (selectedType.value) {
      case "holiday":
        prompt = `Generate a concise holiday notice for ${recipientName} of ${hostelName}. Mention that the mess will be closed tomorrow due to holidays. Keep it friendly and informative.`;
        break;
      case "fee":
        prompt = `Write a polite fee reminder message for ${recipientName} of ${hostelName}. Ask them to clear their hostel fee dues for this month and kindly pay at the office.`;
        break;
      case "welcome":
        prompt = `Create a warm welcome message for ${recipientName} joining ${hostelName}. Express hope for a comfortable and successful stay.`;
        break;
      case "others":
        prompt = `Generate a general hostel-related message for ${recipientName} of ${hostelName}. The message should be adaptable for various announcements.`;
        break;
      default:
        prompt = `Generate a general message for ${recipientName} of ${hostelName}.`;
    }

    try {
      const chatHistory = [];
      chatHistory.push({ role: "user", parts: [{ text: prompt }] });

      const payload = { contents: chatHistory };
      // Use process.env.REACT_APP_GEMINI_API_KEY for the API key
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
        alert("✨ Template generated successfully!");
      } else {
        alert("❌ Failed to generate template. Please try again.");
        console.error("Gemini API response structure unexpected:", result);
      }
    } catch (err) {
      alert(
        "❌ Error generating template. Please check your network or try again."
      );
      console.error("Error calling Gemini API:", err);
    } finally {
      setAiGenerating(false); // End AI loading
    }
  };

  const handleStudentSelectChange = (selectedOptions) => {
    // Check if "Select All" was just selected
    if (
      selectedOptions &&
      selectedOptions.some((option) => option.value === "all")
    ) {
      // If "Select All" is in the new selection and it wasn't previously selected
      const currentlySelectedValues = selectedStudents.map((s) => s.value);
      if (!currentlySelectedValues.includes("all")) {
        // Select all actual students, excluding the "Select All" option itself
        setSelectedStudents(initialStudentOptions);
        return;
      }
    }

    // If "Select All" was deselected, or if individual students are being selected/deselected
    setSelectedStudents(
      selectedOptions
        ? selectedOptions.filter((option) => option.value !== "all")
        : []
    );
  };

  const handleSend = () => {
    if (!message || selectedStudents.length === 0) {
      alert("Please enter a message and select at least one student.");
      return;
    }

    selectedStudents.forEach((student) => {
      // In a real application, you would send this message to your backend
      // The backend would then handle sending actual WhatsApp/SMS messages
      console.log(
        `Simulating sending WhatsApp message to ${student.label}: ${message}`
      );
    });

    alert("Alerts sent successfully ✅");
    setMessage("");
    setSelectedStudents([]);
    setSelectedType(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white p-6 font-inter relative">
      {" "}
      {/* Added font-inter and relative for dark mode toggle positioning */}
      {/* Dark mode toggle (for demonstration, typically in a header/settings) */}
      <div className="absolute top-4 right-4 z-10">
        {" "}
        {/* Added z-10 to ensure it's on top */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white text-xs font-semibold"
        >
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
      <h1 className="text-3xl font-bold mb-6 text-blue-700 dark:text-blue-300">
        {" "}
        {/* Added color for consistency */}
        📩 Send Smart Alerts to Students
      </h1>
      <div className="mb-4">
        <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
          Select Message Type
        </label>
        <Select
          options={messageTypes}
          value={selectedType}
          onChange={(type) => setSelectedType(type)}
          placeholder="Choose type (Holiday, Fee, Welcome...)"
          className="text-black rounded-md" // Added rounded-md
          classNamePrefix="react-select" // Added prefix for custom styling if needed
          // Custom styles for react-select for dark mode compatibility
          styles={{
            control: (baseStyles, state) => ({
              ...baseStyles,
              backgroundColor: isDarkMode ? "#374151" : "#e5e7eb", // dark:bg-gray-700 / bg-gray-200
              borderColor: isDarkMode ? "#4b5563" : "#d1d5db", // dark:border-gray-600 / border-gray-300
              "&:hover": { borderColor: isDarkMode ? "#6b7280" : "#9ca3af" }, // dark:border-gray-500 / border-gray-400
              boxShadow: state.isFocused
                ? isDarkMode
                  ? "0 0 0 1px #60a5fa"
                  : "0 0 0 1px #3b82f6"
                : "none", // dark:ring-blue-500 / ring-blue-500
              borderRadius: "0.375rem", // rounded-md
              minHeight: "42px", // Adjust height if needed
              color: isDarkMode ? "#e5e7eb" : "#1f2937", // dark:text-white / text-gray-800
            }),
            singleValue: (baseStyles) => ({
              ...baseStyles,
              color: isDarkMode ? "#e5e7eb" : "#1f2937", // dark:text-white / text-gray-800
            }),
            input: (baseStyles) => ({
              ...baseStyles,
              color: isDarkMode ? "#e5e7eb" : "#1f2937", // dark:text-white / text-gray-800
            }),
            placeholder: (baseStyles) => ({
              ...baseStyles,
              color: isDarkMode ? "#9ca3af" : "#6b7280", // dark:text-gray-400 / text-gray-500
            }),
            menu: (baseStyles) => ({
              ...baseStyles,
              backgroundColor: isDarkMode ? "#1f2937" : "#ffffff", // dark:bg-gray-800 / bg-white
              borderRadius: "0.375rem", // rounded-md
            }),
            option: (baseStyles, state) => ({
              ...baseStyles,
              backgroundColor: state.isFocused
                ? isDarkMode
                  ? "#1e3a8a"
                  : "#dbeafe" // dark:bg-blue-900 / bg-blue-100
                : isDarkMode
                ? "#1f2937"
                : "#ffffff", // dark:bg-gray-800 / bg-white
              color: isDarkMode ? "#e5e7eb" : "#1f2937", // dark:text-white / text-gray-800
              "&:active": {
                backgroundColor: isDarkMode ? "#1c3e7d" : "#bfdbfe",
              }, // dark:bg-blue-800 / bg-blue-200
            }),
            multiValue: (baseStyles) => ({
              ...baseStyles,
              backgroundColor: isDarkMode ? "#1e3a8a" : "#dbeafe", // dark:bg-blue-900 / bg-blue-100
              borderRadius: "0.375rem",
            }),
            multiValueLabel: (baseStyles) => ({
              ...baseStyles,
              color: isDarkMode ? "#93c5fd" : "#1d4ed8", // dark:text-blue-200 / text-blue-700
            }),
            multiValueRemove: (baseStyles) => ({
              ...baseStyles,
              color: isDarkMode ? "#93c5fd" : "#1d4ed8", // dark:text-blue-200 / text-blue-700
              "&:hover": {
                backgroundColor: isDarkMode ? "#1c3e7d" : "#bfdbfe", // dark:bg-blue-800 / bg-blue-200
                color: isDarkMode ? "#e5e7eb" : "#1f2937", // dark:text-white / text-gray-800
              },
            }),
          }}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
          Select Students
        </label>
        <Select
          isMulti
          options={studentOptionsWithSelectAll} // Use the new options array
          value={selectedStudents}
          onChange={handleStudentSelectChange} // Use the new handler
          placeholder="Search and select students..."
          className="text-black rounded-md" // Added rounded-md
          classNamePrefix="react-select" // Added prefix for custom styling if needed
          styles={{
            control: (baseStyles, state) => ({
              ...baseStyles,
              backgroundColor: isDarkMode ? "#374151" : "#e5e7eb", // dark:bg-gray-700 / bg-gray-200
              borderColor: isDarkMode ? "#4b5563" : "#d1d5db", // dark:border-gray-600 / border-gray-300
              "&:hover": { borderColor: isDarkMode ? "#6b7280" : "#9ca3af" }, // dark:border-gray-500 / border-gray-400
              boxShadow: state.isFocused
                ? isDarkMode
                  ? "0 0 0 1px #60a5fa"
                  : "0 0 0 1px #3b82f6"
                : "none", // dark:ring-blue-500 / ring-blue-500
              borderRadius: "0.375rem", // rounded-md
              minHeight: "42px",
              color: isDarkMode ? "#e5e7eb" : "#1f2937",
            }),
            singleValue: (baseStyles) => ({
              ...baseStyles,
              color: isDarkMode ? "#e5e7eb" : "#1f2937",
            }),
            input: (baseStyles) => ({
              ...baseStyles,
              color: isDarkMode ? "#e5e7eb" : "#1f2937",
            }),
            placeholder: (baseStyles) => ({
              ...baseStyles,
              color: isDarkMode ? "#9ca3af" : "#6b7280",
            }),
            menu: (baseStyles) => ({
              ...baseStyles,
              backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
              borderRadius: "0.375rem",
            }),
            option: (baseStyles, state) => ({
              ...baseStyles,
              backgroundColor: state.isFocused
                ? isDarkMode
                  ? "#1e3a8a"
                  : "#dbeafe"
                : isDarkMode
                ? "#1f2937"
                : "#ffffff",
              color: isDarkMode ? "#e5e7eb" : "#1f2937",
              "&:active": {
                backgroundColor: isDarkMode ? "#1c3e7d" : "#bfdbfe",
              },
            }),
            multiValue: (baseStyles) => ({
              ...baseStyles,
              backgroundColor: isDarkMode ? "#1e3a8a" : "#dbeafe",
              borderRadius: "0.375rem",
            }),
            multiValueLabel: (baseStyles) => ({
              ...baseStyles,
              color: isDarkMode ? "#93c5fd" : "#1d4ed8",
            }),
            multiValueRemove: (baseStyles) => ({
              ...baseStyles,
              color: isDarkMode ? "#93c5fd" : "#1d4ed8",
              "&:hover": {
                backgroundColor: isDarkMode ? "#1c3e7d" : "#bfdbfe",
                color: isDarkMode ? "#e5e7eb" : "#1f2937",
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
          disabled={aiGenerating} // Disable button when AI is generating
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
        className="w-full p-4 rounded-md bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white mb-4 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none" // Added border and focus styles
        rows="5"
        placeholder="Type your message here or use AI to generate"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={aiGenerating} // Disable textarea when AI is generating
      />
      {message && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow mb-4">
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
        className="bg-blue-600 hover:bg-blue-700 transition px-6 py-3 rounded-md flex items-center gap-2 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed" // Added font-semibold and disabled styles
        disabled={aiGenerating} // Disable send button when AI is generating
      >
        <FaPaperPlane /> Send Alerts
      </button>
    </div>
  );
};

export default SendAlerts;
