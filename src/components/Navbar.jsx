import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  UserIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import {
  useCartStore,
  useAuthStore,
  useWishlistStore,
  useProductStore,
} from "../store";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const products = useProductStore((s) => s.products);
  const cartCount = useCartStore((s) =>
    s.items.reduce((acc, i) => acc + i.qty, 0),
  );
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const isLoggedIn = !!user;
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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/80 backdrop-blur-2xl shadow-lg shadow-slate-900/5 border-b border-slate-100/50"
            : "bg-white"
        }`}
      >
        {/* Top strip */}
        <div className="bg-gradient-to-r from-brand-800 via-brand-700 to-brand-600 text-white text-xs text-center py-2 px-4 font-medium tracking-wide">
          ✨ Free shipping on orders over EGP 300 &nbsp;·&nbsp; Professional dental
          supplies since 2010
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-1.5 md:gap-2.5 group focus:outline-none"
            >
              <img
                src="/hermed.jpeg"
                alt="HERMED"
                className="h-7 md:h-9 w-auto object-contain transition-opacity group-hover:opacity-80"
                onError={(e) =>
                  (e.target.src =
                    "https://ui-avatars.com/api/?name=HERMED&background=1d4ed8&color=fff")
                }
              />
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
                className="p-2 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all focus:outline-none"
              >
                <MagnifyingGlassIcon className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="relative p-2 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all focus:outline-none"
              >
                <HeartIcon className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-brand-500 text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center min-w-[18px] px-1">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative p-2 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all focus:outline-none"
              >
                <ShoppingBagIcon className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-brand-500 text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center min-w-[18px] px-1">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* User Account */}
              {isLoggedIn ? (
                <div className="relative group">
                  <button className="p-2 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all focus:outline-none">
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
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-sm text-brand-600 hover:bg-brand-50 font-medium"
                      >
                        ⚙️ Admin Dashboard
                      </Link>
                    )}
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
                  className="p-2 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all focus:outline-none"
                >
                  <UserIcon className="w-5 h-5" />
                </Link>
              )}

              {/* Mobile menu */}
              <button
                className="md:hidden p-2 text-slate-500 hover:text-brand-600 rounded-lg transition-all focus:outline-none"
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
            {isLoggedIn && (
              <NavLink
                to="/account"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-2.5 rounded-lg text-sm font-medium ${
                    isActive
                      ? "text-brand-600 bg-brand-50"
                      : "text-slate-600 hover:bg-slate-50"
                  }`
                }
              >
                My Account
              </NavLink>
            )}
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
