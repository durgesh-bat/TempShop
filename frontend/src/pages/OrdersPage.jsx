import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getOrders } from "../api/profileApi";
import notify from "../utils/notifications";

export default function OrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (err) {
      notify.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      processing: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      shipped: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
      delivered: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
    };
    return colors[status] || colors.pending;
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: "⏳",
      processing: "📦",
      shipped: "🚚",
      delivered: "✅",
      cancelled: "❌"
    };
    return icons[status] || "📋";
  };

  const filteredOrders = filter === "all" 
    ? orders 
    : orders.filter(order => order.status === filter);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-48 mb-8 animate-pulse"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl p-6 mb-4 animate-pulse">
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-32 mb-4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-black dark:text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">📦 My Orders</h1>
          <button
            onClick={() => navigate("/shop")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Continue Shopping
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {["all", "pending", "processing", "shipped", "delivered", "cancelled"].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
                filter === status
                  ? "bg-blue-600 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-gray-500 dark:text-gray-400 text-xl mb-4">
              {filter === "all" ? "No orders yet" : `No ${filter} orders`}
            </p>
            <button
              onClick={() => navigate("/shop")}
              className="px-6 py-3 bg-black dark:bg-white dark:text-black text-white rounded-full hover:scale-105 transition"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map(order => (
              <div
                key={order.id}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold mb-1">Order #{order.id}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(order.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric"
                        })}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)} {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-3 mb-4">
                    {order.items?.map(item => (
                      <div key={item.id} className="flex items-center gap-4">
                        <img
                          src={item.product.primary_image || "https://placehold.co/60x60?text=No+Image"}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                          onError={(e) => e.target.src = "https://placehold.co/60x60?text=No+Image"}
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold">{item.product.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Qty: {item.quantity} × ₹{parseFloat(item.price).toLocaleString("en-IN")}
                          </p>
                        </div>
                        <p className="font-semibold">
                          ₹{(item.quantity * parseFloat(item.price)).toLocaleString("en-IN")}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Delivery Address */}
                  {order.address && (
                    <div className="border-t dark:border-gray-700 pt-4 mb-4">
                      <p className="text-sm font-semibold mb-1">📍 Delivery Address</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {order.address.street}, {order.address.city}, {order.address.state} {order.address.postal_code}
                      </p>
                    </div>
                  )}

                  {/* Total & Actions */}
                  <div className="flex justify-between items-center border-t dark:border-gray-700 pt-4">
                    <div>
                      <span className="font-bold text-lg">Total: </span>
                      <span className="font-bold text-2xl text-blue-600 dark:text-blue-400">
                        ₹{parseFloat(order.total).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <a
                      href={`http://localhost:8000/api/auth/orders/${order.id}/receipt/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download Receipt
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
