import axiosInstance from "./axiosInstance";

export const loginUser = async (credentials) => {
  const res = await axiosInstance.post("/auth/token/", credentials);
  return res.data;
};

export const registerUser = async (userData) => {
  const res = await axiosInstance.post("/auth/register/", userData);
  return res.data;
};

export const verifyToken = async (token) => {
  const res = await axiosInstance.post("/auth/token/verify/", {token });
  console.log("verifyToken response:", res.data);
  return res.data;
};
