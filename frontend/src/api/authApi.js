import axiosInstance from "./axiosInstance";

export const loginUser = async (credentials) => {
  console.log("Credentials: ",credentials)
  const res = await axiosInstance.post("/auth/login/", credentials);
  return res.data;
};

export const registerUser = async (userData) => {
  const res = await axiosInstance.post("/auth/register/", userData);
  return res.data;
};

export const verifyToken = async (token) => {
  const res = await axiosInstance.post("/auth/token/verify/", {token });
  return res.data;
};
