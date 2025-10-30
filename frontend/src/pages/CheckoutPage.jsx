import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getAddresses } from "../api/profileApi";
import { createOrder } from "../api/orderApi";
import { fetchCart } from "../slices/cartSlice";
import notify from "../utils/notifications";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const items = useSelector(state => state.cart.items);
  const totalPrice = useSelector(state => state.cart.totalPrice);
  
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(false);
  const [addressLoading, setAddressLoading] = useState(true);

  useEffect(() => {
    loadAddresses();
    if (!items || items.length === 0) {
      dispatch(fetchCart());
    }
  }, []);

  const loadAddresses = async () => {
    try {
      const data = await getAddresses();
      setAddresses(data);
      const defaultAddr = data.find(a => a.is_default);
      if (defaultAddr) setSelectedAddress(defaultAddr.id);
    } catch (err) {
      notify.error("Failed to load addresses");
    } finally {
      setAddressLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      notify.error("Please select a delivery address");
      return;
    }
    if (!paymentMethod) {
      notify.error("Please select a payment method");
      return;
    }

    setLoading(true);
    try {
      const order = await createOrder({
        address_id: selectedAddress,
        payment_method: paymentMethod
      });
      notify.order.placed(order.id);
      navigate(`/order-success?orderId=${order.id}`);
    } catch (err) {
      const errorData = err?.response?.data;
      
      if (errorData?.out_of_stock) {
        // Show detailed out of stock message
        const outOfStockItems = errorData.out_of_stock.map(item => 
          `${item.product}: Requested ${item.requested}, Available ${item.available}`
        ).join('\n');
        notify.error(`Out of Stock:\n${outOfStockItems}`);
        
        // Refresh cart to update stock status
        dispatch(fetchCart());
      } else {
        notify.order.error(errorData?.error || "Failed to place order");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400 text-xl mb-4">Your cart is empty</p>
          <button
            onClick={() => navigate("/shop")}
            className="bg-black dark:bg-white dark:text-black text-white px-6 py-3 rounded-full hover:scale-105 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-black dark:text-white px-6 py-10">
      <h2 className="text-3xl font-bold text-center mb-8">🛒 Checkout</h2>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Section - Address & Payment */}
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Address */}
          <div className="bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-4">📍 Delivery Address</h3>
            
            {addressLoading ? (
              <div className="space-y-3">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="border dark:border-gray-700 p-4 rounded-lg animate-pulse">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : addresses.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400 mb-4">No addresses found</p>
                <button
                  onClick={() => navigate("/profile")}
                  className="text-blue-600 hover:underline"
                >
                  Add Address in Profile
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map(addr => (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddress(addr.id)}
                    className={`border p-4 rounded-lg cursor-pointer transition ${
                      selectedAddress === addr.id
                        ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-300 dark:border-gray-700 hover:border-blue-400"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          checked={selectedAddress === addr.id}
                          onChange={() => setSelectedAddress(addr.id)}
                          className="mt-1"
                        />
                        <div>
                          <h4 className="font-bold">
                            {addr.label}
                            {addr.is_default && (
                              <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                Default
                              </span>
                            )}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            {addr.street}, {addr.city}, {addr.state} {addr.postal_code}, {addr.country}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div className="bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-4">💳 Payment Method</h3>
            
            <div className="space-y-3">
              {["cod", "card", "upi", "wallet"].map(method => (
                <div
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`border p-4 rounded-lg cursor-pointer transition ${
                    paymentMethod === method
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-300 dark:border-gray-700 hover:border-blue-400"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      checked={paymentMethod === method}
                      onChange={() => setPaymentMethod(method)}
                    />
                    <div>
                      <h4 className="font-semibold capitalize">
                        {method === "cod" ? "Cash on Delivery" : method === "upi" ? "UPI" : method === "card" ? "Credit/Debit Card" : "Wallet"}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {method === "cod" && "Pay when you receive"}
                        {method === "card" && "Visa, Mastercard, Amex"}
                        {method === "upi" && "Google Pay, PhonePe, Paytm"}
                        {method === "wallet" && "Use wallet balance"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section - Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-6 sticky top-6">
            <h3 className="text-xl font-bold mb-4">📦 Order Summary</h3>
            
            <div className="space-y-3 mb-4">
              {items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    {item.product.name} × {item.quantity}
                  </span>
                  <span className="font-semibold">
                    ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t dark:border-gray-700 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span>₹{totalPrice.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Delivery</span>
                <span className="text-green-600">FREE</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t dark:border-gray-700 pt-2">
                <span>Total</span>
                <span>₹{totalPrice.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading || !selectedAddress || !paymentMethod}
              className={`w-full mt-6 py-3 rounded-full font-semibold transition ${
                loading || !selectedAddress || !paymentMethod
                  ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                  : "bg-black dark:bg-white dark:text-black text-white hover:scale-105"
              }`}
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>

            <button
              onClick={() => navigate("/cart")}
              className="w-full mt-3 py-3 border border-gray-300 dark:border-gray-700 rounded-full font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              Back to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
