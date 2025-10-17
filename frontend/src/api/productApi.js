import axiosInstance from "./axiosInstance";

export const getAllProducts = async () => {
  const res = await axiosInstance.get("/products/");
  return res.data;
};

export const getProductDetails = async (id) => {
  const res = await axiosInstance.get(`/product/${id}/`);
  return res.data;
};
