import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import shopkeeperAxiosInstance from "../api/shopkeeperAxiosInstance";
import { showToast } from "../utils/toast";

export default function Analytics() {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await shopkeeperAxiosInstance.get("/shopkeeper/analytics/");
      setAnalytics(res.data);
    } catch (error) {
      showToast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

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
            <h1 className="text-3xl font-bold text-gray-800">Product Analytics</h1>
            <p className="text-gray-600">Track product performance and sales</p>
          </div>
          <button
            onClick={() => navigate("/shopkeeper/dashboard")}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
          >
            ← Back
          </button>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {analytics.map((product, index) => (
            <div key={product.product_id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
              {/* Rank Badge */}
              {index < 3 && (
                <div className="flex justify-end mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    index === 0 ? "bg-yellow-100 text-yellow-800" :
                    index === 1 ? "bg-gray-100 text-gray-800" :
                    "bg-orange-100 text-orange-800"
                  }`}>
                    #{index + 1} Best Seller
                  </span>
                </div>
              )}

              {/* Product Info */}
              <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-bold text-green-600">₹{product.price.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Stock:</span>
                  <span className={`font-bold ${
                    product.stock === 0 ? "text-red-600" :
                    product.stock <= 10 ? "text-yellow-600" :
                    "text-green-600"
                  }`}>
                    {product.stock} units
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Orders:</span>
                  <span className="font-bold text-blue-600">{product.orders}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Revenue:</span>
                  <span className="font-bold text-purple-600">₹{product.revenue.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Rating:</span>
                  <div className="flex items-center">
                    <span className="font-bold text-yellow-600 mr-1">{product.rating.toFixed(1)}</span>
                    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Performance Bar */}
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Performance</span>
                  <span>{product.orders > 0 ? "Active" : "No Sales"}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                    style={{ width: `${Math.min((product.orders / Math.max(...analytics.map(p => p.orders))) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {analytics.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-gray-600 text-lg">No analytics data available yet</p>
            <p className="text-gray-500 text-sm mt-2">Start selling products to see analytics</p>
          </div>
        )}
      </div>
    </div>
  );
}
