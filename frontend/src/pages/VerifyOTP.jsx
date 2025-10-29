import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axiosInstance from "../api/axiosInstance";
import { showToast } from "../utils/toast";

export default function VerifyOTP() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [timer, setTimer] = useState(0);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (user?.is_email_verified) {
      navigate("/profile");
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleSendOTP = async () => {
    setSending(true);
    try {
      await axiosInstance.post("/auth/send-otp/");
      showToast.success("OTP sent to your email");
      setTimer(60);
    } catch (error) {
      showToast.error(error.response?.data?.error || "Failed to send OTP");
    } finally {
      setSending(false);
    }
  };

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6).split("");
    const newOtp = [...otp];
    pastedData.forEach((char, i) => {
      if (/^\d$/.test(char)) newOtp[i] = char;
    });
    setOtp(newOtp);
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      showToast.error("Please enter all 6 digits");
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post("/auth/verify-otp/", { otp: otpString });
      showToast.success("Email verified successfully!");
      setTimeout(() => navigate("/profile"), 1500);
    } catch (error) {
      showToast.error(error.response?.data?.error || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-black px-6 py-12">
      <div className="bg-white dark:bg-gray-900 shadow-2xl rounded-3xl p-8 w-full max-w-md">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center mb-2 text-gray-800 dark:text-white">
          Verify Your Email
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          We've sent a 6-digit code to<br />
          <span className="font-semibold text-gray-800 dark:text-white">{user?.email}</span>
        </p>

        <form onSubmit={handleVerifyOTP} className="space-y-6">
          {/* OTP Input Boxes */}
          <div className="flex justify-center gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="text"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                maxLength={1}
                className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            ))}
          </div>

          {/* Timer */}
          {timer > 0 && (
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              ⏰ Resend available in {timer}s
            </p>
          )}

          <button
            type="submit"
            disabled={loading || otp.join("").length !== 6}
            className={`w-full py-3 rounded-lg font-semibold transition shadow-lg ${
              loading || otp.join("").length !== 6
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Verifying...
              </span>
            ) : "Verify Email"}
          </button>
        </form>

        {/* Resend */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Didn't receive the code?</p>
          <button
            onClick={handleSendOTP}
            disabled={sending || timer > 0}
            className="text-blue-600 dark:text-blue-400 hover:underline font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? "Sending..." : "Resend OTP"}
          </button>
        </div>

        {/* Skip */}
        <button
          onClick={() => navigate("/profile")}
          className="w-full mt-6 py-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm"
        >
          I'll verify later →
        </button>
      </div>
    </div>
  );
}
