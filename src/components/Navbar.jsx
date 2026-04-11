import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useCartStore, useAuthStore } from "../store";
import { products } from "../data/products";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const count = useCartStore((s) => s.count);
  const { user, isLoggedIn, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (query.trim().length > 0) {
      const filtered = products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.description.toLowerCase().includes(query.toLowerCase()) ||
            p.category.toLowerCase().includes(query.toLowerCase()),
        )
        .slice(0, 5); // Limit to 5 suggestions
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setQuery("");
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (product) => {
    navigate(`/product/${product.slug}`);
    setSearchOpen(false);
    setQuery("");
    setSuggestions([]);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/shop", label: "Shop" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white/95 backdrop-blur-sm shadow-nav" : "bg-white"
        }`}
      >
        {/* Top strip */}
        <div className="bg-brand-700 text-white text-xs text-center py-1.5 px-4">
          Free shipping on orders over EGP 300 &nbsp;·&nbsp; Professional dental
          supplies since 2010
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center shadow-sm group-hover:bg-brand-700 transition-colors">
                <span className="text-white text-base font-bold font-display">
                  H
                </span>
              </div>
              <div>
                <span className="font-display font-bold text-xl text-brand-700 tracking-tight">
                  HERMED
                </span>
                <div className="text-[9px] text-slate-400 font-medium tracking-widest uppercase -mt-0.5">
                  Dental Supplies
                </div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === "/"}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? "text-brand-600 bg-brand-50"
                        : "text-slate-600 hover:text-brand-600 hover:bg-slate-50"
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all"
              >
                <MagnifyingGlassIcon className="w-5 h-5" />
              </button>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative p-2 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all"
              >
                <ShoppingBagIcon className="w-5 h-5" />
                {count > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-brand-500 text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center min-w-[18px] px-1">
                    {count}
                  </span>
                )}
              </Link>

              {/* User Account */}
              {isLoggedIn ? (
                <div className="relative group">
                  <button className="p-2 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all">
                    <UserIcon className="w-5 h-5" />
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <div className="font-medium text-slate-800 text-sm">
                        {user?.name}
                      </div>
                      <div className="text-xs text-slate-500">
                        {user?.email}
                      </div>
                    </div>
                    <Link
                      to="/account"
                      className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-brand-600"
                    >
                      My Account
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="p-2 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all"
                >
                  <UserIcon className="w-5 h-5" />
                </Link>
              )}

              {/* Mobile menu */}
              <button
                className="md:hidden p-2 text-slate-500 hover:text-brand-600 rounded-lg transition-all"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? (
                  <XMarkIcon className="w-5 h-5" />
                ) : (
                  <Bars3Icon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-2.5 rounded-lg text-sm font-medium ${
                    isActive
                      ? "text-brand-600 bg-brand-50"
                      : "text-slate-600 hover:bg-slate-50"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>
        )}
      </header>

      {/* Search overlay */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
          onClick={(e) => e.target === e.currentTarget && setSearchOpen(false)}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl">
            <form onSubmit={handleSearch} className="flex gap-3 p-4">
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search dental supplies..."
                className="flex-1 input text-base"
              />
              <button type="submit" className="btn-primary whitespace-nowrap">
                Search
              </button>
            </form>

            {/* Search suggestions */}
            {suggestions.length > 0 && (
              <div className="border-t border-slate-100 max-h-80 overflow-y-auto">
                {suggestions.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleSuggestionClick(product)}
                    className="w-full px-4 py-3 text-left hover:bg-slate-50 border-b border-slate-50 last:border-b-0 flex items-center gap-3 group"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-slate-800 truncate group-hover:text-brand-600">
                        {product.name}
                      </div>
                      <div className="text-sm text-slate-500 truncate">
                        {product.description}
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-brand-600">
                      EGP {product.price}
                    </div>
                  </button>
                ))}
                {suggestions.length >= 5 && (
                  <div className="px-4 py-3 border-t border-slate-100">
                    <button
                      onClick={handleSearch}
                      className="text-sm text-brand-600 hover:text-brand-700 font-medium"
                    >
                      View all results for "{query}" →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
