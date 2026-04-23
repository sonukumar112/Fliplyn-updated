// API Base URL
import axios from 'axios';

// Use local backend for outlets (http://localhost:5000)
const API_BASE_URL = 'http://localhost:5000';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create Manager
export const createManager = async (managerData, token) => {
  try {
    const response = await axiosInstance.post('/api/manager/', managerData, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || error.message || 'Failed to create manager';
    console.error('Create manager error:', errorMessage);
    throw new Error(errorMessage);
  }
};

// Get Manager by ID
export const getManager = async (managerId, token) => {
  try {
    const response = await axiosInstance.get(`/api/manager/${managerId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || 'Failed to fetch manager';
    console.error('Get manager error:', errorMessage);
    throw new Error(errorMessage);
  }
};

// Update Manager
export const updateManager = async (managerId, managerData, token) => {
  try {
    const response = await axiosInstance.put(`/api/manager/${managerId}`, managerData, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || error.message || 'Failed to update manager';
    console.error('Update manager error:', errorMessage);
    throw new Error(errorMessage);
  }
};

// Get all outlets/stalls by admin ID
export const getStallsByAdmin = async (adminId) => {
  try {
    const response = await axiosInstance.get(`/stalls/admin/${adminId}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || error.message || 'Failed to fetch stalls';
    console.error('Get stalls error:', errorMessage);
    throw new Error(errorMessage);
  }
};

// Get all outlets with INTEGER IDs (for items creation)
export const getAllOutlets = async () => {
  try {
    const response = await axiosInstance.get('/api/outlets');
    console.log('getAllOutlets response:', response);
    console.log('getAllOutlets response.data:', response.data);
    
    // Handle if response.data is wrapped in an object
    const data = Array.isArray(response.data) ? response.data : response.data?.data || response.data?.outlets || [];
    console.log('getAllOutlets final data:', data);
    return data;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || error.message || 'Failed to fetch outlets';
    console.error('Get outlets error:', errorMessage);
    console.error('Full error:', error);
    throw new Error(errorMessage);
  }
};

// Get stall by ID (public endpoint)
export const getStallById = async (stallId) => {
  try {
    const response = await axiosInstance.get(`/stalls/${stallId}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || error.message || 'Failed to fetch stall';
    console.error('Get stall error:', errorMessage);
    throw new Error(errorMessage);
  }
};

// Update stall availability
export const updateStallAvailability = async (stallId, isAvailable) => {
  try {
    const response = await axiosInstance.put(`/stalls/${stallId}/availability`, {
      is_available: isAvailable,
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || error.message || 'Failed to update stall availability';
    console.error('Update stall availability error:', errorMessage);
    throw new Error(errorMessage);
  }
};

// Update stall basic info
export const updateStallBasic = async (stallId, stallData) => {
  try {
    const response = await axiosInstance.put(`/stalls/${stallId}/edit-basic`, stallData);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || error.message || 'Failed to update stall';
    console.error('Update stall error:', errorMessage);
    throw new Error(errorMessage);
  }
};

// Delete stall
export const deleteStall = async (stallId) => {
  try {
    const response = await axiosInstance.delete(`/stalls/${stallId}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || error.message || 'Failed to delete stall';
    console.error('Delete stall error:', errorMessage);
    throw new Error(errorMessage);
  }
};
