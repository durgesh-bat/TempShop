import axiosInstance from "./axiosInstance";

export const getCart = async () => {
  const res = await axiosInstance.get("/cart/");
  return res.data;
};

export const addToCart = async (productId, quantity = 1) => {
  const res = await axiosInstance.post(`/cart/${productId}/`, { quantity });
  return res.data;
};

export const removeFromCart = async (productId) => {
  const res = await axiosInstance.delete(`/cart/${productId}/`);
  return res.data;
};
export const updateCartQuantity = async (productId, quantity) => {
  const res = await axiosInstance.patch(`/cart/${productId}/`, { quantity });
  return res.data;
};