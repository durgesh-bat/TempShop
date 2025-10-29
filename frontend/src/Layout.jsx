import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axiosInstance from "./api/axiosInstance";
import { Toaster } from 'react-hot-toast';

export default function Layout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // Fetch cart items count
  useEffect(() => {
    const fetchCartCount = async () => {
      if (!isAuthenticated || !user) {
        setCartCount(0);
        return;
      }


      try {
        const res = await axiosInstance.get("/cart/");
        const items = res.data.items || [];
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(totalItems);
      } catch (err) {
        console.error("Failed to fetch cart:", err);
        if (err.response?.status === 404 || err.response?.status === 401) {
          setCartCount(0);
        } else {
          // For other errors, still set to 0 but could show a subtle indicator
          setCartCount(0);
        }
      }
    };

    fetchCartCount();
  }, [isAuthenticated, user]);
      console.log("IsAuthenticated: ",isAuthenticated,"User: ",user);

  // Fallback image
  const fallbackImg = (first, last) => {
    const text = encodeURIComponent(`${first}${last}`);
    return `https://placehold.co/150x150?text=${text}`;
  };

  // Profile picture URL helper
  const getProfilePicUrl = () => {
    if (!user) {
      return fallbackImg("U", "");
    }

    const pic = user.profile_picture;
    
    if (pic) {
      // Handle Cloudinary object response
      if (typeof pic === 'object' && pic.url) {
        return pic.url;
      }
      // Handle complete URL string
      if (typeof pic === 'string' && pic.startsWith('http')) {
        return pic;
      }
      // Handle Cloudinary path
      if (typeof pic === 'string' && pic.length > 0) {
        return `https://res.cloudinary.com/dq7zkxtnj/${pic}`;
      }
    }

    // Fallback
    const firstInitial = user.first_name?.charAt(0)?.toUpperCase() || 
                         user.username?.charAt(0)?.toUpperCase() || "U";
    const lastInitial = user.last_name?.charAt(0)?.toUpperCase() || "";
    return fallbackImg(firstInitial, lastInitial);
  };

  const profilePicUrl = getProfilePicUrl();
  const username = user?.username || "User";

  // Handle image load error
  const handleImageError = (e) => {
    if (!imageError && e.target) {
      setImageError(true);
      const firstInitial = user?.first_name?.charAt(0)?.toUpperCase() || 
                           user?.username?.charAt(0)?.toUpperCase() || "U";
      const lastInitial = user?.last_name?.charAt(0)?.toUpperCase() || "";
      e.target.src = fallbackImg(firstInitial, lastInitial);
      e.target.onerror = null; // Prevent infinite loop
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-100 to-gray-50 dark:from-gray-900 dark:to-black transition-all duration-300">
      <Toaster position="top-right" />
      {/* Header / Nav */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">TempShop</span>
            </Link>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full px-4 py-2 pl-10 pr-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </form>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-1">
              <Link to="/" className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition font-medium cursor-pointer">Home</Link>
              <Link to="/shop" className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition font-medium cursor-pointer">Shop</Link>
              
              {!isAuthenticated && (
                <a href="/shopkeeper" target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-lg text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition font-medium flex items-center gap-1 cursor-pointer">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Shopkeeper
                </a>
              )}
            </nav>

            {/* Right Side */}
            <div className="hidden md:flex items-center space-x-3">
              {/* Cart */}
              <Link to="/cart" className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer">
                <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              {isAuthenticated && user ? (
                <Link to="/profile" className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition group cursor-pointer">
                  <img src={profilePicUrl} alt="Profile" onError={handleImageError} className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-300 dark:ring-gray-700 group-hover:ring-blue-500 transition" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{username}</span>
                </Link>
              ) : (
                <Link to="/login" className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-medium shadow-md hover:shadow-lg cursor-pointer">
                  Login
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-800">
            <div className="px-4 py-4">
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full px-4 py-2 pl-10 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 outline-none"
                  />
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </form>
            </div>
            <nav className="px-4 pb-4 space-y-2">
              <Link to="/" className="block px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition font-medium cursor-pointer" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              <Link to="/shop" className="block px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition font-medium cursor-pointer" onClick={() => setMobileMenuOpen(false)}>Shop</Link>
              
              {!isAuthenticated && (
                <a href="/shopkeeper" target="_blank" rel="noopener noreferrer" className="block px-4 py-3 rounded-lg text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition font-medium cursor-pointer" onClick={() => setMobileMenuOpen(false)}>Shopkeeper</a>
              )}
              
              <Link to="/cart" className="flex items-center justify-between px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition font-medium cursor-pointer" onClick={() => setMobileMenuOpen(false)}>
                <span>Cart</span>
                {cartCount > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                {isAuthenticated && user ? (
                  <Link to="/profile" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer" onClick={() => setMobileMenuOpen(false)}>
                    <img src={profilePicUrl} alt="Profile" onError={handleImageError} className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-300 dark:ring-gray-700" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{username}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">View Profile</p>
                    </div>
                  </Link>
                ) : (
                  <Link to="/login" className="block px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-center font-medium shadow-md cursor-pointer" onClick={() => setMobileMenuOpen(false)}>
                    Login
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-300 dark:border-gray-700 mt-12">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* About */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">TempShop</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Your one-stop shop for premium products. Quality and style delivered to your doorstep.</p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">Home</Link></li>
                <li><Link to="/shop" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">Shop</Link></li>
                <li><Link to="/contact" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">Contact Us</Link></li>
                {isAuthenticated && <li><Link to="/user-profile" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">My Account</Link></li>}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">Contact</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>📧 support@tempshop.com</li>
                <li>📞 +1 (555) 123-4567</li>
                <li>📍 123 Shop Street, City, Country</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-300 dark:border-gray-700 mt-8 pt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} TempShop. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}