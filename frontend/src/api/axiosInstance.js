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
    if (error.response && error.response.status === 401) {
      // try token refresh logic here or redirect
      console.warn("Unauthorized! Token may have expired.");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
