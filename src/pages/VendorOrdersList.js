import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getVendorOrders } from '../services/vendorAPI';
import AppHeader from '../components/AppHeader';
import './VendorOrdersList.css';

const ORDERS = [
  { id: 'Order #1', items: '1 Spicy Chicken Burger\n1 Chocolate Cake', date: 'Nov 11, 2023 09:30 AM', status: 'pending' },
  { id: 'Order #1', items: '1 Spicy Chicken Burger\n1 Chocolate Cake', date: 'Nov 11, 2023 09:30 AM', status: 'pending' },
  { id: 'Order #1', items: '1 Spicy Chicken Burger\n1 Chocolate Cake', date: 'Nov 11, 2023 09:30 AM', status: 'pending' },
  { id: 'Order #1', items: '1 Spicy Chicken Burger\n1 Chocolate Cake', date: 'Nov 11, 2023 09:30 AM', status: 'pending' },
];

function VendorOrdersList() {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState('listing');
  const [search, setSearch] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [orders, setOrders] = useState(ORDERS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch orders when component mounts
  useEffect(() => {
    if (user?.id && token) {
      fetchOrders();
    }
  }, [user?.id, token]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getVendorOrders(user.id, token);
      if (Array.isArray(data)) {
        setOrders(data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load orders');
      console.error('Error fetching orders:', err);
      // Keep showing default orders if API fails
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vol-page">
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
          style={{ padding: '10px 20px', backgroundColor: '#F05A28', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
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

      <div className="vol-body">
        <h1 className="vol-title">Order List</h1>

        {/* Filters Row */}
        <div className="vol-filters">
          <div className="vol-search-wrap">
            <svg className="vol-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              className="vol-search"
              placeholder="Search items, order ID, token n..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="vol-filter-group">
            <label className="vol-filter-label">Token Number</label>
          </div>
          <div className="vol-filter-group">
            <label className="vol-filter-label">Time Range</label>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
          <div className="vol-tabs">
            <button
              className={`vol-tab ${activeTab === 'listing' ? 'vol-tab--active' : ''}`}
              onClick={() => setActiveTab('listing')}
            >
              In-listing
            </button>
            <button
              className={`vol-tab ${activeTab === 'completed' ? 'vol-tab--active' : ''}`}
              onClick={() => setActiveTab('completed')}
            >
              Completed
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="vol-table-wrap">
          <table className="vol-table">
            <thead>
              <tr>
                <th>Order Number</th>
                <th>Items</th>
                <th>Created Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {ORDERS.map((order, idx) => (
                <tr key={idx}>
                  <td className="vol-order-id">{order.id}</td>
                  <td className="vol-items">
                    {order.items.split('\n').map((item, i) => (
                      <div key={i}>{item}</div>
                    ))}
                  </td>
                  <td className="vol-date">{order.date}</td>
                  <td>
                    <button className="vol-complete-btn">Complete Order</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="vol-pagination">
          <div className="vol-rows-wrap">
            <span className="vol-rows-label">Rows per page:</span>
            <select
              className="vol-rows-select"
              value={rowsPerPage}
              onChange={e => setRowsPerPage(Number(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
          <div className="vol-page-info">
            <span>{(page - 1) * rowsPerPage + 1}–{Math.min(page * rowsPerPage, ORDERS.length)} of {ORDERS.length}</span>
            <button
              className="vol-page-btn"
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <button
              className="vol-page-btn"
              disabled={page * rowsPerPage >= ORDERS.length}
              onClick={() => setPage(p => p + 1)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VendorOrdersList;
