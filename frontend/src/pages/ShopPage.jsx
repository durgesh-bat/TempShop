import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";

import {
  fetchProducts,
  setSearchQuery,
  setSelectedCategory,
  setSortOrder,
  setCurrentPage,
} from "../slices/productSlice";
import { addToCartThunk } from "../slices/cartSlice";

export default function ShopPage() {
  const dispatch = useDispatch();
  const {
    filteredItems,
    loading,
    error,
    searchQuery,
    selectedCategory,
    sortOrder,
    currentPage,
    itemsPerPage,
  } = useSelector((state) => state.products);

  const [categories, setCategories] = useState([]);
  const [adding, setAdding] = useState(false);
  const fallbackImg = "https://via.placeholder.com/300x200?text=No+Image";

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/categories/")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Failed to fetch categories:", err));
  }, []);

  // 🧮 Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const addToCart = async (productId) => {
    setAdding(true);
    try {
      await dispatch(addToCartThunk({ productId, quantity: 1 })).unwrap();
      alert("✅ Item added to cart!");
    } catch (err) {
      console.error('Add to cart error:', err);
      alert("❌ Error adding item to cart");
    } finally {
      setAdding(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-pulse text-lg">Loading products...</div>
      </div>
    );

  if (error)
    return <p className="text-center py-10 text-red-500 font-semibold">{error}</p>;

  return (
    <div className="min-h-screen px-6 py-10 bg-gray-50 dark:bg-black text-black dark:text-white">
      <h2 className="text-4xl font-extrabold mb-8 text-center">🛍️ Explore Our Products</h2>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-10 justify-between items-center">
        <input
          type="text"
          placeholder="🔍 Search products..."
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          className="border px-4 py-2 rounded-lg w-full md:w-1/3 dark:bg-gray-900 dark:text-white"
        />

        <select
          value={selectedCategory}
          onChange={(e) => dispatch(setSelectedCategory(e.target.value))}
          className="border px-4 py-2 rounded-lg dark:bg-gray-900 dark:text-white"
        >
          <option value="All">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          value={sortOrder}
          onChange={(e) => dispatch(setSortOrder(e.target.value))}
          className="border px-4 py-2 rounded-lg dark:bg-gray-900 dark:text-white"
        >
          <option value="">Sort By</option>
          <option value="asc">💸 Price: Low → High</option>
          <option value="desc">💰 Price: High → Low</option>
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {currentProducts.length === 0 && (
          <p className="text-center col-span-full text-gray-500">No products found.</p>
        )}

        {currentProducts.map((item) => (
          <div key={item.id} className="group bg-white dark:bg-gray-900 rounded-2xl shadow-md overflow-hidden p-2" >
            <Link to={`/product/${item.id}`}>
              <img
                src={`https://res.cloudinary.com/dq7zkxtnj/${item.image}`}
                alt={item.name}
                className="w-full h-60 object-cover rounded-t-2xl "
                onError={(e) => (e.target.src = fallbackImg)}
              />
            </Link>
            <div className="p-4 text-center">
              <h3 className="font-semibold text-lg">{item.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-3 min-h-[4.5rem]">
                {item.description.length > 100 
                  ? item.description.substring(0, 100) + "..." 
                  : item.description}
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-left">
                  {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
              </p>
              <div className="flex items-center text-center mb-2">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-5 h-5 ${
                            star <= (item.rating || 0)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-500">
                      ({item.rating || 0})
                    </span>
                  </div>
              <p className="mt-2 font-semibold">₹{item.price}</p>

              <button
                onClick={() => addToCart(item.id)}
                disabled={adding}
                className="mt-3 bg-white text-black px-4 py-2 rounded-full hover:scale-105 transition"
              >
                {adding ? "Adding..." : "🛒 Add to Cart"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 🧭 Pagination */}
      <div className="flex justify-center items-center mt-10 space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 disabled:opacity-50 cursor-pointer"
        >
          ⬅ Prev
        </button>

        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`px-3 py-1 rounded-md ${
              currentPage === index + 1
                ? "bg-black text-white dark:bg-white dark:text-black "
                : "bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 cursor-pointer"
            }`}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 disabled:opacity-50 cursor-pointer"
        >
          Next ➡
        </button>
      </div>
    </div>
  );
}
