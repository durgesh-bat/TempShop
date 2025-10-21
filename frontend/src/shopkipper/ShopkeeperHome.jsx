import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchShopkeeperProfile, fetchShopkeeperDashboard, logoutShopkeeper } from "../slices/shopkeeperSlice";

export default function ShopkeeperHome() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { shopkeeper, dashboard, loading, error, isAuthenticated } = useSelector((state) => state.shopkeeper);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/shopkeeper/login");
      return;
    }
    
    dispatch(fetchShopkeeperProfile());
    dispatch(fetchShopkeeperDashboard());
  }, [dispatch, navigate, isAuthenticated]);

  const handleLogout = () => {
    dispatch(logoutShopkeeper());
    navigate("/shopkeeper/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            🧑‍💼 Shopkeeper Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>

        {/* Shopkeeper Info Card */}
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col md:flex-row items-center gap-6 mb-8">
          <img
            src={shopkeeper?.profile_picture || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
            alt="Shopkeeper"
            className="w-28 h-28 rounded-full object-cover border-4 border-blue-500"
          />
          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-gray-800">{shopkeeper?.name || "Shopkeeper"}</h2>
            <p className="text-gray-500">{shopkeeper?.business_name || "Business Name"}</p>
            <p className="text-sm text-gray-600 mt-2">
              📧 {shopkeeper?.email || "Email not provided"} <br />
              📞 {shopkeeper?.phone_number || "Phone not provided"} <br />
              📍 {shopkeeper?.address || "Address not provided"}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Joined on {new Date(shopkeeper?.created_at).toLocaleDateString()}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Link
              to="/shopkeeper/add-product"
              className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
            >
              + Add Product
            </Link>
            <Link
              to="/shopkeeper/products"
              className="bg-green-600 text-white px-5 py-2 rounded-lg shadow hover:bg-green-700 transition"
            >
              Manage Products
            </Link>
            <Link
              to="/shopkeeper/orders"
              className="bg-purple-600 text-white px-5 py-2 rounded-lg shadow hover:bg-purple-700 transition"
            >
              View Orders
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid sm:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow text-center hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-gray-700">Total Products</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {dashboard?.stats?.total_products || 0}
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow text-center hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-gray-700">Total Orders</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {dashboard?.stats?.total_orders || 0}
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow text-center hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-gray-700">Pending Orders</h3>
            <p className="text-3xl font-bold text-orange-600 mt-2">
              {dashboard?.stats?.pending_orders || 0}
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow text-center hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-gray-700">Revenue</h3>
            <p className="text-3xl font-bold text-yellow-600 mt-2">
              ₹{dashboard?.stats?.total_revenue?.toLocaleString() || 0}
            </p>
          </div>
        </div>

        {/* Recent Orders */}
        {dashboard?.recent_orders && dashboard.recent_orders.length > 0 && (
          <div className="bg-white mt-10 p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Orders</h2>
            <div className="space-y-3">
              {dashboard.recent_orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{order.customer_name}</p>
                    <p className="text-sm text-gray-600">₹{order.total_amount}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* About / Description */}
        <div className="bg-white mt-10 p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            About {shopkeeper?.business_name || shopkeeper?.name}
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Welcome to {shopkeeper?.business_name || shopkeeper?.name}! 
            {shopkeeper?.business_type && ` We specialize in ${shopkeeper.business_type}.`}
            You can manage your store, upload new items, and check your order stats right from this dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
