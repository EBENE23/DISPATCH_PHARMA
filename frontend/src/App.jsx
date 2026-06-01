import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
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

// Composants Layout
import Navbar from './components/Layout/Navbar';

// Context
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Auth guard
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
          {/* Page d'accueil publique */}
          <Route path="/" element={<Landing />} />
          
          {/* Pages d'authentification */}
          <Route path="/login" element={<Login />} />
          
          {/* Pages privées (après connexion) */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <>
                <Navbar />
                <Dashboard />
              </>
            </PrivateRoute>
          } />
          
          <Route path="/catalog" element={
            <PrivateRoute>
              <>
                <Navbar />
                <Catalog />
              </>
            </PrivateRoute>
          } />
          
          <Route path="/product/:id" element={
            <PrivateRoute>
              <>
                <Navbar />
                <ProductDetail />
              </>
            </PrivateRoute>
          } />
          
          <Route path="/cart" element={
            <PrivateRoute>
              <>
                <Navbar />
                <Cart />
              </>
            </PrivateRoute>
          } />
          
          <Route path="/orders" element={
            <PrivateRoute>
              <>
                <Navbar />
                <Orders />
              </>
            </PrivateRoute>
          } />
          
          <Route path="/messages" element={
            <PrivateRoute>
              <>
                <Navbar />
                <Messages />
              </>
            </PrivateRoute>
          } />
          
          <Route path="/doctors" element={
            <PrivateRoute>
              <>
                <Navbar />
                <Doctors />
              </>
            </PrivateRoute>
          } />
          
          <Route path="/ai" element={
            <PrivateRoute>
              <>
                <Navbar />
                <AIDashboard />
              </>
            </PrivateRoute>
          } />
          
          <Route path="/profile" element={
            <PrivateRoute>
              <>
                <Navbar />
                <Profile />
              </>
            </PrivateRoute>
          } />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;