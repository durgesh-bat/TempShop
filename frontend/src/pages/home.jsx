import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../slices/productSlice";
import { addToCartThunk } from "../slices/cartSlice";
import toast, { Toaster } from 'react-hot-toast';

export default function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: products, loading, error } = useSelector(state => state.products);
  const { isAuthenticated } = useSelector(state => state.auth);
  const [addingProducts, setAddingProducts] = useState({});

  const fallbackImg = "https://via.placeholder.com/300x200?text=No+Image";

  // Fetch products
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Handle add to cart
  const handleAddToCart = async (product) => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }

    setAddingProducts(prev => ({ ...prev, [product.id]: true }));
    try {
      await dispatch(addToCartThunk({ productId: product.id, quantity: 1 })).unwrap();
      toast.success(`${product.name} added to cart!`);
    } catch (err) {
      toast.error(err.message || "Failed to add item to cart");
    } finally {
      setAddingProducts(prev => ({ ...prev, [product.id]: false }));
    }
  };

  const scrollToProducts = () => {
    document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-white text-black dark:bg-black dark:text-white min-h-screen transition-all duration-300">
      <Toaster position="top-right" />

      {/* Hero */}
      <main className="text-center px-6 py-16">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
          Elevate Your Style with TempShop
        </h2>
        <p className="text-lg mb-8 max-w-xl mx-auto text-gray-700 dark:text-gray-300">
          Discover premium fashion and accessories that blend simplicity and elegance.
          Shop now with exclusive offers!
        </p>
        <button 
          onClick={scrollToProducts}
          className="bg-black text-white dark:bg-white dark:text-black px-6 py-3 rounded-full font-semibold hover:scale-105 transition"
        >
          Shop Now
        </button>
      </main>

      {/* Product Grid */}
      <section id="products-section" className="px-8 py-10">
        <h3 className="text-2xl font-semibold mb-6 text-center">Featured Products</h3>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl shadow p-2 animate-pulse">
                <div className="w-full h-60 bg-gray-300 dark:bg-gray-700 rounded-t-2xl"></div>
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
                  <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded-full mt-4"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-10">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={() => dispatch(fetchProducts())}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500 dark:text-gray-400 text-xl">No products found.</p>
          </div>
        )}

        {/* Products */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.slice(0, 8).map((item) => {
              const rating = Math.min(Math.max(item.rating || 0, 0), 5);
              
              return (
                <div
                  key={item.id}
                  className="group bg-white dark:bg-gray-900 rounded-2xl shadow hover:shadow-2xl p-2 transition-all duration-300 transform hover:-translate-y-2 flex flex-col justify-between min-h-[550px]"
                >
                  <Link to={`/product/${item.id}`}>
                    <img
                      src={
                        item.image
                          ? item.image.startsWith("http")
                            ? item.image
                            : `https://res.cloudinary.com/dq7zkxtnj/${item.image}`
                          : fallbackImg
                      }
                      alt={item.name}
                      className="w-full h-60 object-cover rounded-t-2xl group-hover:opacity-90 transition duration-300"
                      onError={(e) => (e.target.src = fallbackImg)}
                    />
                  </Link>

                  <div className="p-5 flex flex-col items-center text-center flex-grow">
                    <h3 className="font-semibold text-lg text-center line-clamp-2 overflow-hidden group-hover:text-blue-500 transition mb-2">
                      {item.name}
                    </h3>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-3 min-h-[4.5rem] mb-2">
                      {item.description?.length > 100 
                        ? item.description.substring(0, 100) + "..." 
                        : item.description || "No description available"}
                    </p>
                    
                    <p className="text-sm text-gray-500 dark:text-gray-500 mb-2">
                      {item.category ? item.category.charAt(0).toUpperCase() + item.category.slice(1) : 'Uncategorized'}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center mb-3">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-5 h-5 ${
                              star <= rating ? "text-yellow-400" : "text-gray-300"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-500">
                        ({rating.toFixed(1)})
                      </span>
                    </div>

                    {/* Price */}
                    <p className="text-gray-800 dark:text-gray-200 font-semibold text-lg mb-4">
                      {item.price != null
                        ? `₹${Number(item.price).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}`
                        : "Price N/A"}
                    </p>

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => handleAddToCart(item)}
                      disabled={addingProducts[item.id]}
                      className={`${
                        addingProducts[item.id] 
                          ? "bg-gray-400 cursor-not-allowed" 
                          : "bg-black dark:bg-white dark:text-black text-white hover:scale-105"
                      } px-6 py-2 rounded-full font-semibold transition w-full`}
                    >
                      {addingProducts[item.id] ? "Adding..." : "Add to Cart"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* View All Button */}
        {!loading && !error && products.length > 8 && (
          <div className="text-center mt-12">
            <Link 
              to="/shop"
              className="bg-black dark:bg-white dark:text-black text-white px-8 py-3 rounded-full font-semibold hover:scale-105 transition inline-block"
            >
              View All Products
            </Link>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="text-center py-6 border-t border-gray-300 dark:border-gray-700 text-sm">
        © {new Date().getFullYear()} TempShop. All rights reserved.
      </footer>
    </div>
  );
}