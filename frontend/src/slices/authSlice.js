import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser, registerUser, verifyToken } from '../api/authApi';

// Async thunk for login
export const login = createAsyncThunk(
  'auth/login',
  async (credentials) => {
    const data = await loginUser(credentials);
    // Store tokens
    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);
    return data;
  }
);

// Async thunk for registration
export const register = createAsyncThunk(
  'auth/register',
  async (userData) => {
    const data = await registerUser(userData);
    // Store tokens
    localStorage.setItem("access_token", data.token.access);
    localStorage.setItem("refresh_token", data.token.refresh);
    return data;
  }
);

// Async thunk for token verification
export const verifyAuthToken = createAsyncThunk(
  'auth/verifyToken',
  async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error('No token found');
    }
    const data = await verifyToken(token);
    return data;
  }
);

const initialState = {
  user: null,
  loading: false,
  verifying: false,
  error: null,
  isAuthenticated: !!localStorage.getItem("access_token"),
};

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
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

    // Register
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

    // Verify Token
    builder
      .addCase(verifyAuthToken.pending, (state) => {
        state.verifying = true;
        state.error = null;
      })
      .addCase(verifyAuthToken.fulfilled, (state) => {
        state.verifying = false;
        state.isAuthenticated = true;
      })
      .addCase(verifyAuthToken.rejected, (state, action) => {
        state.verifying = false;
        state.isAuthenticated = false;
        state.error = action.error.message;
        // Clear tokens on verification failure
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;