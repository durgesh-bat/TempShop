import React, { useState, useEffect } from "react";
import { getWishlist, removeFromWishlist } from "../api/profileApi";
import { useNavigate } from "react-router-dom";
import notify from "../utils/notifications";

export default function WishlistView() {
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    const data = await getWishlist();
    setWishlist(data);
  };

  const handleRemove = async (id) => {
    const item = wishlist.find(w => w.id === id);
    try {
      await removeFromWishlist(id);
      notify.wishlist.removed(item?.product?.name || "Item");
      loadWishlist();
    } catch (err) {
      notify.wishlist.error("Failed to remove from wishlist");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">My Wishlist</h2>
      
      {wishlist.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No items in wishlist</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishlist.map(item => (
            <div key={item.id} className="border dark:border-gray-700 rounded-lg p-4 hover:shadow-lg transition">
              <img 
                src={item.product?.images?.[0]?.image || "https://placehold.co/200x200?text=No+Image"} 
                alt={item.product?.name}
                className="w-full h-40 object-cover rounded-lg mb-3"
              />
              <h3 className="font-bold text-gray-800 dark:text-white mb-1">{item.product?.name}</h3>
              <p className="text-blue-600 font-semibold mb-2">₹ {item.product?.price}</p>
              <div className="flex gap-2">
                <button 
                  onClick={() => navigate(`/product/${item.product?.id}`)} 
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 text-sm"
                >
                  View
                </button>
                <button 
                  onClick={() => handleRemove(item.id)} 
                  className="px-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  ❌
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
