// File: RaiseComplaint.jsx

import React, { useState } from "react";

const RaiseComplaint = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject || !message) return alert("Please fill in all fields");

    console.log("Complaint submitted:", { subject, message });
    // This is where backend API call would happen

    setSuccess(true);
    setSubject("");
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 text-gray-800 dark:text-white">
      <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
        <h1 className="text-2xl font-bold mb-4">🙆‍♂️ Raise a Complaint</h1>

        {success && (
          <div className="bg-green-100 text-green-800 px-4 py-2 mb-4 rounded">
            Complaint submitted successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-2 rounded-md border dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Ex: Room not cleaned"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Complaint Details</label>
            <textarea
              rows="3"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-2 rounded-md border dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Explain the issue in detail..."
            ></textarea>
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow hover:scale-[1.02] transition"
          >
            Submit Complaint
          </button>
        </form>
      </div>
    </div>
  );
};

export default RaiseComplaint;
