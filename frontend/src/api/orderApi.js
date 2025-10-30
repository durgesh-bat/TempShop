import axiosInstance from "./axiosInstance";

export const createOrder = async (orderData) => {
  const res = await axiosInstance.post("/auth/orders/", orderData);
  return res.data;
};

export const getOrders = async () => {
  const res = await axiosInstance.get("/auth/orders/");
  return res.data;
};

export const getOrderDetails = async (orderId) => {
  const res = await axiosInstance.get(`/auth/orders/${orderId}/`);
  return res.data;
};
