// API Base URL
import axios from 'axios';

// Use local backend for items (http://localhost:5000)
const API_BASE_URL = 'http://localhost:5000';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create Vendor
export const createVendor = async (vendorData, token) => {
  try {
    const response = await axiosInstance.post('/api/vendor/create', vendorData, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || error.message || 'Failed to create vendor';
    console.error('Create vendor error:', errorMessage);
    throw new Error(errorMessage);
  }
};

// Get Vendor by ID
export const getVendor = async (vendorId, token) => {
  try {
    const response = await axiosInstance.get(`/api/vendor/${vendorId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || 'Failed to fetch vendor';
    console.error('Get vendor error:', errorMessage);
    throw new Error(errorMessage);
  }
};

// Update Vendor
export const updateVendor = async (vendorId, vendorData, token) => {
  try {
    const response = await axiosInstance.put(`/api/vendor/update/${vendorId}`, vendorData, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || error.message || 'Failed to update vendor';
    console.error('Update vendor error:', errorMessage);
    throw new Error(errorMessage);
  }
};

// Update Vendor Status
export const updateVendorStatus = async (vendorId, status, token) => {
  try {
    const response = await axiosInstance.put(`/api/vendor/status/${vendorId}`, { status }, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || error.message || 'Failed to update vendor status';
    console.error('Update vendor status error:', errorMessage);
    throw new Error(errorMessage);
  }
};

// Get Vendor Stalls
export const getVendorStalls = async (vendorId, token) => {
  try {
    const response = await axiosInstance.get(`/api/vendor/stalls/${vendorId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || error.message || 'Failed to fetch vendor stalls';
    console.error('Get vendor stalls error:', errorMessage);
    throw new Error(errorMessage);
  }
};

// Get all items for vendor
export const getVendorItems = async (vendorId, token) => {
  try {
    const response = await axiosInstance.get(`/api/vendor/${vendorId}/items`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || error.message || 'Failed to fetch items';
    console.error('Get items error:', errorMessage);
    throw new Error(errorMessage);
  }
};

// Get all orders for vendor
export const getVendorOrders = async (vendorId, token) => {
  try {
    const response = await axiosInstance.get(`/api/vendor/${vendorId}/orders`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || error.message || 'Failed to fetch orders';
    console.error('Get orders error:', errorMessage);
    throw new Error(errorMessage);
  }
};

// Get items by stall ID (public endpoint)
export const getItemsByStallId = async (stallId) => {
  try {
    const response = await axiosInstance.get(`/items/stall/${stallId}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || error.message || 'Failed to fetch items';
    console.error('Get items by stall error:', errorMessage);
    throw new Error(errorMessage);
  }
};

// Get stall details by stall ID (public endpoint)
export const getStallDetails = async (stallId) => {
  try {
    const response = await axiosInstance.get(`/stalls/${stallId}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || error.message || 'Failed to fetch stall details';
    console.error('Get stall details error:', errorMessage);
    throw new Error(errorMessage);
  }
};

// Update item availability
export const updateItemAvailability = async (itemId, isAvailable) => {
  try {
    const response = await axiosInstance.patch(`/items/items/${itemId}/availability`, {
      is_available: isAvailable,
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || error.message || 'Failed to update item availability';
    console.error('Update item availability error:', errorMessage);
    throw new Error(errorMessage);
  }
};

// Create new item
export const createItem = async (itemData) => {
  try {
    console.log('Creating item with data:', itemData);
    // Use POST /api/items endpoint (local backend at localhost:5000)
    const response = await axiosInstance.post('/api/items', itemData);
    console.log('Item created successfully:', response.data);
    return response.data;
  } catch (error) {
    // Handle validation errors (422)
    let errorMessage = 'Failed to create item';
    
    if (error.response?.status === 422) {
      // API returns validation errors
      const data = error.response?.data;
      
      if (data?.detail && Array.isArray(data.detail)) {
        // Extract field names and messages
        const fieldErrors = data.detail.map(e => `${e.loc?.[1] || 'field'}: ${e.msg}`);
        errorMessage = fieldErrors.join('\n');
      } else if (data?.detail) {
        errorMessage = data.detail;
      } else {
        errorMessage = JSON.stringify(data);
      }
    } else {
      errorMessage = error.response?.data?.detail || error.message || errorMessage;
    }
    
    console.error('Create item error:', errorMessage);
    console.error('Full error response:', error.response?.data);
    throw new Error(errorMessage);
  }
};

// Update item
export const updateItem = async (itemId, itemData) => {
  try {
    const response = await axiosInstance.put(`/items/${itemId}`, itemData);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || error.message || 'Failed to update item';
    console.error('Update item error:', errorMessage);
    throw new Error(errorMessage);
  }
};

// Delete item
export const deleteItem = async (itemId) => {
  try {
    const response = await axiosInstance.delete(`/items/${itemId}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || error.message || 'Failed to delete item';
    console.error('Delete item error:', errorMessage);
    throw new Error(errorMessage);
  }
};

// Get all outlets for vendor
export const getVendorOutlets = async (vendorId, token) => {
  try {
    const response = await axiosInstance.get(`/api/vendor/${vendorId}/outlets`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || error.message || 'Failed to fetch outlets';
    console.error('Get outlets error:', errorMessage);
    throw new Error(errorMessage);
  }
};
