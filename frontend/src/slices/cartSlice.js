import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCart, addToCart, removeFromCart } from '../api/cartApi';

// Async thunk for fetching cart
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async () => {
    const data = await getCart();
    return data;
  }
);

// Async thunk for adding item to cart
export const addToCartThunk = createAsyncThunk(
  'cart/addItem',
  async ({ productId, quantity }) => {
    await addToCart(productId, quantity);
    // After adding item, fetch the updated cart
    const cartData = await getCart();
    return cartData;
  }
);

// Async thunk for updating quantity
export const updateCartItem = createAsyncThunk(
  'cart/updateItem',
  async ({ itemId, newQty }) => {
    await addToCart(itemId, newQty);
    return { itemId, newQty };
  }
);

// Async thunk for removing item
export const removeCartItem = createAsyncThunk(
  'cart/removeItem',
  async ({ itemId }) => {
    await removeFromCart(itemId);
    return itemId;
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
  reducers: {},
  extraReducers: (builder) => {
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
        } else {
          // After adding item, fetch the updated cart
          return {
            ...state,
            items: [],
            totalQuantity: 0,
            totalPrice: 0
          };
        }
      })
      .addCase(addToCartThunk.rejected, (state, action) => {
        state.operationLoading = false;
        state.error = action.error.message;
      });

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
        state.error = action.error.error;
      })

    // Update cart item
    builder
      .addCase(updateCartItem.pending, (state) => {
        state.operationLoading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.operationLoading = false;
        const { itemId, newQty } = action.payload;
        const item = state.items.find(item => item.product.id === itemId);
        if (item) {
          const oldQuantity = item.quantity;
          item.quantity = item.quantity + newQty;
          state.totalQuantity = state.totalQuantity - oldQuantity + item.quantity;
          state.totalPrice = state.items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
        }
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.operationLoading = false;
        state.error = action.error.message;
      })

    // Remove cart item
    builder
      .addCase(removeCartItem.pending, (state) => {
        state.operationLoading = true;
        state.error = null;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.operationLoading = false;
        const itemId = action.payload;
        const item = state.items.find(item => item.product.id === itemId);
        if (item) {
          state.totalQuantity -= item.quantity;
          state.totalPrice -= item.product.price * item.quantity;
          state.items = state.items.filter(item => item.product.id !== itemId);
        }
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.operationLoading = false;
        state.error = action.error.message;
      })
  },
});

export const { clearCart } = cartSlice.actions;
// Selectors
export const selectCartItems = state => state.cart.items;
export const selectCartLoading = state => state.cart.loading;
export const selectCartOperationLoading = state => state.cart.operationLoading;
export const selectCartError = state => state.cart.error;
export const selectCartTotal = state => {
  return state.cart.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
};

export default cartSlice.reducer;
