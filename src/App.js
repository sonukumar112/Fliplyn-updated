import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ManagerAuthProvider, useManagerAuth } from './context/ManagerAuthContext';
import VendorLogin from './VendorLogin';
import VendorOrdersList from './pages/VendorOrdersList';
import VendorOutletsList from './pages/VendorOutletsList';
import VendorItemsList from './pages/VendorItemsList';

import ManagerLogin from './pages/OperationalManager/ManagerLogin';
import ManageOutlets from './pages/OperationalManager/ManageOutlets';
import VendorsList from './pages/OperationalManager/VendorsList';
import ManagersList from './pages/OperationalManager/ManagersList';
import WalletManagement from './pages/OperationalManager/WalletManagement';

import './App.css';

// Protected Route Component for Vendors
function ProtectedVendorRoute({ element }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? element : <Navigate to="/login" replace />;
}

// Protected Route Component for Managers
function ProtectedManagerRoute({ element }) {
  const { isAuthenticated } = useManagerAuth();
  return isAuthenticated ? element : <Navigate to="/manager/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Vendor Routes */}
      <Route path="/" element={<Navigate to="/vendor/items" replace />} />
      <Route path="/login" element={<VendorLogin />} />
      <Route path="/vendor/orders" element={<ProtectedVendorRoute element={<VendorOrdersList />} />} />
      <Route path="/vendor/outlets" element={<ProtectedVendorRoute element={<VendorOutletsList />} />} />
      <Route path="/vendor/items" element={<ProtectedVendorRoute element={<VendorItemsList />} />} />

      {/* Manager Routes */}
      <Route path="/manager/login" element={<ManagerLogin />} />
      <Route path="/manager/outlets" element={<ProtectedManagerRoute element={<ManageOutlets />} />} />
      <Route path="/manager/vendors" element={<ProtectedManagerRoute element={<VendorsList />} />} />
      <Route path="/manager/managers" element={<ProtectedManagerRoute element={<ManagersList />} />} />
      <Route path="/manager/wallet" element={<ProtectedManagerRoute element={<WalletManagement />} />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <ManagerAuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ManagerAuthProvider>
    </AuthProvider>
  );
}

export default App;
