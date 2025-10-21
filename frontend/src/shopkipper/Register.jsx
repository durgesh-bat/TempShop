import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerShopkeeper, clearError } from "../slices/shopkeeperSlice";

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
      return alert("Please fill all required fields");
    }

    if (form.password !== form.password2) {
      return alert("Passwords do not match");
    }

    try {
      await dispatch(registerShopkeeper(form)).unwrap();
      navigate("/shopkeeper");
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/shopkeeper");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-lg">
        <h1 className="text-3xl font-bold text-center text-green-700 mb-6">
          🏪 Register Your Shop
        </h1>

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
                className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-green-200"
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
                className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-green-200"
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
              className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-green-200"
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
                className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-green-200"
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
                className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-green-200"
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
              className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-green-200"
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
              className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-green-200"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Business Type</label>
            <select
              name="business_type"
              value={form.business_type}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-green-200"
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
              className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-green-200"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-2 rounded-lg shadow-md transition"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-5">
          Already registered?{" "}
          <Link to="/shopkeeper/login" className="text-green-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
