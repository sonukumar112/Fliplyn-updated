import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './VendorLogin.css';

function VendorLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/outlets');
  };

  return (
    <div className="vl-container">
      {/* Left Side */}
      <div className="vl-left">
        <div className="vl-logo">
          <div className="vl-logo-icon">
            <img src="/9ac1c10f5b3a208d0a448c38f29ba974e5dc70d2.png" alt="Fliplyn" className="vl-logo-img" />
          </div>
          <span className="vl-logo-text">Fliplyn</span>
        </div>

        <div className="vl-illustration">
          <img
            src="/51afe2099fe57b136410d0e0f19b849cf57b107e (1).png"
            alt="Vendor workspace"
            className="vl-illus-img"
          />
        </div>

        <h2 className="vl-tagline">Smart. Fast. Empowered.</h2>
        <p className="vl-desc">Manage your Fliplyn Vendor workspace with confidence.</p>

        <div className="vl-footer">
          <p>©2025 Fliplyn Vendor Portal · Secure Access</p>
        </div>
      </div>

      {/* Right Side */}
      <div className="vl-right">
        <div className="vl-form-wrap">
          <h1 className="vl-title">Vendor Sign In</h1>
          <p className="vl-subtitle">Sign in to manage outlets and orders.</p>

          <form onSubmit={handleSubmit} className="vl-form">
            <div className="vl-field">
              <label className="vl-label">Email or phone</label>
              <input
                type="text"
                className="vl-input"
                placeholder="vendor@fliplyn.com or +91 9392977592"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="vl-field">
              <label className="vl-label">Password</label>
              <div className="vl-pw-wrap">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="vl-input"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="vl-pw-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
            </div>

            <div className="vl-remember">
              <input
                type="checkbox"
                id="rememberMe"
                className="vl-checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="rememberMe" className="vl-check-label">Remember me</label>
            </div>

            <button type="submit" className="vl-btn">Sign in</button>

            <p className="vl-contact">
              Need access? <a href="#contact">Contact admin</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default VendorLogin;
