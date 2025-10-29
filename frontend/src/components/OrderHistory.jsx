import React, { useState, useEffect } from "react";
import { getOrders } from "../api/profileApi";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const data = await getOrders();
    setOrders(data);
  };

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Order History</h2>
      
      {orders.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No orders yet</p>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="border dark:border-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-white">Order #{order.id}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status]}`}>
                  {order.status.toUpperCase()}
                </span>
              </div>
              
              <div className="space-y-2 mb-3">
                {order.items?.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-700 dark:text-gray-300">{item.product?.name} × {item.quantity}</span>
                    <span className="font-semibold text-gray-800 dark:text-white">${item.price}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t dark:border-gray-700 pt-2 flex justify-between items-center">
                <span className="font-bold text-gray-800 dark:text-white">Total</span>
                <span className="text-xl font-bold text-blue-600">${order.total}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
