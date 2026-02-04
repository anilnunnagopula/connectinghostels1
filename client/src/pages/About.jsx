import React,{useEffect} from "react";

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 min-h-screen py-2 px-6 font-inter">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4 text-blue-800 dark:text-blue-300 drop-shadow-sm">
          About ConnectingHostels: Your Digital Accommodation Hub
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
          Hey there! 👋 I’m a{" "}
          <span className="font-semibold text-blue-600 dark:text-blue-400">
            final-year student from CVR College of Engineering
          </span>{" "}
          who, like countless others, navigated the chaotic maze of finding
          suitable hostel accommodation. The endless phone calls, unreliable
          brokers, and fragmented information were a constant struggle.
          ConnectingHostels was born from this very real frustration — a vision
          to transform the search for the perfect hostel into a seamless,
          digital experience.
        </p>

        {/* Section 1: The Problem & Our Solution */}
        <div className="grid md:grid-cols-2 gap-6 text-left my-10">
          <div className="bg-white dark:bg-gray-800 shadow-xl p-6 rounded-xl hover:scale-105 transition">
            <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-400 mb-2">
              💡 The Challenge: Fragmented Accommodation Search
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              For students and working professionals, finding reliable, safe,
              and affordable hostel accommodation is often a daunting task.
              Information is scattered across WhatsApp groups, local agents, and
              outdated listings. Hostel owners, on the other hand, struggle to
              effectively showcase their properties and reach their target
              audience beyond word-of-mouth. This disconnect leads to
              frustration for both parties.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow-xl p-6 rounded-xl hover:scale-105 transition">
            <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-400 mb-2">
              🎯 Our Solution: A Centralized Digital Ecosystem
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              ConnectingHostels bridges this critical gap by providing a
              comprehensive, centralized web platform. We empower students to
              discover their ideal living spaces with ease, and enable hostel
              owners to manage and promote their properties efficiently. Our
              goal is to eliminate the traditional hassles, offering direct
              connections and transparent information for a stress-free
              experience.
            </p>
          </div>
        </div>

        {/* Section 2: Core Features & User Experience */}
        <div className="grid md:grid-cols-2 gap-6 text-left my-10">
          <div className="bg-white dark:bg-gray-800 shadow-xl p-6 rounded-xl hover:scale-105 transition">
            <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-400 mb-2">
              ✨ Designed for Seamless Discovery & Management
            </h2>
            <ul className="text-gray-600 dark:text-gray-300 list-disc list-inside space-y-1">
              <li>
                <strong>Intuitive Search & Filters:</strong> Easily find hostels
                by category (Girls, Boys, Co-live), location, and available
                rooms.
              </li>
              <li>
                <strong>Detailed Listings:</strong> Access comprehensive room
                details, availability, floor information, and high-quality
                photos.
              </li>
              <li>
                <strong>Direct Communication:</strong> Connect directly with
                hostel owners, cutting out intermediaries.
              </li>
              <li>
                <strong>Owner Dashboards:</strong> Empower hostel owners with
                tools to list, update, and manage their properties effectively.
              </li>
              <li>
                <strong>Real-time Updates:</strong> Experience instant
                information on availability and new listings, crucial for a
                dynamic market.
              </li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow-xl p-6 rounded-xl hover:scale-105 transition">
            <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-400 mb-2">
              🚀 Built for Scale & Modern User Needs
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              ConnectingHostels is built with ❤️ using modern web technologies
              like React and TailwindCSS. This robust foundation ensures:
            </p>
            <ul className="text-gray-600 dark:text-gray-300 list-disc list-inside space-y-1">
              <li>
                <strong>Large-Scale Application:</strong> Architected to handle
                a vast number of users and listings, ensuring performance and
                reliability as we grow.
              </li>
              <li>
                <strong>Mobile-First Design:</strong> Optimized for an
                exceptional experience on any device, from smartphones to
                desktops, ensuring accessibility for all users.
              </li>
              <li>
                <strong>Full Dark Mode Support:</strong> Providing a comfortable
                viewing experience in any lighting condition, allowing users to
                switch themes based on their preference.
              </li>
              <li>
                <strong>Future-Proof Technology:</strong> Ready for future
                enhancements like advanced analytics, integrated payment
                solutions, and community features.
              </li>
            </ul>
          </div>
        </div>

        <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed mt-10">
          Our vision extends beyond just listings; we aim to cultivate a vibrant
          digital community where students can find not just a room, but a home
          away from home, and hostel owners can thrive in a transparent and
          efficient marketplace. ConnectingHostels is more than an app; it's a
          commitment to simplifying accommodation for everyone.
        </p>

        <div className="mt-10 text-sm text-gray-500 dark:text-gray-400">
          💡 Designed and built by a CVR final year student who believes in
          solving real-life problems through code.
        </div>
      </div>
    </div>
  );
};

export default About;
