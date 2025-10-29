import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { addToCartThunk } from "../slices/cartSlice";
import { getWishlistProductIds, toggleWishlist } from "../api/profileApi";
import { searchProducts, getAllProducts, getProductsByCategorySlug } from "../api/productApi";
import { fetchCategories } from "../slices/categorySlice";
import toast, { Toaster } from 'react-hot-toast';

export default function ShopPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items: categories } = useSelector((state) => state.categories);
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState({});
  const [wishlistIds, setWishlistIds] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("");
  const [localSearch, setLocalSearch] = useState("");
  
  const searchQuery = searchParams.get("search") || "";
  const categorySlug = searchParams.get("category") || "";
  const fallbackImg = "https://via.placeholder.com/300x200?text=No+Image";

  useEffect(() => {
    loadProducts();
    dispatch(fetchCategories());
    if (isAuthenticated) loadWishlist();
  }, [searchQuery, categorySlug]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      let data;
      if (searchQuery) {
        data = await searchProducts(searchQuery);
      } else if (categorySlug) {
        data = await getProductsByCategorySlug(categorySlug);
      } else {
        data = await getAllProducts();
      }
      setProducts(data);
      setFilteredProducts(data);
    } catch (err) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const loadWishlist = async () => {
    try {
      const ids = await getWishlistProductIds();
      setWishlistIds(ids);
    } catch (err) {
      console.error("Error loading wishlist");
    }
  };

  useEffect(() => {
    let filtered = [...products];
    
    if (localSearch) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(localSearch.toLowerCase()) ||
        p.description.toLowerCase().includes(localSearch.toLowerCase())
      );
    }
    
    if (selectedCategory !== "All") {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    
    if (sortOrder === "asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "desc") {
      filtered.sort((a, b) => b.price - a.price);
    }
    
    setFilteredProducts(filtered);
  }, [products, localSearch, selectedCategory, sortOrder]);

  const addToCart = async (productId, productName) => {
    setAdding(prev => ({ ...prev, [productId]: true }));
    try {
      await dispatch(addToCartThunk({ productId, quantity: 1 })).unwrap();
      toast.success(`${productName} added to cart!`);
    } catch (err) {
      toast.error("Error adding item to cart");
    } finally {
      setAdding(prev => ({ ...prev, [productId]: false }));
    }
  };

  const handleToggleWishlist = async (e, product) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please login to add to wishlist");
      return;
    }
    const isInWishlist = wishlistIds.includes(product.id);
    try {
      await toggleWishlist(product.id, isInWishlist);
      setWishlistIds(isInWishlist ? wishlistIds.filter(id => id !== product.id) : [...wishlistIds, product.id]);
      toast.success(`${product.name} ${isInWishlist ? 'removed from' : 'added to'} wishlist!`);
    } catch (err) {
      toast.error("Failed to update wishlist");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-black">
        <div className="max-w-7xl mx-auto">
          <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded-lg w-64 mx-auto mb-8 animate-pulse"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl shadow p-2 animate-pulse">
                <div className="w-full h-60 bg-gray-300 dark:bg-gray-700 rounded-t-2xl"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-black">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-extrabold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {searchQuery ? `Search Results for "${searchQuery}"` : categorySlug ? `${categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1)} Products` : "Explore Our Products"}
        </h2>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Filter by name..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="w-full px-4 py-3 pl-10 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 outline-none transition"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 outline-none transition cursor-pointer"
            >
              <option value="All">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 outline-none transition cursor-pointer"
            >
              <option value="">Sort By</option>
              <option value="asc">Price: Low → High</option>
              <option value="desc">Price: High → Low</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
          Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
        </p>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-24 h-24 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-500 dark:text-gray-400 text-xl mb-4">No products found</p>
            <button onClick={() => { setLocalSearch(""); setSelectedCategory("All"); navigate("/shop"); }} className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition cursor-pointer">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((item) => (
              <div key={item.id} className="group bg-white dark:bg-gray-900 rounded-2xl shadow hover:shadow-2xl p-2 transition-all duration-300 transform hover:-translate-y-2 flex flex-col min-h-[500px] relative">
                {isAuthenticated && (
                  <button onClick={(e) => handleToggleWishlist(e, item)} className="absolute top-4 right-4 z-10 bg-white dark:bg-gray-800 p-2 rounded-full shadow hover:scale-110 transition cursor-pointer">
                    {wishlistIds.includes(item.id) ? "❤️" : "🤍"}
                  </button>
                )}
                <Link to={`/product/${item.id}`} className="cursor-pointer">
                  <img src={item.images?.[0]?.image || fallbackImg} alt={item.name} className="w-full h-60 object-cover rounded-t-2xl group-hover:opacity-90 transition" onError={(e) => (e.target.src = fallbackImg)} />
                </Link>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-semibold text-lg line-clamp-2 mb-2 group-hover:text-blue-500 transition">{item.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">{item.description || "No description"}</p>
                  <p className="text-sm text-gray-500 mb-2">{item.category}</p>
                  <div className="flex items-center mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className={`w-4 h-4 ${star <= (item.rating || 0) ? "text-yellow-400" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-1 text-sm text-gray-500">({(item.rating || 0).toFixed(1)})</span>
                  </div>
                  <p className="text-gray-800 dark:text-gray-200 font-semibold text-lg mb-4">₹{Number(item.price).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
                  <button onClick={() => addToCart(item.id, item.name)} disabled={adding[item.id]} className={`${adding[item.id] ? "bg-gray-400 cursor-not-allowed" : "bg-black dark:bg-white dark:text-black text-white hover:scale-105"} px-4 py-2 rounded-full font-semibold transition w-full mt-auto cursor-pointer`}>
                    {adding[item.id] ? "Adding..." : "Add to Cart"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
