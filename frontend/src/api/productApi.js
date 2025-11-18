import axiosInstance from "./axiosInstance";
import { cacheManager, CACHE_KEYS } from "../utils/cacheManager";

export const getAllProducts = async () => {
  const cached = cacheManager.get(CACHE_KEYS.PRODUCTS);
  if (cached) return cached;

  const res = await axiosInstance.get("/products/");
  cacheManager.set(CACHE_KEYS.PRODUCTS, res.data);
  return res.data;
};

export const getProductDetails = async (id) => {
  const cacheKey = `${CACHE_KEYS.PRODUCT_DETAIL}${id}`;
  const cached = cacheManager.get(cacheKey);
  if (cached) return cached;

  const res = await axiosInstance.get(`/product/${id}/`);
  cacheManager.set(cacheKey, res.data);
  return res.data;
};

export const getRecentlyViewed = async () => {
  const res = await axiosInstance.get("/recently-viewed/");
  return res.data;
};

export const getSimilarProducts = async (id) => {
  const res = await axiosInstance.get(`/similar-products/${id}/`);
  return res.data;
};

export const searchProducts = async (query) => {
  const res = await axiosInstance.get(`/search/?q=${encodeURIComponent(query)}`);
  return res.data;
};

export const getProductsByCategorySlug = async (slug) => {
  const res = await axiosInstance.get(`/category/${slug}/products/`);
  return res.data;
};
