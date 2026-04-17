import { useState } from "react";
import { NavLink, Outlet, useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../store";

const navItems = [
  { to: "/admin", icon: "📊", label: "Dashboard", end: true },
  { to: "/admin/products", icon: "📦", label: "Products" },
  { to: "/admin/orders", icon: "🧾", label: "Orders" },
];

export default function AdminLayout() {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside
        className={`w-64 bg-brand-900 flex flex-col fixed inset-y-0 left-0 z-40 transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Logo */}
        <div className="px-6 py-5 border-b border-brand-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-brand-400 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold font-display">
                H
              </span>
            </div>
            <div>
              <span className="font-display font-bold text-white text-sm">
                HERMED
              </span>
              <div className="text-[9px] text-brand-400 tracking-widest uppercase">
                Admin Panel
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-brand-500 text-white"
                    : "text-brand-300 hover:bg-brand-800 hover:text-white"
                }`
              }
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-brand-800 space-y-1">
          <NavLink
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-brand-300 hover:bg-brand-800 hover:text-white transition-all"
          >
            <span>🏪</span> View Store
          </NavLink>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-brand-300 hover:bg-red-800/50 hover:text-red-300 transition-all"
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        {/* Top Header for Mobile */}
        <header className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <Link to="/admin" className="font-display font-bold text-brand-600">
            HERMED ADMIN
          </Link>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg"
          >
            {isSidebarOpen ? "✕" : "☰"}
          </button>
        </header>

        <Outlet />
      </main>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
