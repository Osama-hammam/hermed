import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../store";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

export default function Checkout() {
  const [contentRef, contentVisible] = useScrollAnimation();

  const { items, clearCart } = useCartStore();
  const navigate = useNavigate();
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "Egypt",
    notes: "",
    paymentMethod: "cod",
  });

  const shipping = total > 0 && form.city ? 100 : 0;
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      e.email = "Valid email required";
    if (!form.phone.trim()) e.phone = "Required";
    if (!form.address.trim()) e.address = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (form.paymentMethod === "card") {
      if (!form.cardNumber?.trim()) e.cardNumber = "Required";
      if (!form.expiry?.trim()) e.expiry = "Required";
      if (!form.cvv?.trim()) e.cvv = "Required";
    }
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setSubmitted(true);
    clearCart();
  };

  if (submitted) {
    return (
      <div className="page-enter max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-emerald-500"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="font-display text-3xl font-bold text-slate-900 mb-3">
          Order Placed!
        </h2>
        <p className="text-slate-500 text-lg mb-2">
          Thank you, {form.firstName}!
        </p>
        <p className="text-slate-400 text-sm mb-8 max-w-md mx-auto">
          Your order has been received and is being processed. You'll receive a
          confirmation email at{" "}
          <strong className="text-slate-600">{form.email}</strong> shortly.
        </p>
        <div className="bg-slate-50 rounded-2xl p-5 mb-8 text-sm text-slate-600 inline-block">
          Order Reference:{" "}
          <strong className="text-brand-600 font-mono">
            ORD-{Date.now().toString().slice(-6)}
          </strong>
        </div>
        <div className="flex gap-4 justify-center">
          <Link
            to="/shop"
            className="btn-primary hover:opacity-90 active:scale-[0.98] transition-all"
          >
            Continue Shopping
          </Link>
          <Link
            to="/"
            className="btn-secondary hover:bg-slate-100 active:scale-[0.98] transition-all"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="font-display text-2xl font-bold text-slate-800 mb-3">
          Your cart is empty
        </h2>
        <Link
          to="/shop"
          className="btn-primary hover:opacity-90 active:scale-[0.98] transition-all"
        >
          Shop Now
        </Link>
      </div>
    );
  }

  const Field = ({ label, name, type = "text", half, placeholder }) => (
    <div className={half ? "col-span-1" : "col-span-2"}>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={form[name]}
        onChange={(e) => {
          setForm({ ...form, [name]: e.target.value });
          setErrors({ ...errors, [name]: "" });
        }}
        className={`input ${errors[name] ? "border-red-400 ring-1 ring-red-300" : ""}`}
      />
      {errors[name] && (
        <p className="text-red-500 text-xs mt-1">{errors[name]}</p>
      )}
    </div>
  );

  return (
    <div
      ref={contentRef}
      className={`page-enter max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-all duration-700 ${contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
    >
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-slate-900">
          Checkout
        </h1>
        <div className="flex items-center gap-2 mt-3 text-sm">
          <Link to="/cart" className="text-brand-500 hover:underline">
            Cart
          </Link>
          <svg
            className="w-4 h-4 text-slate-300"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
          <span className="text-slate-700 font-medium">Checkout</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Contact */}
            <div
              className={`bg-white rounded-2xl shadow-card p-6 transition-all ${contentVisible ? "animate-fade-in-up opacity-100" : "opacity-0"}`}
              style={{ animationDelay: "100ms", animationFillMode: "forwards" }}
            >
              <h2 className="font-semibold text-slate-800 text-lg mb-5 flex items-center gap-2">
                <span className="w-6 h-6 bg-brand-500 text-white rounded-full text-xs flex items-center justify-center font-bold">
                  1
                </span>
                Contact Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="First Name"
                  name="firstName"
                  half
                  placeholder="Ahmed"
                />
                <Field
                  label="Last Name"
                  name="lastName"
                  half
                  placeholder="Hassan"
                />
                <Field
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="ahmed@clinic.com"
                />
                <Field
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  half
                  placeholder="+20 2 1234 5678"
                />
              </div>
            </div>

            {/* Shipping */}
            <div
              className={`bg-white rounded-2xl shadow-card p-6 transition-all ${contentVisible ? "animate-fade-in-up opacity-100" : "opacity-0"}`}
              style={{ animationDelay: "200ms", animationFillMode: "forwards" }}
            >
              <h2 className="font-semibold text-slate-800 text-lg mb-5 flex items-center gap-2">
                <span className="w-6 h-6 bg-brand-500 text-white rounded-full text-xs flex items-center justify-center font-bold">
                  2
                </span>
                Shipping Address
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="Street Address"
                  name="address"
                  placeholder="25 Medical District St."
                />
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    City
                  </label>
                  <select
                    value={form.city}
                    onChange={(e) => {
                      setForm({ ...form, city: e.target.value });
                      setErrors({ ...errors, city: "" });
                    }}
                    className={`input ${errors.city ? "border-red-400 ring-1 ring-red-300" : ""}`}
                  >
                    <option value="">Select a city...</option>
                    {[
                      "Cairo",
                      "Alexandria",
                      "Giza",
                      "Shubra El Kheima",
                      "Port Said",
                      "Suez",
                      "Luxor",
                      "Mansoura",
                      "Tanta",
                      "Asyut",
                      "Ismailia",
                      "Fayyum",
                      "Zagazig",
                      "Aswan",
                      "Damietta",
                      "Damanhur",
                      "Minya",
                      "Beni Suef",
                      "Qena",
                      "Sohag",
                      "6th of October",
                      "Shibin El Kom",
                      "Banha",
                      "Kafr El Sheikh",
                      "Mallawi",
                      "10th of Ramadan",
                    ]
                      .sort()
                      .map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                  </select>
                  {errors.city && (
                    <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                  )}
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Country
                  </label>
                  <input
                    type="text"
                    value="Egypt"
                    disabled
                    className="input bg-slate-50 cursor-not-allowed"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Order Notes{" "}
                    <span className="text-slate-400 font-normal">
                      (optional)
                    </span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Special instructions for your order..."
                    value={form.notes}
                    onChange={(e) =>
                      setForm({ ...form, notes: e.target.value })
                    }
                    className="input resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div
              className={`bg-white rounded-2xl shadow-card p-6 transition-all ${contentVisible ? "animate-fade-in-up opacity-100" : "opacity-0"}`}
              style={{ animationDelay: "300ms", animationFillMode: "forwards" }}
            >
              <h2 className="font-semibold text-slate-800 text-lg mb-5 flex items-center gap-2">
                <span className="w-6 h-6 bg-brand-500 text-white rounded-full text-xs flex items-center justify-center font-bold">
                  3
                </span>
                Payment Method
              </h2>
              <div className="space-y-4">
                <label
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${form.paymentMethod === "cod" ? "border-brand-500 bg-brand-50" : "border-slate-100 hover:border-slate-200"}`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={form.paymentMethod === "cod"}
                    onChange={(e) =>
                      setForm({ ...form, paymentMethod: e.target.value })
                    }
                    className="w-4 h-4 text-brand-600 focus:ring-brand-500"
                  />
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Cash on Delivery
                    </p>
                    <p className="text-xs text-slate-500">
                      Pay with cash when your order is delivered.
                    </p>
                  </div>
                </label>
                <label
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${form.paymentMethod === "card" ? "border-brand-500 bg-brand-50" : "border-slate-100 hover:border-slate-200"}`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={form.paymentMethod === "card"}
                    onChange={(e) =>
                      setForm({ ...form, paymentMethod: e.target.value })
                    }
                    className="w-4 h-4 text-brand-600 focus:ring-brand-500"
                  />
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Credit / Debit Card
                    </p>
                    <p className="text-xs text-slate-500">
                      Securely pay using Visa, Mastercard, or Meeza.
                    </p>
                  </div>
                </label>
              </div>

              {form.paymentMethod === "card" && (
                <div className="mt-6 grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl animate-fade-in">
                  <Field
                    label="Card Number"
                    name="cardNumber"
                    placeholder="0000 0000 0000 0000"
                  />
                  <Field
                    label="Expiry Date"
                    name="expiry"
                    placeholder="MM/YY"
                    half
                  />
                  <Field label="CVV" name="cvv" placeholder="123" half />
                </div>
              )}
            </div>

            {/* Payment note */}
            <div className="bg-brand-50 border border-brand-200 rounded-2xl p-5">
              <div className="flex gap-3 items-start">
                <div>
                  <p className="text-sm font-semibold text-brand-700">
                    {form.paymentMethod === "cod"
                      ? "Payment on Delivery"
                      : "Secure Card Payment"}
                  </p>
                  <p className="text-xs text-brand-600/80 mt-0.5">
                    {form.paymentMethod === "cod"
                      ? "Our team will contact you to confirm the order. Please have the exact amount ready upon delivery."
                      : "Your transaction is encrypted and secure. We do not store your full card details on our servers."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div
            className={`${contentVisible ? "animate-fade-in-up opacity-100" : "opacity-0"}`}
            style={{ animationDelay: "200ms", animationFillMode: "forwards" }}
          >
            <div className="bg-white rounded-2xl shadow-card p-6 sticky top-24">
              <h2 className="font-semibold text-slate-800 text-lg mb-5">
                Order Summary
              </h2>
              <div className="space-y-3 mb-5 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 items-center">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-50 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=dbeafe&color=1d4ed8&size=48`;
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base md:text-sm font-bold text-black truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-slate-400">Qty: {item.qty}</p>
                    </div>
                    <span className="text-sm font-semibold text-slate-800">
                      EGP {(item.price * item.qty).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-100 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>EGP {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span
                    className={
                      !form.city
                        ? "text-slate-400"
                        : "font-medium text-slate-800"
                    }
                  >
                    {form.city ? `EGP ${shipping.toFixed(2)}` : "Select city"}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-base text-slate-900 pt-2 border-t border-slate-100">
                  <span>Total</span>
                  <span>EGP {(total + shipping).toFixed(2)}</span>
                </div>
              </div>
              <button
                type="submit"
                className="btn-primary w-full text-center text-base py-3.5 rounded-xl mt-5 hover:opacity-90 active:scale-[0.98] transition-all shadow-md hover:shadow-lg"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
