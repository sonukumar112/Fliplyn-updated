import React, { useState } from 'react';
import ManagerHeader from './ManagerHeader';
import './WalletManagement.css';

const WalletManagement = () => {
  const [showForm, setShowForm] = useState(false);

  const [wallets] = useState([
    { id: 1, name: 'Puja Y', amount: 50000, image: 'https://ui-avatars.com/api/?name=Puja+Y&background=FF7A59&color=fff&size=60' },
    { id: 2, name: 'Madhumitha', amount: 200, image: 'https://ui-avatars.com/api/?name=Madhumitha&background=FF7A59&color=fff&size=60' },
  ]);

  return (
    <div className="manager-page-layout">
      <ManagerHeader />
      
      <div className="manager-content">
        <div className="wallet-page-container">
          
          {/* Left Column: Wallets List */}
          <div className="wallet-left full-width">
            <div className="section-header">
              <h3>Wallet Management</h3>
              <button className="btn-primary small" onClick={() => setShowForm(true)}>+ Add Wallet</button>
            </div>
            
            <div className="wallets-label">Wallets</div>
            <div className="table-container">
              <table className="wallets-table">
                <thead>
                  <tr>
                    <th style={{ backgroundColor: '#F05A28', color: 'white' }}>User Name</th>
                    <th style={{ backgroundColor: '#F05A28', color: 'white' }}>Wallet Amount</th>
                    <th style={{ backgroundColor: '#F05A28', color: 'white' }}>Image</th>
                    <th style={{ backgroundColor: '#F05A28', color: 'white' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {wallets.map((wallet) => (
                    <tr key={wallet.id}>
                      <td>
                        <div className="wallet-user-cell">
                          <img src={wallet.image} alt={wallet.name} className="wallet-avatar" />
                          <span>{wallet.name}</span>
                        </div>
                      </td>
                      <td>₹{wallet.amount.toLocaleString('en-IN')}</td>
                      <td>
                        <img src={wallet.image} alt={wallet.name} className="wallet-image-preview" />
                      </td>
                      <td>
                        <div className="action-icons">
                          <span className="icon edit-icon" title="Edit">✎</span>
                          <span className="icon delete-icon" title="Delete">🗑️</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Add Wallet Modal Popup */}
        {showForm && (
          <div className="modal-overlay">
            <div className="modal-content add-wallet-modal">
              <div className="form-header">
                <h3>Wallet Management</h3>
                <button className="close-btn" onClick={() => setShowForm(false)}>×</button>
              </div>
              
              <div className="modal-body">
                <form className="wallet-form">
                  <div className="form-group">
                    <label>Wallet Amount (₹)</label>
                    <input type="number" placeholder="Enter amount in ₹" />
                  </div>

                  <div className="form-group">
                    <label>User Email / Phone</label>
                    <input type="text" placeholder="Enter user email or phone" />
                  </div>

                  <div className="form-group">
                    <label>Upload Image (optional)</label>
                    <input type="file" />
                  </div>

                  <button type="button" className="btn-create-wallet">CREATE WALLET</button>
                </form>

                <div className="form-wallets-section">
                  <div className="wallets-label">Wallets</div>
                  <div className="table-container">
                    <table className="wallets-table">
                      <thead>
                        <tr>
                          <th style={{ backgroundColor: '#F05A28', color: 'white' }}>User Name</th>
                          <th style={{ backgroundColor: '#F05A28', color: 'white' }}>Wallet Amount</th>
                          <th style={{ backgroundColor: '#F05A28', color: 'white' }}>Image</th>
                          <th style={{ backgroundColor: '#F05A28', color: 'white' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {wallets.map((wallet) => (
                          <tr key={wallet.id}>
                            <td>
                              <div className="wallet-user-cell">
                                <img src={wallet.image} alt={wallet.name} className="wallet-avatar" />
                                <span>{wallet.name}</span>
                              </div>
                            </td>
                            <td>₹{wallet.amount.toLocaleString('en-IN')}</td>
                            <td>
                              <img src={wallet.image} alt={wallet.name} className="wallet-image-preview" />
                            </td>
                            <td>
                              <div className="action-icons">
                                <span className="icon edit-icon" title="Edit">✎</span>
                                <span className="icon delete-icon" title="Delete">🗑️</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletManagement;
