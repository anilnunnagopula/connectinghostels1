// // Home.jsx
// import React, { useState, useEffect } from "react";
// import HostelListings from "./HostelListings";

// const slides = [
//   {
//     background: `url(${process.env.PUBLIC_URL}/Hostel.jpg)`,
//     isImage: true,
//     content: (
//       <>
//         <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
//           Welcome!
//           <br />
//           <strong>the one-stop platform for hostels in Mangalpally</strong>
//         </h1>
//         <p className="text-lg md:text-xl mb-6 drop-shadow-sm">
//           Searching for Hostel (in Mangalpally).
//           <br />
//           Let's do it together.
//         </p>
//       </>
//     ),
//   },
//   {
//     background:
//       "bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900",
//     isImage: false,
//     content: (
//       <>
//         <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
//           Newly Opened: Sri Harsha Boys Hostel
//         </h1>
//         <p className="text-lg md:text-xl drop-shadow-sm">
//           Experience modern amenities and a prime location. Book your spot now!
//         </p>
//       </>
//     ),
//   },
//   {
//     background: "bg-gradient-to-br from-teal-900 via-teal-800 to-cyan-900",
//     isImage: false,
//     content: (
//       <>
//         <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
//           Want to Advertise Your Hostel Here?
//         </h1>
//         <p className="text-lg md:text-xl drop-shadow-sm">
//           Reach thousands of students and fill your rooms faster. Contact us
//           today.
//         </p>
//       </>
//     ),
//   },
//   {
//     background: "bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900",
//     isImage: false,
//     content: (
//       <>
//         <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
//           Tired of Searching for Hostels?
//         </h1>
//         <p className="text-lg md:text-xl drop-shadow-sm">
//           Our platform makes finding the perfect stay simple and easy.
//         </p>
//       </>
//     ),
//   },
// ];

// const Home = () => {
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [showProgressPopup, setShowProgressPopup] = useState(true);

//   // Auto-play slider
//   useEffect(() => {
//     const slideInterval = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % slides.length);
//     }, 6000);
//     return () => clearInterval(slideInterval);
//   }, []);

//   // Progress popup (only show once per session)
//   useEffect(() => {
//     const hasSeenPopup = sessionStorage.getItem("hasSeenProgressPopup");
//     if (hasSeenPopup) {
//       setShowProgressPopup(false);
//     } else {
//       const timer = setTimeout(() => {
//         setShowProgressPopup(false);
//         sessionStorage.setItem("hasSeenProgressPopup", "true");
//       }, 4000);
//       return () => clearTimeout(timer);
//     }
//   }, []);

//   return (
//     <div>
//       {/* Project in Progress Popup */}
//       {showProgressPopup && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fadeIn">
//           <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-400 text-gray-800 p-6 rounded-2xl shadow-2xl max-w-md w-full space-y-4 transform transition-all">
//             <div className="flex items-center justify-center mb-2">
//               <div className="bg-yellow-400 rounded-full p-3">
//                 <svg
//                   className="w-8 h-8 text-yellow-900"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
//                   />
//                 </svg>
//               </div>
//             </div>
//             <h2 className="text-2xl font-bold text-center">🚧 Beta Version</h2>
//             <p className="text-sm text-center leading-relaxed">
//               This platform is currently in development. Browse hostels freely,
//               or use test credentials to explore booking features.
//             </p>
//             <button
//               onClick={() => {
//                 setShowProgressPopup(false);
//                 sessionStorage.setItem("hasSeenProgressPopup", "true");
//               }}
//               className="w-full px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all transform hover:scale-105 shadow-md"
//             >
//               Got it, let's explore!
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Hero Slider - Fully Public */}
//       <div className="relative w-full h-screen overflow-hidden">
//         <div
//           className="flex h-full transition-transform duration-700 ease-in-out"
//           style={{ transform: `translateX(-${currentSlide * 100}%)` }}
//         >
//           {slides.map((slide, index) => (
//             <div
//               key={index}
//               className={`w-full h-full flex-shrink-0 relative flex flex-col items-center justify-center text-center p-4 ${
//                 !slide.isImage ? slide.background : "bg-cover bg-center"
//               }`}
//               style={slide.isImage ? { backgroundImage: slide.background } : {}}
//             >
//               {slide.isImage && (
//                 <div className="absolute inset-0 bg-black bg-opacity-50"></div>
//               )}
//               <div className="relative z-10 text-white max-w-4xl px-4">
//                 {slide.content}
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Navigation Dots */}
//         <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
//           {slides.map((_, index) => (
//             <button
//               key={index}
//               onClick={() => setCurrentSlide(index)}
//               className={`w-3 h-3 rounded-full transition-all ${
//                 currentSlide === index
//                   ? "bg-white scale-125"
//                   : "bg-white/50 hover:bg-white/80"
//               }`}
//               aria-label={`Go to slide ${index + 1}`}
//             />
//           ))}
//         </div>

//         {/* Scroll Indicator */}
//         <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 animate-bounce">
//           <svg
//             className="w-6 h-6 text-white"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M19 14l-7 7m0 0l-7-7m7 7V3"
//             />
//           </svg>
//         </div>
//       </div>

//       {/* Hostel Listings - Fully Public */}
//       <HostelListings />
//     </div>
//   );
// };

// export default Home;
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Building2,
  Shield,
  Star,
  ArrowRight,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import HostelListings from "./HostelListings";

const slides = [
  {
    background: `url(${process.env.PUBLIC_URL}/Hostel.jpg)`,
    isImage: true,
    badge: { icon: MapPin, text: "Mangalpally, Ibrahimpatnam" },
    title: (
      <>
        Find Your Perfect
        <br />
        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Hostel Home
        </span>
      </>
    ),
    description:
      "The one-stop platform for finding quality hostels in Mangalpally. Your comfort, our priority.",
  },
  {
    background:
      "bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900",
    isImage: false,
    badge: { icon: Star, text: "Now Open" },
    title: "Newly Opened: Sri Harsha Boys Hostel",
    description:
      "Experience modern amenities and a prime location. Book your spot now and enjoy exclusive launch offers!",
  },
  {
    background: "bg-gradient-to-br from-teal-900 via-teal-800 to-cyan-900",
    isImage: false,
    badge: { icon: Building2, text: "For Owners" },
    title: "Want to Advertise Your Hostel Here?",
    description:
      "Reach thousands of students and fill your rooms faster. List your property with us today.",
  },
  {
    background: "bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900",
    isImage: false,
    badge: { icon: Search, text: "Easy Search" },
    title: "Tired of Searching for Hostels?",
    description:
      "Our platform makes finding the perfect stay simple, fast, and hassle-free. Browse with confidence.",
  },
];

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play slider
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(slideInterval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Slider */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Slides Container */}
        <div
          className="flex h-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`relative flex h-full w-full flex-shrink-0 items-center justify-center ${
                !slide.isImage ? slide.background : "bg-cover bg-center"
              }`}
              style={slide.isImage ? { backgroundImage: slide.background } : {}}
            >
              {/* Overlay for image slides */}
              {slide.isImage && (
                <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70" />
              )}

              {/* Content */}
              <div className="container relative z-10 mx-auto max-w-5xl px-4 text-center">
                {/* Badge */}
                <div className="mb-6 inline-flex animate-in fade-in slide-in-from-top-4 duration-700 delay-100">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
                    <slide.badge.icon className="h-4 w-4" />
                    {slide.badge.text}
                  </div>
                </div>

                {/* Title */}
                <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-white drop-shadow-2xl animate-in fade-in slide-in-from-top-6 duration-700 delay-200 md:text-6xl lg:text-7xl">
                  {slide.title}
                </h1>

                {/* Description */}
                <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-white/90 drop-shadow-lg animate-in fade-in slide-in-from-top-8 duration-700 delay-300 md:text-xl">
                  {slide.description}
                </p>

                {/* CTA Buttons - Only on first slide */}
                {index === 0 && (
                  <div className="flex flex-col items-center justify-center gap-4 animate-in fade-in slide-in-from-top-10 duration-700 delay-500 sm:flex-row">
                    <Link to="/login">
                      <button className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-base font-semibold text-white shadow-2xl transition-all hover:scale-105 hover:from-blue-700 hover:to-purple-700">
                        <Search className="h-5 w-5" />
                        Browse Hostels
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </button>
                    </Link>
                    <Link to="/login">
                      <button className="flex items-center gap-2 rounded-xl border-2 border-white/30 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/20">
                        <Building2 className="h-5 w-5" />
                        List Your Hostel
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white backdrop-blur-sm transition-all hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 md:left-8"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white backdrop-blur-sm transition-all hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 md:right-8"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Navigation Dots */}
        <div className="absolute bottom-12 left-1/2 z-20 flex -translate-x-1/2 gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2.5 rounded-full transition-all ${
                currentSlide === index
                  ? "w-10 bg-white"
                  : "w-2.5 bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-24 left-1/2 z-20 -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center gap-2 text-white">
            <span className="text-xs font-medium uppercase tracking-wider">
              Scroll Down
            </span>
            <svg
              className="h-6 w-6"
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
      </section>

      {/* How It Works Section */}
      <section className="border-t border-gray-200 bg-white px-4 py-16 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <h2 className="mb-2 text-center text-3xl font-bold text-gray-900 md:text-4xl">
            How It Works
          </h2>
          <p className="mb-12 text-center text-lg text-gray-600">
            Three simple steps to your new home
          </p>
          <div className="grid gap-10 md:grid-cols-3">
            {[
              {
                icon: Search,
                title: "Search & Filter",
                desc: "Browse hostels by type, price, location, and amenities to find your perfect match.",
              },
              {
                icon: Shield,
                title: "Send Request",
                desc: "Apply to your preferred hostel with one click and get instant confirmation.",
              },
              {
                icon: Star,
                title: "Move In",
                desc: "Get approved and move into your new hostel home hassle-free.",
              },
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 text-blue-600 shadow-md">
                  <step.icon className="h-8 w-8" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900">
                  {step.title}
                </h3>
                <p className="text-base text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hostel Listings */}
      <HostelListings />

      {/* CTA Section */}
      <section className="px-4 py-16 md:py-20">
        <div className="container mx-auto max-w-4xl">
          <div className="rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-10 text-center text-white shadow-2xl md:p-16">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Own a Hostel?
            </h2>
            <p className="mx-auto mb-8 max-w-lg text-lg opacity-95">
              List your hostel on ConnectingHostels and reach hundreds of
              students looking for accommodation in Mangalpally.
            </p>
            <Link to="/auth?mode=register&role=owner">
              <button className="transform rounded-xl bg-white px-10 py-4 text-base font-semibold text-purple-600 shadow-lg transition-all hover:scale-105 hover:shadow-xl">
                Get Started Free
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;