import axios from 'axios';

const BASE_URL = "http://localhost:8000/api";

const shopkeeperAxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

shopkeeperAxiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("shopkeeper_access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

shopkeeperAxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem("shopkeeper_refresh_token");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const response = await axios.post(`${BASE_URL}/auth/token/refresh/`, {
          refresh: refreshToken
        });

        if (response.data.access) {
          localStorage.setItem("shopkeeper_access_token", response.data.access);
          originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
          return shopkeeperAxiosInstance(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem("shopkeeper_access_token");
        localStorage.removeItem("shopkeeper_refresh_token");
        window.location.href = "/shopkeeper";
      }
    }
    
    if (error.response?.status === 500 && error.response?.data?.includes('expected a number')) {
      localStorage.removeItem("shopkeeper_access_token");
      localStorage.removeItem("shopkeeper_refresh_token");
      window.location.href = "/shopkeeper";
    }
    
    return Promise.reject(error);
  }
);

export default shopkeeperAxiosInstance;
