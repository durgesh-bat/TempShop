import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");  
  const [sortOrder, setSortOrder] = useState("");

  const fallbackImg = "https://via.placeholder.com/300x200?text=No+Image";

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/products/");
        setProducts(res.data);
        setFilteredProducts(res.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Fetch categories from API
useEffect(() => {
  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/categories/");
      // res.data: [{id, name, subcategories: [...]}, ...]
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };
  fetchCategories();
}, []);

  // Filter, search, sort
useEffect(() => {
  let temp = [...products];

  if (searchQuery)
    temp = temp.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  if (selectedCategory !== "All")
    temp = temp.filter((p) => p.category.id === selectedCategory);

  if (sortOrder === "asc") temp.sort((a, b) => a.price - b.price);
  if (sortOrder === "desc") temp.sort((a, b) => b.price - a.price);

  setFilteredProducts(temp);
}, [searchQuery, selectedCategory, sortOrder, products]);

  const addToCart = async (productId) => {
    setAdding(true);
    try {
      const token = localStorage.getItem("access");
      await axios.post(
        `http://127.0.0.1:8000/api/cart/${productId}/`,
        { quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Item added to cart!");
    } catch {
      alert("❌ Error adding item to cart");
    } finally {
      setAdding(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50 dark:bg-black text-gray-400">
        <div className="animate-pulse text-lg">Loading products...</div>
      </div>
    );

  if (error)
    return (
      <p className="text-center py-10 text-red-500 font-semibold">{error}</p>
    );

  return (
    <div className="min-h-screen px-6 py-10 bg-gray-50 dark:bg-black text-black dark:text-white transition">
      <h2 className="text-4xl font-extrabold mb-8 text-center tracking-tight">
        🛍️ Explore Our Products
      </h2>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-10 justify-between items-center">
        <input
          type="text"
          placeholder="🔍 Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 dark:border-gray-700 px-4 py-2 rounded-lg w-full md:w-1/3 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
        />

        <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 px-4 py-2 rounded-lg dark:bg-gray-900 dark:text-white focus:outline-none"
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
          onChange={(e) => setSortOrder(e.target.value)}
          className="border border-gray-300 dark:border-gray-700 px-4 py-2 rounded-lg dark:bg-gray-900 dark:text-white focus:outline-none"
        >
          <option value="">Sort By</option>
          <option value="asc">💸 Price: Low → High</option>
          <option value="desc">💰 Price: High → Low</option>
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredProducts.length === 0 && (
          <p className="text-center col-span-full text-gray-500">
            No products found.
          </p>
        )}

        {filteredProducts.map((item) => (
          <div
            key={item.id}
            className="group bg-white dark:bg-gray-900 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden relative"
          >
            <Link to={`/product/${item.id}`}>
              <div className="relative">
                <img
                  src={`https://res.cloudinary.com/dq7zkxtnj/${item.image}`}
                  alt={item.name}
                  className="w-full h-60 object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => (e.target.src = fallbackImg)}
                />
                <div className="absolute top-3 right-3 bg-black text-white text-xs px-2 py-1 rounded-full opacity-80">
                  {item.category.name}
                </div>
              </div>
            </Link>

            <div className="p-4 flex flex-col justify-between h-36">
              <div>
                <h3 className="font-semibold text-lg truncate">{item.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">
                  {item.price != null
                    ? `₹${Number(item.price).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                    : "Price N/A"}
                </p>
              </div>

              <button
                onClick={() => addToCart(item.id)}
                disabled={adding}
                className="mt-3 bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-full font-medium hover:scale-105 transition active:scale-95"
              >
                {adding ? "Adding..." : "🛒 Add to Cart"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
