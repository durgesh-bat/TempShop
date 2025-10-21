import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { verifyAuthToken } from "../slices/authSlice";

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, verifying: loading, user } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(verifyAuthToken());
  }, [dispatch]);

  if (loading) {
    // 🔹 Wait until verification is complete
    return (
      <div className="text-center py-10 text-gray-500 dark:text-gray-300">
        Checking authentication...
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Only render children after token is verified
  return <>{children}</>;
};

export default ProtectedRoute;
