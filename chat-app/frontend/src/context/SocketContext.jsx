import React, { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { token, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      // Disconnect socket if user logs out
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      setOnlineUsers([]);
      return;
    }

    // Connect to Chat backend port 6000
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:6000';
    const newSocket = io(API_URL, {
      auth: { token }
    });

    setSocket(newSocket);

    // Socket Event Receivers
    newSocket.on('connect', () => {
      console.log('Socket connected successfully');
    });

    newSocket.on('active-users', (userIds) => {
      setOnlineUsers(userIds);
    });

    newSocket.on('user-status-changed', ({ userId, isOnline }) => {
      setOnlineUsers((prev) => {
        if (isOnline) {
          return prev.includes(userId) ? prev : [...prev, userId];
        } else {
          return prev.filter((id) => id !== userId);
        }
      });
    });

    return () => {
      newSocket.disconnect();
    };
  }, [isAuthenticated, token]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers, isUserOnline: (userId) => onlineUsers.includes(userId) }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
