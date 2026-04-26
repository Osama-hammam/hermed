import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useProductStore, useCartStore, useWishlistStore } from "../store";
import {
  HeartIcon as HeartOutline,
  StarIcon,
  CheckIcon,
  TruckIcon,
  ArrowPathIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import ProductCard from "../components/ProductCard";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

export default function ProductDetail() {
  const [detailRef, detailVisible] = useScrollAnimation();
  const [relatedRef, relatedVisible] = useScrollAnimation();

  const { slug } = useParams();
  const products = useProductStore((s) => s.products);
  const product = products.find(
    (p) => p.slug?.toLowerCase() === slug?.toLowerCase(),
  );
  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const isWishlisted = useWishlistStore((s) =>
    s.items.some((item) => item.id === product?.id),
  );
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="mx-auto w-20 h-20 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center mb-4">
          <XMarkIcon className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Product Not Found
        </h2>
        <p className="text-slate-500 mb-6">
          This product may have been removed or the URL is incorrect.
        </p>
        <Link
          to="/shop"
          className="btn-primary hover:opacity-90 active:scale-[0.98] transition-all"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  const images = product.images?.length ? product.images : [product.image];
  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : null;

  return (
    <div
      ref={detailRef}
      className={`page-enter max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-all duration-1000 ${detailVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-20 scale-95"}`}
    >
      <nav className="flex items-center gap-2 text-sm text-slate-400 mb-8 flex-wrap">
        <Link to="/" className="hover:text-brand-600 transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-brand-600 transition-colors">
          Shop
        </Link>
        <span>/</span>
        <span className="text-slate-600 capitalize">{product.category}</span>
        <span>/</span>
        <span className="text-slate-600 truncate max-w-xs">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
        <div>
          <div className="bg-slate-50 rounded-3xl overflow-hidden aspect-square mb-4">
            <img
              src={images[imgIdx]}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(product.name)}&background=dbeafe&color=1d4ed8&size=600`;
              }}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="text-xs font-medium text-brand-500 bg-brand-50 px-2.5 py-1 rounded-full capitalize">
              {product.category}
            </span>
            {product.badge && (
              <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                {product.badge}
              </span>
            )}
            {product.inStock && product.stockCount > 0 && (
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-full ${product.stockCount < 10 ? "text-amber-700 bg-amber-50" : "text-slate-600 bg-slate-100"}`}
              >
                {product.stockCount} items left in stock
              </span>
            )}
            {(!product.inStock || product.stockCount <= 0) && (
              <span className="text-xs font-medium text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
                Currently Out of Stock
              </span>
            )}
            <button
              type="button"
              onClick={() => toggleWishlist(product)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                isWishlisted
                  ? "bg-brand-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {isWishlisted ? (
                <HeartSolid className="w-4 h-4" />
              ) : (
                <HeartOutline className="w-4 h-4" />
              )}
              {isWishlisted ? "Saved" : "Add to Wishlist"}
            </button>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mb-4 leading-snug">
            {product.name}
          </h1>

          <div className="flex items-center gap-2 mb-5">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <StarIcon
                  key={s}
                  className={`w-5 h-5 ${s <= Math.round(product.rating) ? "text-amber-400" : "text-slate-200"}`}
                />
              ))}
            </div>
            <span className="font-semibold text-slate-700">
              {product.rating}
            </span>
            <span className="text-slate-400 text-sm">
              ({product.reviews} reviews)
            </span>
          </div>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-4xl font-bold text-slate-900">
              EGP {product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-xl text-slate-400 line-through">
                  EGP {product.originalPrice.toFixed(2)}
                </span>
                <span className="badge bg-red-100 text-red-600">
                  Save {discount}%
                </span>
              </>
            )}
          </div>

          <p className="text-slate-600 leading-relaxed mb-6 text-base">
            {product.description}
          </p>

          {product.features?.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-slate-800 mb-3">
                Key Features
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-sm text-slate-600"
                  >
                    <CheckIcon className="w-4 h-4 text-brand-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="text-xs text-slate-400 mb-8">
            SKU: <span className="font-mono text-slate-600">{product.sku}</span>
          </p>

          {product.inStock ? (
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-10 h-12 text-slate-600 hover:bg-slate-50 transition-colors font-bold text-lg"
                >
                  −
                </button>
                <span className="w-12 text-center font-semibold text-slate-800">
                  {qty}
                </span>
                <button
                  onClick={() => setQty(Math.min(product.stockCount, qty + 1))}
                  className="w-10 h-12 text-slate-600 hover:bg-slate-50 transition-colors font-bold text-lg"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className={`flex-1 py-3.5 rounded-xl font-semibold transition-all text-base shadow-sm ${added ? "bg-emerald-500 text-white" : "bg-brand-500 hover:bg-brand-600 text-white hover:shadow-md active:scale-[0.98]"}`}
              >
                {added ? "✓ Added to Cart!" : "Add to Cart"}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium">
                Sorry, this product is currently out of stock
              </div>
              <button
                disabled
                className="w-full py-3.5 rounded-xl font-semibold bg-slate-200 text-slate-500 cursor-not-allowed uppercase tracking-wider"
              >
                Out of Stock
              </button>
            </div>
          )}

          <div className="mt-6 flex gap-6 text-sm text-slate-500 flex-wrap">
            <span className="inline-flex items-center gap-2">
              <TruckIcon className="w-4 h-4 text-brand-500" />
              Free shipping over EGP 300
            </span>
            <span className="inline-flex items-center gap-2">
              <ArrowPathIcon className="w-4 h-4 text-brand-500" />
              30-day returns
            </span>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section
          ref={relatedRef}
          className={`mt-20 transition-all duration-1000 ${relatedVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-20 scale-95"}`}
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-8">
            Related Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {related.map((p, index) => (
              <div
                key={p.id}
                className={`${relatedVisible ? "animate-fade-in-up" : "opacity-0"}`}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: "forwards",
                }}
              >
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
