import axiosInstance from "./axiosInstance";
import axios from 'axios';
import {Base_URL} from '../utils/baseURL'

const BASE_URL = Base_URL;

// Get CSRF token before login/register
export const getCsrfToken = async () => {
  await axios.get(`${BASE_URL}/auth/csrf/`, { withCredentials: true });
};

// ...existing code...
// Login expects email and password
export const loginUser = async (credentials) => {
  await getCsrfToken();
  // Ensure credentials use email, not username
  const { email, password } = credentials;
  const res = await axiosInstance.post("/auth/login/", { email, password });
  return res.data;
};

export const registerUser = async (userData) => {
  await getCsrfToken();
  const res = await axiosInstance.post("/auth/register/", userData);
  return res.data;
};

export const logoutUser = async () => {
  const res = await axiosInstance.post("/auth/logout/");
  return res.data;
};

export const verifyToken = async () => {
  const res = await axiosInstance.get("/auth/profile/");
  return res.data;
};

export const fetchProfile = async () => {
  const res = await axiosInstance.get("/auth/profile/");
  return res.data;
};
// ...existing code...
// Update profile using PATCH and multipart/form-data
export const updateProfile = async (profileData) => {
  try {
    const formData = new FormData();
    Object.entries(profileData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });
    const res = await axiosInstance.patch("/auth/profile/", formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
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
