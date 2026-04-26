import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useProductStore, useAuthStore } from "../../store";

const statusColors = {
  Delivered: "bg-emerald-100 text-emerald-700",
  Processing: "bg-blue-100 text-blue-700",
  Shipped: "bg-amber-100 text-amber-700",
  Pending: "bg-slate-100 text-slate-600",
};

export default function AdminDashboard() {
  const products = useProductStore((s) => s.products);
  const users = useAuthStore((s) => s.users) || [];

  // Dynamically aggregate orders from all users in the store
  const allOrders = useMemo(() => {
    const list = [];
    users.forEach((user) => {
      if (user.orders) {
        user.orders.forEach((order) => {
          list.push({ ...order, customer: user.name });
        });
      }
    });
    return list.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [users]);

  const totalRevenue = allOrders.reduce((sum, o) => sum + o.total, 0);
  const totalStock = products.reduce((sum, p) => sum + (p.stockCount || 0), 0);

  const stats = [
    {
      label: "Total Products",
      value: products.length,
      icon: "📦",
      color: "bg-blue-50 text-blue-600",
      link: "/admin/products",
    },
    {
      label: "Total Orders",
      value: allOrders.length,
      icon: "🧾",
      color: "bg-emerald-50 text-emerald-600",
      link: "/admin/orders",
    },
    {
      label: "Total Revenue",
      value: `EGP ${totalRevenue.toLocaleString()}`,
      icon: "💰",
      color: "bg-amber-50 text-amber-600",
      link: "#",
    },
    {
      label: "Total Units",
      value: totalStock.toLocaleString(),
      icon: "✅",
      color: "bg-violet-50 text-violet-600",
      link: "/admin/products",
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-slate-900">
          Dashboard
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Welcome back, Admin. Here's what's happening with HERMED.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {stats.map((s) => (
          <Link
            key={s.label}
            to={s.link}
            className="bg-white rounded-2xl shadow-card p-5 hover:shadow-card-hover transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${s.color}`}
              >
                {s.icon}
              </div>
            </div>
            <div className="font-display text-2xl font-bold text-slate-900">
              {s.value}
            </div>
            <div className="text-sm text-slate-500 mt-0.5">{s.label}</div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-slate-800">Recent Orders</h2>
            <Link
              to="/admin/orders"
              className="text-sm text-brand-500 hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {allOrders.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm">
                No orders yet.
              </div>
            ) : (
              allOrders.slice(0, 4).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      {order.customer}
                    </p>
                    <p className="text-xs text-slate-400">
                      {order.id} · {order.date}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">
                      EGP {order.total.toFixed(2)}
                    </p>
                    <span
                      className={`badge text-xs ${statusColors[order.status]}`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Low Stock */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-slate-800">Product Overview</h2>
            <Link
              to="/admin/products"
              className="text-sm text-brand-500 hover:underline"
            >
              Manage
            </Link>
          </div>
          <div className="space-y-3">
            {products.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm">
                No products in inventory.
              </div>
            ) : (
              products.slice(0, 5).map((p) => (
                <div key={p.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-50 flex-shrink-0">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=dbeafe&color=1d4ed8&size=40`;
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">
                      {p.name}
                    </p>
                    <p className="text-xs text-slate-400 capitalize">
                      {p.category}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold text-slate-900">
                      EGP {p.price.toFixed(2)}
                    </p>
                    <p
                      className={`text-[10px] font-bold uppercase tracking-tight ${p.stockCount < 10 ? "text-amber-500" : "text-slate-400"}`}
                    >
                      {p.stockCount} Units
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
