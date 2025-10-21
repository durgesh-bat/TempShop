import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  shopkeeperRegister,
  shopkeeperLogin,
  getShopkeeperProfile,
  updateShopkeeperProfile,
  getShopkeeperProducts,
  createShopkeeperProduct,
  updateShopkeeperProduct,
  deleteShopkeeperProduct,
  getShopkeeperOrders,
  updateOrderStatus,
  getShopkeeperDashboard
} from '../api/shopkeeperApi';

// Authentication thunks
export const registerShopkeeper = createAsyncThunk(
  'shopkeeper/register',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await shopkeeperRegister(userData);
      const access = data.tokens?.access;
      const refresh = data.tokens?.refresh;
      if (access) localStorage.setItem("shopkeeper_access_token", access);
      if (refresh) localStorage.setItem("shopkeeper_refresh_token", refresh);
      return data;
    } catch (err) {
      const message = err?.response?.data?.detail || err?.response?.data || err.message || 'Registration failed';
      return rejectWithValue({ message });
    }
  }
);

export const loginShopkeeper = createAsyncThunk(
  'shopkeeper/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await shopkeeperLogin(credentials);
      const access = data.tokens?.access;
      const refresh = data.tokens?.refresh;
      if (access) localStorage.setItem("shopkeeper_access_token", access);
      if (refresh) localStorage.setItem("shopkeeper_refresh_token", refresh);
      return data;
    } catch (err) {
      const message = err?.response?.data?.detail || err?.response?.data || err.message || 'Login failed';
      return rejectWithValue({ message });
    }
  }
);

export const fetchShopkeeperProfile = createAsyncThunk(
  'shopkeeper/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getShopkeeperProfile();
      return data;
    } catch (err) {
      const message = err?.response?.data?.detail || err?.response?.data || err.message || 'Profile fetch failed';
      return rejectWithValue({ message });
    }
  }
);

export const updateShopkeeperProfileThunk = createAsyncThunk(
  'shopkeeper/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const data = await updateShopkeeperProfile(profileData);
      return data;
    } catch (err) {
      const message = err?.response?.data?.detail || err?.response?.data || err.message || 'Profile update failed';
      return rejectWithValue({ message });
    }
  }
);

// Product thunks
export const fetchShopkeeperProducts = createAsyncThunk(
  'shopkeeper/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getShopkeeperProducts();
      return data;
    } catch (err) {
      const message = err?.response?.data?.detail || err?.response?.data || err.message || 'Products fetch failed';
      return rejectWithValue({ message });
    }
  }
);

export const createShopkeeperProductThunk = createAsyncThunk(
  'shopkeeper/createProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const data = await createShopkeeperProduct(productData);
      return data;
    } catch (err) {
      const message = err?.response?.data?.detail || err?.response?.data || err.message || 'Product creation failed';
      return rejectWithValue({ message });
    }
  }
);

export const updateShopkeeperProductThunk = createAsyncThunk(
  'shopkeeper/updateProduct',
  async ({ productId, productData }, { rejectWithValue }) => {
    try {
      const data = await updateShopkeeperProduct(productId, productData);
      return data;
    } catch (err) {
      const message = err?.response?.data?.detail || err?.response?.data || err.message || 'Product update failed';
      return rejectWithValue({ message });
    }
  }
);

export const deleteShopkeeperProductThunk = createAsyncThunk(
  'shopkeeper/deleteProduct',
  async (productId, { rejectWithValue }) => {
    try {
      const data = await deleteShopkeeperProduct(productId);
      return { productId, data };
    } catch (err) {
      const message = err?.response?.data?.detail || err?.response?.data || err.message || 'Product deletion failed';
      return rejectWithValue({ message });
    }
  }
);

// Order thunks
export const fetchShopkeeperOrders = createAsyncThunk(
  'shopkeeper/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getShopkeeperOrders();
      return data;
    } catch (err) {
      const message = err?.response?.data?.detail || err?.response?.data || err.message || 'Orders fetch failed';
      return rejectWithValue({ message });
    }
  }
);

export const updateOrderStatusThunk = createAsyncThunk(
  'shopkeeper/updateOrderStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const data = await updateOrderStatus(orderId, status);
      return data;
    } catch (err) {
      const message = err?.response?.data?.detail || err?.response?.data || err.message || 'Order update failed';
      return rejectWithValue({ message });
    }
  }
);

// Dashboard thunk
export const fetchShopkeeperDashboard = createAsyncThunk(
  'shopkeeper/fetchDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getShopkeeperDashboard();
      return data;
    } catch (err) {
      const message = err?.response?.data?.detail || err?.response?.data || err.message || 'Dashboard fetch failed';
      return rejectWithValue({ message });
    }
  }
);

// Initial state
const initialState = {
  shopkeeper: null,
  products: [],
  orders: [],
  dashboard: null,
  loading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem("shopkeeper_access_token"),
};

// Slice
const shopkeeperSlice = createSlice({
  name: 'shopkeeper',
  initialState,
  reducers: {
    logoutShopkeeper: (state) => {
      localStorage.removeItem("shopkeeper_access_token");
      localStorage.removeItem("shopkeeper_refresh_token");
      state.shopkeeper = null;
      state.isAuthenticated = false;
      state.products = [];
      state.orders = [];
      state.dashboard = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Register
    builder
      .addCase(registerShopkeeper.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerShopkeeper.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.shopkeeper = action.payload.shopkeeper;
      })
      .addCase(registerShopkeeper.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Registration failed';
      });

    // Login
    builder
      .addCase(loginShopkeeper.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginShopkeeper.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.shopkeeper = action.payload.shopkeeper;
      })
      .addCase(loginShopkeeper.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Login failed';
      });

    // Fetch Profile
    builder
      .addCase(fetchShopkeeperProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShopkeeperProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.shopkeeper = action.payload;
      })
      .addCase(fetchShopkeeperProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Profile fetch failed';
      });

    // Update Profile
    builder
      .addCase(updateShopkeeperProfileThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateShopkeeperProfileThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.shopkeeper = action.payload;
      })
      .addCase(updateShopkeeperProfileThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Profile update failed';
      });

    // Fetch Products
    builder
      .addCase(fetchShopkeeperProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShopkeeperProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchShopkeeperProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Products fetch failed';
      });

    // Create Product
    builder
      .addCase(createShopkeeperProductThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createShopkeeperProductThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
      })
      .addCase(createShopkeeperProductThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Product creation failed';
      });

    // Update Product
    builder
      .addCase(updateShopkeeperProductThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateShopkeeperProductThunk.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(product => product.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(updateShopkeeperProductThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Product update failed';
      });

    // Delete Product
    builder
      .addCase(deleteShopkeeperProductThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteShopkeeperProductThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(product => product.id !== action.payload.productId);
      })
      .addCase(deleteShopkeeperProductThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Product deletion failed';
      });

    // Fetch Orders
    builder
      .addCase(fetchShopkeeperOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShopkeeperOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchShopkeeperOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Orders fetch failed';
      });

    // Update Order Status
    builder
      .addCase(updateOrderStatusThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatusThunk.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.orders.findIndex(order => order.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      .addCase(updateOrderStatusThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Order update failed';
      });

    // Fetch Dashboard
    builder
      .addCase(fetchShopkeeperDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShopkeeperDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = action.payload;
      })
      .addCase(fetchShopkeeperDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Dashboard fetch failed';
      });
  },
});

export const { logoutShopkeeper, clearError } = shopkeeperSlice.actions;
export default shopkeeperSlice.reducer;
