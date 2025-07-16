import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const Support = () => {
  // Scroll to top when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 md:p-12">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8 text-center">
          ConnectingHostels Support Center
        </h1>

        <p className="mb-6 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          Welcome to the <strong>ConnectingHostels</strong> Support Center! We
          understand that navigating a new platform or managing accommodation
          can sometimes present challenges. Our goal is to provide you with all
          the resources and assistance you need to have a smooth and positive
          experience. Whether you're a student seeking a hostel or a hostel
          owner managing listings, we're here to help.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          🚀 Quick Solutions to Common Issues
        </h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          Find immediate answers to frequently asked questions and direct links
          to relevant policies:
        </p>
        <ul className="list-disc pl-6 space-y-3 mb-6">
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              Refunds & Vacating Process:
            </strong>
            Understand our policies regarding security deposits, refunds, and
            the process for vacating a hostel room.
            <Link
              to="/legal/refund-policy"
              className="ml-2 text-blue-600 dark:text-blue-400 underline hover:text-blue-500 dark:hover:text-blue-300"
            >
              Learn More
            </Link>
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              Data or Profile Deletion:
            </strong>
            Information on how to manage your personal data, update your
            profile, or request account deletion.
            <Link
              to="/legal/data-protection"
              className="ml-2 text-blue-600 dark:text-blue-400 underline hover:text-blue-500 dark:hover:text-blue-300"
            >
              Manage Your Data
            </Link>
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              Login or Account Access Problems:
            </strong>
            Troubleshooting steps for issues logging in, forgotten passwords, or
            account security.
            <Link
              to="/login"
              className="ml-2 text-blue-600 dark:text-blue-400 underline hover:text-blue-500 dark:hover:text-blue-300"
            >
              Reset Password
            </Link>
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              Issues with Hostel Listings:
            </strong>
            Problems concerning hostel availability, inaccurate details,
            verification status, or discrepancies in amenities. For these,
            please contact us directly via email below.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          📨 Contact Our Support Team
        </h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          If your issue isn't covered above or requires personalized assistance,
          our dedicated support team is ready to help.
        </p>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          <strong className="text-gray-900 dark:text-white">Email Us:</strong>{" "}
          For general inquiries, reporting issues, or any assistance, please
          send us an email at:{" "}
          <a
            href="mailto:anilnunnagopula15@gmail.com"
            className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
          >
            anilnunnagopula15@gmail.com
          </a>
        </p>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          <strong className="text-gray-900 dark:text-white">
            What to Include in Your Email:
          </strong>{" "}
          To help us resolve your issue quickly, please include:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-6 text-gray-700 dark:text-gray-300">
          <li>Your full name and registered email address.</li>
          <li>A clear description of the problem or question.</li>
          <li>Any relevant booking IDs, hostel names, or dates.</li>
          <li>Screenshots or error messages, if applicable.</li>
        </ul>
        <p className="mb-6 text-gray-700 dark:text-gray-300">
          We are actively working on building a more robust, real-time support
          system and a comprehensive knowledge base to serve you better in the
          near future. Stay tuned for updates! 🔄
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          🧠 Self-Help Resources & Policies
        </h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          Familiarize yourself with our operational policies and guidelines to
          ensure a smooth experience and understand your rights and
          responsibilities on the platform.
        </p>
        <ul className="list-disc pl-6 space-y-3 mb-6">
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              Community Guidelines:
            </strong>{" "}
            Our rules for fostering a respectful and safe community.
            <Link
              to="/legal/community-guidelines"
              className="ml-2 text-blue-600 dark:text-blue-400 underline hover:text-blue-500 dark:hover:text-blue-300"
            >
              Read Guidelines
            </Link>{" "}
            — Avoid getting reported or banned 😅
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              Terms & Conditions:
            </strong>{" "}
            The full legal agreement governing your use of our service.
            <Link
              to="/legal/terms-and-conditions"
              className="ml-2 text-blue-600 dark:text-blue-400 underline hover:text-blue-500 dark:hover:text-blue-300"
            >
              View Terms
            </Link>{" "}
            — Everything you signed up for 📜
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              Privacy Policy:
            </strong>{" "}
            Details on how we collect, use, store, and protect your personal
            information.
            <Link
              to="/legal/privacy-policy"
              className="ml-2 text-blue-600 dark:text-blue-400 underline hover:text-blue-500 dark:hover:text-blue-300"
            >
              Our Privacy Practices
            </Link>{" "}
            — What we do with your info 🔐
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              Transparency Statement:
            </strong>{" "}
            Our commitment to open and honest operations.
            <Link
              to="/legal/transparency"
              className="ml-2 text-blue-600 dark:text-blue-400 underline hover:text-blue-500 dark:hover:text-blue-300"
            >
              Our Values
            </Link>
          </li>
          <li>
            <strong className="text-blue-600 dark:text-blue-400">
              Partner Terms & Conditions:
            </strong>
            Specific terms for hostel owners using our platform.
            <Link
              to="/legal/partner-terms"
              className="ml-2 text-blue-600 dark:text-blue-400 underline hover:text-blue-500 dark:hover:text-blue-300"
            >
              For Hostel Owners
            </Link>
          </li>
        </ul>

        <p className="mt-10 text-gray-700 dark:text-gray-300">
          <strong className="text-gray-900 dark:text-white">
            ConnectingHostels Address:
          </strong>{" "}
          Hyderabad-501506, Telangana, India
        </p>

        <p className="mt-8 text-sm text-gray-500 dark:text-gray-400 text-center">
          Last updated: July 17, 2025
        </p>
      </div>
    </div>
  );
};

export default Support;
