import React, { useState, useMemo } from "react";
import { useAuthStore } from "../../store";
import {
  ShoppingBagIcon,
  UserIcon,
  ClockIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

export default function AdminOrders() {
  // Aggregates all orders from all users in the mock store
  const users = useAuthStore((s) => s.users) || [];
  const updateOrderStatus = useAuthStore((s) => s.updateOrderStatus);

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const allOrders = useMemo(() => {
    const orders = [];
    users.forEach((user) => {
      if (user.orders) {
        user.orders.forEach((order) => {
          orders.push({
            ...order,
            customerName: user.name,
            customerEmail: user.email,
          });
        });
      }
    });
    return orders.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [users]);

  const filteredOrders = useMemo(() => {
    return allOrders.filter((order) => {
      const matchesFilter =
        filter === "all" || order.status.toLowerCase() === filter.toLowerCase();
      const matchesSearch =
        order.id.toLowerCase().includes(search.toLowerCase()) ||
        order.customerName.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [allOrders, filter, search]);

  const handleStatusUpdate = (orderId, newStatus) => {
    if (updateOrderStatus) {
      updateOrderStatus(orderId, newStatus);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Order Management
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage and track all customer orders
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white rounded-xl shadow-sm border border-slate-100 p-1">
          {["all", "processing", "delivered"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                filter === f
                  ? "bg-brand-600 text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6 relative max-w-md">
        <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by Order ID or Customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider w-10"></th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Order Details
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    No orders found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <React.Fragment key={order.id}>
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleExpand(order.id)}
                          className="text-slate-400 hover:text-brand-600 transition-colors"
                        >
                          {expandedId === order.id ? (
                            <ChevronUpIcon className="w-5 h-5" />
                          ) : (
                            <ChevronDownIcon className="w-5 h-5" />
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-mono text-sm font-bold text-brand-600">
                            {order.id}
                          </span>
                          <span className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                            <ClockIcon className="w-3 h-3" /> {order.date}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                            <UserIcon className="w-4 h-4" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-slate-800">
                              {order.customerName}
                            </span>
                            <span className="text-xs text-slate-400">
                              {order.customerEmail}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            order.status === "Delivered"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-blue-50 text-blue-600"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900">
                        EGP {order.total.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {order.status === "Processing" && (
                          <button
                            onClick={() =>
                              handleStatusUpdate(order.id, "Delivered")
                            }
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 text-brand-600 hover:bg-brand-600 hover:text-white rounded-lg text-xs font-bold transition-all shadow-sm"
                          >
                            <CheckCircleIcon className="w-4 h-4" /> Mark
                            Delivered
                          </button>
                        )}
                      </td>
                    </tr>
                    {expandedId === order.id && (
                      <tr className="bg-slate-50/50 border-t border-slate-100">
                        <td colSpan="6" className="px-6 py-4">
                          <div className="space-y-3">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                              Order Items
                            </p>
                            {order.items.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center justify-between text-sm bg-white p-3 rounded-xl border border-slate-100 shadow-sm"
                              >
                                <div className="flex items-center gap-4">
                                  <img
                                    src={item.image}
                                    alt=""
                                    className="w-10 h-10 object-cover rounded-lg bg-slate-50"
                                  />
                                  <div>
                                    <p className="font-bold text-slate-800">
                                      {item.name}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                      Qty: {item.qty} × EGP{" "}
                                      {item.price.toFixed(2)}
                                    </p>
                                  </div>
                                </div>
                                <p className="font-bold text-slate-900">
                                  EGP {(item.qty * item.price).toFixed(2)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
