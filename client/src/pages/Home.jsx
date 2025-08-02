import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Define the content for each slide
const slides = [
  // Slide 1: Your original home page content
  {
    background: `url(${process.env.PUBLIC_URL}/Hostel.jpg)`,
    isImage: true,
    content: (
      <>
        <h1 className="text-4xl font-bold mb-4 drop-shadow-lg">
          Welcome!
          <br />
          <strong>the one-stop platform for hostels in Mangalpally</strong>
        </h1>
        <p className="text-lg mb-6 drop-shadow-sm">
          Searching for Hostel (in Mangalpally).
          <br />
          Let’s do it together.
        </p>
      </>
    ),
  },
  // Slide 2: Ad with a colored background
  {
    background: "bg-indigo-900",
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
  // Slide 3: Ad with a colored background
  {
    background: "bg-teal-900",
    isImage: false,
    content: (
      <>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
          Want to Advertise Your Hostel Here?
        </h1>
        <p className="text-lg md:text-xl drop-shadow-sm">
          Reach thousands of students and fill your rooms faster. Please contact
          us.
        </p>
      </>
    ),
  },
  // Slide 4: Ad with a colored background
  {
    background: "bg-slate-800",
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

  // Auto-play slider logic
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000); // Change slide every 6 seconds
    return () => clearInterval(slideInterval);
  }, []);

  // Progress popup logic
  useEffect(() => {
    const timer = setTimeout(() => setShowProgressPopup(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {/* Project in Progress Popup */}
      {showProgressPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4">
          <div className="bg-yellow-100 text-black p-6 rounded-lg shadow-xl max-w-sm w-full text-center space-y-4">
            <h2 className="text-xl font-bold">🚧 Project in Progress</h2>
            <p className="text-sm">
              This website is still under development. Please use the test
              credentials to log in and explore.
            </p>
            <button
              onClick={() => setShowProgressPopup(false)}
              className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition"
            >
              Okay, got it!
            </button>
          </div>
        </div>
      )}

      {/* Main Page Slider */}
      <div className="relative w-full h-screen overflow-hidden">
        {/* Sliding container */}
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
              <div className="relative z-10 text-white max-w-3xl">
                {slide.content}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Dots */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                currentSlide === index
                  ? "bg-white"
                  : "bg-white/50 hover:bg-white"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
