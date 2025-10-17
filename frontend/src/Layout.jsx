import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Layout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Fetch cart items count
useEffect(() => {
  const fetchCartCount = async () => {
    try {
      const token = localStorage.getItem("access");
      if (!token) return;

      const res = await axios.get("http://127.0.0.1:8000/api/cart/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Make sure you access the items array
      const items = res.data.items || []; // fallback to empty array
      const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalItems);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    }
  };

  fetchCartCount();
}, []);

  return (
    <div className="bg-gradient-to-b from-gray-100 to-gray-50 dark:from-gray-900 dark:to-black transition-all duration-300">
      {/* Header / Nav */}
      <header className="bg-white dark:bg-gray-900 shadow-md">
        <div className="mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-black dark:text-white">TempShop</h1>

          {/* Desktop Nav */}
          <nav className="space-x-6 hidden md:flex items-center">
            <Link to="/" className="hover:underline text-gray-800 dark:text-gray-200">
              Home
            </Link>
            <Link to="/shop" className="hover:underline text-gray-800 dark:text-gray-200">
              Shop
            </Link>
            <Link
              to="/profile"
              className="hover:underline text-gray-800 dark:text-gray-200 font-semibold"
            >
              Profile
            </Link>
            <Link to="/contact" className="hover:underline text-gray-800 dark:text-gray-200">
              Contact
            </Link>

            {/* Cart with badge */}
            <Link
              to="/cart"
              className="relative hover:underline text-gray-800 dark:text-gray-200"
            >
              🛒 Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-800 dark:text-gray-200 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? "✖" : "☰"}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <nav className="md:hidden bg-white dark:bg-gray-900 px-6 pb-4 space-y-3">
            <Link
              to="/"
              className="block hover:underline text-gray-800 dark:text-gray-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/shop"
              className="block hover:underline text-gray-800 dark:text-gray-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Shop
            </Link>
            <Link
              to="/profile"
              className="block hover:underline text-gray-800 dark:text-gray-200 font-semibold"
              onClick={() => setMobileMenuOpen(false)}
            >
              Profile
            </Link>
            <Link
              to="/contact"
              className="block hover:underline text-gray-800 dark:text-gray-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              to="/cart"
              className="relative block hover:underline text-gray-800 dark:text-gray-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              🛒 Cart
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-4 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
}
