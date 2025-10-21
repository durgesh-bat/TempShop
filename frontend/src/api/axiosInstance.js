import axios from 'axios';

const BASE_URL = "http://127.0.0.1:8000/api"; // Django backend URL

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Automatically attach Access Token (if available)
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Handle Token Expiration or API Errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const response = await axios.post(`${BASE_URL}/auth/token/refresh/`, {
          refresh: refreshToken
        });

        if (response.data.access) {
          localStorage.setItem("access_token", response.data.access);
          originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
