import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginShopkeeper, clearError } from "../slices/shopkeeperSlice";

export default function ShopkeeperLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector((state) => state.shopkeeper);
  
  const [form, setForm] = useState({ username: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) return alert("All fields required!");

    try {
      await dispatch(loginShopkeeper(form)).unwrap();
      navigate("/shopkeeper");
    } catch (err) {
      console.error("Login failed:", err);
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
      <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
          🧑‍💼 Shopkeeper Login
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-600 mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Enter your username"
              className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 rounded-lg shadow-md transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-5">
          Don’t have an account?{" "}
          <Link to="/shopkeeper/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
