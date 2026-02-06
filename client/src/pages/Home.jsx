// Home.jsx
import React, { useState, useEffect } from "react";
import HostelListings from "./HostelListings";

const slides = [
  {
    background: `url(${process.env.PUBLIC_URL}/Hostel.jpg)`,
    isImage: true,
    content: (
      <>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
          Welcome!
          <br />
          <strong>the one-stop platform for hostels in Mangalpally</strong>
        </h1>
        <p className="text-lg md:text-xl mb-6 drop-shadow-sm">
          Searching for Hostel (in Mangalpally).
          <br />
          Let's do it together.
        </p>
      </>
    ),
  },
  {
    background:
      "bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900",
    isImage: false,
    content: (
      <>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
          Newly Opened: Sri Harsha Boys Hostel
        </h1>
        <p className="text-lg md:text-xl drop-shadow-sm">
          Experience modern amenities and a prime location. Book your spot now!
        </p>
      </>
    ),
  },
  {
    background: "bg-gradient-to-br from-teal-900 via-teal-800 to-cyan-900",
    isImage: false,
    content: (
      <>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
          Want to Advertise Your Hostel Here?
        </h1>
        <p className="text-lg md:text-xl drop-shadow-sm">
          Reach thousands of students and fill your rooms faster. Contact us
          today.
        </p>
      </>
    ),
  },
  {
    background: "bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900",
    isImage: false,
    content: (
      <>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
          Tired of Searching for Hostels?
        </h1>
        <p className="text-lg md:text-xl drop-shadow-sm">
          Our platform makes finding the perfect stay simple and easy.
        </p>
      </>
    ),
  },
];

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showProgressPopup, setShowProgressPopup] = useState(true);

  // Auto-play slider
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(slideInterval);
  }, []);

  // Progress popup (only show once per session)
  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem("hasSeenProgressPopup");
    if (hasSeenPopup) {
      setShowProgressPopup(false);
    } else {
      const timer = setTimeout(() => {
        setShowProgressPopup(false);
        sessionStorage.setItem("hasSeenProgressPopup", "true");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div>
      {/* Project in Progress Popup */}
      {showProgressPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-400 text-gray-800 p-6 rounded-2xl shadow-2xl max-w-md w-full space-y-4 transform transition-all">
            <div className="flex items-center justify-center mb-2">
              <div className="bg-yellow-400 rounded-full p-3">
                <svg
                  className="w-8 h-8 text-yellow-900"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center">🚧 Beta Version</h2>
            <p className="text-sm text-center leading-relaxed">
              This platform is currently in development. Browse hostels freely,
              or use test credentials to explore booking features.
            </p>
            <button
              onClick={() => {
                setShowProgressPopup(false);
                sessionStorage.setItem("hasSeenProgressPopup", "true");
              }}
              className="w-full px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all transform hover:scale-105 shadow-md"
            >
              Got it, let's explore!
            </button>
          </div>
        </div>
      )}

      {/* Hero Slider - Fully Public */}
      <div className="relative w-full h-screen overflow-hidden">
        <div
          className="flex h-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`w-full h-full flex-shrink-0 relative flex flex-col items-center justify-center text-center p-4 ${
                !slide.isImage ? slide.background : "bg-cover bg-center"
              }`}
              style={slide.isImage ? { backgroundImage: slide.background } : {}}
            >
              {slide.isImage && (
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>
              )}
              <div className="relative z-10 text-white max-w-4xl px-4">
                {slide.content}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                currentSlide === index
                  ? "bg-white scale-125"
                  : "bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 animate-bounce">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>

      {/* Hostel Listings - Fully Public */}
      <HostelListings />
    </div>
  );
};

export default Home;
