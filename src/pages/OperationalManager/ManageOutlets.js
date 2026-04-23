import React, { useState, useEffect, useCallback } from 'react';
import { getAllOutlets, updateStallAvailability } from '../../services/managerAPI';
import { createItem } from '../../services/vendorAPI';
import { useManagerAuth } from '../../context/ManagerAuthContext';
import ManagerHeader from './ManagerHeader';
import './ManageOutlets.css';

const ManageOutlets = () => {
  const { manager } = useManagerAuth();
  const [showAddItem, setShowAddItem] = useState(false);
  const [showCreateOutlet, setShowCreateOutlet] = useState(false);
  const [showViewOrders, setShowViewOrders] = useState(false);
  const [showViewSales, setShowViewSales] = useState(false);
  const [showEditMenu, setShowEditMenu] = useState(false);
  const [selectedOutlet, setSelectedOutlet] = useState(null);
  const [showManageMenu, setShowManageMenu] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddVendor, setShowAddVendor] = useState(false);
  const [showAddWallet, setShowAddWallet] = useState(false);
  const [itemFileName, setItemFileName] = useState('No file chosen');
  const [outletFileName, setOutletFileName] = useState('No file chosen');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const [outlets, setOutlets] = useState([]);
  
  // Add Item Form State
  const [itemForm, setItemForm] = useState({
    selectedOutletId: '',
    selectedCategoryId: '',
    itemName: '',
    itemDescription: '',
    price: '',
    gst: '',
    taxIncluded: false,
    available: true,
    isVeg: true,
  });
  const [addingItem, setAddingItem] = useState(false);

  // Fetch outlets from API on mount
  const fetchOutlets = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Fetching outlets from local backend');
      const data = await getAllOutlets();
      console.log('Outlets API Response:', data);
      
      if (Array.isArray(data)) {
        // Map API response to match component structure
        const mappedOutlets = data.map((outlet, index) => ({
          id: outlet.id,
          name: outlet.name || `Outlet ${index + 1}`,
          wallet: outlet.wallet || Math.floor(Math.random() * 1000),
          active: outlet.active !== false,
          pendingOrders: Math.floor(Math.random() * 5), // Mock pending orders
          description: outlet.description || '',
          opening_time: outlet.opening_time || '09:00:00',
          closing_time: outlet.closing_time || '21:00:00',
          image_url: outlet.image_url || null,
          ...outlet, // Include all original fields
        }));
        console.log('Mapped outlets:', mappedOutlets);
        setOutlets(mappedOutlets);
      }
    } catch (err) {
      setError(err.message || 'Failed to load outlets');
      console.error('Error fetching outlets:', err);
      // Keep showing default outlets if API fails
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOutlets();
  }, [fetchOutlets]);

  const handleToggleActive = async (id) => {
    // Find current outlet
    const outlet = outlets.find(o => o.id === id);
    if (!outlet) return;

    const newStatus = !outlet.active;

    try {
      // Call API to update stall availability
      console.log(`Toggling stall ${id} to ${newStatus}`);
      await updateStallAvailability(id, newStatus);
      
      // Update local state only after successful API call
      setOutlets(outlets.map(o => o.id === id ? { ...o, active: newStatus } : o));
      console.log(`Stall ${id} updated successfully`);
    } catch (err) {
      console.error('Error toggling outlet:', err.message);
      // Show error message (optional - you can add toast notification)
      alert(`Failed to toggle outlet: ${err.message}`);
    }
  };

  // Filter outlets based on active filter
  const getFilteredOutlets = () => {
    switch(activeFilter) {
      case 'pending':
        return outlets.filter(o => o.pendingOrders > 0);
      case 'offline':
        return outlets.filter(o => !o.active);
      case 'active':
        return outlets.filter(o => o.active);
      case 'all':
      default:
        return outlets;
    }
  };

  const filteredOutlets = getFilteredOutlets();
  const pendingCount = outlets.filter(o => o.pendingOrders > 0).length;

  const handleItemFileChange = (e) => {
    const fileName = e.target.files?.[0]?.name || 'No file chosen';
    setItemFileName(fileName);
  };

  const handleOutletFileChange = (e) => {
    const fileName = e.target.files?.[0]?.name || 'No file chosen';
    setOutletFileName(fileName);
  };

  const triggerItemFileInput = (e) => {
    e.currentTarget.querySelector('.file-input')?.click();
  };

  const triggerOutletFileInput = (e) => {
    e.currentTarget.querySelector('.upload-box')?.click();
  };

  // Handle item form input changes
  const handleItemFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setItemForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle create item
  const handleCreateItem = async (e) => {
    e.preventDefault();
    
    if (!itemForm.selectedOutletId) {
      alert('Please select an outlet');
      return;
    }
    
    if (!itemForm.itemName.trim()) {
      alert('Please enter item name');
      return;
    }
    
    if (!itemForm.price) {
      alert('Please enter price');
      return;
    }

    try {
      setAddingItem(true);
      console.log('Creating item:', itemForm);
      
      // Validate category is selected
      if (!itemForm.selectedCategoryId) {
        alert('Please select a category');
        setAddingItem(false);
        return;
      }
      
      const itemData = {
        outlet_id: parseInt(itemForm.selectedOutletId),
        category_id: parseInt(itemForm.selectedCategoryId),
        name: itemForm.itemName,
        description: itemForm.itemDescription,
        price: parseFloat(itemForm.price),
        gst_percent: parseFloat(itemForm.gst) || 0,
        is_available: itemForm.available,
        is_veg: itemForm.isVeg,
      };

      console.log('Item data being sent:', JSON.stringify(itemData, null, 2));
      await createItem(itemData);
      
      alert('✅ Item created successfully!');
      
      // Reset form
      setItemForm({
        selectedOutletId: '',
        selectedCategoryId: '',
        itemName: '',
        itemDescription: '',
        price: '',
        gst: '',
        taxIncluded: false,
        available: true,
        isVeg: true,
      });
      setItemFileName('No file chosen');
      setShowAddItem(false);
      
    } catch (err) {
      console.error('Error creating item:', err);
      alert(`❌ Failed to create item: ${err.message}`);
    } finally {
      setAddingItem(false);
    }
  };

  return (
    <div className="manager-page-layout">
      <ManagerHeader />
      
      <div className="manager-content">
        <div className="page-header">
          <div className="page-title-section">
            <h2>Your Active Outlets</h2>
            <p>Monitor orders, control availability, and manage daily operations.</p>
          </div>
          
          <div className="page-actions-row">
            <div className="filter-tabs">
              <span 
                className={`tab ${activeFilter === 'all' ? 'active' : ''}`}
                onClick={() => setActiveFilter('all')}
              >
                ☰ All Outlets
              </span>
              <span 
                className={`tab ${activeFilter === 'pending' ? 'active' : ''}`}
                onClick={() => setActiveFilter('pending')}
              >
                🔔 Has Pending Orders <span className="badge">{pendingCount}</span>
              </span>
              <span 
                className={`tab ${activeFilter === 'offline' ? 'active' : ''}`}
                onClick={() => setActiveFilter('offline')}
              >
                📴 Offline
              </span>
              <span 
                className={`tab ${activeFilter === 'active' ? 'active' : ''}`}
                onClick={() => setActiveFilter('active')}
              >
                ✓ Active Today
              </span>
            </div>
            
            <div className="action-buttons">
              <div className="search-bar">
                <input type="text" placeholder="Search outlets..." />
              </div>
              <button className="btn-outline" onClick={() => setShowViewOrders(true)}>👁 View Orders</button>
              <button className="btn-outline" onClick={() => setShowViewSales(true)}>📊 View Sales</button>
              <div className="manage-dropdown-container">
                <button className="btn-primary" onClick={() => setShowManageMenu(!showManageMenu)}>⋮ Manage ▼</button>
                {showManageMenu && (
                  <div className="manage-dropdown-menu">
                    <div className="dropdown-item" onClick={() => { setShowAddItem(true); setShowManageMenu(false); }}>
                      <span className="dropdown-icon">➕</span>
                      <span>Add Item</span>
                    </div>
                    <div className="dropdown-item" onClick={() => { setShowCreateOutlet(true); setShowManageMenu(false); }}>
                      <span className="dropdown-icon">🏪</span>
                      <span>Add Outlet</span>
                    </div>
                    <div className="dropdown-item" onClick={() => { setShowAddCategory(true); setShowManageMenu(false); }}>
                      <span className="dropdown-icon">📁</span>
                      <span>Add Category</span>
                    </div>
                    <div className="dropdown-item" onClick={() => { setShowAddVendor(true); setShowManageMenu(false); }}>
                      <span className="dropdown-icon">👤</span>
                      <span>Add Vendor</span>
                    </div>
                    <div className="dropdown-item" onClick={() => { setShowAddWallet(true); setShowManageMenu(false); }}>
                      <span className="dropdown-icon">💳</span>
                      <span>Add Wallet</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="outlets-grid">
          {filteredOutlets.length > 0 ? (
            filteredOutlets.map(outlet => (
              <div className="outlet-card" key={outlet.id}>
                <div className="card-image-placeholder">
                  <img src="/5638eefe4a2c2c0edd299ede2ab6204d0ee9db92.png" alt="store" className="store-icon-img" />
                </div>
                <div className="card-details">
                  <div className="outlet-header-row">
                    <h3>{outlet.name}</h3>
                  <label className="switch">
                    <input 
                      type="checkbox" 
                      checked={outlet.active} 
                      onChange={() => handleToggleActive(outlet.id)} 
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
                <div className="outlet-status">
                  <span className={`status-badge ${outlet.active ? 'open' : 'closed'}`}>
                    {outlet.active ? 'Open' : 'Closed'}
                  </span>
                </div>
                <div className="card-actions">
                  <button 
                    className="edit-menu-btn"
                    onClick={() => {
                      setSelectedOutlet(outlet);
                      setShowEditMenu(true);
                    }}
                  >
                    ✏️ Edit Menu
                  </button>
                </div>
              </div>
            </div>
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
              <p style={{ fontSize: '16px', color: '#666' }}>No outlets found for this filter.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add New Item Modal */}
      {showAddItem && (
        <div className="modal-overlay">
          <div className="modal-content add-item-modal">
            <div className="modal-header">
              <h3>Add New Item</h3>
              <button className="close-btn" onClick={() => setShowAddItem(false)}>×</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleCreateItem}>
                <div className="form-group">
                  <label>Select Outlet: {outlets.length > 0 ? `(${outlets.length} available)` : '(Loading...)'}</label>
                  <select 
                    name="selectedOutletId"
                    value={itemForm.selectedOutletId}
                    onChange={handleItemFormChange}
                    required
                  >
                    <option value="">- Select Outlet -</option>
                    {outlets && outlets.length > 0 ? (
                      outlets.map(outlet => (
                        <option key={outlet.id} value={outlet.id}>{outlet.name}</option>
                      ))
                    ) : (
                      <option disabled>No outlets available</option>
                    )}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Select Category:</label>
                  <select 
                    name="selectedCategoryId"
                    value={itemForm.selectedCategoryId}
                    onChange={handleItemFormChange}
                  >
                    <option value="">- Select Category -</option>
                    <option value="1">Beverages</option>
                    <option value="2">Appetizers</option>
                    <option value="3">Main Course</option>
                    <option value="4">Desserts</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Item Name</label>
                  <input 
                    type="text" 
                    name="itemName"
                    value={itemForm.itemName}
                    onChange={handleItemFormChange}
                    placeholder="Item Name" 
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Item Description</label>
                  <textarea 
                    name="itemDescription"
                    value={itemForm.itemDescription}
                    onChange={handleItemFormChange}
                    placeholder="Item Description" 
                    rows="2"
                  ></textarea>
                </div>
                
                <div className="form-row">
                  <div className="form-group half">
                    <label>Price</label>
                    <input 
                      type="number" 
                      name="price"
                      value={itemForm.price}
                      onChange={handleItemFormChange}
                      placeholder="₹0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="form-group half">
                    <label>GST %</label>
                    <input 
                      type="number" 
                      name="gst"
                      value={itemForm.gst}
                      onChange={handleItemFormChange}
                      placeholder="0%"
                      step="0.1"
                    />
                  </div>
                </div>
                
                <div className="checkbox-row">
                  <div className="checkbox-item">
                    <input 
                      type="checkbox" 
                      id="taxIncluded"
                      name="taxIncluded"
                      checked={itemForm.taxIncluded}
                      onChange={handleItemFormChange}
                    />
                    <label htmlFor="taxIncluded">Tax Included</label>
                  </div>
                  <div className="checkbox-item">
                    <input 
                      type="checkbox" 
                      id="available"
                      name="available"
                      checked={itemForm.available}
                      onChange={handleItemFormChange}
                    />
                    <label htmlFor="available">Available</label>
                  </div>
                </div>

                <div className="checkbox-row">
                  <label style={{ fontWeight: '500', marginBottom: '8px' }}>Item Type:</label>
                  <div className="checkbox-item">
                    <input 
                      type="radio"
                      id="veg"
                      name="isVeg"
                      value="true"
                      checked={itemForm.isVeg === true}
                      onChange={(e) => setItemForm(prev => ({ ...prev, isVeg: true }))}
                    />
                    <label htmlFor="veg">🟢 Veg</label>
                  </div>
                  <div className="checkbox-item">
                    <input 
                      type="radio"
                      id="nonveg"
                      name="isVeg"
                      value="false"
                      checked={itemForm.isVeg === false}
                      onChange={(e) => setItemForm(prev => ({ ...prev, isVeg: false }))}
                    />
                    <label htmlFor="nonveg">🔴 Non-Veg</label>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Upload Photo:</label>
                  <div className="file-upload-box" onClick={triggerItemFileInput}>
                    <span className="upload-icon">🖼️</span>
                    <input type="file" className="file-input" onChange={handleItemFileChange} />
                    <span className="upload-text">Choose File</span>
                    <span className="file-name">{itemFileName}</span>
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  className="btn-create"
                  disabled={addingItem}
                >
                  {addingItem ? '⏳ Creating...' : '✅ Create Item'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Create New Outlet Modal */}
      {showCreateOutlet && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Create New Outlet</h3>
              <button className="close-btn" onClick={() => setShowCreateOutlet(false)}>×</button>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group">
                  <label>Outlet Name</label>
                  <input type="text" placeholder="Enter Name" />
                </div>
                <div className="form-group">
                  <label>FSSAI Number</label>
                  <input type="text" placeholder="A123000..." />
                </div>
                <div className="form-row">
                  <div className="form-group half">
                    <label>Opening Time</label>
                    <input type="time" defaultValue="09:00" />
                  </div>
                  <div className="form-group half">
                    <label>Closing Time</label>
                    <input type="time" defaultValue="22:00" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Upload Photo</label>
                  <div className="upload-box" onClick={triggerOutletFileInput}>
                    <input type="file" style={{ display: 'none' }} onChange={handleOutletFileChange} />
                    <span>📂</span>
                    <span className="upload-text" style={{ display: 'block', marginTop: '8px' }}>{outletFileName}</span>
                  </div>
                </div>
                <button type="button" className="btn-primary full-width" onClick={() => setShowCreateOutlet(false)}>Create Outlet</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showAddCategory && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3>Add Category</h3>
              <button className="close-btn" onClick={() => setShowAddCategory(false)}>×</button>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group">
                  <label>Select Outlet:</label>
                  <select>
                    <option>- Select Outlet -</option>
                    {outlets.map(outlet => (
                      <option key={outlet.id} value={outlet.id}>{outlet.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Category Name</label>
                  <input type="text" placeholder="Enter Category Name" />
                </div>
                <div className="form-group">
                  <label>Category Description</label>
                  <textarea placeholder="Enter Description" rows="2"></textarea>
                </div>
                <div className="modal-actions-row">
                  <button type="button" className="btn-primary" onClick={() => setShowAddCategory(false)}>Add Category</button>
                  <button type="button" className="btn-outline" onClick={() => setShowAddCategory(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Vendor Modal */}
      {showAddVendor && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3>Add Vendor</h3>
              <button className="close-btn" onClick={() => setShowAddVendor(false)}>×</button>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group">
                  <label>Vendor Name</label>
                  <input type="text" placeholder="Enter Vendor Name" />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" placeholder="vendor@email.com" />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="text" placeholder="91-XXXXXXXXXX" />
                </div>
                <div className="form-group">
                  <label>Select Outlets:</label>
                  <select multiple>
                    <option>- Select Outlets -</option>
                    {outlets.map(outlet => (
                      <option key={outlet.id} value={outlet.id}>{outlet.name}</option>
                    ))}
                  </select>
                </div>
                <div className="modal-actions-row">
                  <button type="button" className="btn-primary" onClick={() => setShowAddVendor(false)}>Add Vendor</button>
                  <button type="button" className="btn-outline" onClick={() => setShowAddVendor(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Wallet Modal */}
      {showAddWallet && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3>Add Wallet</h3>
              <button className="close-btn" onClick={() => setShowAddWallet(false)}>×</button>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group">
                  <label>Select Outlet:</label>
                  <select>
                    <option>- Select Outlet -</option>
                    {outlets.map(outlet => (
                      <option key={outlet.id} value={outlet.id}>{outlet.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Wallet Amount</label>
                  <input type="number" placeholder="Enter Amount" />
                </div>
                <div className="form-group">
                  <label>Wallet Description</label>
                  <textarea placeholder="Enter Description" rows="2"></textarea>
                </div>
                <div className="form-group">
                  <label>Payment Method</label>
                  <select>
                    <option>- Select Payment Method -</option>
                    <option>Bank Transfer</option>
                    <option>Credit Card</option>
                    <option>Debit Card</option>
                    <option>UPI</option>
                  </select>
                </div>
                <div className="modal-actions-row">
                  <button type="button" className="btn-primary" onClick={() => setShowAddWallet(false)}>Add Wallet</button>
                  <button type="button" className="btn-outline" onClick={() => setShowAddWallet(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Orders Modal */}
      {showViewOrders && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>📦 All Orders</h3>
              <button className="close-btn" onClick={() => setShowViewOrders(false)}>×</button>
            </div>
            <div className="modal-body">
              <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                <p>📋 Orders will be displayed here</p>
                <p style={{ fontSize: '14px', marginTop: '10px' }}>Real-time order tracking coming soon</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Sales Modal */}
      {showViewSales && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>📊 Sales Analytics</h3>
              <button className="close-btn" onClick={() => setShowViewSales(false)}>×</button>
            </div>
            <div className="modal-body">
              <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                <p>📈 Sales charts and analytics</p>
                <p style={{ fontSize: '14px', marginTop: '10px' }}>Revenue dashboard coming soon</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Menu Modal */}
      {showEditMenu && selectedOutlet && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>✏️ Edit Menu - {selectedOutlet.name}</h3>
              <button className="close-btn" onClick={() => setShowEditMenu(false)}>×</button>
            </div>
            <div className="modal-body">
              <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                <p>🍽️ Menu editor for {selectedOutlet.name}</p>
                <p style={{ fontSize: '14px', marginTop: '10px' }}>Add, edit, or remove items from this outlet's menu</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOutlets;
