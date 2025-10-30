import axios from 'axios';

const BASE_URL = "http://localhost:8000/api";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Enable cookies
});

// Get CSRF token from cookie
const getCsrfToken = () => {
  const name = 'csrftoken';
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [key, value] = cookie.trim().split('=');
    if (key === name) return value;
  }
  return null;
};

// Attach CSRF token to requests
axiosInstance.interceptors.request.use((config) => {
  const csrfToken = getCsrfToken();
  if (csrfToken && ['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase())) {
    config.headers['X-CSRFToken'] = csrfToken;
  }
  return config;
});

// Handle token refresh on 401
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip retry for auth endpoints or if already retried
    if (originalRequest._retry || 
        originalRequest.url?.includes('/auth/login') || 
        originalRequest.url?.includes('/auth/register') ||
        originalRequest.url?.includes('/auth/token/refresh') ||
        originalRequest.url?.includes('/auth/profile')) {
      return Promise.reject(error);
    }

    // Only attempt refresh on protected routes
    const protectedRoutes = ['/cart', '/orders', '/addresses', '/wallet', '/payment-methods', '/reviews', '/wishlist'];
    const isProtectedEndpoint = protectedRoutes.some(route => originalRequest.url?.includes(route));

    if (error.response?.status === 401 && isProtectedEndpoint) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => axiosInstance(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axios.post(`${BASE_URL}/auth/token/refresh/`, {}, {
          withCredentials: true,
          headers: { 'X-CSRFToken': getCsrfToken() }
        });
        processQueue(null);
        isRefreshing = false;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
