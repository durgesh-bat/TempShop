import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser, registerUser, verifyToken } from '../api/authApi';
import axiosInstance from '../api/axiosInstance';

// --- Async thunk for login ---
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await loginUser(credentials);
      const access = data.tokens?.access || data.token?.access;
      const refresh = data.tokens?.refresh || data.token?.refresh;
      if (access) localStorage.setItem("access_token", access);
      if (refresh) localStorage.setItem("refresh_token", refresh);
      return data;
    } catch (err) {
      const message = err?.response?.data?.detail || err?.response?.data || err.message || 'Login failed';
      return rejectWithValue({ message });
    }
  }
);

// --- Async thunk for registration ---
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await registerUser(userData);
      const access = data.tokens?.access || data.token?.access;
      const refresh = data.tokens?.refresh || data.token?.refresh;
      if (access) localStorage.setItem("access_token", access);
      if (refresh) localStorage.setItem("refresh_token", refresh);
      return data;
    } catch (err) {
      const message = err?.response?.data?.detail || err?.response?.data || err.message || 'Registration failed';
      return rejectWithValue({ message });
    }
  }
);

// --- Async thunk for token verification ---
export const verifyAuthToken = createAsyncThunk(
  'auth/verifyToken',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return rejectWithValue({ message: 'No token found' });

      // Verify token
      await verifyToken(token);

      // Fetch user profile after token verification
      const response = await axiosInstance.get('/auth/profile/');
      return response.data;   // return user object
    } catch (err) {
      const message = err?.response?.data?.detail || err?.message || 'Token verify failed';
      return rejectWithValue({ message });
    }
  }
);


export const updateUserProfile = createAsyncThunk(
  'auth/updateProfile',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch('/auth/profile/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data; // full profile object
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Update failed');
    }
  }
);

// --- Initial state ---
const initialState = {
  user: null,
  loading: false,
  verifying: false,
  saving: false,
  error: null,
  isAuthenticated: !!localStorage.getItem("access_token"),
};

// --- Slice ---
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false; state.isAuthenticated = true; state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false; state.user = null; state.isAuthenticated = false;
        state.error = action.payload?.message || action.error?.message || 'Login failed';
      });

    // Register
    builder
      .addCase(register.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false; state.isAuthenticated = true; state.user = action.payload.user;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false; state.user = null; state.isAuthenticated = false;
        state.error = action.payload?.message || action.error?.message || 'Registration failed';
      });

    // Verify token
    builder
      .addCase(verifyAuthToken.pending, (state) => { state.verifying = true; state.error = null; })
      .addCase(verifyAuthToken.fulfilled, (state, action) => { state.verifying = false; state.isAuthenticated = true; state.user = action.payload.user; })
      .addCase(verifyAuthToken.rejected, (state, action) => {
        state.verifying = false; state.isAuthenticated = false;
        state.error = action.payload?.message || action.error?.message || 'Token verification failed';
        localStorage.removeItem("access_token"); localStorage.removeItem("refresh_token");
      });

    // Update profile
    builder
      .addCase(updateUserProfile.pending, (state) => { state.saving = true; state.error = null; })
      .addCase(updateUserProfile.fulfilled, (state, action) => { 
        state.saving = false; 
        state.user = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload?.message || action.error?.message || 'Profile update failed';
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
