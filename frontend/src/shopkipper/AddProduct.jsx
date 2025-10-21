import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { 
  createShopkeeperProductThunk, 
  fetchShopkeeperProducts,
  clearError 
} from "../slices/shopkeeperSlice";

export default function AddProduct() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { products, loading, error, isAuthenticated } = useSelector((state) => state.shopkeeper);
  
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    stock_quantity: "",
    image: null,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/shopkeeper/login");
      return;
    }
    
    dispatch(fetchShopkeeperProducts());
  }, [dispatch, navigate, isAuthenticated]);

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
      return alert("Please fill all required fields");
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
      
      // Reset form
      setForm({
        name: "",
        category: "",
        price: "",
        description: "",
        stock_quantity: "",
        image: null,
      });
      
      // Refresh products list
      dispatch(fetchShopkeeperProducts());
      
      alert("Product added successfully!");
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
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          🛍️ TempShop - Product Upload & Listing
        </h1>

        {/* Upload Form */}
        <div className="bg-white p-6 rounded-2xl shadow-md mb-10">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Add New Product</h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-gray-600">Product Name *</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
                placeholder="e.g. Wireless Headphones"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-600">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
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
              <label className="block mb-1 text-gray-600">Price (₹) *</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
                placeholder="e.g. 1499"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-600">Stock Quantity</label>
              <input
                type="number"
                name="stock_quantity"
                value={form.stock_quantity}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
                placeholder="e.g. 50"
                min="0"
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-600">Product Image *</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block mb-1 text-gray-600">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
                placeholder="Short product details..."
              ></textarea>
            </div>

            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl shadow"
              >
                {loading ? "Adding Product..." : "Add Product"}
              </button>
            </div>
          </form>
        </div>

        {/* Product Listing */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Your Products</h2>

          {loading ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <p className="text-gray-500 text-center py-10">No products uploaded yet.</p>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition"
                >
                  <img
                    src={product.image || "https://via.placeholder.com/300x200?text=No+Image"}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded-lg mb-3"
                  />
                  <h3 className="text-lg font-semibold text-gray-800">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500">{product.category}</p>
                  <p className="text-blue-600 font-semibold mt-1">₹{product.price}</p>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      Stock: {product.stock_quantity}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
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
