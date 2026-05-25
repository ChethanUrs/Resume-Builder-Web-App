import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import { Loader2 } from 'lucide-react';

// Protected Route Guard: Requires Authentication
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 gap-3 text-white">
        <Loader2 className="h-8 w-8 text-primary-500 animate-spin" />
        <span className="text-xs text-slate-400 font-medium">Authorizing secure session...</span>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Admin Route Guard: Requires Authentication & Administrator Rights
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 gap-3 text-white">
        <Loader2 className="h-8 w-8 text-primary-500 animate-spin" />
        <span className="text-xs text-slate-400 font-medium">Validating credentials...</span>
      </div>
    );
  }

  return isAuthenticated && isAdmin ? children : <Navigate to="/" replace />;
};

// Public Route Guard (Redirect dashboard if signed in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

function AppContent() {
  return (
    <div className="min-h-screen flex flex-col justify-between transition-colors duration-300">
      <Navbar />
      
      {/* Visual store screens rendering */}
      <main className="flex-grow">
        <Routes>
          {/* Public Storefront paths */}
          <Route path="/" element={<Catalog />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          
          {/* Guest authentication paths */}
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />

          {/* Secure client pathways */}
          <Route path="/checkout" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

          {/* Secure Admin Control pathways */}
          <Route path="/admin" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />

          {/* Fallback Catch-all redirects directly to storefront */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <ThemeProvider>
            <AppContent />
          </ThemeProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
