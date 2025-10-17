import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../slices/authSlice";

export default function Register() {
  const [form, setForm] = useState({ 
    username: "", 
    email: "", 
    password: "",
    password2: "" 
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.password2) {
      alert("Passwords don't match!");
      return;
    }
    
    try {
      await dispatch(register(form)).unwrap();
    } catch (err) {
      // Error is handled by the slice
      console.error('Registration failed:', err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700"
          />
          <input
            name="password2"
            type="password"
            placeholder="Confirm Password"
            value={form.password2}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700"
          />
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-lg hover:scale-105 transition"
          >
            Register
          </button>
        </form>
        <p className="text-center text-gray-600 dark:text-gray-400 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
