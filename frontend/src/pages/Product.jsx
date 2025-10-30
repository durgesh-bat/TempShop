import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductDetails } from "../slices/productSlice";
import { addToCartThunk } from "../slices/cartSlice";
import { getWishlistProductIds, toggleWishlist, createReview, getProductReviews } from "../api/profileApi";
import { getSimilarProducts } from "../api/productApi";
import notify from "../utils/notifications";

export default function ProductPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct: product, loading, error } = useSelector(state => state.products);
  const { isAuthenticated } = useSelector(state => state.auth);
  const [adding, setAdding] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [review, setReview] = useState({ rating: 5, comment: "" });
  const [reviews, setReviews] = useState([]);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  const fallbackImg = "https://via.placeholder.com/500x400.png?text=No+Image";

  useEffect(() => {
    dispatch(fetchProductDetails(id));
    loadReviews();
    loadSimilarProducts();
    if (isAuthenticated) {
      checkWishlist();
    }
  }, [dispatch, id, isAuthenticated]);

  const loadReviews = async () => {
    try {
      const data = await getProductReviews(id);
      setReviews(data);
    } catch (err) {
      console.error("Error loading reviews");
    }
  };

  const checkWishlist = async () => {
    try {
      const ids = await getWishlistProductIds();
      setIsInWishlist(ids.includes(parseInt(id)));
    } catch (err) {
      console.error("Error checking wishlist");
    }
  };

  const loadSimilarProducts = async () => {
    try {
      const data = await getSimilarProducts(id);
      setSimilarProducts(data);
    } catch (err) {
      console.error("Error loading similar products");
    }
  };

  if (loading)
    return (
      <div className="bg-white text-black dark:bg-black dark:text-white min-h-screen transition-all duration-300">
        <main className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          {/* Image Skeleton */}
          <div className="flex flex-col items-center animate-pulse">
            <div className="w-full max-w-md h-96 bg-gray-300 dark:bg-gray-700 rounded-2xl mb-4"></div>
            <div className="flex gap-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-16 h-16 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          </div>
          
          {/* Details Skeleton */}
          <div className="space-y-4 animate-pulse">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-4/5"></div>
            </div>
            <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded-full w-32"></div>
          </div>
        </main>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        {error}
      </div>
    );

  if (!product)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Product not found.
      </div>
    );

  const primaryImage = product.images && product.images.length > 0
    ? product.images.find(img => img.is_primary)?.image || product.images[0].image
    : null;
  
  const imageUrl = primaryImage || fallbackImg;

  const handleAddToCart = async (productId) => {
    if (!isAuthenticated) {
      notify.auth.error("Please login to add items to cart");
      navigate("/login");
      return;
    }
    if (adding) return;
    setAdding(true);
    try {
      await dispatch(addToCartThunk({ productId, quantity: 1 })).unwrap();
      notify.cart.added(product.name, productId);
    } catch (err) {
      notify.cart.error(err.message || "Failed to add item");
    } finally {
      setAdding(false);
    }
  };

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      notify.auth.error("Please login to add to wishlist");
      navigate("/login");
      return;
    }
    try {
      await toggleWishlist(product.id, isInWishlist);
      setIsInWishlist(!isInWishlist);
      if (isInWishlist) {
        notify.wishlist.removed(product.name);
      } else {
        notify.wishlist.added(product.name, product.id);
      }
    } catch (err) {
      notify.wishlist.error("Failed to update wishlist");
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      notify.auth.error("Please login to submit a review");
      navigate("/login");
      return;
    }
    try {
      await createReview({ product_id: product.id, ...review });
      notify.review.submitted();
      setShowReview(false);
      setReview({ rating: 5, comment: "" });
      loadReviews();
    } catch (err) {
      notify.review.error("Failed to submit review");
    }
  };
  return (
    <div className="bg-white text-black dark:bg-black dark:text-white min-h-screen transition-all duration-300">
      {/* Product Section */}
      <main className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Images */}
        <div className="flex flex-col items-center">
          <div className="relative w-full max-w-md">
            <img
              src={product.images && product.images.length > 0 ? product.images[currentImageIndex]?.image || fallbackImg : fallbackImg}
              alt={product.name}
              onError={(e) => (e.target.src = fallbackImg)}
              loading="lazy"
              className="rounded-2xl shadow-lg w-full object-cover hover:scale-105 transition-transform duration-300 mb-4"
            />
            {product.images && product.images.length > 1 && (
              <>
                <button onClick={() => setCurrentImageIndex((currentImageIndex - 1 + product.images.length) % product.images.length)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 p-2 rounded-full hover:bg-white dark:hover:bg-gray-800 transition">
                  ←
                </button>
                <button onClick={() => setCurrentImageIndex((currentImageIndex + 1) % product.images.length)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 p-2 rounded-full hover:bg-white dark:hover:bg-gray-800 transition">
                  →
                </button>
              </>
            )}
          </div>
          
          {/* Additional Images */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((img, index) => (
                <img
                  key={img.id}
                  src={img.image}
                  alt={`${product.name} ${index + 1}`}
                  className={`w-16 h-16 object-cover rounded-lg cursor-pointer hover:opacity-75 transition ${currentImageIndex === index ? 'ring-2 ring-blue-500' : ''}`}
                  onError={(e) => (e.target.src = fallbackImg)}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

          <div className="flex flex-wrap gap-4 mb-4 text-gray-600 dark:text-gray-400">
            <span>
              Category: <span className="font-medium">{product.category}</span>
            </span>
            {product.subcategory && (
              <span>
                Subcategory: <span className="font-medium">{product.subcategory}</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 mb-4">
            <p className="text-2xl font-semibold text-black dark:text-white">
              {product.price != null
                ? `₹${Number(product.price).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`
                : "Price N/A"}
            </p>
            {product.total_stock !== undefined && (
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                product.total_stock === 0 ? 'bg-red-100 text-red-800 border border-red-300' :
                product.total_stock <= 10 ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' :
                'bg-green-100 text-green-800 border border-green-300'
              }`}>
                {product.total_stock === 0 ? 'Out of Stock' :
                 product.total_stock <= 10 ? `Only ${product.total_stock} left` :
                 'In Stock'}
              </span>
            )}
          </div>

          <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
            {product.description || "No description available for this product."}
          </p>

          <div className="flex gap-3 mt-4">
            <button
              onClick={() => handleAddToCart(product.id)}
              disabled={adding || product.total_stock === 0 || !product.is_available}
              className={`flex-1 bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-full hover:scale-105 transition ${
                adding || product.total_stock === 0 || !product.is_available ? 'opacity-50 cursor-not-allowed' : ''
              }`}>
                {product.total_stock === 0 || !product.is_available ? "Out of Stock" : adding ? "Adding..." : "Add to Cart"}
            </button>
            <button
              onClick={handleToggleWishlist}
              className="px-4 py-2 border-2 border-black dark:border-white rounded-full hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition">
              {isInWishlist ? "❤️" : "🤍"}
            </button>
          </div>

          <button
            onClick={() => setShowReview(!showReview)}
            className="mt-4 text-blue-600 dark:text-blue-400 hover:underline">
            {showReview ? "Cancel Review" : "⭐ Write a Review"}
          </button>

          {showReview && (
            <form onSubmit={handleSubmitReview} className="mt-4 p-4 border dark:border-gray-700 rounded-lg space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Rating</label>
                <select value={review.rating} onChange={(e) => setReview({ ...review, rating: e.target.value })} className="w-full p-2 border rounded dark:bg-gray-800">
                  {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} ⭐</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Comment</label>
                <textarea value={review.comment} onChange={(e) => setReview({ ...review, comment: e.target.value })} className="w-full p-2 border rounded dark:bg-gray-800" rows="3" placeholder="Share your experience..."></textarea>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">Submit Review</button>
            </form>
          )}

          <div>
            <Link
              to="/"
              className="text-sm text-gray-600 dark:text-gray-400 hover:underline cursor-pointer"
            >
              ← Back to Shop
            </Link>
          </div>
        </div>
      </main>

      {/* Reviews Section */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No reviews yet. Be the first to review!</p>
        ) : (
          <div className="space-y-4">
            {reviews.map(rev => (
              <div key={rev.id} className="border dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold">{rev.user?.username || "Anonymous"}</p>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < rev.rating ? "text-yellow-500" : "text-gray-300"}>★</span>
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{new Date(rev.created_at).toLocaleDateString()}</span>
                </div>
                {rev.comment && <p className="text-gray-700 dark:text-gray-300">{rev.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-bold mb-6">Similar Products</h2>
          <div className="relative">
            <div className="overflow-x-auto scrollbar-hide" id="similar-scroll">
              <div className="flex gap-6 pb-4">
                {similarProducts.map((item) => (
                  <div key={item.id} className="group bg-white dark:bg-gray-900 rounded-2xl shadow hover:shadow-2xl p-2 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer min-w-[250px]" onClick={() => navigate(`/product/${item.id}`)}>
                    <img src={item.images?.[0]?.image || fallbackImg} alt={item.name} className="w-full h-48 object-cover rounded-t-2xl" onError={(e) => (e.target.src = fallbackImg)} />
                    <div className="p-4">
                      <h3 className="font-semibold text-lg line-clamp-2 mb-2 group-hover:text-blue-500 transition">{item.name}</h3>
                      <div className="flex items-center mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg key={star} className={`w-4 h-4 ${star <= (item.rating || 0) ? "text-yellow-400" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="ml-1 text-sm text-gray-500">({(item.rating || 0).toFixed(1)})</span>
                      </div>
                      <p className="text-gray-800 dark:text-gray-200 font-semibold text-lg">₹{Number(item.price).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={() => document.getElementById('similar-scroll').scrollBy({ left: -300, behavior: 'smooth' })} className="absolute left-0 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg hover:scale-110 transition z-10">
              ←
            </button>
            <button onClick={() => document.getElementById('similar-scroll').scrollBy({ left: 300, behavior: 'smooth' })} className="absolute right-0 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg hover:scale-110 transition z-10">
              →
            </button>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="text-center py-6 border-t border-gray-300 dark:border-gray-700 text-sm">
        © {new Date().getFullYear()} TempShop. All rights reserved.
      </footer>
    </div>
  );
}
