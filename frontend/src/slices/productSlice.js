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
  displayedItems: [],
  selectedProduct: null,
  loading: false,
  error: null,
  searchQuery: '',
  selectedCategory: 'All',
  sortOrder: '',
  itemsToShow: 8,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.itemsToShow = 8;
      state.filteredItems = filterProducts(state);
      state.displayedItems = state.filteredItems.slice(0, state.itemsToShow);
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
      state.itemsToShow = 8;
      state.filteredItems = filterProducts(state);
      state.displayedItems = state.filteredItems.slice(0, state.itemsToShow);
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
      state.filteredItems = filterProducts(state);
      state.displayedItems = state.filteredItems.slice(0, state.itemsToShow);
    },
    loadMoreItems: (state) => {
      state.itemsToShow += 8;
      state.displayedItems = state.filteredItems.slice(0, state.itemsToShow);
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
        state.displayedItems = state.filteredItems.slice(0, state.itemsToShow);
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch product details
      .addCase(fetchProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// 🧩 Helper function to filter and sort products
const filterProducts = (state) => {
  let filtered = [...state.items];

  // 🧩 Category filter
  if (state.selectedCategory !== 'All') {
    filtered = filtered.filter((product) => {
      // Handle both category ID and name comparison
      if (typeof state.selectedCategory === 'string' && state.selectedCategory !== 'All') {
        return product.category === state.selectedCategory || 
               product.category?.toString() === state.selectedCategory;
      }
      return true;
    });
  }

  // 🔍 Search filter
  if (state.searchQuery) {
    const query = state.searchQuery.toLowerCase();
    filtered = filtered.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category?.toLowerCase().includes(query)
    );
  }

  // ↕️ Sort filter
  if (state.sortOrder) {
    filtered.sort((a, b) => {
      if (state.sortOrder === 'asc') return parseFloat(a.price) - parseFloat(b.price);
      if (state.sortOrder === 'desc') return parseFloat(b.price) - parseFloat(a.price);
      return 0;
    });
  }

  return filtered;
};

export const {
  setSearchQuery,
  setSelectedCategory,
  setSortOrder,
  loadMoreItems,
} = productSlice.actions;

export default productSlice.reducer;
