import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import './VendorLogin.css';

function VendorLogin() {
  const navigate = useNavigate();
  const { login, loading, error: authError } = useAuth();
  const [phone_number, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!phone_number || !password) {
      setLocalError('Please enter phone number and password');
      return;
    }

    try {
      await login(phone_number, password);
      // Redirect to vendor dashboard on successful login
      navigate('/vendor/items');
    } catch (err) {
      setLocalError(err.message || 'Login failed. Please try again.');
      console.error('Login error:', err);
    }
  };

  const togglePasswordVisibility = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  return (
    <div className="vendor-login-container">
      {/* Left Side */}
      <div className="vendor-login-left">
        <div className="vendor-login-logo">
          <img 
            src="/9ac1c10f5b3a208d0a448c38f29ba974e5dc70d2.png" 
            alt="Fliplyn Logo" 
            className="logo-image"
          />
        </div>

        <div className="logo-text" aria-label="Fliplyn">
          Fliplyn
        </div>

        <div className="vendor-login-illustration">
          <img 
            src="/51afe2099fe57b136410d0e0f19b849cf57b107e (1).png" 
            alt="Vendor workspace illustration" 
            className="illustration-image"
          />
        </div>

        <h2 className="vendor-login-tagline">Smart. Fast. Empowered.</h2>
        <p className="vendor-login-description">
          Manage your Fliplyn Vendor workspace with confidence.
        </p>

        <div className="vendor-login-footer">
          <p>©2025 Fliplyn Vendor Portal · Secure Access</p>
        </div>
      </div>

      {/* Right Side */}
      <div className="vendor-login-right">
        <div className="vendor-login-form-container">
          <h1 className="vendor-login-title">Vendor Sign In</h1>
          <p className="vendor-login-subtitle">Sign in to manage outlets and orders.</p>

          {(localError || authError) && <div className="error-message">{localError || authError}</div>}

          <form onSubmit={handleSubmit} className="vendor-login-form">
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-input"
                placeholder="6305410507"
                value={phone_number}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button" 
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? '👁️‍🗨️' : '👁️'}
                </button>
              </div>
            </div>

            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="rememberMe"
                className="form-checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="rememberMe" className="checkbox-label">
                Remember me
              </label>
            </div>

            <button 
              type="submit" 
              className="vendor-login-button"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>

            <p className="vendor-login-contact">
              Need access? <a href="#contact">Contact admin</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default VendorLogin;
