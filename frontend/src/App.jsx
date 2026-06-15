import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages publiques
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Messages from './pages/Messages';
import Doctors from './pages/Doctors';
import AIDashboard from './pages/AIDashboard';
import Profile from './pages/Profile';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import Navbar from './components/Layout/Navbar';

// Pages Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCatalog from './pages/admin/AdminCatalog';
import AdminPharmacists from './pages/admin/AdminPharmacists';
import AdminDelegates from './pages/admin/AdminDelegates';
import AdminDeliveryPersons from './pages/admin/AdminDeliveryPersons';
import AdminOrders from './pages/admin/AdminOrders';
import AdminPayments from './pages/admin/AdminPayments';
import AdminAnnouncements from './pages/admin/AdminAnnouncements';
import AdminStatistics from './pages/admin/AdminStatistics';
import AdminSettings from './pages/admin/AdminSettings';

// Context
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Auth guards
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (!token) return <Navigate to="/login" />;
  if (user.role !== 'admin') return <Navigate to="/dashboard" />;
  return children;
};

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          
          {/* Routes Admin */}
          <Route path="/admin" element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="catalog" element={<AdminCatalog />} />
            <Route path="pharmacists" element={<AdminPharmacists />} />
            <Route path="delegates" element={<AdminDelegates />} />
            <Route path="delivery" element={<AdminDeliveryPersons />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="announcements" element={<AdminAnnouncements />} />
            <Route path="statistics" element={<AdminStatistics />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
          
          {/* Routes Délégué */}
          <Route path="/dashboard" element={<PrivateRoute><><Navbar /><Dashboard /></></PrivateRoute>} />
          <Route path="/catalog" element={<PrivateRoute><><Navbar /><Catalog /></></PrivateRoute>} />
          <Route path="/product/:id" element={<PrivateRoute><><Navbar /><ProductDetail /></></PrivateRoute>} />
          <Route path="/cart" element={<PrivateRoute><><Navbar /><Cart /></></PrivateRoute>} />
          <Route path="/orders" element={<PrivateRoute><><Navbar /><Orders /></></PrivateRoute>} />
          <Route path="/messages" element={<PrivateRoute><><Navbar /><Messages /></></PrivateRoute>} />
          <Route path="/doctors" element={<PrivateRoute><><Navbar /><Doctors /></></PrivateRoute>} />
          <Route path="/ai" element={<PrivateRoute><><Navbar /><AIDashboard /></></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><><Navbar /><Profile /></></PrivateRoute>} />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;