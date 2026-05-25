import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Default Chat backend port is 6000
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:6000';

axios.defaults.baseURL = API_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('chat_token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const setAuthHeader = (authToken) => {
    if (authToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        setAuthHeader(token);
        try {
          const res = await axios.get('/api/auth/me');
          setUser(res.data);
        } catch (err) {
          console.error('Invalid token, session expired', err.message);
          logout();
        }
      } else {
        setAuthHeader(null);
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      const { token: userToken, user: userData } = res.data;
      
      localStorage.setItem('chat_token', userToken);
      setToken(userToken);
      setUser(userData);
      setAuthHeader(userToken);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Try again.';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('/api/auth/register', { username, email, password });
      const { token: userToken, user: userData } = res.data;
      
      localStorage.setItem('chat_token', userToken);
      setToken(userToken);
      setUser(userData);
      setAuthHeader(userToken);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Try again.';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('chat_token');
    setToken(null);
    setUser(null);
    setAuthHeader(null);
    setError(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      error,
      login,
      register,
      logout,
      isAuthenticated: !!user,
      apiUrl: API_URL
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
