import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../slices/cartSlice';
import authReducer from '../slices/authSlice';
import productReducer from '../slices/productSlice';
import categoryReducer from '../slices/categorySlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    products: productReducer,
    categories: categoryReducer,
  },
});

export default store;
