import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { categories } from "../data/products";
import {
  SparklesIcon,
  WrenchIcon,
  ScissorsIcon,
  BeakerIcon,
  PhotoIcon,
  ShieldCheckIcon,
  Squares2X2Icon,
  TruckIcon,
  CheckBadgeIcon,
  ChatBubbleLeftRightIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { useProductStore } from "../store";
import ProductCard from "../components/ProductCard";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

const categoryIcons = {
  handpieces: WrenchIcon,
  instruments: ScissorsIcon,
  materials: BeakerIcon,
  imaging: PhotoIcon,
  hygiene: ShieldCheckIcon,
  chairs: Squares2X2Icon,
  orthodontics: SparklesIcon,
  endodontics: ShieldCheckIcon,
};

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1600&q=80",
    "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=1600&q=80",
    "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1600&q=80",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const products = useProductStore((s) => s.products);

  // VERIFY SINGLE SOURCE OF TRUTH
  console.log("PRODUCT STORE:", useProductStore.getState().products);

  const featured = [...products].sort((a, b) => b.id - a.id).slice(0, 4);

  const [heroRef, heroVisible] = useScrollAnimation();
  const [categoriesRef, categoriesVisible] = useScrollAnimation();
  const [featuresRef, featuresVisible] = useScrollAnimation();
  const [featuredRef, featuredVisible] = useScrollAnimation();
  const [ctaRef, ctaVisible] = useScrollAnimation();

  return (
    <div className="page-enter">
      {/* ── HERO ── */}
      <section
        ref={heroRef}
        className={`relative min-h-[88vh] flex items-center overflow-hidden bg-brand-900 ${heroVisible ? "animate-fade-in-up" : "opacity-0"}`}
      >
        {/* Hero Slider Background */}
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${currentSlide === idx ? "opacity-30" : "opacity-0"}`}
          >
            <img src={slide} className="w-full h-full object-cover" alt="" />
            <div className="absolute inset-0 bg-gradient-to-br from-brand-900/80 via-brand-800/40 to-transparent" />
          </div>
        ))}

        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="grid"
                width="60"
                height="60"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="30" cy="30" r="1.5" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Decorative blob */}
        <div className="absolute right-0 top-0 w-[600px] h-[600px] bg-brand-400/20 rounded-full blur-3xl -translate-y-1/4 translate-x-1/4 pointer-events-none" />
        <div className="absolute left-0 bottom-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-3xl translate-y-1/4 -translate-x-1/4 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div
              className={`inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/80 text-xs font-medium px-3 py-1.5 rounded-full mb-6 border border-white/20 transition-all duration-1000 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              Trusted by 2,000+ dental professionals
            </div>
            <h1
              className={`font-bold text-4xl md:text-6xl mb-4 whitespace-pre-line text-white leading-snug transition-all duration-1000 delay-100 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
              Delivering Dental{"\n"}
              <span className="text-brand-200">Excellence</span>
            </h1>
            <p
              className={`text-brand-100/80 text-lg leading-relaxed mb-10 max-w-md transition-all duration-1000 delay-200 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
              Premium dental instruments, equipment, and supplies for
              professionals who demand the best
            </p>
            <div
              className={`flex flex-wrap gap-4 transition-all duration-1000 delay-300 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
              <Link
                to="/shop"
                className="bg-white text-brand-700 hover:bg-brand-50 font-semibold px-8 py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
              >
                Shop Now
              </Link>
              <Link
                to="/about"
                className="border border-white/30 text-white hover:bg-white/10 font-medium px-8 py-3.5 rounded-xl transition-all backdrop-blur-sm"
              >
                Learn More
              </Link>
            </div>

            {/* Stats */}
            <div
              className={`mt-14 flex gap-10 transition-all duration-1000 delay-500 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
              {[
                ["2,000+", "Clinics Served"],
                ["500+", "Products"],
                ["15+", "Years Experience"],
              ].map(([n, l]) => (
                <div key={l}>
                  <div className="text-2xl font-bold text-white">{n}</div>
                  <div className="text-xs text-brand-200/70 mt-0.5">{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Slider Indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${currentSlide === idx ? "bg-white w-8" : "bg-white/30 w-4 hover:bg-white/50"}`}
              />
            ))}
          </div>

          {/* Hero image card */}
          <div
            className={`hidden lg:flex justify-end transition-all duration-1000 delay-300 ${heroVisible ? "opacity-100 translate-x-0 scale-100" : "opacity-0 translate-x-12 scale-95"}`}
          >
            <div className="relative">
              <div className="w-[460px] h-[460px] rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=900&q=90"
                  alt="Dental clinic"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Float card */}
              <div className="absolute -bottom-4 -left-8 bg-white rounded-2xl p-4 shadow-xl border border-slate-100 flex items-center gap-3 w-52">
                <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center text-brand-700">
                  <SparklesIcon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">New Arrivals</div>
                  <div className="text-sm font-semibold text-slate-800">
                    12 Products
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-xl border border-slate-100">
                <div className="flex gap-0.5 mb-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <SparklesIcon
                      key={s}
                      className="w-3.5 h-3.5 text-amber-400"
                    />
                  ))}
                </div>
                <div className="text-xs font-semibold text-slate-800">
                  4.9 / 5 Rating
                </div>
                <div className="text-[10px] text-slate-400">1,200+ reviews</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section
        ref={categoriesRef}
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 ${categoriesVisible ? "animate-fade-in-up" : "opacity-0"}`}
      >
        <div className="text-center mb-12">
          <span className="text-brand-500 text-sm font-medium tracking-widest uppercase">
            Browse By
          </span>
          <h2 className="text-3xl font-bold text-slate-900 mt-2">
            Product Categories
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat, index) => {
            const CategoryIcon = categoryIcons[cat.id] || Squares2X2Icon;
            return (
              <Link
                key={cat.id}
                to={`/shop?category=${cat.id}`}
                className={`group bg-white border border-slate-100 rounded-2xl p-5 flex flex-col items-center text-center hover:border-brand-200 hover:shadow-card-hover transition-all duration-500 ${categoriesVisible ? "animate-fade-in-up opacity-100" : "opacity-0"}`}
                style={{
                  animationDelay: `${(index % 4) * 100}ms`,
                  animationFillMode: "forwards",
                }}
              >
                <CategoryIcon className="w-10 h-10 text-brand-500 mb-3" />
                <h3 className="font-semibold text-slate-800 text-sm mb-1 group-hover:text-brand-600 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {cat.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── FEATURED ── */}
      <section
        ref={featuredRef}
        className={`bg-surface py-20 ${featuredVisible ? "animate-fade-in-up" : "opacity-0"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <span className="text-brand-500 text-sm font-medium tracking-widest uppercase">
                Hand-Picked
              </span>
              <h2 className="text-3xl font-bold text-slate-900 mt-2">
                Featured Products
              </h2>
            </div>
            <Link to="/shop" className="btn-secondary hidden sm:inline-flex">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((p, index) => (
              <div
                key={p.id}
                className={`${featuredVisible ? "animate-fade-in-up" : "opacity-0"}`}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: "forwards",
                }}
              >
                <ProductCard product={p} />
              </div>
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link to="/shop" className="btn-secondary">
              View All Products →
            </Link>
          </div>
        </div>
      </section>

      {/* ── PROMO BANNER ── */}
      <section
        ref={ctaRef}
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 ${ctaVisible ? "animate-fade-in-up" : "opacity-0"}`}
      >
        <div className="bg-gradient-to-r from-brand-700 to-brand-500 rounded-3xl p-10 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-10 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3 pointer-events-none" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white text-xs font-medium px-3 py-1.5 rounded-full mb-4 border border-white/20">
              <SparklesIcon className="w-4 h-4" /> Limited Time Offer
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">
              Save 15% on Your First Order
            </h2>
            <p className="text-brand-100/80 text-base max-w-md">
              New to HERMED? Use code{" "}
              <strong className="text-white">HERMED15</strong> at checkout for
              15% off your entire first order. Valid for all new accounts.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Link
              to="/shop"
              className="bg-white text-brand-700 hover:bg-brand-50 font-bold px-10 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-[0.98] text-base inline-block"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHY HERMED ── */}
      <section ref={featuresRef} className="bg-surface py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: TruckIcon,
                title: "Fast Delivery",
                desc: "Same-day dispatch for orders before 2 PM",
              },
              {
                icon: CheckBadgeIcon,
                title: "Certified Products",
                desc: "FDA, CE & ISO certified supplies only",
              },
              {
                icon: ChatBubbleLeftRightIcon,
                title: "Expert Support",
                desc: "Dental professionals on call for advice",
              },
              {
                icon: ArrowPathIcon,
                title: "Easy Returns",
                desc: "30-day hassle-free return policy",
              },
            ].map((f, index) => {
              const FeatureIcon = f.icon;
              return (
                <div
                  key={f.title}
                  className={`bg-white rounded-2xl p-6 flex items-start gap-4 border border-slate-100 hover:shadow-card transition-all duration-500 ${featuresVisible ? "animate-fade-in-up opacity-100" : "opacity-0"}`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: "forwards",
                  }}
                >
                  <FeatureIcon className="w-6 h-6 text-brand-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">
                      {f.title}
                    </h3>
                    <p className="text-sm text-slate-500">{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
