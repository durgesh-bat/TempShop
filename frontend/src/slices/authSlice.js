import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser, registerUser, logoutUser } from '../api/authApi';
import axiosInstance from '../api/axiosInstance';
import notify from '../utils/notifications';

// --- Async thunk for login ---
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await loginUser(credentials);
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
      const response = await axiosInstance.get('/auth/profile/');
      return response.data;
    } catch (err) {
      const message = err?.response?.data?.detail || 
                     err?.response?.data?.message || 
                     err?.response?.data || 
                     err?.message || 
                     'Token verification failed';
      return rejectWithValue({ message });
    }
  }
);

// --- Async thunk for updating profile ---
export const updateUserProfile = createAsyncThunk(
  'auth/updateProfile',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch('/auth/profile/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Update failed');
    }
  }
);

// --- Async thunk for fetching profile separately ---
export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/auth/profile/');
      console.log('Fetch profile response:', res.data); // Debug log
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Fetch profile failed');
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
  isAuthenticated: false,
};

// --- Slice ---
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      notify.auth.logoutSuccess();
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => { 
        state.loading = true; 
        state.error = null; 
      })
      .addCase(login.fulfilled, (state, action) => { 
        state.loading = false; 
        state.isAuthenticated = true; 
        // ✅ Backend returns { user: {...}, tokens: {...} }
        state.user = action.payload.user || action.payload;
        state.emailVerified = action.payload.email_verified !== false;
        console.log('Login user set:', state.user);
        notify.auth.loginSuccess(state.user?.username || 'User');
      })
      .addCase(login.rejected, (state, action) => { 
        state.loading = false; 
        state.user = null; 
        state.isAuthenticated = false; 
        state.error = action.payload?.message || action.error?.message || 'Login failed'; 
      });

    // Register
    builder
      .addCase(register.pending, (state) => { 
        state.loading = true; 
        state.error = null; 
      })
      .addCase(register.fulfilled, (state, action) => { 
        state.loading = false; 
        state.isAuthenticated = true; 
        // ✅ Backend returns { user: {...}, tokens: {...} }
        state.user = action.payload.user || action.payload;
        console.log('Register user set:', state.user);
      })
      .addCase(register.rejected, (state, action) => { 
        state.loading = false; 
        state.user = null; 
        state.isAuthenticated = false; 
        state.error = action.payload?.message || action.error?.message || 'Registration failed'; 
      });

    // Verify token
    builder
      .addCase(verifyAuthToken.pending, (state) => { 
        state.verifying = true; 
        state.error = null; 
      })
      .addCase(verifyAuthToken.fulfilled, (state, action) => { 
        state.verifying = false; 
        state.isAuthenticated = true; 
        // ✅ Profile endpoint returns flat structure: { id, username, email, ... }
        state.user = action.payload;
        console.log('Verify user set:', state.user);
      })
      .addCase(verifyAuthToken.rejected, (state, action) => { 
        state.verifying = false; 
        state.isAuthenticated = false; 
        state.user = null;
        const errorMsg = action.payload?.message || action.error?.message || 'Authentication failed';
        state.error = errorMsg;
      });

    // Update profile
    builder
      .addCase(updateUserProfile.pending, (state) => { 
        state.saving = true; 
        state.error = null; 
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => { 
        state.saving = false; 
        // ✅ Profile update returns flat structure
        state.user = action.payload;
        console.log('Update user set:', state.user);
        notify.profile.updated();
      })
      .addCase(updateUserProfile.rejected, (state, action) => { 
        state.saving = false; 
        state.error = action.payload?.message || action.error?.message || 'Profile update failed'; 
      });

    // Fetch profile
    builder
      .addCase(fetchProfile.pending, (state) => { 
        state.loading = true; 
        state.error = null; 
      })
      .addCase(fetchProfile.fulfilled, (state, action) => { 
        state.loading = false; 
        // ✅ Profile endpoint returns flat structure
        state.user = action.payload;
        console.log('Fetch user set:', state.user);
      })
      .addCase(fetchProfile.rejected, (state, action) => { 
        state.loading = false; 
        const errorMsg = typeof action.payload === 'string' ? action.payload : 
                        action.payload?.message || action.payload?.detail || 
                        action.error?.message || 'Fetch profile failed';
        state.error = errorMsg;
      });

    // Clear cart on logout
    builder.addCase('auth/logout', (state) => {
      // Cart slice will listen to this action
    });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;