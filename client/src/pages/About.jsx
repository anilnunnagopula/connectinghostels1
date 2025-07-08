import React from "react";

const About = () => {
  return (
    <div className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 min-h-screen py-2 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4 text-blue-800 dark:text-blue-300 drop-shadow-sm">
          About ConnectingHostels
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
          Hey there! 👋 I’m a{" "}
          <span className="font-semibold text-blue-600 dark:text-blue-400">
            final-year student from CVR College of Engineering
          </span>{" "}
          who faced the same struggle every hostel student goes through —
          finding the right place at the right time.
        </p>

        <div className="grid md:grid-cols-2 gap-6 text-left my-10">
          <div className="bg-white dark:bg-gray-800 shadow-xl p-6 rounded-xl hover:scale-105 transition">
            <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-400 mb-2">
              🎯 Bridging the Gap
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Whether you're a student searching for a good hostel or a hostel
              owner trying to reach students — this platform connects both sides
              seamlessly. No brokers. No confusion. Just easy access.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow-xl p-6 rounded-xl hover:scale-105 transition">
            <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-400 mb-2">
              🔧 Built for Students & Owners
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              ConnectingHostels is built with ❤️ using React and TailwindCSS to
              provide a fast, mobile-friendly experience for users on both ends
              — students & hostel owners.
            </p>
          </div>
        </div>

        <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
          The goal is simple — to make hostel search & management easier,
          faster, and smarter. Whether you're new to the area or managing a
          property, this app is your go-to tool.
        </p>

        <div className="mt-10 text-sm text-gray-500 dark:text-gray-400">
          💡 Designed and built  by a CVR final year student who believes in
          solving real-life problems through code.
        </div>
      </div>
    </div>
  );
};

export default About;
