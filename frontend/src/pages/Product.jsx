import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);

  const fallbackImg = "https://via.placeholder.com/500x400.png?text=No+Image";

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/product/${id}/`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600 dark:text-gray-300">
        Loading product...
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

  const imageUrl = product.image
    ? product.image.startsWith("http")
      ? product.image
      : `https://res.cloudinary.com/dq7zkxtnj/${product.image}`
    : fallbackImg;

  const addToCart = async (productId) => {
    setAdding(true);
    try {
      const token = localStorage.getItem("access");
      await axios.post(
        `http://127.0.0.1:8000/api/cart/${productId}/`,
        { quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Item added to cart!");
    } catch {
      alert("Error adding item to cart");
    } finally {
      setAdding(false);
    }
  };
  return (
    <div className="bg-white text-black dark:bg-black dark:text-white min-h-screen transition-all duration-300">
      {/* Product Section */}
      <main className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Image */}
        <div className="flex justify-center">
          <img
            src={imageUrl}
            alt={product.name}
            onError={(e) => (e.target.src = fallbackImg)}
            loading="lazy"
            className="rounded-2xl shadow-lg w-full max-w-md object-cover hover:scale-105 transition-transform duration-300"
          />
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

          <p className="text-2xl font-semibold text-black dark:text-white mb-4">
            {product.price != null
              ? `₹${Number(product.price).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`
              : "Price N/A"}
          </p>

          <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
            {product.description || "No description available for this product."}
          </p>

          <button
              onClick={() => addToCart(product.id)}
              className="mt-3 bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-full hover:scale-105 transition">
                {adding ? "Adding..." : "Add to Cart"}
          </button>

          <div>
            <Link
              to="/"
              className="text-sm text-gray-600 dark:text-gray-400 hover:underline"
            >
              ← Back to Shop
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 border-t border-gray-300 dark:border-gray-700 text-sm">
        © {new Date().getFullYear()} TempShop. All rights reserved.
      </footer>
    </div>
  );
}
