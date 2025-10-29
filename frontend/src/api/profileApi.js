import axiosInstance from "./axiosInstance";

export const getAddresses = async () => {
  const res = await axiosInstance.get("/auth/addresses/");
  return res.data;
};

export const createAddress = async (data) => {
  const res = await axiosInstance.post("/auth/addresses/", data);
  return res.data;
};

export const updateAddress = async (id, data) => {
  const res = await axiosInstance.patch(`/auth/addresses/${id}/`, data);
  return res.data;
};

export const deleteAddress = async (id) => {
  await axiosInstance.delete(`/auth/addresses/${id}/`);
};

export const getWallet = async () => {
  const res = await axiosInstance.get("/auth/wallet/");
  return res.data;
};

export const getPaymentMethods = async () => {
  const res = await axiosInstance.get("/auth/payment-methods/");
  return res.data;
};

export const createPaymentMethod = async (data) => {
  const res = await axiosInstance.post("/auth/payment-methods/", data);
  return res.data;
};

export const deletePaymentMethod = async (id) => {
  await axiosInstance.delete(`/auth/payment-methods/${id}/`);
};

export const getOrders = async () => {
  const res = await axiosInstance.get("/auth/orders/");
  return res.data;
};

export const getOrderDetail = async (id) => {
  const res = await axiosInstance.get(`/auth/orders/${id}/`);
  return res.data;
};

export const getReviews = async () => {
  const res = await axiosInstance.get("/auth/reviews/");
  return res.data;
};

export const createReview = async (data) => {
  const res = await axiosInstance.post("/auth/reviews/", data);
  return res.data;
};

export const deleteReview = async (id) => {
  await axiosInstance.delete(`/auth/reviews/${id}/`);
};

export const getWishlist = async () => {
  const res = await axiosInstance.get("/auth/wishlist/");
  return res.data;
};

export const addToWishlist = async (productId) => {
  const res = await axiosInstance.post("/auth/wishlist/", { product_id: productId });
  return res.data;
};

export const removeFromWishlist = async (id) => {
  await axiosInstance.delete(`/auth/wishlist/${id}/`);
};

export const getProductReviews = async (productId) => {
  const res = await axiosInstance.get(`/auth/products/${productId}/reviews/`);
  return res.data;
};

export const getWishlistProductIds = async () => {
  const res = await axiosInstance.get("/auth/wishlist/product-ids/");
  return res.data;
};

export const removeFromWishlistByProduct = async (productId) => {
  await axiosInstance.delete(`/auth/wishlist/product/${productId}/`);
};

export const toggleWishlist = async (productId, isInWishlist) => {
  if (isInWishlist) {
    await removeFromWishlistByProduct(productId);
  } else {
    await addToWishlist(productId);
  }
};
