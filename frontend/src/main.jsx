import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";
import "./index.css";

import Layout from "./Layout";
import App from "./pages/home";
import ProductPage from "./pages/Product";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";
import CartPage from "./pages/CartPage";
import ShopPage from "./pages/ShopPage";
import Contact from "./pages/Contact";
import { store } from './store';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { verifyAuthToken } from './slices/authSlice';
import AddProduct from "./shopkipper/AddProduct";
import ShopkeeperHome from "./shopkipper/ShopkeeperHome";
import ShopkeeperLogin from "./shopkipper/Login";
import ShopkeeperRegister from "./shopkipper/Register";

// Wrapper for auth routes to prevent redirect loops
function AuthRoute({ children }) {
  const { isAuthenticated } = useSelector(state => state.auth);
  const location = useLocation();
  
  // Don't redirect if already navigating
  if (isAuthenticated && !location.state?.preventRedirect) {
    return <Navigate to="/profile" replace />;
  }
  
  return children;
}

// App wrapper component for auto-verification
function AppWrapper() {
  const dispatch = useDispatch();
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  // Auto-verify token on app mount - RUNS ONLY ONCE
  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        setInitialCheckDone(true);
        return;
      }

      try {
        await dispatch(verifyAuthToken()).unwrap();
        if (isMounted) {
          console.log('✅ Auto-login successful');
        }
      } catch (error) {
        if (isMounted) {
          console.log('❌ Auto-login failed:', error);
        }
      } finally {
        if (isMounted) {
          setInitialCheckDone(true);
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  // Show loading screen during initial verification
  if (!initialCheckDone) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">Loading TempShop...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={
          <Layout>
            <App />
          </Layout>
        }
      />
      <Route
        path="/product/:id"
        element={
          <Layout>
            <ProductPage />
          </Layout>
        }
      />
      <Route
        path="/shop"
        element={
          <Layout>
            <ShopPage />
          </Layout>
        }
      />
      <Route
        path="/contact"
        element={
          <Layout>
            <Contact />
          </Layout>
        }
      />
      
      {/* Auth Routes - Simple, no automatic redirects */}
      <Route
        path="/login"
        element={
          <Layout>
            <Login />
          </Layout>
        }
      />
      <Route
        path="/register"
        element={
          <Layout>
            <Register />
          </Layout>
        }
      />
      
      {/* 🔒 Protected Routes */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Layout>
              <ProfilePage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route 
        path="/cart" 
        element={
          <ProtectedRoute>
            <Layout>
              <CartPage />
            </Layout>
          </ProtectedRoute>
        } 
      />
      
      {/* 🔒 Shopkeeper Routes */}
      <Route
        path="/shopkeeper/login"
        element={
          <Layout>
            <ShopkeeperLogin />
          </Layout>
        }
      />
      <Route
        path="/shopkeeper/register"
        element={
          <Layout>
            <ShopkeeperRegister />
          </Layout>
        }
      />
      <Route
        path="/add-product"
        element={
          <ProtectedRoute>
            <Layout>
              <AddProduct />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/shopkeeper"
        element={
          <ProtectedRoute>
            <Layout>
              <ShopkeeperHome />
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <AppWrapper />
      </Provider>
    </BrowserRouter>
  </StrictMode>
);
