import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function OrderSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    // Auto redirect after 5 seconds
    const timer = setTimeout(() => {
      navigate("/orders");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Order Placed Successfully! 🎉
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Your order #{orderId} has been confirmed
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg mb-6">
          <div className="space-y-3 text-left">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm">✓</span>
              </div>
              <span className="text-gray-700 dark:text-gray-300">Order confirmed</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <span className="text-gray-400 text-sm">2</span>
              </div>
              <span className="text-gray-500 dark:text-gray-400">Processing</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <span className="text-gray-400 text-sm">3</span>
              </div>
              <span className="text-gray-500 dark:text-gray-400">Shipped</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <span className="text-gray-400 text-sm">4</span>
              </div>
              <span className="text-gray-500 dark:text-gray-400">Delivered</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate("/orders")}
            className="w-full bg-black dark:bg-white dark:text-black text-white px-6 py-3 rounded-full font-semibold hover:scale-105 transition"
          >
            View My Orders
          </button>
          <button
            onClick={() => navigate("/shop")}
            className="w-full border border-gray-300 dark:border-gray-700 px-6 py-3 rounded-full font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            Continue Shopping
          </button>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">
          Redirecting to orders in 5 seconds...
        </p>
      </div>
    </div>
  );
}
