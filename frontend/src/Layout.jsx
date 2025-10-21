import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

export default function Layout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // Fetch cart items count
  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) return;

        const res = await axios.get("http://127.0.0.1:8000/api/cart/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const items = res.data.items || [];
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(totalItems);
      } catch (err) {
        console.error("Failed to fetch cart:", err);
      }
    };

    fetchCartCount();
  }, []);

  const fallbackImg = "https://via.placeholder.com/32?text=U";
  const profilePicUrl = user?.profile_picture
    ? user.profile_picture.startsWith("http")
      ? user.profile_picture
      : `https://res.cloudinary.com/dq7zkxtnj/${user.profile_picture}`
    : fallbackImg;

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

            {isAuthenticated && user ? (
              <Link
                to="/profile"
                className="flex items-center space-x-2 hover:underline text-gray-800 dark:text-gray-200 font-semibold"
              >
                <img
                  src={profilePicUrl}
                  alt="Profile"
                  onError={(e) => (e.target.src = fallbackImg)}
                  className="w-8 h-8 rounded-full object-cover border-2 border-gray-300 dark:border-gray-700"
                />
                <span>{user.user?.username || "User"}</span>
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:underline text-gray-800 dark:text-gray-200 font-semibold"
                >
                  Login
                </Link>
                {/* Shopkeeper options only if user is NOT logged in */}
                <Link
                  to="/shopkeeper/register"
                  className="hover:underline text-gray-800 dark:text-gray-200"
                >
                  Shopkeeper Register
                </Link>
                <Link
                  to="/shopkeeper/login"
                  className="hover:underline text-gray-800 dark:text-gray-200"
                >
                  Shopkeeper Login
                </Link>
              </>
            )}

            <Link to="/contact" className="hover:underline text-gray-800 dark:text-gray-200">
              Contact
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative hover:underline text-gray-800 dark:text-gray-200">
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
            <Link to="/" className="block hover:underline text-gray-800 dark:text-gray-200" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            <Link to="/shop" className="block hover:underline text-gray-800 dark:text-gray-200" onClick={() => setMobileMenuOpen(false)}>
              Shop
            </Link>

            {isAuthenticated && user ? (
              <Link
                to="/profile"
                className="flex items-center space-x-2 hover:underline text-gray-800 dark:text-gray-200 font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                <img
                  src={profilePicUrl}
                  alt="Profile"
                  onError={(e) => (e.target.src = fallbackImg)}
                  className="w-6 h-6 rounded-full object-cover border-2 border-gray-300 dark:border-gray-700"
                />
                <span>{user.user?.username || "User"}</span>
              </Link>
            ) : (
              <>
                <Link to="/login" className="block hover:underline text-gray-800 dark:text-gray-200 font-semibold" onClick={() => setMobileMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/shopkeeper/register" className="block hover:underline text-gray-800 dark:text-gray-200" onClick={() => setMobileMenuOpen(false)}>
                  Shopkeeper Register
                </Link>
                <Link to="/shopkeeper/login" className="block hover:underline text-gray-800 dark:text-gray-200" onClick={() => setMobileMenuOpen(false)}>
                  Shopkeeper Login
                </Link>
              </>
            )}

            <Link to="/contact" className="block hover:underline text-gray-800 dark:text-gray-200" onClick={() => setMobileMenuOpen(false)}>
              Contact
            </Link>
            <Link to="/cart" className="relative block hover:underline text-gray-800 dark:text-gray-200" onClick={() => setMobileMenuOpen(false)}>
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
