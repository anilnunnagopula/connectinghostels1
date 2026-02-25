import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  MapPin,
  Mail,
  Phone,
  ChevronRight,
  Building2,
  GraduationCap,
  ShieldCheck,
  MessageCircle,
} from "lucide-react";
import {
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaFacebookF,
  FaWhatsapp,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const HIDDEN_PATHS = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

const SCHEMA = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: "ConnectingHostels",
  url: "https://connectinghostels1.netlify.app",
  logo: "https://connectinghostels1.netlify.app/Hostel.jpg",
  description:
    "Find verified hostels & PG accommodations near CVR College, Mangalpally, Hyderabad, Telangana.",
  telephone: "+91-93988-28248",
  email: "anilnunnagopula15@gmail.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "CVR College Road",
    addressLocality: "Mangalpally",
    addressRegion: "Telangana",
    postalCode: "501301",
    addressCountry: "IN",
  },
  areaServed: ["Mangalpally", "Ibrahimpatnam", "Sheriguda", "Hyderabad"],
  priceRange: "₹₹",
  openingHours: "Mo-Su 09:00-21:00",
};

const Footer = () => {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const isLoggedIn = !!user;
  const userRole = user?.role;

  if (HIDDEN_PATHS.some((p) => pathname.startsWith(p))) return null;

  return (
    <footer
      className="bg-slate-900 text-slate-300"
      aria-label="Site footer"
    >
      {/* JSON-LD structured data — RealEstateAgent schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />

      {/* ── Main content ───────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Column 1 — Brand ──────────────────────────────────── */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              to="/"
              aria-label="ConnectingHostels Home"
              className="inline-flex items-center gap-2 mb-4 group"
            >
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600 text-white text-[11px] font-black select-none">
                CH
              </span>
              <span className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                ConnectingHostels
              </span>
            </Link>

            <p className="text-sm leading-relaxed text-slate-400 mb-6 max-w-xs">
              The fastest way to find verified hostels &amp; PG rooms near CVR
              College, Mangalpally, Hyderabad. Trusted by 400+ students across
              Telangana.
            </p>

            {/* Social links — real <a> tags for SEO */}
            <div className="flex items-center gap-2">
              <SocialLink
                href="https://instagram.com"
                label="Follow ConnectingHostels on Instagram"
                icon={FaInstagram}
                hover="hover:bg-pink-600"
              />
              <SocialLink
                href="https://twitter.com"
                label="Follow ConnectingHostels on Twitter"
                icon={FaTwitter}
                hover="hover:bg-sky-500"
              />
              <SocialLink
                href="https://linkedin.com"
                label="ConnectingHostels on LinkedIn"
                icon={FaLinkedinIn}
                hover="hover:bg-blue-600"
              />
              <SocialLink
                href="https://facebook.com"
                label="ConnectingHostels on Facebook"
                icon={FaFacebookF}
                hover="hover:bg-blue-700"
              />
              <SocialLink
                href="https://wa.me/919398828248"
                label="Chat on WhatsApp"
                icon={FaWhatsapp}
                hover="hover:bg-green-600"
              />
            </div>
          </div>

          {/* Column 2 — For Students ───────────────────────────── */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-5 flex items-center gap-2">
              <GraduationCap size={14} className="text-blue-400" />
              For Students
            </h3>
            <nav aria-label="Student links">
              <ul className="space-y-2.5">
                <FooterLink to="/student/hostels">Browse Hostels</FooterLink>
                {isLoggedIn && userRole === "student" ? (
                  <>
                    <FooterLink to="/student-dashboard">My Dashboard</FooterLink>
                    <FooterLink to="/student/my-bookings">My Bookings</FooterLink>
                    <FooterLink to="/student/my-hostel">My Hostel</FooterLink>
                    <FooterLink to="/student/interested">Saved Hostels</FooterLink>
                    <FooterLink to="/student/raise-complaint">Raise Complaint</FooterLink>
                  </>
                ) : (
                  <>
                    <FooterLink to="/register">Create Account</FooterLink>
                    <FooterLink to="/login">Sign In</FooterLink>
                    <FooterLink to="/about">How It Works</FooterLink>
                  </>
                )}
              </ul>
            </nav>
          </div>

          {/* Column 3 — For Owners ─────────────────────────────── */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-5 flex items-center gap-2">
              <Building2 size={14} className="text-blue-400" />
              For Owners
            </h3>
            <nav aria-label="Owner links">
              <ul className="space-y-2.5">
                {isLoggedIn && userRole === "owner" ? (
                  <>
                    <FooterLink to="/owner-dashboard">My Dashboard</FooterLink>
                    <FooterLink to="/owner/my-hostels">My Hostels</FooterLink>
                    <FooterLink to="/owner/add-hostel">Add Hostel</FooterLink>
                    <FooterLink to="/owner/view-requests">Booking Requests</FooterLink>
                    <FooterLink to="/owner/my-students">My Students</FooterLink>
                  </>
                ) : (
                  <>
                    <FooterLink to="/register">List Your Hostel</FooterLink>
                    <FooterLink to="/login">Owner Login</FooterLink>
                    <FooterLink to="/about">How It Works</FooterLink>
                  </>
                )}
                <FooterLink to="/legal/partner-terms">Partner Terms</FooterLink>
                <FooterLink to="/support">Support Center</FooterLink>
              </ul>
            </nav>
          </div>

          {/* Column 4 — Contact ────────────────────────────────── */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-5 flex items-center gap-2">
              <ShieldCheck size={14} className="text-blue-400" />
              Get in Touch
            </h3>

            <address className="not-italic space-y-3 text-sm text-slate-400">
              <a
                href="https://www.google.com/maps/search/?api=1&query=CVR+College+Road,+Mangalpally,+Hyderabad,+Telangana"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2.5 hover:text-white transition-colors group"
              >
                <MapPin
                  size={14}
                  className="shrink-0 mt-0.5 text-blue-400 group-hover:text-blue-300"
                />
                <span>
                  CVR College Road, Mangalpally,
                  <br />
                  Hyderabad, Telangana — 501301
                </span>
              </a>

              <a
                href="mailto:anilnunnagopula15@gmail.com"
                className="flex items-center gap-2.5 hover:text-white transition-colors group"
              >
                <Mail
                  size={14}
                  className="shrink-0 text-blue-400 group-hover:text-blue-300"
                />
                anilnunnagopula15@gmail.com
              </a>

              <a
                href="tel:+919398828248"
                className="flex items-center gap-2.5 hover:text-white transition-colors group"
              >
                <Phone
                  size={14}
                  className="shrink-0 text-blue-400 group-hover:text-blue-300"
                />
                +91 93988 28248
              </a>

              <a
                href="https://wa.me/919398828248"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 hover:text-white transition-colors group"
              >
                <MessageCircle
                  size={14}
                  className="shrink-0 text-green-500 group-hover:text-green-400"
                />
                WhatsApp us
              </a>
            </address>

            <Link
              to="/contact"
              className="inline-flex items-center gap-1.5 mt-5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Send a Message
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Bottom strip ───────────────────────────────────────── */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 text-center sm:text-left">
            &copy; {new Date().getFullYear()}{" "}
            <Link
              to="/"
              className="text-slate-300 font-semibold hover:text-white transition-colors"
            >
              ConnectingHostels
            </Link>
            . All rights reserved. Made with ♥ in Hyderabad, India.
          </p>

          <nav
            aria-label="Legal links"
            className="flex flex-wrap justify-center gap-x-4 gap-y-1.5"
          >
            {[
              ["/legal/privacy-policy", "Privacy Policy"],
              ["/legal/terms-and-conditions", "Terms of Service"],
              ["/legal/cookie-policy", "Cookies"],
              ["/legal/refund-policy", "Refund Policy"],
              ["/support", "Support"],
            ].map(([to, label]) => (
              <Link
                key={to}
                to={to}
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
};

// ── Sub-components ──────────────────────────────────────────────────────────

const FooterLink = ({ to, children }) => (
  <li>
    <Link
      to={to}
      className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors group"
    >
      <ChevronRight
        size={11}
        className="text-blue-500/50 group-hover:text-blue-400 transition-colors shrink-0"
      />
      {children}
    </Link>
  </li>
);

const SocialLink = ({ href, label, icon: Icon, hover }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className={`w-8 h-8 rounded-full bg-slate-800 ${hover} inline-flex items-center justify-center text-slate-300 hover:text-white transition-colors`}
  >
    <Icon size={14} />
  </a>
);

export default Footer;
