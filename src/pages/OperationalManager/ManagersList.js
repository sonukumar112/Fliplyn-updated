import React, { useState, useEffect } from 'react';
import { useManagerAuth } from '../../context/ManagerAuthContext';
import { createManager, getManager, updateManager } from '../../services/managerAPI';
import ManagerHeader from './ManagerHeader';
import './ManagersList.css';

const ManagersList = () => {
  const { token } = useManagerAuth();
  const [showCreateManager, setShowCreateManager] = useState(false);
  const [showEditManager, setShowEditManager] = useState(false);
  const [selectedManager, setSelectedManager] = useState(null);
  const [managers, setManagers] = useState([
    { id: 1, name: 'Manager 1', email: 'manager1@fliplyn.com', phone: '91-9892017382', status: 'Active' },
    { id: 2, name: 'Manager 2', email: 'manager2@fliplyn.com', phone: '91-9892017382', status: 'Active' },
    { id: 3, name: 'Manager 3', email: 'manager3@fliplyn.com', phone: '91-9892017382', status: 'Active' },
  ]);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
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

  const handleCreateManager = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.name || !formData.email || !formData.phone || !formData.password) {
        throw new Error('Please fill in all fields');
      }

      const managerPayload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      };

      const response = await createManager(managerPayload, token);

      // Add new manager to the list
      const newManager = {
        id: response.manager_id || managers.length + 1,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        status: 'Active',
      };

      setManagers([...managers, newManager]);

      // Reset form and close modal
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
      });
      setShowCreateManager(false);
    } catch (err) {
      setError(err.message || 'Failed to create manager');
      console.error('Create manager error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditManager = async (manager) => {
    setError('');
    setLoading(true);
    try {
      const managerDetails = await getManager(manager.id, token);
      setSelectedManager(managerDetails);
      setFormData({
        name: managerDetails.name || '',
        email: managerDetails.email || '',
        phone: managerDetails.phone || '',
        password: '',
      });
      setShowEditManager(true);
    } catch (err) {
      setError(err.message || 'Failed to fetch manager details');
      console.error('Fetch manager error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateManager = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.name || !formData.email || !formData.phone) {
        throw new Error('Please fill in all fields');
      }

      const updatePayload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      };

      if (formData.password) {
        updatePayload.password = formData.password;
      }

      await updateManager(selectedManager.manager_id || selectedManager.id, updatePayload, token);

      // Update manager in list
      setManagers(managers.map(m => 
        m.id === selectedManager.id 
          ? { ...m, name: formData.name, email: formData.email, phone: formData.phone }
          : m
      ));

      // Reset and close modal
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
      });
      setSelectedManager(null);
      setShowEditManager(false);
    } catch (err) {
      setError(err.message || 'Failed to update manager');
      console.error('Update manager error:', err);
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
            <h2>Managers List</h2>
          </div>
          
          <div className="action-buttons">
            <button className="btn-primary" onClick={() => setShowCreateManager(true)}>+ Create Manager</button>
          </div>
        </div>

        <div className="table-container">
          <table className="managers-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {managers.map((manager) => (
                <tr key={manager.id}>
                  <td>{manager.name}</td>
                  <td>{manager.email}</td>
                  <td>{manager.phone}</td>
                  <td>
                    <span className={`status-badge ${manager.status.toLowerCase()}`}>
                      {manager.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-icons">
                      <span 
                        className="icon edit-icon" 
                        title="Edit"
                        onClick={() => handleEditManager(manager)}
                      >
                        ✎
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

      {/* Create Manager Modal */}
      {showCreateManager && (
        <div className="modal-overlay">
          <div className="modal-content create-manager-modal">
            <div className="modal-header">
              <h3>Create Manager</h3>
              <button className="close-btn" onClick={() => setShowCreateManager(false)}>×</button>
            </div>
            <div className="modal-body">
              {error && <div className="error-message">{error}</div>}
              <form onSubmit={handleCreateManager}>
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
                  <span className="input-icon">📧</span>
                  <input 
                    type="email" 
                    name="email"
                    placeholder="Email" 
                    value={formData.email}
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
                    onClick={() => setShowCreateManager(false)}
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

      {/* Edit Manager Modal */}
      {showEditManager && (
        <div className="modal-overlay">
          <div className="modal-content create-manager-modal">
            <div className="modal-header">
              <h3>Edit Manager</h3>
              <button className="close-btn" onClick={() => setShowEditManager(false)}>×</button>
            </div>
            <div className="modal-body">
              {error && <div className="error-message">{error}</div>}
              <form onSubmit={handleUpdateManager}>
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
                  <span className="input-icon">📧</span>
                  <input 
                    type="email" 
                    name="email"
                    placeholder="Email" 
                    value={formData.email}
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
                    onClick={() => setShowEditManager(false)}
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
    </div>
  );
};

export default ManagersList;
