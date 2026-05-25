import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { WebRTCProvider } from './context/WebRTCContext';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ChatDashboard from './pages/ChatDashboard';
import { Loader2 } from 'lucide-react';

// Protected Route Guard
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 gap-3 text-white">
        <Loader2 className="h-8 w-8 text-primary-500 animate-spin" />
        <span className="text-xs text-slate-400 font-medium">Synchronizing profile credentials...</span>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public Route Guard (Redirect dashboard if already authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <WebRTCProvider>
            <ThemeProvider>
              <Routes>
                {/* Auth Screen Entry Points */}
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

                {/* Secure Active Workspace */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <ChatDashboard />
                  </ProtectedRoute>
                } />

                {/* Standard Catch-all redirects directly to dashboard */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </ThemeProvider>
          </WebRTCProvider>
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
