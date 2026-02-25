import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Search,
  Building2,
  Shield,
  Star,
  ArrowRight,
  MapPin,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Users,
  BadgeCheck,
  Quote,
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
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (user?.role === "owner") { navigate("/owner-dashboard", { replace: true }); return; }
    if (user?.role === "student") { navigate("/student-dashboard", { replace: true }); return; }
  }, [user, navigate]);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(id);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="min-h-screen">
      {/* ── Hero Slider ─────────────────────────────────────────── */}
      <section className="relative h-screen w-full overflow-hidden">
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
              {slide.isImage && (
                <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70" />
              )}

              <div className="container relative z-10 mx-auto max-w-5xl px-4 text-center">
                <div className="mb-6 inline-flex">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
                    <slide.badge.icon className="h-4 w-4" />
                    {slide.badge.text}
                  </div>
                </div>

                <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-white drop-shadow-2xl md:text-6xl lg:text-7xl">
                  {slide.title}
                </h1>

                <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-white/90 drop-shadow-lg md:text-xl">
                  {slide.description}
                </p>

                {index === 0 && (
                  <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
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

        <div className="absolute bottom-24 left-1/2 z-20 -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center gap-2 text-white">
            <span className="text-xs font-medium uppercase tracking-wider">Scroll Down</span>
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────────────── */}
      <section className="border-t border-slate-200 bg-white px-4 py-16 dark:border-slate-700 dark:bg-slate-900 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <h2 className="mb-2 text-center text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
            How It Works
          </h2>
          <p className="mb-12 text-center text-lg text-slate-500 dark:text-slate-400">
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
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 text-blue-600 shadow-md dark:from-blue-900/40 dark:to-purple-900/40 dark:text-blue-400">
                  <step.icon className="h-8 w-8" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="text-base text-slate-500 dark:text-slate-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust Stats ─────────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-4 py-8">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-6 text-center text-white sm:grid-cols-3">
            {[
              { icon: BadgeCheck, value: "50+", label: "Verified Hostels" },
              { icon: Users, value: "400+", label: "Happy Students" },
              { icon: Star, value: "4.8★", label: "Average Rating" },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <s.icon className="mb-1 h-6 w-6 opacity-80" />
                <span className="text-3xl font-extrabold">{s.value}</span>
                <span className="text-sm font-medium opacity-80">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Hostel Listings ─────────────────────────────────────── */}
      <HostelListings />

      {/* ── Testimonials ────────────────────────────────────────── */}
      <section className="bg-slate-50 px-4 py-16 dark:bg-slate-800/50 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <h2 className="mb-2 text-center text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
            Students Love It
          </h2>
          <p className="mb-12 text-center text-lg text-slate-500 dark:text-slate-400">
            Real experiences from students who found their home through us
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                name: "Ravi Kumar",
                college: "CBIT, Hyderabad",
                hostel: "Sri Harsha Boys Hostel",
                text: "Found my hostel in 10 minutes. The owner responded the same day. Best part — no broker fees, no hidden charges.",
                initials: "RK",
                color: "from-blue-500 to-blue-600",
              },
              {
                name: "Priya Sharma",
                college: "VNR VJIET, Hyderabad",
                hostel: "Green Valley Girls PG",
                text: "I was nervous moving to a new city. This platform made it so simple. The verified badge gave me confidence the hostel was genuine.",
                initials: "PS",
                color: "from-purple-500 to-purple-600",
              },
              {
                name: "Aakash Reddy",
                college: "JNTU Hyderabad",
                hostel: "Sai Krishna Boys Hostel",
                text: "Paid rent directly through the app. Safe, fast, tracked. No more carrying cash to the owner every month.",
                initials: "AR",
                color: "from-pink-500 to-pink-600",
              },
            ].map((t, i) => (
              <div
                key={i}
                className="relative rounded-2xl bg-white p-6 shadow-md dark:bg-slate-800"
              >
                <Quote className="absolute right-5 top-5 h-8 w-8 text-slate-100 dark:text-slate-700" />
                <p className="mb-5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${t.color} text-sm font-bold text-white`}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{t.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{t.college}</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">{t.hostel}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Owner CTA ───────────────────────────────────────────── */}
      <section className="px-4 py-16 dark:bg-slate-900 md:py-20">
        <div className="container mx-auto max-w-4xl">
          <div className="rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-10 text-center text-white shadow-2xl md:p-16">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Own a Hostel?</h2>
            <p className="mx-auto mb-3 max-w-lg text-lg opacity-95">
              List your hostel on ConnectingHostels and reach hundreds of students
              looking for accommodation in Mangalpally.
            </p>
            <ul className="mx-auto mb-8 max-w-sm space-y-1 text-sm opacity-85">
              {[
                "Zero listing fee",
                "Direct bookings — no middlemen",
                "Manage students & payments in one place",
              ].map((b, i) => (
                <li key={i} className="flex items-center justify-center gap-2">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
            <Link to="/register">
              <button className="transform rounded-xl bg-white px-10 py-4 text-base font-semibold text-purple-600 shadow-lg transition-all hover:scale-105 hover:shadow-xl">
                List Your Hostel Free →
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
