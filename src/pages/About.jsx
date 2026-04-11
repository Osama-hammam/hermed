import {
  ShieldCheckIcon,
  BoltIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

export default function About() {
  const [heroRef, heroVisible] = useScrollAnimation();
  const [storyRef, storyVisible] = useScrollAnimation();
  const [valuesRef, valuesVisible] = useScrollAnimation();
  const [teamRef, teamVisible] = useScrollAnimation();
  const [partnersRef, partnersVisible] = useScrollAnimation();

  const team = [
    {
      name: "Dr. Karim Mansour",
      role: "CEO & Founder",
      img: "https://ui-avatars.com/api/?name=Karim+Mansour&background=dbeafe&color=1d4ed8&size=200",
    },
    {
      name: "Sara Al-Rashid",
      role: "Head of Procurement",
      img: "https://ui-avatars.com/api/?name=Sara+Rashid&background=fce7f3&color=be185d&size=200",
    },
    {
      name: "Ahmed Nour",
      role: "Sales Director",
      img: "https://ui-avatars.com/api/?name=Ahmed+Nour&background=d1fae5&color=065f46&size=200",
    },
    {
      name: "Layla Hassan",
      role: "Customer Success",
      img: "https://ui-avatars.com/api/?name=Layla+Hassan&background=fef3c7&color=92400e&size=200",
    },
  ];

  return (
    <div className="page-enter">
      {/* Hero */}
      <section
        ref={heroRef}
        className={`bg-gradient-to-br from-brand-900 via-brand-700 to-brand-600 py-24 px-4 text-center relative overflow-hidden transition-all duration-700 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      >
        {/* Background Image Overlay */}
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=1600&q=80"
            className="w-full h-full object-cover"
            alt=""
          />
        </div>
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%">
            <defs>
              <pattern
                id="dots"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="20" cy="20" r="1.5" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>
        <div className="relative max-w-3xl mx-auto">
          <span className="badge bg-white/10 text-white border border-white/20 mb-4">
            About HERMED
          </span>
          <h1 className="font-display text-4xl lg:text-5xl font-bold text-white mb-5 mt-3">
            Supplying Excellence to
            <br />
            Dental Professionals
          </h1>
          <p className="text-brand-100/80 text-lg leading-relaxed max-w-2xl mx-auto">
            HERMED has been the trusted dental supply partner for over 2,000
            clinics across the Middle East. We believe every dentist deserves
            access to world-class instruments and materials.
          </p>
        </div>
      </section>

      {/* Story */}
      <section
        ref={storyRef}
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 transition-all duration-700 ${storyVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-brand-500 text-sm font-medium tracking-widest uppercase">
              Our Story
            </span>
            <h2 className="font-display text-3xl font-bold text-slate-900 mt-2 mb-6">
              Founded by Dentists, For Dentists
            </h2>
            <div className="space-y-4 text-slate-600 leading-relaxed">
              <p>
                HERMED was founded in 2010 by Dr. Karim Mansour, a practicing
                prosthodontist who grew frustrated with unreliable supply chains
                and counterfeit products infiltrating the Egyptian dental
                market.
              </p>
              <p>
                His vision was simple: build a supply company that prioritizes
                authenticity, speed, and clinical expertise. Every product on
                our platform is sourced directly from certified manufacturers
                and verified through our quality control process.
              </p>
              <p>
                Today, HERMED serves dental clinics, hospitals, and universities
                across Egypt, Saudi Arabia, UAE, and across the MENA region —
                fulfilling over 50,000 orders annually with a 99.2% on-time
                delivery rate.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { n: "2,000+", l: "Clinics Served" },
              { n: "500+", l: "Products Listed" },
              { n: "15", l: "Years in Business" },
              { n: "99.2%", l: "On-Time Delivery" },
            ].map((s) => (
              <div
                key={s.l}
                className="bg-white rounded-2xl p-6 shadow-card text-center border border-slate-50"
              >
                <div className="font-display text-3xl font-bold text-brand-600 mb-1">
                  {s.n}
                </div>
                <div className="text-sm text-slate-500">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section
        ref={valuesRef}
        className={`bg-surface py-20 transition-all duration-700 ${valuesVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-brand-500 text-sm font-medium tracking-widest uppercase">
              What We Stand For
            </span>
            <h2 className="font-display text-3xl font-bold text-slate-900 mt-2">
              Our Core Values
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: ShieldCheckIcon,
                title: "Authenticity Guaranteed",
                desc: "Every product is sourced directly from certified manufacturers. We never compromise on quality or certification.",
              },
              {
                icon: BoltIcon,
                title: "Speed & Reliability",
                desc: "Same-day dispatch for orders placed before 2 PM. Real-time tracking for every shipment.",
              },
              {
                icon: UserGroupIcon,
                title: "Clinical Expertise",
                desc: "Our team includes dental professionals who understand your needs and can advise on the right products.",
              },
              {
                icon: CurrencyDollarIcon,
                title: "Competitive Pricing",
                desc: "By working directly with manufacturers, we pass the savings on to you. No hidden fees, ever.",
              },
              {
                icon: MapPinIcon,
                title: "Regional Reach",
                desc: "We ship across MENA with local warehouses in Egypt, Saudi Arabia, and UAE for faster delivery.",
              },
              {
                icon: ArrowPathIcon,
                title: "Sustainable Practices",
                desc: "We prioritize eco-friendly packaging and work with suppliers who share our commitment to sustainability.",
              },
            ].map((v) => {
              const ValueIcon = v.icon;
              return (
                <div
                  key={v.title}
                  className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-shadow border border-slate-50"
                >
                  <ValueIcon className="w-6 h-6 text-brand-600 block mb-4" />
                  <h3 className="font-semibold text-slate-800 mb-2">
                    {v.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section
        ref={teamRef}
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 transition-all duration-700 ${teamVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      >
        <div className="text-center mb-12">
          <span className="text-brand-500 text-sm font-medium tracking-widest uppercase">
            The People Behind HERMED
          </span>
          <h2 className="font-display text-3xl font-bold text-slate-900 mt-2">
            Meet Our Team
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((m) => (
            <div key={m.name} className="text-center group">
              <div className="w-24 h-24 rounded-2xl overflow-hidden mx-auto mb-4 shadow-card group-hover:shadow-card-hover transition-shadow">
                <img
                  src={m.img}
                  alt={m.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-semibold text-slate-800 text-sm">{m.name}</h3>
              <p className="text-xs text-brand-500 mt-0.5">{m.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Partners */}
      <section
        ref={partnersRef}
        className={`bg-surface py-16 transition-all duration-700 ${partnersVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-400 text-sm font-medium tracking-widest uppercase mb-8">
            Authorized Distributor For
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {[
              "KaVo",
              "NSK",
              "3M Dental",
              "Dentsply Sirona",
              "Hu-Friedy",
              "Ivoclar",
              "Ormco",
              "Midmark",
            ].map((b) => (
              <div
                key={b}
                className="bg-white border border-slate-100 rounded-xl px-6 py-3 shadow-sm hover:shadow-card transition-shadow"
              >
                <span className="font-semibold text-slate-600 text-sm">
                  {b}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
