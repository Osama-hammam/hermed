import { Link } from "react-router-dom";
import { useCartStore, useWishlistStore } from "../store";
import {
  HeartIcon,
  ShoppingBagIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

export default function Wishlist() {
  const [contentRef, contentVisible] = useScrollAnimation();

  const items = useWishlistStore((state) => state.items);
  const removeItem = useWishlistStore((state) => state.removeItem);
  const addItem = useCartStore((state) => state.addItem);

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
        <Link to="/shop" className="btn-primary text-base">
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

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl shadow-card p-5 grid grid-cols-1 lg:grid-cols-[110px_minmax(0,1fr)_auto] gap-4 items-center"
          >
            <div className="w-full h-28 rounded-3xl overflow-hidden bg-slate-50">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=dbeafe&color=1d4ed8&size=200`;
                }}
              />
            </div>
            <div>
              <p className="text-xs text-brand-500 font-medium uppercase tracking-wide mb-1">
                {item.category}
              </p>
              <Link
                to={`/product/${item.slug}`}
                className="font-semibold text-slate-900 hover:text-brand-600 transition-colors text-sm line-clamp-2"
              >
                {item.name}
              </Link>
              <p className="mt-3 font-bold text-slate-900">
                EGP {item.price.toFixed(2)}
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:items-end">
              <button
                onClick={() => addItem(item)}
                className="btn-primary inline-flex items-center justify-center gap-2 px-4 py-2 text-sm"
              >
                <ShoppingBagIcon className="w-4 h-4" />
                Add to Cart
              </button>
              <button
                onClick={() => removeItem(item.id)}
                className="btn-secondary inline-flex items-center justify-center gap-2 px-4 py-2 text-sm"
              >
                <XMarkIcon className="w-4 h-4" />
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
