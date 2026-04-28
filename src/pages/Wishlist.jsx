import { Link } from "react-router-dom";
import { useWishlistStore } from "../store";
import { HeartIcon } from "@heroicons/react/24/outline";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import ProductCard from "../components/ProductCard";

export default function Wishlist() {
  const [contentRef, contentVisible] = useScrollAnimation();

  const items = useWishlistStore((state) => state.items);

  if (items.length === 0) {
    return (
      <div className="page-enter max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="mx-auto w-20 h-20 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center mb-6">
          <HeartIcon className="w-10 h-10" />
        </div>
        <h2 className="font-display text-2xl font-bold text-slate-800 mb-3">
          Your wishlist is empty
        </h2>
        <p className="text-slate-500 mb-8 max-w-xl mx-auto">
          Save your favorite dental supplies to revisit them later or move them
          straight to your cart.
        </p>
        <Link
          to="/shop"
          className="btn-primary text-base hover:opacity-90 active:scale-[0.98] transition-all"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div
      ref={contentRef}
      className={`page-enter max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-all duration-700 ${contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-sm text-brand-500 uppercase tracking-[0.2em] mb-2">
            Saved for later
          </p>
          <h1 className="font-display text-3xl font-bold text-slate-900">
            Wishlist
          </h1>
          <p className="text-slate-500 text-sm mt-2">
            You have {items.length} saved product{items.length !== 1 ? "s" : ""}
            .
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item, index) => (
          <div
            key={item.id}
            className={`${contentVisible ? "animate-fade-in-up" : "opacity-0"}`}
            style={{
              animationDelay: `${index * 100}ms`,
              animationFillMode: "forwards",
            }}
          >
            <ProductCard product={item} />
          </div>
        ))}
      </div>
    </div>
  );
}
