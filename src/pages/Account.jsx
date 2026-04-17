import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store";
import { UserIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

export default function Account() {
  const [contentRef, contentVisible] = useScrollAnimation();

  const { user, logout } = useAuthStore();
  const orders = user?.orders || [];
  const [activeTab, setActiveTab] = useState("profile");

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center animate-fade-in">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            Access Denied
          </h2>
          <p className="text-slate-600 mb-6">
            Please log in to view your profile and orders.
          </p>
          <Link to="/login" className="btn-primary">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      logout();
    }
  };

  return (
    <div
      ref={contentRef}
      className={`page-enter transition-all duration-700 ${contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-slate-900 mb-2">
            My Account
          </h1>
          <p className="text-slate-600">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-brand-600" />
                </div>
                <div>
                  <div className="font-semibold text-slate-800">
                    {user.name}
                  </div>
                  <div className="text-sm text-slate-500">{user.email}</div>
                </div>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === "profile"
                      ? "bg-brand-50 text-brand-600"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === "orders"
                      ? "bg-brand-50 text-brand-600"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Order History
                </button>
              </nav>

              <div className="mt-6 pt-6 border-t border-slate-100">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-card p-6">
              {activeTab === "profile" && (
                <div>
                  <h2 className="font-display text-2xl font-bold text-slate-900 mb-6">
                    Profile Information
                  </h2>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Full Name
                        </label>
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                          <UserIcon className="w-5 h-5 text-slate-400" />
                          <span className="text-slate-800">{user.name}</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Email Address
                        </label>
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                          <EnvelopeIcon className="w-5 h-5 text-slate-400" />
                          <span className="text-slate-800">{user.email}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100">
                      <h3 className="font-semibold text-slate-800 mb-4">
                        Account Status
                      </h3>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-sm text-slate-600">
                          Active Account
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "orders" && (
                <div>
                  <h2 className="font-display text-2xl font-bold text-slate-900 mb-6">
                    Order History
                  </h2>

                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                          className="w-8 h-8 text-slate-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                          />
                        </svg>
                      </div>
                      <h3 className="font-semibold text-slate-800 mb-2">
                        No orders yet
                      </h3>
                      <p className="text-slate-500 text-sm mb-4">
                        Your order history will appear here once you make your
                        first purchase.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="bg-slate-50 p-4 flex flex-wrap justify-between items-center gap-4">
                            <div className="flex gap-8">
                              <div>
                                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">
                                  Date
                                </p>
                                <p className="text-sm font-semibold text-slate-700">
                                  {order.date}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">
                                  Total
                                </p>
                                <p className="text-sm font-bold text-brand-600">
                                  EGP {order.total.toFixed(2)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-xs font-mono text-slate-400 hidden sm:block">
                                {order.id}
                              </span>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-bold ${
                                  order.status === "Delivered"
                                    ? "bg-emerald-50 text-emerald-600"
                                    : "bg-blue-50 text-blue-600"
                                }`}
                              >
                                {order.status}
                              </span>
                            </div>
                          </div>
                          <div className="p-4 divide-y divide-slate-50">
                            {order.items.map((item) => (
                              <div
                                key={item.id}
                                className="py-3 first:pt-0 last:pb-0 flex items-center gap-4"
                              >
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-14 h-14 object-cover rounded-lg bg-slate-50"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-bold text-slate-800 truncate">
                                    {item.name}
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    Quantity: {item.qty}
                                  </p>
                                </div>
                                <div className="text-sm font-bold text-slate-900">
                                  EGP {item.price.toFixed(2)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
