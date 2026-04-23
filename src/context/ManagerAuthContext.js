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

export const ManagerAuthContext = createContext();

export function ManagerAuthProvider({ children }) {
  const [manager, setManager] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('manager_token');
    const savedManager = localStorage.getItem('manager_user');
    
    if (savedToken && savedManager) {
      setToken(savedToken);
      setManager(JSON.parse(savedManager));
    }
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post('/api/manager/auth/login', {
        email,
        password,
      });

      const data = response.data;
      console.log('Manager login response:', data);
      console.log('Response keys:', Object.keys(data));

      // Extract manager_id - should be in response.manager_id
      let managerId = data.manager_id;
      
      // If no manager_id in response, try to decode JWT
      if (!managerId && data.access_token) {
        try {
          const decoded = JSON.parse(atob(data.access_token.split('.')[1]));
          console.log('Decoded JWT:', decoded);
          managerId = decoded.sub || decoded.manager_id || decoded.user_id;
        } catch (e) {
          console.log('Could not decode JWT');
        }
      }

      console.log('Using managerId:', managerId);

      // Store in state and localStorage
      setToken(data.access_token);
      setManager({
        id: managerId || email, // Fallback to email as unique identifier
        manager_id: managerId,
        email,
        admin_id: data.admin_id,
      });

      localStorage.setItem('manager_token', data.access_token);
      localStorage.setItem('manager_user', JSON.stringify({ 
        id: managerId || email, 
        manager_id: managerId,
        email,
        admin_id: data.admin_id,
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
    setManager(null);
    setToken(null);
    setError(null);
    localStorage.removeItem('manager_token');
    localStorage.removeItem('manager_user');
  }, []);

  const value = {
    manager,
    token,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!token,
  };

  return (
    <ManagerAuthContext.Provider value={value}>
      {children}
    </ManagerAuthContext.Provider>
  );
}

// Custom hook to use manager auth context
export function useManagerAuth() {
  const context = React.useContext(ManagerAuthContext);
  if (!context) {
    throw new Error('useManagerAuth must be used within ManagerAuthProvider');
  }
  return context;
}
