import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useProductStore, useCartStore, useWishlistStore } from "../store";
import {
  HeartIcon as HeartOutline,
  StarIcon,
  CheckIcon,
  TruckIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import ProductCard from "../components/ProductCard";
import ImageLightbox from "../components/ImageLightbox";
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
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="mx-auto w-20 h-20 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-5">
          <XMarkIcon className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Product Not Found
        </h2>
        <p className="text-slate-500 mb-6">
          This product may have been removed or the URL is incorrect.
        </p>
        <Link to="/shop" className="btn-primary">
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
    <>
    <div
      ref={detailRef}
      className={`page-enter max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-all duration-1000 ${detailVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
    >
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-400 mb-8 flex-wrap">
        <Link to="/" className="hover:text-brand-600 transition-colors">
          Home
        </Link>
        <span className="text-slate-300">/</span>
        <Link to="/shop" className="hover:text-brand-600 transition-colors">
          Shop
        </Link>
        <span className="text-slate-300">/</span>
        <span className="text-slate-600 capitalize">{product.category}</span>
        <span className="text-slate-300">/</span>
        <span className="text-slate-600 truncate max-w-xs">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        {/* ── Image Gallery ── */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          {/* Main Image */}
          <div
            onClick={() => setLightboxOpen(true)}
            className="relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl lg:rounded-3xl overflow-hidden aspect-square sm:aspect-[4/3] lg:aspect-square mb-3 lg:mb-4 group cursor-zoom-in"
          >
            <img
              src={images[imgIdx]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(product.name)}&background=dbeafe&color=1d4ed8&size=600`;
              }}
            />

            {/* Zoom hint */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100 shadow-lg">
                <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                </svg>
              </div>
            </div>

            {/* Discount badge */}
            {discount && (
              <div className="absolute top-3 left-3 lg:top-4 lg:left-4 bg-rose-500 text-white text-[10px] lg:text-xs font-bold px-2.5 lg:px-3 py-1 lg:py-1.5 rounded-lg lg:rounded-xl shadow-lg shadow-rose-500/30">
                -{discount}% OFF
              </div>
            )}

            {/* Image counter */}
            {images.length > 1 && (
              <div className="absolute bottom-3 right-3 lg:bottom-4 lg:right-4 bg-black/50 backdrop-blur-sm text-white text-[10px] lg:text-xs font-medium px-2.5 lg:px-3 py-1 lg:py-1.5 rounded-lg">
                {imgIdx + 1} / {images.length}
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setImgIdx(idx)}
                  className={`flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 rounded-lg lg:rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                    imgIdx === idx
                      ? "border-brand-500 shadow-lg shadow-brand-500/20 scale-105"
                      : "border-transparent opacity-60 hover:opacity-100 hover:border-slate-200"
                  }`}
                >
                  <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Product Info ── */}
        <div>
          {/* Tags */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="text-[10px] font-bold text-brand-600 bg-brand-50 px-3 py-1.5 rounded-lg capitalize tracking-wide">
              {product.category}
            </span>
            {product.badge && (
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg">
                {product.badge}
              </span>
            )}
            {product.inStock && product.stockCount > 0 && product.stockCount < 10 && (
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg animate-pulse">
                Only {product.stockCount} left!
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 lg:mb-4 leading-tight">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <StarIcon
                  key={s}
                  className={`w-5 h-5 ${s <= Math.round(product.rating) ? "text-amber-400 fill-amber-400" : "text-slate-200"}`}
                />
              ))}
            </div>
            <span className="font-bold text-slate-700">{product.rating}</span>
            <span className="text-slate-400 text-sm">
              ({product.reviews} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 sm:gap-3 mb-5 lg:mb-6 pb-5 lg:pb-6 border-b border-slate-100 flex-wrap">
            <span className="text-3xl sm:text-4xl font-bold text-slate-900">
              EGP {product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-base sm:text-xl text-slate-400 line-through">
                  EGP {product.originalPrice.toFixed(2)}
                </span>
                <span className="badge bg-rose-100 text-rose-600 font-bold">
                  Save {discount}%
                </span>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-slate-600 leading-relaxed mb-6 text-base">
            {product.description}
          </p>

          {/* Features */}
          {product.features?.length > 0 && (
            <div className="mb-6 p-5 bg-slate-50 rounded-2xl">
              <h3 className="font-bold text-slate-800 mb-3 text-sm">
                Key Features
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {product.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-slate-600">
                    <div className="w-5 h-5 bg-brand-100 rounded-md flex items-center justify-center flex-shrink-0">
                      <CheckIcon className="w-3 h-3 text-brand-600" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* SKU */}
          {product.sku && (
            <p className="text-xs text-slate-400 mb-6">
              SKU: <span className="font-mono text-slate-500">{product.sku}</span>
            </p>
          )}

          {/* Add to Cart / Out of Stock */}
          {product.inStock && product.stockCount > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                {/* Quantity Selector */}
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-10 h-11 sm:w-11 sm:h-12 text-slate-500 hover:bg-slate-50 transition-colors font-bold text-lg"
                  >
                    −
                  </button>
                  <span className="w-10 sm:w-12 text-center font-bold text-slate-800 text-sm">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty(Math.min(product.stockCount, qty + 1))}
                    className="w-10 h-11 sm:w-11 sm:h-12 text-slate-500 hover:bg-slate-50 transition-colors font-bold text-lg"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-3 sm:py-3.5 rounded-xl font-bold transition-all duration-300 text-sm sm:text-base shadow-sm flex items-center justify-center gap-2 ${
                    added
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                      : "bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white hover:shadow-lg hover:shadow-brand-500/25 active:scale-[0.98]"
                  }`}
                >
                  {added ? "✓ Added!" : "Add to Cart"}
                </button>

                {/* Wishlist */}
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex-shrink-0 flex items-center justify-center transition-all duration-300 ${
                    isWishlisted
                      ? "bg-brand-600 text-white shadow-lg shadow-brand-600/25"
                      : "border border-slate-200 text-slate-400 hover:text-brand-600 hover:border-brand-200"
                  }`}
                >
                  {isWishlisted ? (
                    <HeartSolid className="w-5 h-5" />
                  ) : (
                    <HeartOutline className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium">
                Sorry, this product is currently out of stock
              </div>
              <button
                disabled
                className="w-full py-3.5 rounded-xl font-bold bg-slate-100 text-slate-400 cursor-not-allowed"
              >
                Out of Stock
              </button>
            </div>
          )}

          {/* Trust Badges */}
          <div className="mt-6 lg:mt-8 grid grid-cols-3 gap-2 sm:gap-4">
            {[
              { icon: TruckIcon, label: "Free Shipping", sub: "Over EGP 300" },
              { icon: ArrowPathIcon, label: "Easy Returns", sub: "30-day policy" },
              { icon: ShieldCheckIcon, label: "Warranty", sub: "Certified" },
            ].map((badge) => (
              <div key={badge.label} className="text-center p-2.5 sm:p-3 rounded-xl bg-slate-50">
                <badge.icon className="w-4 h-4 sm:w-5 sm:h-5 text-brand-500 mx-auto mb-1" />
                <div className="text-[10px] sm:text-xs font-bold text-slate-700 leading-tight">{badge.label}</div>
                <div className="text-[9px] sm:text-[10px] text-slate-400 hidden sm:block">{badge.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Related Products ── */}
      {related.length > 0 && (
        <section
          ref={relatedRef}
          className={`mt-24 transition-all duration-1000 ${relatedVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="section-label">You May Also Like</span>
              <h2 className="section-title mt-2">Related Products</h2>
            </div>
            <Link to="/shop" className="btn-secondary text-sm hidden sm:inline-flex">
              View All →
            </Link>
          </div>
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

    {/* Lightbox */}
    {lightboxOpen && (
      <ImageLightbox
        images={images}
        initialIndex={imgIdx}
        onClose={() => setLightboxOpen(false)}
      />
    )}
    </>
  );
}
