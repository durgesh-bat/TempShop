import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchCart, updateCartItem, removeCartItem } from "../slices/cartSlice";

export default function CartPage() {
  const dispatch = useDispatch();
  const items = useSelector(state => state.cart.items);
  const loading = useSelector(state => state.cart.loading);
  const operationLoading = useSelector(state => state.cart.operationLoading);
  const error = useSelector(state => state.cart.error);
  const totalPrice = useSelector(state => state.cart.totalPrice);

  console.log("error: ",error)
  // Fetch cart data
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  // Update quantity
  const updateQuantity = async (itemId, newQty) => {
    if (operationLoading) return; // Prevent multiple operations while loading
    try {
      await dispatch(updateCartItem({ itemId, newQty })).unwrap();
    } catch (err) {
      alert(err.message || "Failed to update quantity");
    }
  };

  // Remove item
  const removeItem = async (itemId) => {
    if (operationLoading) return; // Prevent multiple operations while loading
    try {
      await dispatch(removeCartItem({ itemId })).unwrap();
    } catch (err) {
      alert(err.message || "Failed to remove item");
    }
  };

  if (loading) return <p className="text-center py-10 text-gray-500">Loading cart...</p>;
  if (error) return <p className="text-center py-10 text-red-500">{error}</p>;
  if (!items || items.length === 0)
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-black dark:text-white px-6 py-10">
      <h2 className="text-3xl font-bold text-center mb-8">🛒 Your Cart</h2>

      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-6">
        {items.map((item) => (
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
                disabled={operationLoading}
                className={`bg-gray-200 dark:bg-gray-800 px-3 py-1 rounded ${
                  operationLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
              >
                −
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.product.id, 1)}
                disabled={operationLoading}
                className={`bg-gray-200 dark:bg-gray-800 px-3 py-1 rounded ${
                  operationLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
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
                disabled={operationLoading}
                className={`text-red-500 text-sm mt-2 hover:underline ${
                  operationLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
              >
                {operationLoading ? 'Removing...' : 'Remove'}
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
