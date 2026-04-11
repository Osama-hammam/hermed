import { Link } from "react-router-dom";
import { useCartStore } from "../store";
import { ShoppingBagIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

export default function Cart() {
  const [contentRef, contentVisible] = useScrollAnimation();

  const { items, removeItem, updateQty } = useCartStore();
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shipping = total === 0 ? 0 : 100;

  if (items.length === 0) {
    return (
      <div className="page-enter max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="mx-auto w-24 h-24 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center mb-6">
          <ShoppingBagIcon className="w-12 h-12" />
        </div>
        <h2 className="font-display text-2xl font-bold text-slate-800 mb-3">
          Your cart is empty
        </h2>
        <p className="text-slate-500 mb-8 max-w-sm mx-auto">
          Browse our catalog of professional dental supplies and add items to
          get started.
        </p>
        <Link to="/shop" className="btn-primary text-base">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div
      ref={contentRef}
      className={`page-enter max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-all duration-700 ${contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
    >
      <h1 className="font-display text-3xl font-bold text-slate-900 mb-8">
        Shopping Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-card p-5 flex gap-5"
            >
              <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-50 flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=dbeafe&color=1d4ed8&size=96`;
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <p className="text-xs text-brand-500 font-medium capitalize mb-0.5">
                      {item.category}
                    </p>
                    <Link
                      to={`/product/${item.slug}`}
                      className="font-semibold text-slate-800 hover:text-brand-600 transition-colors line-clamp-2 text-sm"
                    >
                      {item.name}
                    </Link>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-slate-300 hover:text-red-400 transition-colors flex-shrink-0 p-1"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => updateQty(item.id, item.qty - 1)}
                      className="w-8 h-8 text-slate-600 hover:bg-slate-50 transition-colors font-bold"
                    >
                      −
                    </button>
                    <span className="w-10 text-center text-sm font-semibold text-slate-800">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateQty(item.id, item.qty + 1)}
                      className="w-8 h-8 text-slate-600 hover:bg-slate-50 transition-colors font-bold"
                    >
                      +
                    </button>
                  </div>
                  <span className="font-bold text-slate-900">
                    EGP {(item.price * item.qty).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div>
          <div className="bg-white rounded-2xl shadow-card p-6 sticky top-24">
            <h2 className="font-semibold text-slate-800 text-lg mb-5">
              Order Summary
            </h2>
            <div className="space-y-3 text-sm mb-5">
              <div className="flex justify-between text-slate-600">
                <span>
                  Subtotal ({items.reduce((n, i) => n + i.qty, 0)} items)
                </span>
                <span className="font-medium text-slate-800">
                  EGP {total.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span
                  className={
                    shipping === 0
                      ? "text-emerald-600 font-medium"
                      : "font-medium text-slate-800"
                  }
                >
                    EGP {shipping.toFixed(2)}
                </span>
              </div>
              <div className="border-t border-slate-100 pt-3 flex justify-between font-bold text-base text-slate-900">
                <span>Total</span>
                <span>EGP {(total + shipping).toFixed(2)}</span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="btn-primary w-full text-center block text-base py-3.5 rounded-xl"
            >
              Proceed to Checkout
            </Link>
            <Link
              to="/shop"
              className="btn-ghost w-full text-center block mt-3 text-sm"
            >
              Continue Shopping
            </Link>

            {/* Promo code */}
            <div className="mt-5 pt-5 border-t border-slate-100">
              <p className="text-xs text-slate-500 mb-2">Promo Code</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="HERMED15"
                  className="input text-sm flex-1"
                />
                <button className="btn-secondary text-sm px-4 py-2">
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
