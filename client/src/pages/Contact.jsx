  import React from "react";
  import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

  const Contact = () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800 px-4 py-6 text-gray-800 dark:text-white">
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
            {/* Left Contact Info Cards */}
            <div className="space-y-8">
              <div className="flex items-start gap-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:scale-[1.02] transition">
                <FaPhone className="text-blue-600 text-xl mt-1" />
                <div>
                  <h3 className="font-semibold text-lg">Call Us</h3>
                  <p>+91 93988 28248</p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:scale-[1.02] transition">
                <FaEnvelope className="text-green-600 text-xl mt-1" />
                <div>
                  <h3 className="font-semibold text-lg">Email</h3>
                  <p>anilnunnagopula15@gmail.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:scale-[1.02] transition">
                <FaMapMarkerAlt className="text-red-500 text-xl mt-1" />
                <div>
                  <h3 className="font-semibold text-lg">Location</h3>
                  <p>CVR College Road, Mangalpally, Hyderabad, Telangana</p>
                </div>
              </div>
            </div>

            {/* Right Contact Form */}
            <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg">
              <h2 className="text-2xl font-semibold mb-6 text-blue-700 dark:text-blue-300">
                📩 Send us a message
              </h2>
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  className="w-full px-4 py-2 rounded bg-gray-100 dark:bg-gray-700 dark:text-white"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  className="w-full px-4 py-2 rounded bg-gray-100 dark:bg-gray-700 dark:text-white"
                />
                <textarea
                  rows="2"
                  placeholder="Your message..."
                  required
                  className="w-full px-4 py-2 rounded bg-gray-100 dark:bg-gray-700 dark:text-white resize-none"
                ></textarea>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
                >
                  Send Message 🚀
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default Contact;
