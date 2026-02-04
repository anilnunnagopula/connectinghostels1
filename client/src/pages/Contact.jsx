import React, {useEffect, useState } from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { Loader2 } from "lucide-react"; // Assuming lucide-react is available for the spinner

const Contact = () => {
  // State for form inputs
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  // State for loading indicator during form submission
  const [loading, setLoading] = useState(false);

  // Handle input changes to update state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when submission starts

    const { name, email, message } = formData; // Get data from state

    try {
      const res = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Message sent successfully!");
        setFormData({ name: "", email: "", message: "" }); // Clear the form by resetting state
      } else {
        alert("❌ Failed to send message: " + data.message);
      }
    } catch (err) {
      console.error("Error sending message:", err);
      alert("❌ Something went wrong. Please try again later.");
    } finally {
      setLoading(false); // Set loading to false when submission finishes (success or error)
    }
  };
useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800 px-4 py-6 text-gray-800 dark:text-white font-inter">
      {" "}
      {/* Added font-inter */}
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
            💬 Get in Touch
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            We're here to help students find hostels and owners list them with
            ease!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Left: Contact Info Cards */}
          <div className="space-y-8">
            <a
              href="tel:+919398828248"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div className="flex items-start gap-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:scale-[1.02] transition cursor-pointer">
                <FaPhone className="text-blue-600 text-xl mt-1" />
                <div>
                  <h3 className="font-semibold text-lg">Call Us</h3>
                  <p>+91 93988 28248</p>
                </div>
              </div>
            </a>

            <a
              href="mailto:anilnunnagopula15@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div className="flex items-start gap-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:scale-[1.02] transition cursor-pointer">
                <FaEnvelope className="text-green-600 text-xl mt-1" />
                <div>
                  <h3 className="font-semibold text-lg">Email</h3>
                  <p>anilnunnagopula15@gmail.com</p>
                </div>
              </div>
            </a>

            <a
              href="https://www.google.com/maps/search/?api=1&query=CVR+College+Road,+Mangalpally,+Hyderabad,+Telangana"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div className="flex items-start gap-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:scale-[1.02] transition cursor-pointer">
                <FaMapMarkerAlt className="text-red-500 text-xl mt-1" />
                <div>
                  <h3 className="font-semibold text-lg">Location</h3>
                  <p>CVR College Road, Mangalpally, Hyderabad, Telangana</p>
                </div>
              </div>
            </a>
          </div>

          {/* Right: Contact Form */}
          <div className="bg-white dark:bg-gray-900 p-8 pt-4 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 text-blue-700 dark:text-blue-300">
              📩 Send us a message
            </h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {" "}
              {/* Increased space-y for better spacing */}
              <input
                type="text"
                name="name" // Added name attribute
                placeholder="Full Name"
                required
                value={formData.name} // Controlled component
                onChange={handleChange} // Handle changes
                className="w-full px-4 py-2 rounded bg-gray-100 dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" // Added focus styles
                disabled={loading} // Disable when loading
              />
              <input
                type="email"
                name="email" // Added name attribute
                placeholder="Email Address"
                required
                value={formData.email} // Controlled component
                onChange={handleChange} // Handle changes
                className="w-full px-4 py-2 rounded bg-gray-100 dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" // Added focus styles
                disabled={loading} // Disable when loading
              />
              <textarea
                rows="3" // Increased rows for better message input area
                name="message" // Added name attribute
                placeholder="Your message..."
                required
                value={formData.message} // Controlled component
                onChange={handleChange} // Handle changes
                className="w-full px-4 py-2 rounded bg-gray-100 dark:bg-gray-700 dark:text-white resize-none border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" // Added focus styles
                disabled={loading} // Disable when loading
              ></textarea>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center" // Added disabled styles and flex for spinner
                disabled={loading} // Disable when loading
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 inline-block mr-2 animate-spin" />{" "}
                    Sending...
                  </>
                ) : (
                  "Send Message 🚀"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
