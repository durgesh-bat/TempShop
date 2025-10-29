import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import shopkeeperAxiosInstance from "../api/shopkeeperAxiosInstance";
import { showToast } from "../utils/toast";

export default function Inventory() {
  const navigate = useNavigate();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await shopkeeperAxiosInstance.get("/shopkeeper/inventory/");
      setInventory(res.data);
    } catch (error) {
      showToast.error("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (productId, newStock) => {
    try {
      await shopkeeperAxiosInstance.patch(`/shopkeeper/inventory/${productId}/stock/`, {
        stock_quantity: newStock
      });
      showToast.success("Stock updated");
      fetchInventory();
    } catch (error) {
      showToast.error("Failed to update stock");
    }
  };

  const toggleAvailability = async (productId) => {
    try {
      await shopkeeperAxiosInstance.patch(`/shopkeeper/inventory/${productId}/toggle/`);
      showToast.success("Availability updated");
      fetchInventory();
    } catch (error) {
      showToast.error("Failed to update availability");
    }
  };

  const filteredInventory = inventory.filter(item => {
    if (filter === "out") return item.stock_quantity === 0;
    if (filter === "low") return item.stock_quantity > 0 && item.stock_quantity <= 10;
    if (filter === "in") return item.stock_quantity > 10;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Inventory Management</h1>
            <p className="text-gray-600">Track and manage your stock levels</p>
          </div>
          <button
            onClick={() => navigate("/shopkeeper/dashboard")}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
          >
            ← Back
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex gap-4">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg font-medium ${filter === "all" ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-700"}`}
            >
              All ({inventory.length})
            </button>
            <button
              onClick={() => setFilter("in")}
              className={`px-4 py-2 rounded-lg font-medium ${filter === "in" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700"}`}
            >
              In Stock ({inventory.filter(i => i.stock_quantity > 10).length})
            </button>
            <button
              onClick={() => setFilter("low")}
              className={`px-4 py-2 rounded-lg font-medium ${filter === "low" ? "bg-yellow-600 text-white" : "bg-gray-100 text-gray-700"}`}
            >
              Low Stock ({inventory.filter(i => i.stock_quantity > 0 && i.stock_quantity <= 10).length})
            </button>
            <button
              onClick={() => setFilter("out")}
              className={`px-4 py-2 rounded-lg font-medium ${filter === "out" ? "bg-red-600 text-white" : "bg-gray-100 text-gray-700"}`}
            >
              Out of Stock ({inventory.filter(i => i.stock_quantity === 0).length})
            </button>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{item.name}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">₹{item.price}</td>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      value={item.stock_quantity}
                      onChange={(e) => updateStock(item.id, e.target.value)}
                      className="w-20 px-2 py-1 border rounded"
                      min="0"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.status === "Out of Stock" ? "bg-red-100 text-red-800" :
                      item.status === "Low Stock" ? "bg-yellow-100 text-yellow-800" :
                      "bg-green-100 text-green-800"
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleAvailability(item.id)}
                      className={`px-3 py-1 rounded text-sm font-medium ${
                        item.is_available
                          ? "bg-red-100 text-red-700 hover:bg-red-200"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      }`}
                    >
                      {item.is_available ? "Disable" : "Enable"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
