import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../slices/productSlice";
import { addToCartThunk } from "../slices/cartSlice";

export default function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: products, loading, error } = useSelector(state => state.products);
  const { isAuthenticated } = useSelector(state => state.auth);
  const [adding, setAdding] = useState(false);

  const fallbackImg = "https://via.placeholder.com/300x200?text=No+Image";

  // Fetch products
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Handle add to cart
  const handleAddToCart = async (product) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setAdding(true);
    try {
      await dispatch(addToCartThunk({ productId: product.id, quantity: 1 })).unwrap();
      alert(`${product.name} added to cart`);
    } catch (err) {
      if (!isAuthenticated) {
        navigate("/login");
      } else {
        alert(err.message || "Failed to add item to cart");
      }
    } finally {
      setAdding(false);
    }
  };

  return (
    <div >
      <div className="bg-white text-black dark:bg-black dark:text-white min-h-screen transition-all duration-300">
        {/* Navbar */}
       

        {/* Hero */}
        <main className="text-center px-6 py-16">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            Elevate Your Style with TempShop
          </h2>
          <p className="text-lg mb-8 max-w-xl mx-auto text-gray-700 dark:text-gray-300">
            Discover premium fashion and accessories that blend simplicity and elegance.
            Shop now with exclusive offers!
          </p>
          <button className="bg-black text-white dark:bg-white dark:text-black px-6 py-3 rounded-full font-semibold hover:scale-105 transition">
            Shop Now
          </button>
        </main>

        {/* Product Grid */}
        <section className="px-8 py-10">
          <h3 className="text-2xl font-semibold mb-6 text-center">Featured Products</h3>

          {loading && <p className="text-center text-gray-500 dark:text-gray-400">Loading products...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}
          {!loading && !error && products.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400">No products found.</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((item) => (
              <div
                key={item.id}
                className="group bg-white dark:bg-gray-900 rounded-2xl shadow hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col justify-between"
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
                    className="w-full h-60 object-cover rounded-t-2xl group-hover:opacity-90 transition"
                    onError={(e) => (e.target.src = fallbackImg)}
                  />
                </Link>

                <div className="p-5 flex flex-col items-center text-center">
                  <h3 className="font-semibold text-lg text-center line-clamp-2 overflow-hidden group-hover:text-blue-500 transition">
                    {item.name}
                  </h3>


                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    {item.price != null
                      ? `₹${Number(item.price).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`
                      : "Price N/A"}
                  </p>
                  <button
                    onClick={() => handleAddToCart(item)}
                    disabled={adding}
                    className={`${
                      adding ? "bg-gray-400" : "bg-black dark:bg-white dark:text-black text-white"
                    } px-6 py-2 rounded-full font-semibold hover:scale-105 transition`}
                  >
                    {adding ? "Adding..." : "Add to Cart"}
                  </button>
                </div>
              </div>
            ))}
          </div>

        </section>

        {/* Footer */}
        <footer className="text-center py-6 border-t border-gray-300 dark:border-gray-700 text-sm">
          © {new Date().getFullYear()} TempShop. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
