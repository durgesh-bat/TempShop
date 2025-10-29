import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerShopkeeper, clearError } from "../slices/shopkeeperSlice";
import { showToast } from "../utils/toast";

export default function ShopkeeperRegister() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector((state) => state.shopkeeper);
  
  const [form, setForm] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    password2: "",
    phone_number: "",
    address: "",
    business_name: "",
    business_type: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.name || !form.email || !form.password || !form.password2) {
      return showToast.error("Please fill all required fields");
    }

    if (form.password !== form.password2) {
      return showToast.error("Passwords do not match");
    }

    try {
      await dispatch(registerShopkeeper(form)).unwrap();
      navigate("/shopkeeper/dashboard");
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/shopkeeper/dashboard");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4 py-8">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-lg border border-gray-200">
        <div className="text-center mb-6">
          <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Register Your Shop
          </h1>
          <p className="text-gray-500 text-sm mt-2">Start your business journey</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-600 mb-1">Username *</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Enter username"
                className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-purple-200"
                required
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-1">Full Name *</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your full name"
                className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-purple-200"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Email Address *</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="shop@example.com"
              className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-purple-200"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-600 mb-1">Password *</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-purple-200"
                required
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-1">Confirm Password *</label>
              <input
                type="password"
                name="password2"
                value={form.password2}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-purple-200"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone_number"
              value={form.phone_number}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-purple-200"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Business Name</label>
            <input
              type="text"
              name="business_name"
              value={form.business_name}
              onChange={handleChange}
              placeholder="TempShop Electronics"
              className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-purple-200"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Business Type</label>
            <select
              name="business_type"
              value={form.business_type}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-purple-200"
            >
              <option value="">Select Business Type</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="groceries">Groceries</option>
              <option value="pharmacy">Pharmacy</option>
              <option value="restaurant">Restaurant</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Address</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Main Market, Gorakhpur, UP"
              rows={2}
              className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-purple-200"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 text-white py-3 rounded-lg shadow-md transition font-semibold"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="mt-6 space-y-3">
          <p className="text-center text-sm text-gray-600">
            Already registered?{" "}
            <Link to="/shopkeeper/login" className="text-purple-600 hover:underline font-semibold">
              Login
            </Link>
          </p>
          <div className="text-center">
            <a href="/" className="text-sm text-gray-500 hover:text-gray-700">
              ← Back to Main Site
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
