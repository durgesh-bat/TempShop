import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axiosInstance from "./api/axiosInstance"; // ✅ Use axiosInstance

export default function Layout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [imageError, setImageError] = useState(false);

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

  return (
    <div className="bg-gradient-to-b from-gray-100 to-gray-50 dark:from-gray-900 dark:to-black transition-all duration-300">
      {/* Header / Nav */}
      <header className="bg-white dark:bg-gray-900 shadow-md">
        <div className="mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-black dark:text-white">TempShop</h1>

          {/* Desktop Nav */}
          <nav className="space-x-6 hidden md:flex items-center">
            <Link to="/" className="hover:underline text-gray-800 dark:text-gray-200">Home</Link>
            <Link to="/shop" className="hover:underline text-gray-800 dark:text-gray-200">Shop</Link>

            {isAuthenticated && user ? (
              <Link
                to="/profile"
                className="flex items-center space-x-2 hover:underline text-gray-800 dark:text-gray-200 font-semibold"
              >
                <img
                  src={profilePicUrl}
                  alt="Profile"
                  onError={handleImageError}
                  className="w-8 h-8 rounded-full object-cover border-2 border-gray-300 dark:border-gray-700"
                />
                <span>{username}</span>
              </Link>
            ) : (
              <>
                <Link to="/login" className="hover:underline text-gray-800 dark:text-gray-200 font-semibold">Login</Link>
                <Link to="/shopkeeper/register" className="hover:underline text-gray-800 dark:text-gray-200">Shopkeeper Register</Link>
                <Link to="/shopkeeper/login" className="hover:underline text-gray-800 dark:text-gray-200">Shopkeeper Login</Link>
              </>
            )}

            <Link to="/contact" className="hover:underline text-gray-800 dark:text-gray-200">Contact</Link>

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
            <Link to="/" className="block hover:underline text-gray-800 dark:text-gray-200" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="/shop" className="block hover:underline text-gray-800 dark:text-gray-200" onClick={() => setMobileMenuOpen(false)}>Shop</Link>

            {isAuthenticated && user ? (
              <Link
                to="/profile"
                className="flex items-center space-x-2 hover:underline text-gray-800 dark:text-gray-200 font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                <img
                  src={profilePicUrl}
                  alt="Profile"
                  onError={handleImageError}
                  className="w-6 h-6 rounded-full object-cover border-2 border-gray-300 dark:border-gray-700"
                />
                <span>{username}</span>
              </Link>
            ) : (
              <>
                <Link to="/login" className="block hover:underline text-gray-800 dark:text-gray-200 font-semibold" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                <Link to="/shopkeeper/register" className="block hover:underline text-gray-800 dark:text-gray-200" onClick={() => setMobileMenuOpen(false)}>Shopkeeper Register</Link>
                <Link to="/shopkeeper/login" className="block hover:underline text-gray-800 dark:text-gray-200" onClick={() => setMobileMenuOpen(false)}>Shopkeeper Login</Link>
              </>
            )}

            <Link to="/contact" className="block hover:underline text-gray-800 dark:text-gray-200" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
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