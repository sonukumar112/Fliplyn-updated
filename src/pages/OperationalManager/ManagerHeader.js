import React from 'react';
import './ManagerHeader.css';

const ManagerHeader = () => {
  return (
    <div className="manager-header">
      <div className="brand-logo">
        <img src="/9ac1c10f5b3a208d0a448c38f29ba974e5dc70d2.png" alt="Fliplyn Logo" className="logo-image" />
        <span className="fliplyn-text">Fliplyn</span>
      </div>
      <div className="header-user-profile">
        <button className="help-icon" title="Help">?</button>
        <div className="user-avatar">
          <img src="https://ui-avatars.com/api/?name=Alex+M&background=F05A28&color=fff" alt="User Avatar" />
        </div>
      </div>
    </div>
  );
};

export default ManagerHeader;
