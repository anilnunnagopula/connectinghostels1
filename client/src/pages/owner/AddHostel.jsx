import React, { useState, useEffect } from "react"; // Added useEffect for dark mode
import { useNavigate } from "react-router-dom";
import { Loader2, Sparkles, LocateFixed } from "lucide-react";
import axios from "axios";

const AddHostel = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    rooms: "",
    facilities: "",
    category: "",
    description: "",
    location: "",
  });
  const [loading, setLoading] = useState(false); // General loading state for form actions
  const [aiLoading, setAiLoading] = useState(false); // Specific loading state for AI generation
  const [locationLoading, setLocationLoading] = useState(false); // Specific loading state for location
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);

  // State for dark mode (conceptual, typically managed by a context/global state)
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleVideoChange = (e) => {
    setVideo(e.target.files[0]);
  };

  // Function to generate description using Gemini API
  const handleGenerateDescription = async () => {
    setAiLoading(true);
    try {
      const prompt = `Generate a concise and appealing hostel description based on the following details:
        Hostel Name: ${formData.name || "A great hostel"}
        Facilities: ${formData.facilities || "WiFi, Mess, AC rooms"}
        Category: ${formData.category || "for students"}
        Location: ${formData.location || "in a peaceful environment"}

        Keep it under 100 words. Focus on benefits for students/working professionals.`;

      const chatHistory = [];
      chatHistory.push({ role: "user", parts: [{ text: prompt }] });

      const payload = { contents: chatHistory };
      const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
; // Canvas will provide this in runtime
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
        setFormData({ ...formData, description: generatedText });
        alert("✨ Description generated successfully!");
      } else {
        alert("❌ Failed to generate description. Please try again.");
        console.error("Gemini API response structure unexpected:", result);
      }
    } catch (err) {
      alert(
        "❌ Error generating description. Please check your network or try again."
      );
      console.error("Error calling Gemini API:", err);
    } finally {
      setAiLoading(false);
    }
  };

  // Function to get current location
  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      setLocationLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData({
            ...formData,
            location: `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(
              4
            )}`,
          });
          alert("📍 Current location fetched!");
          setLocationLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert(
            "❌ Error getting location. Please enable location services or enter manually."
          );
          setLocationLoading(false);
        }
      );
    } else {
      alert("⚠️ Geolocation is not supported by your browser.");
    }
  };

  // Handles form submission, including file uploads
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Basic client-side validation
    if (
      !formData.name ||
      !formData.contact ||
      !formData.rooms ||
      !formData.facilities ||
      !formData.category ||
      !formData.description ||
      !formData.location ||
      images.length === 0
    ) {
      alert(
        "Please fill in all required fields and upload at least one image."
      );
      setLoading(false);
      return;
    }

    // For large-scale applications, you'd typically send a FormData object
    // which handles both text fields and file uploads.
    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    // Append each image file
    images.forEach((image) => {
      data.append(`images`, image); // 'images' should match the field name expected by your backend
    });

    // Append video file if available
    if (video) {
      data.append("video", video); // 'video' should match the field name expected by your backend
    }

    try {
      // In a real-time, large-scale application, this axios.post request
      // would go to your dedicated backend API (e.g., Node.js, Python, Java).
      // The backend would:
      // 1. Validate the incoming data.
      // 2. Store text data (hostel details) in a database (e.g., MongoDB, PostgreSQL).
      // 3. Upload images/videos to cloud storage (e.g., AWS S3, Google Cloud Storage, Cloudinary).
      // 4. Save the URLs of the uploaded files in the database along with hostel details.
      // 5. Respond with success or detailed error messages.

      // You would also typically include an authorization token for authenticated users:
      const authToken = localStorage.getItem("token"); // Get token
      if (!authToken) {
        alert("Authentication token not found. Please log in again.");
        return;
      }
      const headers = {
        "Content-Type": "multipart/form-data", // Essential for file uploads
      };
      if (authToken) {
        headers["Authorization"] = `Bearer ${authToken}`; // Add token for authenticated requests
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/owner/add-hostel`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      alert("✅ Hostel added successfully!");
      console.log("Hostel added:", response.data);  
      navigate("/owner-dashboard");  
    } catch (err) { 
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to add hostel. Please check your input and try again.";
      alert(`❌ ${errorMessage}`);
      console.error("Error adding hostel:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Main container with responsive padding and font-inter
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white p-4 sm:p-8 font-inter">
      {" "}
      {/* Added font-inter */}
      {/* Dark mode toggle (for demonstration, typically in a header/settings) */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white text-xs font-semibold"
        >
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
      <h2 className="text-2xl font-bold mb-6 text-center sm:text-left text-blue-700 dark:text-blue-300">
        🏢 Add New Hostel
      </h2>
      <form
        onSubmit={handleSubmit}
        // Responsive form container
        className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-5"
      >
        {/* Hostel Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Hostel Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="input" // Custom Tailwind class for consistent input styling
            placeholder="e.g. Sunrise Girls Hostel"
            required
            disabled={loading}
          />
        </div>

        {/* Contact Number */}
        <div>
          <label
            htmlFor="contact"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Contact Number
          </label>
          <input
            type="number"
            id="contact"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            className="input"
            placeholder="e.g. 9876543210"
            minLength={10}
            required
            disabled={loading}
          />
        </div>

        {/* Rooms Available & Category - responsive layout */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label
              htmlFor="rooms"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Rooms Available
            </label>
            <input
              type="number"
              id="rooms"
              name="rooms"
              value={formData.rooms}
              onChange={handleChange}
              className="input"
              required
              disabled={loading}
            />
          </div>
          <div className="flex-1">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input"
              required
              disabled={loading}
            >
              <option value="">Select</option>
              <option value="Girls">Girls</option>
              <option value="Boys">Boys</option>
              <option value="Co-Live">Co-Live</option>
            </select>
          </div>
        </div>

        {/* Facilities */}
        <div>
          <label
            htmlFor="facilities"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Facilities
          </label>
          <textarea
            id="facilities"
            name="facilities"
            value={formData.facilities}
            onChange={handleChange}
            className="input"
            placeholder="WiFi, Mess, AC Rooms, Study Area, etc"
            rows="3" // Added rows for better textarea display
            required
            disabled={loading}
          />
        </div>

        {/* Hostel Description with AI Generate button */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          {" "}
          {/* flex-wrap for mobile */}
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Hostel Description
          </label>
          <button
            type="button"
            onClick={handleGenerateDescription}
            className="text-blue-600 text-sm flex items-center gap-1 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={aiLoading || loading} // Disable if AI is loading or general loading
          >
            {aiLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Use AI to Generate
              </>
            )}
          </button>
        </div>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="input"
          placeholder="Leave empty and let AI generate if needed 🤖"
          rows="5" // Added rows for better textarea display
          required
          disabled={loading}
        />

        {/* Location with Use Current Location button */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          {" "}
          {/* flex-wrap for mobile */}
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Enter Location
          </label>
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            className="text-blue-600 text-sm flex items-center gap-1 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={locationLoading || loading}
          >
            {locationLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Getting Location...
              </>
            ) : (
              <>
                <LocateFixed className="w-4 h-4" /> Use Current Location
              </>
            )}
          </button>
        </div>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="input"
          placeholder="e.g. Mangalpally, Hyderabad"
          required
          disabled={loading}
        />

        {/* Image Upload */}
        <div>
          <label
            htmlFor="images"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Upload Hostel Images ({images.length} selected)
          </label>
          <input
            type="file"
            id="images"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            // Tailwind file input styling for better appearance
            className="input file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-200 dark:hover:file:bg-blue-800"
            required
            disabled={loading}
          />
        </div>

        {/* Video Upload */}
        <div>
          <label
            htmlFor="video"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Upload Hostel Video (Optional) {video ? `(${video.name})` : ""}
          </label>
          <input
            type="file"
            id="video"
            accept="video/*"
            onChange={handleVideoChange}
            className="input file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-200 dark:hover:file:bg-blue-800"
            disabled={loading}
          />
        </div>

        {/* Submit Button with Loading Indicator */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          disabled={loading || aiLoading || locationLoading}
        >
          {loading ? (
            <Loader2 className="w-5 h-5 inline-block mr-2 animate-spin" />
          ) : null}
          {loading ? "Submitting..." : "Submit Hostel"}
        </button>
      </form>
    </div>
  );
};

export default AddHostel;

// Add the following Tailwind class globally or locally for `.input`
// .input {
//   @apply w-full px-3 py-2 mt-1 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white;
// }
