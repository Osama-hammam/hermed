import { useState } from "react";
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  ArrowPathIcon,
  ChatBubbleLeftRightIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

export default function Contact() {
  const [headerRef, headerVisible] = useScrollAnimation();
  const [contentRef, contentVisible] = useScrollAnimation();

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      e.email = "Valid email required";
    if (!form.message.trim()) e.message = "Required";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setSent(true);
  };

  return (
    <div className="page-enter">
      {/* Header */}
      <section
        ref={headerRef}
        className={`bg-gradient-to-br from-brand-900 to-brand-600 py-20 px-4 text-center relative overflow-hidden transition-all duration-700 ${headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      >
        {/* Background Image Overlay */}
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1600&q=80"
            className="w-full h-full object-cover"
            alt=""
          />
        </div>
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%">
            <defs>
              <pattern
                id="dots2"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="20" cy="20" r="1.5" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots2)" />
          </svg>
        </div>
        <div className="relative">
          <h1 className="font-display text-4xl font-bold text-white mb-3">
            Get in Touch
          </h1>
          <p className="text-brand-100/80 text-lg max-w-md mx-auto">
            Our team of dental professionals is here to help you find the right
            supplies for your clinic.
          </p>
        </div>
      </section>

      <div
        ref={contentRef}
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 transition-all duration-700 ${contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Info */}
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-xl font-bold text-slate-900 mb-4">
                Contact Information
              </h2>
              <div className="space-y-4">
                {[
                  {
                    icon: MapPinIcon,
                    label: "Address",
                    value: "25 Medical District St.\nCairo, Egypt 11311",
                  },
                  { icon: PhoneIcon, label: "Phone", value: "+20 2 2123 4567" },
                  {
                    icon: EnvelopeIcon,
                    label: "Email",
                    value: "orders@hermed.com",
                  },
                  {
                    icon: ClockIcon,
                    label: "Hours",
                    value: "Sun–Thu: 9:00 AM – 6:00 PM\nFri–Sat: Closed",
                  },
                ].map((c) => {
                  const Icon = c.icon;
                  return (
                    <div
                      key={c.label}
                      className="flex gap-3 items-start bg-white rounded-xl p-4 shadow-card"
                    >
                      <Icon className="w-6 h-6 text-brand-600 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-0.5">
                          {c.label}
                        </p>
                        <p className="text-sm text-slate-700 whitespace-pre-line">
                          {c.value}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-brand-50 border border-brand-200 rounded-2xl p-5">
              <h3 className="font-semibold text-brand-800 mb-2 inline-flex items-center gap-2">
                <ChatBubbleLeftRightIcon className="w-5 h-5" /> Order Support
              </h3>
              <p className="text-sm text-brand-700/80">
                For urgent order inquiries, call our direct line or WhatsApp us
                at <strong>+20 10 1234 5678</strong> for immediate assistance.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            {sent ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckBadgeIcon className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="font-display text-2xl font-bold text-slate-800 mb-2">
                  Message Sent!
                </h3>
                <p className="text-slate-500 mb-6">
                  Thanks for reaching out. We'll get back to you within 24
                  hours.
                </p>
                <button
                  onClick={() => {
                    setSent(false);
                    setForm({ name: "", email: "", subject: "", message: "" });
                  }}
                  className="btn-secondary"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl shadow-card p-8"
              >
                <h2 className="font-display text-xl font-bold text-slate-900 mb-6">
                  Send Us a Message
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Dr. Ahmed Hassan"
                      value={form.name}
                      onChange={(e) => {
                        setForm({ ...form, name: e.target.value });
                        setErrors({ ...errors, name: "" });
                      }}
                      className={`input ${errors.name ? "border-red-400" : ""}`}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      placeholder="dr.ahmed@clinic.com"
                      value={form.email}
                      onChange={(e) => {
                        setForm({ ...form, email: e.target.value });
                        setErrors({ ...errors, email: "" });
                      }}
                      className={`input ${errors.email ? "border-red-400" : ""}`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mb-5">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Subject
                  </label>
                  <select
                    value={form.subject}
                    onChange={(e) =>
                      setForm({ ...form, subject: e.target.value })
                    }
                    className="input"
                  >
                    <option value="">Select a subject...</option>
                    <option>Product Inquiry</option>
                    <option>Order Status</option>
                    <option>Returns & Refunds</option>
                    <option>Bulk / Clinic Pricing</option>
                    <option>Technical Support</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Message *
                  </label>
                  <textarea
                    rows={5}
                    placeholder="How can we help you?"
                    value={form.message}
                    onChange={(e) => {
                      setForm({ ...form, message: e.target.value });
                      setErrors({ ...errors, message: "" });
                    }}
                    className={`input resize-none ${errors.message ? "border-red-400" : ""}`}
                  />
                  {errors.message && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.message}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  className="btn-primary text-base px-8 py-3"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
