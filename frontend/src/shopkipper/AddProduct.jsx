import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { 
  createShopkeeperProductThunk, 
  fetchShopkeeperProducts,
  clearError 
} from "../slices/shopkeeperSlice";
import { cacheManager, CACHE_KEYS } from "../utils/cacheManager";
import { showToast } from "../utils/toast";

export default function AddProduct() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.shopkeeper);
  
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    stock_quantity: "",
    image: null,
  });

  useEffect(() => {
    const token = localStorage.getItem('shopkeeper_access_token');
    if (!token) {
      navigate("/shopkeeper");
      return;
    }
    
    dispatch(fetchShopkeeperProducts());
  }, [dispatch, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageChange = (e) => {
    setForm({ ...form, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.image) {
      return showToast.error("Please fill all required fields");
    }

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('category', form.category);
      formData.append('price', form.price);
      formData.append('description', form.description);
      formData.append('stock_quantity', form.stock_quantity || 0);
      formData.append('image', form.image);

      await dispatch(createShopkeeperProductThunk(formData)).unwrap();
      
      cacheManager.clear(CACHE_KEYS.PRODUCTS);
      
      setForm({
        name: "",
        category: "",
        price: "",
        description: "",
        stock_quantity: "",
        image: null,
      });
      
      document.querySelector('input[type="file"]').value = '';
      
      dispatch(fetchShopkeeperProducts());
      
      showToast.success("Product added successfully!");
    } catch (err) {
      console.error("Product creation failed:", err);
    }
  };

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-2 rounded-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Add Product
                </h1>
              </div>
            </div>
            <button
              onClick={() => navigate("/shopkeeper/dashboard")}
              className="text-gray-600 hover:text-gray-800"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Upload Form */}
        <div className="bg-white p-8 rounded-2xl shadow-xl mb-10">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Product</h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-gray-700 font-semibold">Product Name *</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-200"
                placeholder="e.g. Wireless Headphones"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-700 font-semibold">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-200"
              >
                <option value="">Select Category</option>
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing</option>
                <option value="groceries">Groceries</option>
                <option value="books">Books</option>
                <option value="home">Home & Garden</option>
                <option value="sports">Sports</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 text-gray-700 font-semibold">Price (₹) *</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-200"
                placeholder="e.g. 1499"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-700 font-semibold">Stock Quantity</label>
              <input
                type="number"
                name="stock_quantity"
                value={form.stock_quantity}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-200"
                placeholder="e.g. 50"
                min="0"
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-700 font-semibold">Product Image *</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-200"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block mb-2 text-gray-700 font-semibold">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-200"
                placeholder="Short product details..."
              ></textarea>
            </div>

            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 text-white rounded-lg shadow-lg font-semibold"
              >
                {loading ? "Adding Product..." : "Add Product"}
              </button>
            </div>
          </form>
        </div>

        {/* Product Listing */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Products</h2>

          {loading ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-10 text-center">
              <p className="text-gray-500">No products uploaded yet.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white p-4 rounded-xl shadow-lg hover:shadow-2xl transition"
                >
                  <img
                    src={product.image || "https://via.placeholder.com/300x200?text=No+Image"}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded-lg mb-3"
                  />
                  <h3 className="text-lg font-bold text-gray-800">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500">{product.category}</p>
                  <p className="text-purple-600 font-bold mt-1">₹{product.price}</p>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="mt-3 flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      Stock: {product.stock_quantity}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      product.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {product.is_available ? 'Available' : 'Out of Stock'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
