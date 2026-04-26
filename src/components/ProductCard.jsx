import { useState } from "react";
import { Link } from "react-router-dom";
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
    setTimeout(() => setAdding(false), 1000);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    toggleWishlist(product);
  };

  return (
    <div className="group bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <Link
        to={`/product/${product.slug}`}
        className="block relative aspect-square overflow-hidden bg-slate-50"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(product.name)}&background=dbeafe&color=1d4ed8&size=300`;
          }}
        />

        {/* Badges Container */}
        <div className="absolute top-4 left-4 flex flex-col gap-1.5 items-start z-20">
          {product.badge && (
            <span className="bg-white/90 backdrop-blur-sm text-brand-600 text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
              {product.badge}
            </span>
          )}

          {product.inStock && product.stockCount > 0 && (
            <span className={`text-[10px] font-bold px-2 py-1 rounded-full shadow-sm ${product.stockCount < 10 ? 'bg-amber-500 text-white animate-pulse' : 'bg-white/90 text-slate-700'}`}>
              {product.stockCount < 10 ? `Only ${product.stockCount} left` : `${product.stockCount} in stock`}
            </span>
          )}
        </div>

        {/* Out of Stock Overlay */}
        {(!product.inStock || product.stockCount <= 0) && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-10">
            <span className="bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-lg">
              Out of Stock
            </span>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-4 right-4 p-2 rounded-full shadow-md transition-all duration-300 ${
            isWishlisted
              ? "bg-brand-600 text-white scale-110"
              : "bg-white text-slate-400 hover:text-brand-600"
          }`}
        >
          {isWishlisted ? (
            <HeartSolid className="w-4 h-4" />
          ) : (
            <HeartOutline className="w-4 h-4" />
          )}
        </button>
      </Link>

      <div className="p-5">
        <Link
          to={`/product/${product.slug}`}
          className="block font-bold text-black hover:text-brand-600 transition-colors mb-1 line-clamp-2 text-lg md:text-base"
        >
          {product.name}
        </Link>
        <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
          {product.category}
        </p>

        <div className="flex items-center justify-between mt-4">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-slate-900 leading-none">
              EGP {product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-slate-400 line-through mt-1">
                EGP {product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {product.inStock && product.stockCount > 0 && (
            <button
              onClick={handleAddToCart}
              className={`p-2.5 rounded-xl transition-all duration-300 flex items-center justify-center ${
                adding
                  ? "bg-emerald-500 text-white scale-110 shadow-lg shadow-emerald-200"
                  : "bg-brand-50 text-brand-600 hover:bg-brand-600 hover:text-white"
              }`}
            >
              {adding ? (
                <span className="text-[10px] font-bold px-1">✓</span>
              ) : (
                <ShoppingBagIcon className="w-5 h-5" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
