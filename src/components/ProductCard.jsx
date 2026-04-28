import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useCartStore, useWishlistStore } from "../store";
import {
  HeartIcon as HeartOutline,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";

export default function ProductCard({ product }) {
  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const isWishlisted = useWishlistStore((state) =>
    state.items.some((item) => item.id === product.id),
  );

  const [adding, setAdding] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!product.inStock || product.stockCount <= 0) return;
    setAdding(true);
    addItem(product);
    toast.success(`${product.name} added to cart`);
    setTimeout(() => setAdding(false), 1200);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    toggleWishlist(product);
    if (isWishlisted) {
      toast('Removed from wishlist', { icon: '💔' });
    } else {
      toast.success('Added to wishlist');
    }
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="group bg-white rounded-2xl border border-slate-100/80 overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1.5 transition-all duration-500">
      <Link
        to={`/product/${product.slug}`}
        className="block relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover img-zoom"
          onError={(e) => {
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(product.name)}&background=dbeafe&color=1d4ed8&size=400`;
          }}
        />

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start z-20">
          {product.badge && (
            <span className="bg-brand-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-lg shadow-brand-600/30">
              {product.badge}
            </span>
          )}
          {discount && (
            <span className="bg-rose-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-lg shadow-rose-500/30">
              -{discount}%
            </span>
          )}
        </div>

        {/* Out of Stock Overlay */}
        {(!product.inStock || product.stockCount <= 0) && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center z-10">
            <span className="bg-slate-900/90 text-white text-[10px] font-bold uppercase tracking-[0.15em] px-4 py-2 rounded-xl">
              Out of Stock
            </span>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-3 right-3 z-20 p-2 rounded-xl transition-all duration-300 ${
            isWishlisted
              ? "bg-brand-600 text-white shadow-lg shadow-brand-600/30 scale-110"
              : "bg-white/90 backdrop-blur-sm text-slate-400 hover:text-brand-600 hover:bg-white shadow-md opacity-0 group-hover:opacity-100"
          }`}
        >
          {isWishlisted ? (
            <HeartSolid className="w-4 h-4" />
          ) : (
            <HeartOutline className="w-4 h-4" />
          )}
        </button>

        {/* Quick Add Button (appears on hover) */}
        {product.inStock && product.stockCount > 0 && (
          <button
            onClick={handleAddToCart}
            className={`absolute bottom-3 left-3 right-3 z-20 py-2.5 rounded-xl font-semibold text-xs tracking-wide transition-all duration-500 flex items-center justify-center gap-2 ${
              adding
                ? "bg-emerald-500 text-white translate-y-0 opacity-100"
                : "bg-white/95 backdrop-blur-sm text-slate-800 hover:bg-brand-600 hover:text-white translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 shadow-lg"
            }`}
          >
            {adding ? (
              <>✓ Added</>
            ) : (
              <><ShoppingBagIcon className="w-4 h-4" /> Quick Add</>
            )}
          </button>
        )}
      </Link>

      <div className="p-4">
        {/* Category */}
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-1.5">
          {product.category}
        </p>

        {/* Name */}
        <Link
          to={`/product/${product.slug}`}
          className="block font-semibold text-slate-800 hover:text-brand-600 transition-colors mb-3 line-clamp-2 text-sm leading-snug"
        >
          {product.name}
        </Link>

        {/* Stock indicator */}
        {product.inStock && product.stockCount > 0 && product.stockCount < 10 && (
          <div className="mb-3">
            <div className="flex items-center justify-between text-[10px] mb-1">
              <span className="text-amber-600 font-bold">Only {product.stockCount} left</span>
            </div>
            <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-rose-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (product.stockCount / 20) * 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-slate-900">
              EGP {product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-slate-400 line-through ml-1.5">
                EGP {product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
