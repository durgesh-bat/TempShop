import axiosInstance from "./axiosInstance";

export const getAllCategories = async () => {
  const res = await axiosInstance.get("/categories/");
  return res.data;
};
