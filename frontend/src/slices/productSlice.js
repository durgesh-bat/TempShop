import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllProducts, getProductDetails } from '../api/productApi';

// Async thunk for fetching all products
export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async () => {
    const data = await getAllProducts();
    return data;
  }
);

// Async thunk for fetching a single product
export const fetchProductDetails = createAsyncThunk(
  'products/fetchDetails',
  async (productId) => {
    const data = await getProductDetails(productId);
    return data;
  }
);

const initialState = {
  items: [],
  filteredItems: [],
  selectedProduct: null,
  loading: false,
  error: null,
  searchQuery: '',
  selectedCategory: 'All',
  sortOrder: '',
  currentPage: 1,       // 🔹 pagination: current page
  itemsPerPage: 8,      // 🔹 items per page
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.currentPage = 1; // reset page when filter changes
      state.filteredItems = filterProducts(state);
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
      state.currentPage = 1;
      state.filteredItems = filterProducts(state);
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
      state.filteredItems = filterProducts(state);
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload; // 🔹 set active page
    },
  },
  extraReducers: (builder) => {
    const sortByLatest = (products) => {
      return [...products].sort((a, b) => b.id - a.id);
    };

    builder
      // Fetch all products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = sortByLatest(action.payload);
        state.filteredItems = filterProducts(state);
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch product details
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.selectedProduct = action.payload;
      });
  },
});

// 🧩 Helper function to filter and sort products
const filterProducts = (state) => {
  let filtered = [...state.items];

  // 🧩 Category filter
  if (state.selectedCategory !== 'All') {
    filtered = filtered.filter(
      (product) => product.category?.name === state.selectedCategory
    );
  }

  // 🔍 Search filter
  if (state.searchQuery) {
    const query = state.searchQuery.toLowerCase();
    filtered = filtered.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
    );
  }

  // ↕️ Sort filter
  if (state.sortOrder) {
    filtered.sort((a, b) => {
      if (state.sortOrder === 'price-asc') return a.price - b.price;
      if (state.sortOrder === 'price-desc') return b.price - a.price;
      return 0;
    });
  }

  return filtered;
};

export const {
  setSearchQuery,
  setSelectedCategory,
  setSortOrder,
  setCurrentPage,
} = productSlice.actions;

export default productSlice.reducer;
