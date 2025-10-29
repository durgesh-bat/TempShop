import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../api/axiosInstance';
import { cacheManager, CACHE_KEYS } from '../utils/cacheManager';

export const fetchCategories = createAsyncThunk(
  'categories/fetchAll',
  async () => {
    const cached = cacheManager.get(CACHE_KEYS.CATEGORIES);
    if (cached) return cached;

    const response = await axiosInstance.get('/categories/');
    cacheManager.set(CACHE_KEYS.CATEGORIES, response.data);
    return response.data;
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default categorySlice.reducer;