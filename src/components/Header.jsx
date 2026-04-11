import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuthStore, useCartStore, useWishlistStore } from "../store";
import {
  ShoppingBagIcon,
  HeartIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const isLoggedIn = !!user;
  const cartCount = useCartStore((s) =>
    s.items.reduce((acc, i) => acc + i.qty, 0),
  );
  const wishlistCount = useWishlistStore((s) => s.items.length);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 bg-brand-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
              <span className="text-white text-xl font-bold font-display">
                H
              </span>
            </div>
            <span className="font-display text-2xl font-bold text-slate-900 tracking-tight">
              HERMED
            </span>
          </Link>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-10">
            <Link
              to="/shop"
              className="text-sm font-semibold text-slate-600 hover:text-brand-600 transition-colors"
            >
              Shop
            </Link>
            <Link
              to="/about"
              className="text-sm font-semibold text-slate-600 hover:text-brand-600 transition-colors"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-sm font-semibold text-slate-600 hover:text-brand-600 transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Wishlist Link with Count */}
            <Link
              to="/wishlist"
              className="relative p-2 text-slate-400 hover:text-brand-600 transition-colors"
            >
              <HeartIcon className="w-6 h-6" />
              {wishlistCount > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-brand-600 text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full ring-2 ring-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Link with Count */}
            <Link
              to="/cart"
              className="relative p-2 text-slate-400 hover:text-brand-600 transition-colors"
            >
              <ShoppingBagIcon className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-brand-600 text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full ring-2 ring-white animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>

            <div className="h-6 w-[1px] bg-slate-100 mx-1 hidden sm:block" />

            {/* User Profile / Login */}
            {isLoggedIn && user ? (
              <Link
                to="/account"
                className="flex items-center gap-2 p-1 pr-3 bg-slate-50 hover:bg-brand-50 rounded-full transition-all border border-slate-100 group"
              >
                <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center group-hover:bg-brand-200 transition-colors">
                  <UserIcon className="w-4 h-4 text-brand-600" />
                </div>
                <span className="text-sm font-bold text-slate-700 group-hover:text-brand-600 truncate max-w-[120px]">
                  {user.name}
                </span>
              </Link>
            ) : (
              <Link to="/login" className="btn-primary py-2 px-5 text-sm">
                Sign In
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all"
            >
              {isMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-2 animate-fade-in shadow-lg">
          {[
            { to: "/", label: "Home" },
            { to: "/shop", label: "Shop" },
            { to: "/about", label: "About" },
            { to: "/contact", label: "Contact" },
          ].map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                  isActive
                    ? "bg-brand-50 text-brand-600"
                    : "text-slate-600 hover:bg-slate-50"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          {isLoggedIn && (
            <NavLink
              to="/account"
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                  isActive
                    ? "bg-brand-50 text-brand-600"
                    : "text-slate-600 hover:bg-slate-50"
                }`
              }
            >
              My Profile
            </NavLink>
          )}
        </div>
      )}
    </header>
  );
}
