// API Base URL
const API_BASE_URL = 'https://fliplyn-b-c.fly.dev';

// Vendor Login
export const vendorLogin = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/vendor/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Login failed');
    }

    const data = await response.json();
    
    // Store token in localStorage
    if (data.access_token) {
      localStorage.setItem('vendor_token', data.access_token);
      localStorage.setItem('vendor_id', data.vendor_id || '');
    }

    return data;
  } catch (error) {
    console.error('Vendor login error:', error);
    throw error;
  }
};

// Logout
export const logout = () => {
  localStorage.removeItem('vendor_token');
  localStorage.removeItem('vendor_id');
};

// Get stored token
export const getVendorToken = () => {
  return localStorage.getItem('vendor_token');
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('vendor_token');
};
