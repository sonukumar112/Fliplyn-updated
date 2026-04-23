import React, { useState, useEffect } from 'react';
import { useManagerAuth } from '../../context/ManagerAuthContext';
import { createVendor, getVendor, updateVendor, updateVendorStatus, getVendorStalls } from '../../services/vendorAPI';
import ManagerHeader from './ManagerHeader';
import './VendorsList.css';

const VendorsList = () => {
  const { token, manager } = useManagerAuth();
  const [showCreateVendor, setShowCreateVendor] = useState(false);
  const [showEditVendor, setShowEditVendor] = useState(false);
  const [showVendorStalls, setShowVendorStalls] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [vendorStalls, setVendorStalls] = useState([]);
  const [vendors, setVendors] = useState([
    { id: 1, name: 'Vendor 1', email: 'vendor1@gmail.com', phone: '91-9892017382', orders: 'Outlet 1, Outlet 2', status: 'Active' },
    { id: 2, name: 'Vendor 2', email: 'vendor2@gmail.com', phone: '91-9892017382', orders: 'Outlet 2', status: 'Active' },
    { id: 3, name: 'Vendor 3', email: 'vendor3@gmail.com', phone: '91-9892017382', orders: 'Outlet 1, Outlet 3', status: 'Inactive' },
    { id: 4, name: 'Vendor 4', email: 'vendor4@gmail.com', phone: '91-9892017382', orders: 'Outlet 4, Outlet 5', status: 'Active' },
    { id: 5, name: 'Vendor 5', email: 'vendor5@gmail.com', phone: '91-9892017382', orders: 'Outlet 2', status: 'Active' },
    { id: 6, name: 'Vendor 6', email: 'vendor6@gmail.com', phone: '91-9892017382', orders: 'Outlet 6', status: 'Active' },
    { id: 7, name: 'Vendor 7', email: 'vendor7@gmail.com', phone: '91-9892017382', orders: 'Outlet 1, Outlet 6', status: 'Active' },
  ]);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    outlets: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateVendor = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.name || !formData.phone || !formData.password) {
        throw new Error('Please fill in all fields');
      }

      const vendorPayload = {
        vendor_name: formData.name,
        phone_number: formData.phone,
        password: formData.password,
        stall_ids: formData.outlets.length > 0 ? formData.outlets : [],
        admin_id: manager?.id || 'admin',
        owner_id: manager?.id || 'owner',
      };

      const response = await createVendor(vendorPayload, token);

      // Add new vendor to the list
      const newVendor = {
        id: response.vendor_id || vendors.length + 1,
        name: formData.name,
        email: response.email || 'N/A',
        phone: formData.phone,
        orders: formData.outlets.join(', ') || 'N/A',
        status: 'Active',
      };

      setVendors([...vendors, newVendor]);

      // Reset form and close modal
      setFormData({
        name: '',
        phone: '',
        password: '',
        outlets: [],
      });
      setShowCreateVendor(false);
    } catch (err) {
      setError(err.message || 'Failed to create vendor');
      console.error('Create vendor error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOutletChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({
      ...prev,
      outlets: selectedOptions,
    }));
  };

  const handleEditVendor = async (vendor) => {
    setError('');
    setLoading(true);
    try {
      const vendorDetails = await getVendor(vendor.id, token);
      setSelectedVendor(vendorDetails);
      setFormData({
        name: vendorDetails.name || '',
        phone: vendorDetails.phone || '',
        password: '',
        outlets: vendorDetails.outlets || [],
      });
      setShowEditVendor(true);
    } catch (err) {
      setError(err.message || 'Failed to fetch vendor details');
      console.error('Fetch vendor error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateVendor = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.name || !formData.phone) {
        throw new Error('Please fill in all fields');
      }

      const updatePayload = {
        name: formData.name,
        phone: formData.phone,
      };

      if (formData.password) {
        updatePayload.password = formData.password;
      }

      await updateVendor(selectedVendor.vendor_id || selectedVendor.id, updatePayload, token);

      // Update vendor in list
      setVendors(vendors.map(v => 
        v.id === selectedVendor.id 
          ? { ...v, name: formData.name, phone: formData.phone }
          : v
      ));

      // Reset and close modal
      setFormData({
        name: '',
        phone: '',
        password: '',
        outlets: [],
      });
      setSelectedVendor(null);
      setShowEditVendor(false);
    } catch (err) {
      setError(err.message || 'Failed to update vendor');
      console.error('Update vendor error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVendorStatus = async (vendor) => {
    setError('');
    setLoading(true);

    try {
      const newStatus = vendor.status === 'Active' ? 'inactive' : 'active';
      await updateVendorStatus(vendor.id, newStatus, token);

      // Update vendor status in list
      setVendors(vendors.map(v => 
        v.id === vendor.id 
          ? { ...v, status: newStatus === 'active' ? 'Active' : 'Inactive' }
          : v
      ));
    } catch (err) {
      setError(err.message || 'Failed to update vendor status');
      console.error('Update status error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewVendorStalls = async (vendor) => {
    setError('');
    setLoading(true);
    try {
      const stalls = await getVendorStalls(vendor.id, token);
      setVendorStalls(stalls || []);
      setSelectedVendor(vendor);
      setShowVendorStalls(true);
    } catch (err) {
      setError(err.message || 'Failed to fetch vendor stalls');
      console.error('Fetch stalls error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="manager-page-layout">
      <ManagerHeader />
      
      <div className="manager-content">
        <div className="page-header space-between">
          <div className="page-title-section">
            <h2>Vendors List</h2>
          </div>
          
          <div className="action-buttons">
            <button className="btn-primary" onClick={() => setShowCreateVendor(true)}>+ Create Vendor</button>
          </div>
        </div>

        <div className="table-container">
          <table className="vendors-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone Number</th>
                <th>Outlets</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((vendor, index) => (
                <tr key={vendor.id}>
                  <td>{vendor.name}</td>
                  <td>{vendor.phone}</td>
                  <td>
                    <div className="orders-badges">
                      {vendor.orders.split(', ').map(order =>(
                        <span className="order-badge" key={order}>{order}</span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <span 
                      className={`status-badge ${vendor.status.toLowerCase()}`}
                      onClick={() => handleToggleVendorStatus(vendor)}
                      title="Click to toggle status"
                    >
                      {vendor.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-icons">
                      <span 
                        className="icon edit-icon" 
                        title="Edit"
                        onClick={() => handleEditVendor(vendor)}
                      >
                        ✎
                      </span>
                      <span 
                        className="icon stalls-icon" 
                        title="View Stalls"
                        onClick={() => handleViewVendorStalls(vendor)}
                      >
                        📦
                      </span>
                      <span className="icon delete-icon" title="Delete">🗑️</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Vendor Modal */}
      {showCreateVendor && (
        <div className="modal-overlay">
          <div className="modal-content create-vendor-modal">
            <div className="modal-header">
              <h3>Create Vendor</h3>
              <button className="close-btn" onClick={() => setShowCreateVendor(false)}>×</button>
            </div>
            <div className="modal-body">
              {error && <div className="error-message">{error}</div>}
              <form onSubmit={handleCreateVendor}>
                <div className="form-group icon-input">
                  <span className="input-icon">👤</span>
                  <input 
                    type="text" 
                    name="name"
                    placeholder="Name" 
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group icon-input">
                  <span className="input-icon">📞</span>
                  <input 
                    type="text" 
                    name="phone"
                    placeholder="Phone Number" 
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group icon-input">
                  <span className="input-icon">🔒</span>
                  <input 
                    type="password" 
                    name="password"
                    placeholder="Password" 
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Select Outlets:</label>
                  <select 
                    multiple
                    value={formData.outlets}
                    onChange={handleOutletChange}
                  >
                    <option value="Outlet 1">Outlet 1</option>
                    <option value="Outlet 2">Outlet 2</option>
                    <option value="Outlet 3">Outlet 3</option>
                    <option value="Outlet 4">Outlet 4</option>
                    <option value="Outlet 5">Outlet 5</option>
                  </select>
                </div>
                
                <div className="modal-actions-row">
                  <button 
                    type="submit" 
                    className="btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Creating...' : 'Save'}
                  </button>
                  <button 
                    type="button" 
                    className="btn-outline" 
                    onClick={() => setShowCreateVendor(false)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Vendor Modal */}
      {showEditVendor && (
        <div className="modal-overlay">
          <div className="modal-content create-vendor-modal">
            <div className="modal-header">
              <h3>Edit Vendor</h3>
              <button className="close-btn" onClick={() => setShowEditVendor(false)}>×</button>
            </div>
            <div className="modal-body">
              {error && <div className="error-message">{error}</div>}
              <form onSubmit={handleUpdateVendor}>
                <div className="form-group icon-input">
                  <span className="input-icon">👤</span>
                  <input 
                    type="text" 
                    name="name"
                    placeholder="Name" 
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group icon-input">
                  <span className="input-icon">📞</span>
                  <input 
                    type="text" 
                    name="phone"
                    placeholder="Phone Number" 
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group icon-input">
                  <span className="input-icon">🔒</span>
                  <input 
                    type="password" 
                    name="password"
                    placeholder="Password (leave empty to keep current)" 
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="modal-actions-row">
                  <button 
                    type="submit" 
                    className="btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Updating...' : 'Update'}
                  </button>
                  <button 
                    type="button" 
                    className="btn-outline" 
                    onClick={() => setShowEditVendor(false)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Vendor Stalls Modal */}
      {showVendorStalls && (
        <div className="modal-overlay">
          <div className="modal-content vendor-stalls-modal">
            <div className="modal-header">
              <h3>{selectedVendor?.name}'s Stalls</h3>
              <button className="close-btn" onClick={() => setShowVendorStalls(false)}>×</button>
            </div>
            <div className="modal-body">
              {error && <div className="error-message">{error}</div>}
              {vendorStalls.length > 0 ? (
                <table className="stalls-table">
                  <thead>
                    <tr>
                      <th>Stall ID</th>
                      <th>Stall Name</th>
                      <th>Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendorStalls.map((stall) => (
                      <tr key={stall.id}>
                        <td>{stall.id}</td>
                        <td>{stall.name}</td>
                        <td>{stall.location || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="no-data">No stalls assigned to this vendor</p>
              )}
              <div className="modal-actions-row">
                <button 
                  type="button" 
                  className="btn-outline" 
                  onClick={() => setShowVendorStalls(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorsList;
