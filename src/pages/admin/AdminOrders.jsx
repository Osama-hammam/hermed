import { useState, useEffect, useMemo } from "react";
import { useAuthStore } from "../../store";
import {
  UserIcon,
  ClockIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  MagnifyingGlassIcon,
  TruckIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

const statusOptions = ["Processing", "Shipped", "Delivered", "Cancelled"];

export default function AdminOrders() {
  const fetchAllOrders = useAuthStore((s) => s.fetchAllOrders);
  const updateOrderStatus = useAuthStore((s) => s.updateOrderStatus);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  // Fetch orders from Supabase on mount
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      const data = await fetchAllOrders();
      if (!cancelled) {
        setOrders(data || []);
        setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [fetchAllOrders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesFilter =
        filter === "all" || order.status?.toLowerCase() === filter.toLowerCase();
      const matchesSearch =
        (order.id || "").toLowerCase().includes(search.toLowerCase()) ||
        (order.customer_name || "").toLowerCase().includes(search.toLowerCase()) ||
        (order.customer_email || "").toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [orders, filter, search]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    if (updateOrderStatus) {
      await updateOrderStatus(orderId, newStatus);
      // Refresh orders
      const data = await fetchAllOrders();
      setOrders(data || []);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const statusIcon = (status) => {
    switch (status) {
      case "Delivered":
        return <CheckCircleIcon className="w-3.5 h-3.5" />;
      case "Shipped":
        return <TruckIcon className="w-3.5 h-3.5" />;
      case "Cancelled":
        return <XCircleIcon className="w-3.5 h-3.5" />;
      default:
        return <ClockIcon className="w-3.5 h-3.5" />;
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-50 text-emerald-600";
      case "Shipped":
        return "bg-amber-50 text-amber-600";
      case "Cancelled":
        return "bg-red-50 text-red-600";
      default:
        return "bg-blue-50 text-blue-600";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-600"></div>
          <span className="text-sm text-slate-400">Loading orders...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Order Management
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {orders.length} total orders
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white rounded-xl shadow-sm border border-slate-100 p-1">
          {["all", "processing", "shipped", "delivered", "cancelled"].map((f) => (
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
                  <>
                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
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
                            <ClockIcon className="w-3 h-3" /> {new Date(order.created_at).toLocaleDateString()}
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
                              {order.customer_name || "Guest"}
                            </span>
                            <span className="text-xs text-slate-400">
                              {order.customer_email || "—"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColor(order.status)}`}
                        >
                          {statusIcon(order.status)}
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900">
                        EGP {parseFloat(order.total || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {order.status !== "Delivered" && order.status !== "Cancelled" && (
                          <div className="flex items-center gap-2 justify-end">
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                              className="text-xs font-medium border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-300 bg-white"
                            >
                              {statusOptions.map((s) => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </div>
                        )}
                      </td>
                    </tr>
                    {expandedId === order.id && (
                      <tr key={`${order.id}-expanded`} className="bg-slate-50/50 border-t border-slate-100">
                        <td colSpan="6" className="px-6 py-4">
                          <div className="space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Phone</p>
                                <p className="text-sm text-slate-700">{order.customer_phone || "—"}</p>
                              </div>
                              <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Address</p>
                                <p className="text-sm text-slate-700">{order.shipping_address || "—"}, {order.shipping_city || ""}</p>
                              </div>
                              <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Payment</p>
                                <p className="text-sm text-slate-700 capitalize">{order.payment_method || "COD"}</p>
                              </div>
                            </div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                              Order Items
                            </p>
                            {(order.order_items || []).length === 0 ? (
                              <p className="text-sm text-slate-400">No items data available.</p>
                            ) : (
                              order.order_items.map((item, idx) => (
                                <div
                                  key={item.id || idx}
                                  className="flex items-center justify-between text-sm bg-white p-3 rounded-xl border border-slate-100 shadow-sm"
                                >
                                  <div className="flex items-center gap-4">
                                    {item.product_image && (
                                      <img
                                        src={item.product_image}
                                        alt=""
                                        className="w-10 h-10 object-cover rounded-lg bg-slate-50"
                                      />
                                    )}
                                    <div>
                                      <p className="font-bold text-slate-800">
                                        {item.product_name}
                                      </p>
                                      <p className="text-xs text-slate-500">
                                        Qty: {item.quantity} × EGP{" "}
                                        {parseFloat(item.price || 0).toFixed(2)}
                                      </p>
                                    </div>
                                  </div>
                                  <p className="font-bold text-slate-900">
                                    EGP {(item.quantity * parseFloat(item.price || 0)).toFixed(2)}
                                  </p>
                                </div>
                              ))
                            )}
                            {order.notes && (
                              <div className="mt-3">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Notes</p>
                                <p className="text-sm text-slate-600 bg-white p-3 rounded-xl border border-slate-100">{order.notes}</p>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
