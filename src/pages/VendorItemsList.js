import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getItemsByStallId, getStallDetails, updateItemAvailability } from '../services/vendorAPI';
import AppHeader from '../components/AppHeader';
import './VendorItemsList.css';

const ITEMS = [
  { id: 1, name: 'Item 1', type: 'Non Veg', price: 195, gst: true, status: 'available' },
  { id: 2, name: 'Item 2', type: 'Non Veg', price: 50, gst: true, status: 'available' },
  { id: 3, name: 'Item 3', type: '', price: 120, gst: false, status: 'paused' },
  { id: 4, name: 'Item 4', type: '', price: 258, gst: true, status: 'paused' },
];

const VegIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect x="1" y="1" width="12" height="12" rx="2" stroke="#27AE60" strokeWidth="1.5"/>
    <circle cx="7" cy="7" r="3.5" fill="#27AE60"/>
  </svg>
);

const NonVegIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect x="1" y="1" width="12" height="12" rx="2" stroke="#E74C3C" strokeWidth="1.5"/>
    <polygon points="7,3.5 11,10.5 3,10.5" fill="#E74C3C"/>
  </svg>
);

function Toggle({ checked, onChange }) {
  return (
    <button
      className={`vit-toggle ${checked ? 'vit-toggle--on' : 'vit-toggle--off'}`}
      onClick={() => onChange(!checked)}
      aria-label={checked ? 'Available' : 'Paused'}
    >
      <span className="vit-toggle-knob"></span>
    </button>
  );
}

function VendorItemsList() {
  const { user, token } = useAuth();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [items, setItems] = useState(ITEMS);
  const [outlet, setOutlet] = useState({
    name: 'Loading...',
    desc: 'Serving popular Indian Delicious',
    openTime: 'Opens at 9:00 AM',
    closeTime: 'Closes at 8:00 PM',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const STALL_ID = '66ff9944-2c10-4486-93b7-5c8530233d03'; // Default stall ID

  const fetchOutletDetails = useCallback(async () => {
    try {
      console.log('Fetching stall details for stall:', STALL_ID);
      const stallData = await getStallDetails(STALL_ID);
      console.log('Stall details response:', stallData);
      
      setOutlet({
        name: stallData.name || 'Your Outlet',
        desc: stallData.description || 'Manage your items and availability',
        openTime: stallData.opening_time ? `Opens at ${stallData.opening_time}` : 'Opens at 9:00 AM',
        closeTime: stallData.closing_time ? `Closes at ${stallData.closing_time}` : 'Closes at 8:00 PM',
      });
    } catch (err) {
      console.error('Error fetching stall details:', err);
      // Fallback to default
      setOutlet({
        name: 'Your Outlet',
        desc: 'Manage your items and availability',
        openTime: 'Opens at 9:00 AM',
        closeTime: 'Closes at 8:00 PM',
      });
    }
  }, [STALL_ID]);

  const fetchItems = useCallback(async () => {
    if (!STALL_ID) {
      console.log('No STALL_ID provided');
      return;
    }
    
    try {
      console.log('Fetching items for stall:', STALL_ID);
      setLoading(true);
      setError('');
      const data = await getItemsByStallId(STALL_ID);
      console.log('Items API Response:', data);
      
      if (Array.isArray(data) && data.length > 0) {
        console.log('Mapping items...');
        // Map API response to match component structure
        const mappedItems = data.map((item) => ({
          id: item.id,
          name: item.name || 'Unknown Item',
          type: item.is_veg ? 'Veg' : 'Non Veg',
          price: item.final_price || item.price || 0,
          gst: item.tax_included || false,
          status: item.is_available ? 'available' : 'paused',
          description: item.description || '',
          image_url: item.image_url || null,
          ...item,
        }));
        console.log('Setting items:', mappedItems);
        setItems(mappedItems);
      } else {
        console.log('No items received from API, using defaults');
      }
    } catch (err) {
      const errorMsg = err.message || 'Failed to load items';
      setError(errorMsg);
      console.error('Error fetching items:', err);
    } finally {
      setLoading(false);
    }
  }, [STALL_ID]);

  // Fetch items when component mounts
  useEffect(() => {
    console.log('VendorItemsList mounted, user:', user);
    
    if (user && user.id) {
      console.log('User id found:', user.id);
      console.log('Fetching outlet and items for stall:', STALL_ID);
      fetchOutletDetails();
      fetchItems();
    } else {
      console.log('User or user.id not available. User:', user);
    }
  }, [user, fetchItems, fetchOutletDetails, STALL_ID]);

  const toggleItem = async (id) => {
    // Find the current item to get its current status
    const item = items.find(i => i.id === id);
    if (!item) return;
    
    const newStatus = item.status === 'available' ? 'paused' : 'available';
    const isAvailable = newStatus === 'available';
    
    try {
      console.log(`Toggling item ${id} availability to ${isAvailable}`);
      
      // Call API to update availability
      const response = await updateItemAvailability(id, isAvailable);
      console.log('Item availability updated:', response);
      
      // Update local state after successful API call
      setItems(prev =>
        prev.map(item =>
          item.id === id
            ? { ...item, status: isAvailable ? 'available' : 'paused', is_available: isAvailable }
            : item
        )
      );
    } catch (err) {
      console.error('Error toggling item availability:', err);
      alert(`Failed to update item availability: ${err.message}`);
      // Don't update local state on error
    }
  };

  const filtered = items.filter(item => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'available' && item.status === 'available') ||
      (filter === 'paused' && item.status === 'paused');
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="vit-page">
      <AppHeader onSettingsClick={() => {}} onClose={() => navigate('/vendor/outlets')} />
      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '10px', padding: '15px', backgroundColor: '#f5f5f5', borderBottom: '1px solid #eee' }}>
        <button 
          onClick={() => navigate('/vendor/items')}
          style={{ padding: '10px 20px', backgroundColor: '#F05A28', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Items
        </button>
        <button 
          onClick={() => navigate('/vendor/orders')}
          style={{ padding: '10px 20px', backgroundColor: '#e0e0e0', color: '#333', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Orders
        </button>
        <button 
          onClick={() => navigate('/vendor/outlets')}
          style={{ padding: '10px 20px', backgroundColor: '#e0e0e0', color: '#333', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Outlets
        </button>
      </div>
      <div className="vit-body">
        {/* Outlet Header */}
        <div className="vit-outlet-header">
          <div className="vit-outlet-info">
            <h1 className="vit-outlet-name">{outlet.name}</h1>
            <p className="vit-outlet-desc">{outlet.desc}</p>
            <div className="vit-outlet-hours">
              <span className="vit-dot vit-dot--open"></span>
              <span>{outlet.openTime}</span>
              <span className="vit-dot vit-dot--closed"></span>
              <span>{outlet.closeTime}</span>
            </div>
          </div>
          <button className="vit-reports-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            Reports
          </button>
        </div>

        {/* Search & Filter */}
        <div className="vit-controls">
          <div className="vit-search-wrap">
            <svg className="vit-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              className="vit-search"
              placeholder="Search items by name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="vit-filter-tabs">
            {['all', 'available', 'paused'].map(tab => (
              <button
                key={tab}
                className={`vit-filter-tab ${filter === tab ? 'vit-filter-tab--active' : ''}`}
                onClick={() => setFilter(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Items Table */}
        <div className="vit-table-wrap">
          <table className="vit-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Price</th>
                <th>Availability</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.id}>
                  <td>
                    <div className="vit-item-cell">
                      <span className="vit-item-icon">
                        {item.type === 'Non Veg' ? <NonVegIcon /> : <VegIcon />}
                      </span>
                      <div>
                        <div className="vit-item-name">{item.name}</div>
                        {item.type && <div className="vit-item-type">{item.type}</div>}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="vit-price">₹{item.price}</div>
                    {item.gst && <div className="vit-gst">inc. GST</div>}
                  </td>
                  <td>
                    <div className="vit-avail-cell">
                      <Toggle
                        checked={item.status === 'available'}
                        onChange={() => toggleItem(item.id)}
                      />
                      <span className={`vit-avail-label ${item.status === 'available' ? 'vit-avail--on' : 'vit-avail--off'}`}>
                        {item.status === 'available' ? 'Available' : 'Paused'}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default VendorItemsList;
