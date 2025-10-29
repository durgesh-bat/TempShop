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

export const fetchProfile = async () => {
  const res = await axiosInstance.get("/auth/profile/");
  return res.data;
};
export const updateProfile = async (profileData) => {
  try {
    const res = await axiosInstance.put("/auth/profile/", profileData);
    return res.data;
  } catch (error) {
    console.error('Profile update error:', error);
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.detail || 
                        error.message || 
                        'Profile update failed';
    throw new Error(errorMessage);
  }
};

export const sendOTP = async () => {
  const res = await axiosInstance.post("/auth/send-otp/");
  return res.data;
};

export const verifyOTP = async (otp) => {
  const res = await axiosInstance.post("/auth/verify-otp/", { otp });
  return res.data;
};
