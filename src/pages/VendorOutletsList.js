import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getVendorOutlets } from '../services/vendorAPI';
import AppHeader from '../components/AppHeader';
import './VendorOutletsList.css';

const OUTLETS = [
  {
    id: 1,
    name: 'Bella Rosa Cafe',
    desc: 'Cozy cafe meets R&B Mall',
    image: null,
    openTime: 'Opens at 9:00 AM',
    closeTime: 'Closes at 8:00 PM',
    isOpen: true,
    color: '#8B4513',
  },
  {
    id: 2,
    name: 'Campus Food Court',
    desc: 'Friendly venue for campus diners',
    image: null,
    openTime: 'Opens at 9:00 AM',
    closeTime: 'Closes at 8:00 PM',
    isOpen: true,
    color: '#E8732A',
  },
  {
    id: 3,
    name: 'Express Mini Mart',
    desc: 'Wide selection at 2 Manipal St.',
    image: null,
    openTime: 'Opens at 9:00 AM',
    closeTime: 'Closes at 8:00 PM',
    isOpen: true,
    color: '#D4440C',
  },
  {
    id: 4,
    name: 'Spicy Delights',
    desc: 'Serving popular Indian Delicious',
    image: null,
    openTime: 'Opens at 9:00 AM',
    closeTime: 'Closes at 8:00 PM',
    isOpen: true,
    color: '#C0392B',
  },
];

const StoreIcon = ({ color }) => (
  <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="8" fill={color} opacity="0.15"/>
    <rect x="20" y="55" width="60" height="35" rx="4" fill={color}/>
    <rect x="38" y="65" width="24" height="25" rx="2" fill="white" opacity="0.3"/>
    <path d="M15 55 L30 30 H70 L85 55" fill={color} opacity="0.8"/>
    <rect x="10" y="52" width="80" height="6" rx="3" fill={color}/>
    <rect x="25" y="60" width="18" height="14" rx="2" fill="white" opacity="0.4"/>
    <rect x="57" y="60" width="18" height="14" rx="2" fill="white" opacity="0.4"/>
  </svg>
);

function VendorOutletsList() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [outlets, setOutlets] = useState(OUTLETS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch outlets when component mounts
  useEffect(() => {
    if (user?.id && token) {
      fetchOutlets();
    }
  }, [user?.id, token]);

  const fetchOutlets = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getVendorOutlets(user.id, token);
      console.log('Outlets API Response:', data); // Debug log
      
      if (Array.isArray(data)) {
        // Map API response to match component structure
        const mappedOutlets = data.map((outlet, index) => ({
          id: outlet.id || outlet.outlet_id || index,
          name: outlet.name || outlet.outlet_name || 'Unknown Outlet',
          desc: outlet.description || outlet.desc || 'No description',
          image: outlet.image || null,
          openTime: outlet.openTime || outlet.open_time || 'Opens at 9:00 AM',
          closeTime: outlet.closeTime || outlet.close_time || 'Closes at 8:00 PM',
          isOpen: outlet.isOpen !== undefined ? outlet.isOpen : true,
          color: outlet.color || '#8B4513',
          ...outlet, // Include all original fields too
        }));
        setOutlets(mappedOutlets);
      }
    } catch (err) {
      setError(err.message || 'Failed to load outlets');
      console.error('Error fetching outlets:', err);
      // Keep showing default outlets if API fails
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vout-page">
      <AppHeader onSettingsClick={() => {}} onClose={() => navigate('/login')} />

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '10px', padding: '15px', backgroundColor: '#f5f5f5', borderBottom: '1px solid #eee' }}>
        <button 
          onClick={() => navigate('/vendor/items')}
          style={{ padding: '10px 20px', backgroundColor: '#e0e0e0', color: '#333', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
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
          style={{ padding: '10px 20px', backgroundColor: '#F05A28', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Outlets
        </button>
      </div>

      <div className="vout-body">
        <h1 className="vout-title">My Outlets</h1>
        <p className="vout-subtitle">Select an outlet to manage items and update availability.</p>

        <div className="vout-grid">
          {outlets.map((outlet) => (
            <div key={outlet.id} className="vout-card">
              <div className="vout-card-img" style={{ background: `${outlet.color}18` }}>
                <StoreIcon color={outlet.color} />
              </div>
              <div className="vout-card-body">
                <h3 className="vout-card-name">{outlet.name}</h3>
                <p className="vout-card-desc">{outlet.desc}</p>
                <div className="vout-card-status">
                  <div className="vout-status-row">
                    <span className={`vout-dot ${outlet.isOpen ? 'vout-dot--open' : 'vout-dot--closed'}`}></span>
                    <span className="vout-status-text">{outlet.openTime}</span>
                  </div>
                  <div className="vout-status-row">
                    <span className="vout-dot vout-dot--closed"></span>
                    <span className="vout-status-text">{outlet.closeTime}</span>
                  </div>
                </div>
                <button
                  className="vout-open-btn"
                  onClick={() => navigate('/vendor/items')}
                >
                  Open
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="vout-bottom">
          <button className="vout-manage-btn" onClick={() => navigate('/vendor/items')}>
            Manage Items
          </button>
        </div>
      </div>
    </div>
  );
}

export default VendorOutletsList;
