import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCartThunk } from "../slices/cartSlice";
import notify from '../utils/notifications';
import { getWishlistProductIds, toggleWishlist } from "../api/profileApi";
import { getProductsByCategory, getRecentlyViewed } from "../api/productApi";
import { getAllCategories } from "../api/categoryApi";

export default function HomePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);
  const [categories, setCategories] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingProducts, setAddingProducts] = useState({});
  const [wishlistIds, setWishlistIds] = useState([]);

  const fallbackImg = "https://via.placeholder.com/300x200?text=No+Image";

  useEffect(() => {
    loadData();
  }, [isAuthenticated]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [categoriesData, categoryData, wishlistData, recentData] = await Promise.all([
        getAllCategories(),
        getProductsByCategory(),
        isAuthenticated ? getWishlistProductIds() : Promise.resolve([]),
        isAuthenticated ? getRecentlyViewed() : Promise.resolve([])
      ]);
      setCategories(categoriesData);
      setCategoryProducts(categoryData);
      setWishlistIds(wishlistData);
      setRecentlyViewed(recentData);
    } catch (err) {
      notify.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    if (!isAuthenticated) {
      notify.auth.error("Please login to add items to cart");
      navigate("/login");
      return;
    }
    setAddingProducts(prev => ({ ...prev, [product.id]: true }));
    try {
      await dispatch(addToCartThunk({ productId: product.id, quantity: 1 })).unwrap();
      notify.cart.added(product.name);
    } catch (err) {
      notify.cart.error(err.message || "Failed to add item to cart");
    } finally {
      setAddingProducts(prev => ({ ...prev, [product.id]: false }));
    }
  };

  const handleToggleWishlist = async (e, product) => {
    e.preventDefault();
    if (!isAuthenticated) {
      notify.auth.error("Please login to add to wishlist");
      navigate("/login");
      return;
    }
    const isInWishlist = wishlistIds.includes(product.id);
    try {
      await toggleWishlist(product.id, isInWishlist);
      setWishlistIds(isInWishlist ? wishlistIds.filter(id => id !== product.id) : [...wishlistIds, product.id]);
      if (isInWishlist) {
        notify.wishlist.removed(product.name);
      } else {
        notify.wishlist.added(product.name);
      }
    } catch (err) {
      notify.wishlist.error("Failed to update wishlist");
    }
  };

  const ProductCard = ({ item }) => (
    <div className="group bg-white dark:bg-gray-900 rounded-2xl shadow hover:shadow-2xl p-2 transition-all duration-300 transform hover:-translate-y-2 flex flex-col min-h-[450px] relative">
      {isAuthenticated && (
        <button onClick={(e) => handleToggleWishlist(e, item)} className="absolute top-4 right-4 z-10 bg-white dark:bg-gray-800 p-2 rounded-full shadow hover:scale-110 transition">
          {wishlistIds.includes(item.id) ? "❤️" : "🤍"}
        </button>
      )}
      <Link to={`/product/${item.id}`}>
        <img src={item.images?.[0]?.image || fallbackImg} alt={item.name} className="w-full h-48 object-cover rounded-t-2xl" onError={(e) => (e.target.src = fallbackImg)} />
      </Link>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-lg line-clamp-2 mb-2 group-hover:text-blue-500 transition">{item.name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">{item.description || "No description"}</p>
        <div className="flex items-center mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg key={star} className={`w-4 h-4 ${star <= (item.rating || 0) ? "text-yellow-400" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="ml-1 text-sm text-gray-500">({(item.rating || 0).toFixed(1)})</span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-gray-800 dark:text-gray-200 font-semibold text-lg">₹{Number(item.price).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
          {item.total_stock !== undefined && (
            <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
              item.total_stock === 0 ? 'bg-red-100 text-red-800' :
              item.total_stock <= 10 ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {item.total_stock === 0 ? 'Out' : item.total_stock <= 10 ? `${item.total_stock} left` : 'In Stock'}
            </span>
          )}
        </div>
        <button onClick={() => handleAddToCart(item)} disabled={addingProducts[item.id] || item.total_stock === 0 || !item.is_available} className={`${addingProducts[item.id] || item.total_stock === 0 || !item.is_available ? "bg-gray-400 cursor-not-allowed" : "bg-black dark:bg-white dark:text-black text-white hover:scale-105"} px-4 py-2 rounded-full font-semibold transition w-full mt-auto`}>
          {item.total_stock === 0 || !item.is_available ? "Out of Stock" : addingProducts[item.id] ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-white text-black dark:bg-black dark:text-white min-h-screen transition-all duration-300">

      {/* Hero */}
      <main className="text-center px-6 py-16 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4">Elevate Your Style with TempShop</h2>
        <p className="text-lg mb-8 max-w-xl mx-auto text-gray-700 dark:text-gray-300">Discover premium fashion and accessories that blend simplicity and elegance.</p>
        <Link to="/shop" className="bg-black text-white dark:bg-white dark:text-black px-6 py-3 rounded-full font-semibold hover:scale-105 transition inline-block cursor-pointer">
          Shop Now
        </Link>
      </main>

      {loading ? (
        <div className="px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl shadow p-2 animate-pulse">
                <div className="w-full h-48 bg-gray-300 dark:bg-gray-700 rounded-t-2xl"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded-full mt-4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
        {/* Recently Viewed */}
          {isAuthenticated && recentlyViewed.length > 0 && (
            <section className="px-8 py-10 bg-gray-50 dark:bg-gray-900">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold">Recently Viewed</h3>
              </div>
              <div className="relative">
                <div className="overflow-x-auto scrollbar-hide" id="recent-scroll">
                  <div className="flex gap-6 pb-4">
                    {recentlyViewed.map((item) => <div key={item.id} className="min-w-[280px]"><ProductCard item={item} /></div>)}
                  </div>
                </div>
                {recentlyViewed.length > 4 && (
                  <>
                    <button onClick={() => document.getElementById('recent-scroll').scrollBy({ left: -300, behavior: 'smooth' })} className="absolute left-0 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg hover:scale-110 transition z-10">
                      ←
                    </button>
                    <button onClick={() => document.getElementById('recent-scroll').scrollBy({ left: 300, behavior: 'smooth' })} className="absolute right-0 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg hover:scale-110 transition z-10">
                      →
                    </button>
                  </>
                )}
              </div>
            </section>
          )}
          {/* Category Showcase */}
          {categories.length > 0 && (
            <section className="px-8 py-10 bg-gray-50 dark:bg-gray-900">
              <h3 className="text-3xl font-bold mb-6 text-center">Shop by Category</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {categories.map((cat) => (
                  <Link key={cat.id} to={`/shop?category=${cat.slug}`} className="group cursor-pointer">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                      <div className="aspect-square relative">
                        <img src={cat.image || fallbackImg} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" onError={(e) => (e.target.src = fallbackImg)} />
                      </div>
                      <div className="p-4 text-center">
                        <h4 className="font-semibold text-lg group-hover:text-blue-500 transition">{cat.name}</h4>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          

          {/* Category Sections */}
          {categoryProducts.map((section) => (
            <section key={section.category.id} className="px-8 py-10">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  {section.category.image && (
                    <img src={section.category.image} alt={section.category.name} className="w-12 h-12 rounded-full object-cover" />
                  )}
                  <h3 className="text-2xl font-semibold">{section.category.name}</h3>
                </div>
                <Link to={`/shop?category=${section.category.slug}`} className="text-blue-500 hover:underline cursor-pointer">View All</Link>
              </div>
              <div className="relative">
                <div className="overflow-x-auto scrollbar-hide" id={`category-${section.category.id}-scroll`}>
                  <div className="flex gap-6 pb-4">
                    {section.products.map((item) => <div key={item.id} className="min-w-[280px]"><ProductCard item={item} /></div>)}
                  </div>
                </div>
                {section.products.length > 4 && (
                  <>
                    <button onClick={() => document.getElementById(`category-${section.category.id}-scroll`).scrollBy({ left: -300, behavior: 'smooth' })} className="absolute left-0 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg hover:scale-110 transition z-10">
                      ←
                    </button>
                    <button onClick={() => document.getElementById(`category-${section.category.id}-scroll`).scrollBy({ left: 300, behavior: 'smooth' })} className="absolute right-0 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg hover:scale-110 transition z-10">
                      →
                    </button>
                  </>
                )}
              </div>
            </section>
          ))}

        </>
      )}

      {/* Footer */}
      <footer className="text-center py-6 border-t border-gray-300 dark:border-gray-700 text-sm">
        © {new Date().getFullYear()} TempShop. All rights reserved.
      </footer>
    </div>
);
}