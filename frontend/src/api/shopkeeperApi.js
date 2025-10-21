import axiosInstance from './axiosInstance';

const BASE_URL = 'http://127.0.0.1:8000/api/shopkeeper';

// Authentication APIs
export const shopkeeperRegister = async (userData) => {
  const response = await axiosInstance.post(`${BASE_URL}/register/`, userData);
  return response.data;
};

export const shopkeeperLogin = async (credentials) => {
  const response = await axiosInstance.post(`${BASE_URL}/login/`, credentials);
  return response.data;
};

// Profile APIs
export const getShopkeeperProfile = async () => {
  const response = await axiosInstance.get(`${BASE_URL}/profile/`);
  return response.data;
};

export const updateShopkeeperProfile = async (profileData) => {
  const response = await axiosInstance.put(`${BASE_URL}/profile/`, profileData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Product APIs
export const getShopkeeperProducts = async () => {
  const response = await axiosInstance.get(`${BASE_URL}/products/`);
  return response.data;
};

export const createShopkeeperProduct = async (productData) => {
  const response = await axiosInstance.post(`${BASE_URL}/products/`, productData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateShopkeeperProduct = async (productId, productData) => {
  const response = await axiosInstance.put(`${BASE_URL}/products/${productId}/`, productData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteShopkeeperProduct = async (productId) => {
  const response = await axiosInstance.delete(`${BASE_URL}/products/${productId}/`);
  return response.data;
};

// Order APIs
export const getShopkeeperOrders = async () => {
  const response = await axiosInstance.get(`${BASE_URL}/orders/`);
  return response.data;
};

export const updateOrderStatus = async (orderId, status) => {
  const response = await axiosInstance.put(`${BASE_URL}/orders/${orderId}/`, { status });
  return response.data;
};

// Document APIs
export const getShopkeeperDocuments = async () => {
  const response = await axiosInstance.get(`${BASE_URL}/documents/`);
  return response.data;
};

export const uploadShopkeeperDocument = async (documentData) => {
  const response = await axiosInstance.post(`${BASE_URL}/documents/`, documentData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Review APIs
export const getShopkeeperReviews = async () => {
  const response = await axiosInstance.get(`${BASE_URL}/reviews/`);
  return response.data;
};

// Dashboard API
export const getShopkeeperDashboard = async () => {
  const response = await axiosInstance.get(`${BASE_URL}/dashboard/`);
  return response.data;
};
