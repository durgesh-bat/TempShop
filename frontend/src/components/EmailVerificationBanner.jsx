import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function EmailVerificationBanner() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  if (!user || user.is_email_verified) return null;

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 rounded-lg shadow-md">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <svg
            className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div>
            <p className="font-semibold text-yellow-800 dark:text-yellow-300">
              Email Not Verified
            </p>
            <p className="text-sm text-yellow-700 dark:text-yellow-400">
              Verify your email to unlock all features
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate("/verify-otp")}
          className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition shadow-sm hover:shadow-md"
        >
          Verify Now
        </button>
      </div>
    </div>
  );
}
