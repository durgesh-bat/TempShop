import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("access"); // or HttpOnly cookie
        const res = await axios.get("http://127.0.0.1:8000/api/cart/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Assuming API returns array of items with quantity field
        const totalItems = res.data.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(totalItems);
      } catch (err) {
        console.error("Error fetching cart:", err);
      }
    };

    fetchCart();
  }, []);
  return (
    <nav className="flex justify-end items-center gap-4 p-4">
      <Link
        to="/cart"
        className="relative hover:underline text-gray-800 dark:text-gray-200"
      >
        🛒 Go to Cart
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
            {cartCount}
          </span>
        )}
      </Link>
    </nav>
  );
}
