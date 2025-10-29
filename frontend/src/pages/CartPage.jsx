import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchCart, updateCartItem, removeCartItem } from "../slices/cartSlice";
import { showToast } from "../utils/toast";

export default function CartPage() {
  const dispatch = useDispatch();
  const items = useSelector(state => state.cart.items);
  const loading = useSelector(state => state.cart.loading);
  const operationLoading = useSelector(state => state.cart.operationLoading);
  const error = useSelector(state => state.cart.error);
  const totalPrice = useSelector(state => state.cart.totalPrice);

  // Fetch cart data
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  // Update quantity
  const updateQuantity = async (productId, delta) => {
    if (operationLoading) return;
    try {
      await dispatch(updateCartItem({ itemId: productId, newQty: delta })).unwrap();
    } catch (err) {
      console.error('Failed to update quantity:', err);
      const errorMessage = err?.message || err?.error || "Failed to update quantity";
      showToast.error(errorMessage);
    }
  };

  // Remove item
  const removeItem = async (productId) => {
    if (operationLoading) return;
    if (!window.confirm('Are you sure you want to remove this item from your cart?')) {
      return;
    }
    try {
      await dispatch(removeCartItem({ itemId: productId })).unwrap();
      // No need to refresh cart as removeCartItem already updates state optimistically
    } catch (err) {
      console.error('Failed to remove item:', err);
      const errorMessage = err?.message || err?.error || "Failed to remove item";
      showToast.error(errorMessage);
    }
  };

  // Cart Item Skeleton Component
  const CartItemSkeleton = () => (
    <div className="flex flex-col sm:flex-row justify-between items-center border-b border-gray-300 dark:border-gray-700 py-4 animate-pulse">
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <div className="w-20 h-20 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-32"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-20"></div>
        </div>
      </div>
      <div className="flex items-center gap-3 mt-3 sm:mt-0">
        <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="w-6 h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>
      <div className="flex flex-col items-center mt-3 sm:mt-0 space-y-2">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-12"></div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black text-black dark:text-white px-6 py-10">
        <h2 className="text-3xl font-bold text-center mb-8">🛒 Your Cart</h2>
        
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-6">
          {[...Array(3)].map((_, i) => <CartItemSkeleton key={i} />)}
          
          <div className="flex justify-between items-center mt-6 border-t pt-4">
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
          </div>
          
          <div className="text-center mt-8">
            <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded-full w-48 mx-auto animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">⚠️ {error}</p>
          <button 
            onClick={() => dispatch(fetchCart())}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400 text-xl mb-4">🛒 Your cart is empty</p>
          <Link
            to="/shop"
            className="bg-black dark:bg-white dark:text-black text-white px-6 py-3 rounded-full hover:scale-105 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-black dark:text-white px-6 py-10">
      <h2 className="text-3xl font-bold text-center mb-8">🛒 Your Cart</h2>

      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-6">
        {items.map((item) => {
          const imageUrl = item.product.primary_image || 'https://placehold.co/80x80?text=No+Image';

          return (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row justify-between items-center border-b border-gray-300 dark:border-gray-700 py-4"
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <img
                  src={imageUrl}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-lg"
                  onError={(e) => e.target.src = 'https://placehold.co/80x80?text=No+Image'}
                  loading="lazy"
                />
                <div>
                  <h3 className="font-semibold text-lg">{item.product.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    ₹{item.product.price.toLocaleString("en-IN", { 
                      minimumFractionDigits: 2, 
                      maximumFractionDigits: 2 
                    })}
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
                  className={`bg-gray-200 dark:bg-gray-800 px-3 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-700 transition ${
                    operationLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  −
                </button>
                <span className="font-semibold">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.product.id, 1)}
                  disabled={operationLoading}
                  className={`bg-gray-200 dark:bg-gray-800 px-3 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-700 transition ${
                    operationLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  +
                </button>
              </div>

              <div className="flex flex-col items-center mt-3 sm:mt-0">
                <p className="font-semibold text-lg">
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
          );
        })}

        <div className="flex justify-between items-center mt-6 border-t pt-4">
          <h3 className="text-xl font-bold">Total:</h3>
          <p className="text-2xl font-semibold">
            ₹{totalPrice.toLocaleString("en-IN", { 
              minimumFractionDigits: 2, 
              maximumFractionDigits: 2 
            })}
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