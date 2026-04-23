import React, { createContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://fliplyn-b-c.fly.dev';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('vendor_token');
    const savedUser = localStorage.getItem('vendor_user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = useCallback(async (phone_number, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post('/api/vendor/auth/login', {
        phone_number,
        password,
      });

      const data = response.data;
      console.log('Login response:', data);
      console.log('Response keys:', Object.keys(data));

      // Extract vendor_id - could be in different fields
      let vendorId = data.vendor_id || data.id || data.vendorId;
      
      // If no vendor_id in response, try to decode JWT to get it
      if (!vendorId && data.access_token) {
        try {
          const decoded = JSON.parse(atob(data.access_token.split('.')[1]));
          console.log('Decoded JWT:', decoded);
          vendorId = decoded.vendor_id || decoded.sub || decoded.user_id;
        } catch (e) {
          console.log('Could not decode JWT');
        }
      }

      console.log('Using vendorId:', vendorId);

      // Store in state and localStorage
      setToken(data.access_token);
      setUser({
        id: vendorId || phone_number, // Fallback to phone_number as unique identifier
        vendor_id: vendorId,
        phone_number,
      });

      localStorage.setItem('vendor_token', data.access_token);
      localStorage.setItem('vendor_user', JSON.stringify({ 
        id: vendorId || phone_number, 
        vendor_id: vendorId,
        phone_number 
      }));

      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || 'Login failed. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setError(null);
    localStorage.removeItem('vendor_token');
    localStorage.removeItem('vendor_user');
  }, []);

  const value = {
    user,
    token,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
