import { useState } from "react";
import { orders } from "../../data/products";

const STATUS_COLORS = {
  Delivered: "bg-emerald-100 text-emerald-700",
  Processing: "bg-blue-100 text-blue-700",
  Shipped: "bg-amber-100 text-amber-700",
  Pending: "bg-slate-100 text-slate-600",
};

const STATUSES = ["All", "Pending", "Processing", "Shipped", "Delivered"];

export default function AdminOrders() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = orders.filter((o) => {
    const matchStatus = filter === "All" || o.status === filter;
    const matchSearch = o.customer.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const revenue = filtered.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-slate-900">Orders</h1>
        <p className="text-slate-500 text-sm mt-1">Manage and track all customer orders</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATUSES.slice(1).map((status) => {
          const count = orders.filter((o) => o.status === status).length;
          return (
            <button key={status} onClick={() => setFilter(status === filter ? "All" : status)}
              className={`bg-white rounded-xl p-4 shadow-card text-left hover:shadow-card-hover transition-shadow border-2 ${
                filter === status ? "border-brand-300" : "border-transparent"
              }`}>
              <div className={`badge mb-2 ${STATUS_COLORS[status]}`}>{status}</div>
              <div className="font-display text-2xl font-bold text-slate-900">{count}</div>
            </button>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-md">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input type="text" placeholder="Search orders or customers..." value={search}
            onChange={(e) => setSearch(e.target.value)} className="input pl-10" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {STATUSES.map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                filter === s ? "bg-brand-500 text-white" : "bg-white text-slate-600 hover:bg-slate-50 shadow-sm border border-slate-200"
              }`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left px-5 py-3.5 font-medium text-slate-500">Order ID</th>
                <th className="text-left px-5 py-3.5 font-medium text-slate-500">Customer</th>
                <th className="text-left px-5 py-3.5 font-medium text-slate-500">Date</th>
                <th className="text-left px-5 py-3.5 font-medium text-slate-500">Items</th>
                <th className="text-left px-5 py-3.5 font-medium text-slate-500">Total</th>
                <th className="text-left px-5 py-3.5 font-medium text-slate-500">Status</th>
                <th className="text-left px-5 py-3.5 font-medium text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <span className="font-mono text-xs font-semibold text-brand-600 bg-brand-50 px-2 py-1 rounded-lg">{order.id}</span>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-medium text-slate-800">{order.customer}</p>
                  </td>
                  <td className="px-5 py-4 text-slate-500">{order.date}</td>
                  <td className="px-5 py-4 text-slate-600">{order.items} item{order.items !== 1 ? "s" : ""}</td>
                  <td className="px-5 py-4">
                    <span className="font-semibold text-slate-900">${order.total.toFixed(2)}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`badge ${STATUS_COLORS[order.status]}`}>{order.status}</span>
                  </td>
                  <td className="px-5 py-4">
                    <button className="text-xs font-medium text-brand-500 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-lg transition-colors">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-400">No orders match your search.</div>
          )}
        </div>
        {filtered.length > 0 && (
          <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-sm">
            <span className="text-slate-500">Showing {filtered.length} order{filtered.length !== 1 ? "s" : ""}</span>
            <span className="font-semibold text-slate-800">Total: <span className="text-brand-600">${revenue.toFixed(2)}</span></span>
          </div>
        )}
      </div>
    </div>
  );
}
