import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function CartPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const token = localStorage.getItem("access");

  // Fetch cart data
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/cart/", {
          headers: { Authorization: `Bearer ${token}` },
        });
    
        setCart(res.data);
      } catch (err) {
        setError(err.response?.data?.detail || "Failed to fetch cart");
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [refreshTrigger,token]);

  useEffect(()=>{

  },[])
  // Update quantity
  const updateQuantity = async (itemId, newQty) => {
    try {
      await axios.post(
        `http://127.0.0.1:8000/api/cart/${itemId}/`,
        { quantity: newQty },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRefreshTrigger((prev) => prev + 1);
      setCart((prev) => ({
        ...prev,
        items: prev.items.map((item) =>
          item.id === itemId ? { ...item, quantity: newQty } : item
        ),
      }));
    } catch (err) {
      alert("Failed to update quantity: ",err);
    }
  };

  // Remove item
  const removeItem = async (itemId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/cart/${itemId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRefreshTrigger((prev) => prev + 1);
      setCart((prev) => ({
        ...prev,
        items: prev.items.filter((item) => item.id !== itemId),
      }));
    } catch {
      alert("Failed to remove item");
    }
  };

  if (loading) return <p className="text-center py-10 text-gray-500">Loading cart...</p>;
  if (error) return <p className="text-center py-10 text-red-500">{error}</p>;
  if (!cart || !Array.isArray(cart.items) || cart.items.length === 0)
    return (
      <div className="text-center">
        <p className="text-gray-500 mb-4">Your cart is empty.</p>
        <Link
          to="/"
          className="bg-black dark:bg-white dark:text-black text-white px-6 py-3 rounded-full hover:scale-105 transition"
        >
          Continue Shopping
        </Link>
      </div>
    );

  const totalPrice = cart.items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-black dark:text-white px-6 py-10">
      <h2 className="text-3xl font-bold text-center mb-8">🛒 Your Cart</h2>

      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-6">
        {cart.items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row justify-between items-center border-b border-gray-300 dark:border-gray-700 py-4"
          >
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <img
                src={
                  `https://res.cloudinary.com/dq7zkxtnj/${item.product.image}`
                }
                alt={item.product.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div>
                <h3 className="font-semibold text-lg">{item.product.name}</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  ₹{item.product.price}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-3 sm:mt-0">
              <button
                onClick={() => {
                  if (item.quantity > 1) {
                    updateQuantity(item.product.id, -1);
                  } else {
                    removeItem(item.product.id);
                  }
                }}
                className="bg-gray-200 dark:bg-gray-800 px-3 py-1 rounded cursor-pointer"
              >
                −
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.product.id,1)}
                className="bg-gray-200 dark:bg-gray-800 px-3 py-1 rounded cursor-pointer"
              >
                +
              </button>
            </div>

            <div className="flex flex-col items-center mt-3 sm:mt-0">
              <p className="font-semibold">
                ₹{(item.product.price * item.quantity).toLocaleString("en-IN", { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                })}
            </p>

              <button
                onClick={() => removeItem(item.product.id)}
                className="text-red-500 text-sm mt-2 hover:underline cursor-pointer"
              >
                Remove
              </button>
            </div>
          </div>
        ))}

        <div className="flex justify-between items-center mt-6 border-t pt-4">
          <h3 className="text-xl font-bold">Total:</h3>
            <p className="text-2xl font-semibold">
            ₹{totalPrice.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
        </div>

        <div className="text-center mt-8">
          <button className="bg-black dark:bg-white dark:text-black text-white px-8 py-3 rounded-full font-semibold hover:scale-105 transition">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
