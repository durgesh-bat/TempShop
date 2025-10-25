import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCart, addToCart, removeFromCart, updateCartQuantity } from '../api/cartApi';

// Fetch cart
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getCart();
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Add to cart
export const addToCartThunk = createAsyncThunk(
  'cart/addItem',
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      await addToCart(productId, quantity);
      const cartData = await getCart();
      return cartData;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Update cart item (set absolute quantity)
export const updateCartItem = createAsyncThunk(
  'cart/updateItem',
  async ({ itemId, newQty }, { rejectWithValue, getState }) => {
    try {
      if (itemId === null || itemId === undefined) {
        return rejectWithValue('Invalid item ID');
      }
      
      const currentItem = getState().cart.items.find(item => item.product.id === itemId);
      if (!currentItem) {
        return rejectWithValue('Item not found in cart');
      }
      
      const updatedQuantity = currentItem.quantity + newQty;
      if (updatedQuantity <= 0) {
        return rejectWithValue('Quantity must be greater than 0');
      }
      
      await updateCartQuantity(itemId, updatedQuantity);
      const cartData = await getCart();
      return cartData;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message || 'Update failed');
    }
  }
);

// Remove cart item
export const removeCartItem = createAsyncThunk(
  'cart/removeItem',
  async ({ itemId }, { rejectWithValue }) => {
    try {
      await removeFromCart(itemId);
      return itemId; // Return productId for optimistic update
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
  operationLoading: false,
  totalQuantity: 0,
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch cart
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && Array.isArray(action.payload.items)) {
          state.items = action.payload.items;
          state.totalQuantity = action.payload.items.reduce((acc, item) => acc + (item.quantity || 0), 0);
          state.totalPrice = action.payload.items.reduce((acc, item) => 
            acc + ((item.product?.price || 0) * (item.quantity || 0)), 0);
        } else {
          state.items = [];
          state.totalQuantity = 0;
          state.totalPrice = 0;
        }
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || 'Failed to fetch cart';
      });

    // Add to cart
    builder
      .addCase(addToCartThunk.pending, (state) => {
        state.operationLoading = true;
        state.error = null;
      })
      .addCase(addToCartThunk.fulfilled, (state, action) => {
        state.operationLoading = false;
        if (action.payload && Array.isArray(action.payload.items)) {
          state.items = action.payload.items;
          state.totalQuantity = action.payload.items.reduce((acc, item) => acc + (item.quantity || 0), 0);
          state.totalPrice = action.payload.items.reduce((acc, item) => 
            acc + ((item.product?.price || 0) * (item.quantity || 0)), 0);
        }
      })
      .addCase(addToCartThunk.rejected, (state, action) => {
        state.operationLoading = false;
        state.error = action.payload || action.error.message || 'Failed to add item';
      });

    // Update cart item
    builder
      .addCase(updateCartItem.pending, (state) => {
        state.operationLoading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.operationLoading = false;
        if (action.payload && Array.isArray(action.payload.items)) {
          state.items = action.payload.items;
          state.totalQuantity = action.payload.items.reduce((acc, item) => acc + (item.quantity || 0), 0);
          state.totalPrice = action.payload.items.reduce((acc, item) => 
            acc + ((item.product?.price || 0) * (item.quantity || 0)), 0);
        }
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.operationLoading = false;
        state.error = action.payload || action.error.message || 'Failed to update item';
      });

    // Remove cart item
    builder
      .addCase(removeCartItem.pending, (state) => {
        state.operationLoading = true;
        state.error = null;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.operationLoading = false;
        const productId = action.payload;
        
        const item = state.items.find(item => item.product.id === productId);
        if (item) {
          state.totalQuantity -= item.quantity;
          state.totalPrice -= item.product.price * item.quantity;
          state.items = state.items.filter(item => item.product.id !== productId);
        }
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.operationLoading = false;
        state.error = action.payload || action.error.message || 'Failed to remove item';
      });


  },
});

export const { clearCart } = cartSlice.actions;

// Selectors
export const selectCartItems = state => state.cart.items;
export const selectCartLoading = state => state.cart.loading;
export const selectCartOperationLoading = state => state.cart.operationLoading;
export const selectCartError = state => state.cart.error;
export const selectCartCount = state => state.cart.totalQuantity;
export const selectCartTotal = state => state.cart.totalPrice;

export default cartSlice.reducer;