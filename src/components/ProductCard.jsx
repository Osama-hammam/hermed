import { Link } from "react-router-dom";
import { useCartStore, useWishlistStore } from "../store";
import {
  HeartIcon as HeartOutline,
  ShoppingBagIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";

const badgeColors = {
  "Best Seller": "bg-amber-100 text-amber-700",
  New: "bg-emerald-100 text-emerald-700",
  Sale: "bg-red-100 text-red-600",
  Premium: "bg-brand-100 text-brand-700",
  Professional: "bg-violet-100 text-violet-700",
};

export default function ProductCard({ product }) {
  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const isWishlisted = useWishlistStore((s) =>
    s.items.some((item) => item.id === product.id),
  );

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : null;

  return (
    <div className="card group flex flex-col">
      {/* Image */}
      <Link
        to={`/product/${product.slug}`}
        className="relative block overflow-hidden bg-slate-50 aspect-[4/3]"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(product.name)}&background=dbeafe&color=1d4ed8&size=400`;
          }}
        />
        {product.badge && (
          <span
            className={`absolute top-3 left-3 badge ${badgeColors[product.badge] || "bg-slate-100 text-slate-700"}`}
          >
            {product.badge}
          </span>
        )}
        <button
          type="button"
          onClick={() => toggleWishlist(product)}
          className="absolute top-3 right-3 w-11 h-11 rounded-2xl bg-white/95 text-slate-700 border border-slate-200 shadow-sm flex items-center justify-center hover:bg-brand-50 transition-colors"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          {isWishlisted ? (
            <HeartSolid className="w-5 h-5 text-brand-600" />
          ) : (
            <HeartOutline className="w-5 h-5" />
          )}
        </button>
        {discount && (
          <span className="absolute top-3 right-16 badge bg-red-500 text-white">
            -{discount}%
          </span>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="badge bg-slate-800 text-white text-sm">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-col flex-1 p-4">
        <p className="text-xs text-brand-500 font-medium uppercase tracking-wide mb-1">
          {product.category}
        </p>
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-semibold text-slate-800 text-sm leading-snug mb-2 hover:text-brand-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Stars */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <StarIcon
                key={s}
                className={`w-3.5 h-3.5 ${s <= Math.round(product.rating) ? "text-amber-400" : "text-slate-200"}`}
              />
            ))}
          </div>
          <span className="text-xs text-slate-400">({product.reviews})</span>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <div>
            <span className="font-bold text-slate-900 text-lg">
              EGP {product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-slate-400 line-through ml-1.5">
                EGP {product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <button
            onClick={() => product.inStock && addItem(product)}
            disabled={!product.inStock}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
              product.inStock
                ? "bg-brand-500 hover:bg-brand-600 text-white shadow-sm hover:shadow-md active:scale-95"
                : "bg-slate-100 text-slate-300 cursor-not-allowed"
            }`}
            title="Add to cart"
          >
            <ShoppingBagIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
