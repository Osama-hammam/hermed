import { Link } from "react-router-dom";
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.88v-6.99H7.898v-2.89h2.54V9.797c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.242 0-1.63.772-1.63 1.562v1.875h2.773l-.443 2.89h-2.33v6.99C18.343 21.128 22 16.991 22 12Z" />
    </svg>
  );
}

function InstagramIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
      <path d="M16 11.37a4 4 0 1 1-7.99.5 4 4 0 0 1 7.99-.5Z" />
      <path d="M17.5 6.5h.01" />
    </svg>
  );
}

function LinkedInIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M4.98 3.5C3.34 3.5 2 4.84 2 6.48c0 1.65 1.34 2.99 2.98 2.99 1.65 0 2.99-1.34 2.99-2.99 0-1.64-1.34-2.98-2.99-2.98ZM2.5 8.73H5.4V21H2.5V8.73ZM8.93 8.73H11.8v1.68h.04c.39-.74 1.35-1.52 2.78-1.52 2.98 0 3.51 1.96 3.51 4.52V21h-2.9v-5.73c0-1.37-.03-3.14-1.91-3.14-1.91 0-2.2 1.49-2.2 3.03V21H8.93V8.73Z" />
    </svg>
  );
}

export default function Footer() {
  const [footerRef, footerVisible] = useScrollAnimation();

  return (
    <footer
      ref={footerRef}
      className={`bg-slate-900 text-slate-300 mt-24 transition-all duration-1000 ease-out ${footerVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-20 scale-95"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              to="/"
              className="inline-flex items-center gap-2.5 mb-6 group"
            >
              <img
                src="/public/hermed.jpeg"
                alt="HERMED"
                className="h-12 w-auto object-contain transition-opacity group-hover:opacity-80"
                onError={(e) =>
                  (e.target.src =
                    "https://ui-avatars.com/api/?name=HERMED&background=1d4ed8&color=fff")
                }
              />
            </Link>
            <p className="text-sm text-slate-300 leading-relaxed mb-6 max-w-xs">
              Your trusted partner for premium dental supplies, serving dental
              professionals across the Middle East since 2010.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="w-8 h-8 bg-slate-800 hover:bg-brand-600 rounded-lg flex items-center justify-center transition-colors text-slate-300 hover:text-white"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="w-8 h-8 bg-slate-800 hover:bg-brand-600 rounded-lg flex items-center justify-center transition-colors text-slate-300 hover:text-white"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="w-8 h-8 bg-slate-800 hover:bg-brand-600 rounded-lg flex items-center justify-center transition-colors text-slate-300 hover:text-white"
              >
                <LinkedInIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-5 text-xs uppercase tracking-widest opacity-90">
              Quick Links
            </h4>
            <ul className="space-y-3.5 text-sm">
              {[
                { to: "/shop", label: "Shop All" },
                { to: "/about", label: "About Us" },
                { to: "/contact", label: "Contact" },
                { to: "/admin", label: "Admin Portal" },
              ].map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="hover:text-white hover:translate-x-1 inline-block transition-all text-slate-300"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-bold mb-5 text-xs uppercase tracking-widest opacity-90">
              Categories
            </h4>
            <ul className="space-y-3.5 text-sm">
              {[
                "Handpieces",
                "Instruments",
                "Materials",
                "Imaging",
                "Hygiene & PPE",
                "Endodontics",
              ].map((c) => (
                <li key={c}>
                  <Link
                    to={`/shop?category=${c.toLowerCase().replace(/ & /g, "-")}`}
                    className="hover:text-white inline-block transition-colors text-slate-300"
                  >
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-5 text-xs uppercase tracking-widest opacity-90">
              Contact Us
            </h4>
            <ul className="space-y-4 text-sm text-slate-300">
              <li className="flex gap-2.5 items-start">
                <MapPinIcon className="w-5 h-5 text-brand-500 flex-shrink-0" />
                <span>25 Medical District St., Cairo, Egypt 11311</span>
              </li>
              <li className="flex gap-2.5">
                <PhoneIcon className="w-5 h-5 text-brand-500 flex-shrink-0" />
                <a
                  href="tel:+20221234567"
                  className="hover:text-white transition-colors"
                >
                  +20 2 2123 4567
                </a>
              </li>
              <li className="flex gap-2.5">
                <EnvelopeIcon className="w-5 h-5 text-brand-500 flex-shrink-0" />
                <a
                  href="mailto:orders@hermed.com"
                  className="hover:text-white transition-colors"
                >
                  orders@hermed.com
                </a>
              </li>
              <li className="flex gap-2.5">
                <ClockIcon className="w-5 h-5 text-brand-500 flex-shrink-0" />
                <span>Sun–Thu: 9:00 AM – 6:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-slate-400">
          <p>
            © {new Date().getFullYear()} HERMED Dental Supplies. All rights
            reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-slate-300 transition-colors">
              Terms of Use
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
