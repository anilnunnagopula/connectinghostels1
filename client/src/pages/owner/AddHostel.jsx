import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Sparkles, LocateFixed } from "lucide-react";

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
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);

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

  const handleGenerateDescription = () => {
    setFormData({
      ...formData,
      description:
        "This modern hostel offers premium facilities including WiFi, Mess, AC rooms, and more. Located in a peaceful environment, ideal for students.",
    });
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData({
            ...formData,
            location: `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(
              4
            )}`,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    console.log(images);
    console.log(video);
    navigate("/owner-dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white p-4 sm:p-8">
      <h2 className="text-2xl font-bold mb-6">🏢 Add New Hostel</h2>

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-5"
      >
        <div>
          <label className="block text-sm font-medium">Hostel Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="input"
            placeholder="e.g. Sunrise Girls Hostel"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Contact Number</label>
          <input
            type="number"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            className="input"
            placeholder="e.g. 9876543210"
            minLength={10}
            required
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium">Rooms Available</label>
            <input
              type="number"
              name="rooms"
              value={formData.rooms}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input"
              required
            >
              <option value="">Select</option>
              <option value="Girls">Girls</option>
              <option value="Boys">Boys</option>
              <option value="Co-Live">Co-Live</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Facilities</label>
          <textarea
            name="facilities"
            value={formData.facilities}
            onChange={handleChange}
            className="input"
            placeholder="WiFi, Mess, AC Rooms, Study Area, etc"
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium">
            Hostel Description
          </label>
          <button
            type="button"
            onClick={handleGenerateDescription}
            className="text-blue-600 text-sm flex items-center gap-1 hover:underline"
          >
            <Sparkles className="w-4 h-4" /> Use AI to Generate
          </button>
        </div>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="input"
          placeholder="Leave empty and let AI generate if needed 🤖"
          required
        />

        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium">Enter Location</label>
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            className="text-blue-600 text-sm flex items-center gap-1 hover:underline"
          >
            <LocateFixed className="w-4 h-4" /> Use Current Location
          </button>
        </div>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="input"
          placeholder="e.g. Mangalpally, Hyderabad"
          required
        />

        <div>
          <label className="block text-sm font-medium">
            Upload Hostel Images
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="input"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">
            Upload Hostel Video (Optional)
          </label>
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            className="input"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Submit Hostel
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
