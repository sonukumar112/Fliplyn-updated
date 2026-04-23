import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AppHeader.css';

function AppHeader({ onSettingsClick, onClose }) {
  const navigate = useNavigate();

  return (
    <header className="app-header">
      <div className="app-header-logo" onClick={() => navigate('/outlets')} style={{ cursor: 'pointer' }}>
        <div className="app-header-logo-icon">
          <img src="/9ac1c10f5b3a208d0a448c38f29ba974e5dc70d2.png" alt="Fliplyn" className="app-header-logo-img" />
        </div>
        <span className="app-header-logo-text">Fliplyn</span>
      </div>
      <div className="app-header-actions">
        <button className="app-header-btn" onClick={onSettingsClick} aria-label="Settings">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        </button>
        <button className="app-header-btn app-header-close" onClick={onClose} aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    </header>
  );
}

export default AppHeader;
