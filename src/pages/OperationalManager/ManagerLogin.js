import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useManagerAuth } from '../../context/ManagerAuthContext';
import './ManagerLogin.css';

const ManagerLogin = () => {
  const { login, loading, error: authError } = useManagerAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!email || !password) {
      setLocalError('Please enter email and password');
      return;
    }

    try {
      await login(email, password);
      // Redirect to manager dashboard on successful login
      navigate('/manager/outlets');
    } catch (err) {
      setLocalError(err.message || 'Login failed. Please try again.');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="manager-login-container">
      <div className="manager-login-left">
        <div className="brand-logo">
          <img src="/9ac1c10f5b3a208d0a448c38f29ba974e5dc70d2.png" alt="Fliplyn Logo" className="logo-image" />
          <span className="brand-text">Fliplyn</span>
        </div>
        <div className="illustration-container">
          <img 
            src="/32aa279f0cec0ec1902170f9b9709ca8e6541c12.png" 
            alt="Manager Dashboard Illustration" 
            className="login-illustration"
          />
        </div>
        <div className="login-copy">
          <h2>Manage. Monitor. Deliver.</h2>
          <p>Handle orders, control your vendors list and keep outlets running smoothly.</p>
        </div>
        <div className="login-footer-copy">
          <p> ©2025 Fliplyn Manager Console · Limited Access</p>
        </div>
      </div>
      
      <div className="manager-login-right">
        <div className="login-form-wrapper">
          <h2>Manager Login</h2>
          <p className="login-subtext">Sign in to manage outlet operations<br />and live orders.</p>
          
          {(localError || authError) && <div className="error-message">{localError || authError}</div>}
          
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email or phone</label>
              <input 
                type="text" 
                placeholder="vendor@fliplyn.com or +91 9392977592" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group relative">
              <label>Password</label>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Enter password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span 
                className="eye-icon" 
                onClick={() => setShowPassword(!showPassword)}
              >
                👁️
              </span>
            </div>
            
            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" className="custom-checkbox" /> Remember me
              </label>
            </div>
            
            <button type="submit" className="manager-btn-primary" disabled={loading}>
              {loading ? 'Accessing Dashboard...' : 'Access Dashboard'}
            </button>
          </form>
          
          <div className="login-footer-secure">
            <span className="secure-icon">🛡️</span> Manager access only, Actions are logged for audit.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerLogin;
