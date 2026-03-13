import React, { Suspense, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/Layout";
import PageLoader from "./components/PageLoader";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";
import SplashScreen from "./components/SplashScreen";
import { ToastContainer } from "./components/Toast";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { SplashProvider, useSplash } from "./context/SplashContext";
import { useAuthStore } from "./store/authStore";
import { initializeAnalytics } from "./services/firebase/analyticsService";

// Lazy load page components
const Home = React.lazy(() => import("./pages/Home"));
const About = React.lazy(() => import("./pages/About"));
const Products = React.lazy(() => import("./pages/Products"));
const Categories = React.lazy(() => import("./pages/Categories"));
const CategoryDetail = React.lazy(() => import("./pages/CategoryDetail"));
const ProductDetail = React.lazy(() => import("./pages/ProductDetail"));
const Product = React.lazy(() => import("./pages/Product"));
const Search = React.lazy(() => import("./pages/Search"));
const Cart = React.lazy(() => import("./pages/Cart"));
const Wishlist = React.lazy(() => import("./pages/Wishlist"));
const Checkout = React.lazy(() => import("./pages/Checkout"));
const Login = React.lazy(() => import("./pages/Login"));
const AdminDashboard = React.lazy(() => import("./pages/AdminDashboard"));
const SeedData = React.lazy(() => import("./pages/SeedData"));
const DebugAuth = React.lazy(() => import("./pages/DebugAuth"));

function AppContent() {
  const { initializeAuth } = useAuthStore();
  const { showSplash, completeSplash } = useSplash();

  // Initialize authentication on app load (only once)
  useEffect(() => {
    try {
      initializeAuth();
    } catch (error: unknown) {
      console.error('[App] Auth initialization error:', error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty array - run only once

  // Track visitor session on app load
  useEffect(() => {
    let cancelled = false;
    let timeoutId: number | null = null;
    const win = window as Window & {
      requestIdleCallback?: (callback: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    const run = () => {
      if (cancelled) return;
      initializeAnalytics().catch((err: Error) => {
        // Silently fail - analytics is optional
        console.debug('Analytics not available:', err.message);
      });
    };

    if (typeof win.requestIdleCallback === 'function') {
      const idleId = win.requestIdleCallback(run, { timeout: 2000 });
      return () => {
        cancelled = true;
        if (typeof win.cancelIdleCallback === 'function') {
          win.cancelIdleCallback(idleId);
        }
      };
    }

    timeoutId = window.setTimeout(run, 1200);
    return () => {
      cancelled = true;
      if (timeoutId !== null) window.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <>
      {showSplash && <SplashScreen onComplete={completeSplash} />}
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Admin Routes - No MainLayout, Protected */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute requiresAdmin>
                <Suspense fallback={<PageLoader />}>
                  <AdminDashboard />
                </Suspense>
              </ProtectedRoute>
            } 
          />
          
          {/* Public Routes - With MainLayout */}
          <Route path="/*" element={
            <MainLayout>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route
                    path="/categories/:categorySlug"
                    element={<CategoryDetail />}
                  />
                  <Route path="/product/:productId" element={<ProductDetail />} />
                  <Route path="/product-old/:slug" element={<Product />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/seed-data" element={<SeedData />} />
                  <Route path="/debug-auth" element={<DebugAuth />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </MainLayout>
          } />
        </Routes>
      </Router>
      <ToastContainer />
    </>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600">Page not found</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <SplashProvider>
        <AppContent />
      </SplashProvider>
    </ErrorBoundary>
  );
}
