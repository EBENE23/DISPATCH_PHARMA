import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import dispatchLogo from '../../assets/images/logos/dispatch-logo.png';
import defaultAvatar from '../../assets/images/avatars/avatar-admin.png';
import { 
  HomeIcon, 
  ShoppingBagIcon, 
  ShoppingCartIcon, 
  ChatBubbleLeftRightIcon, 
  UserGroupIcon, 
  ChartBarIcon, 
  UserIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { summary } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Accueil', icon: HomeIcon, roles: ['delegate', 'admin', 'pharmacist', 'delivery'] },
    { path: '/catalog', label: 'Catalogue', icon: ShoppingBagIcon, roles: ['delegate'] },
    { path: '/doctors', label: 'Médecins', icon: UserGroupIcon, roles: ['delegate', 'admin'] },
    { path: '/orders', label: 'Commandes', icon: ShoppingBagIcon, roles: ['delegate', 'admin', 'delivery'] },
    { path: '/messages', label: 'Messages', icon: ChatBubbleLeftRightIcon, roles: ['delegate', 'admin', 'pharmacist', 'delivery'] },
    { path: '/ai', label: 'IA Assistant', icon: SparklesIcon, roles: ['delegate', 'admin'] },
    { path: '/statistics', label: 'Stats', icon: ChartBarIcon, roles: ['admin'] },
    { path: '/profile', label: 'Profil', icon: UserIcon, roles: ['delegate', 'admin', 'pharmacist', 'delivery'] },
  ];

  const visibleNavItems = navItems.filter(item => item.roles.includes(user?.role));

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src={dispatchLogo} 
              alt="Dispatch Pharma" 
              className="h-10 w-auto"
              onError={(e) => { e.target.src = dispatchLogo; }}
            />
            <span className="font-bold text-xl text-primary-500">DISPATCH PHARMA</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {visibleNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all ${
                  isActive(item.path)
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Right side - Cart & User */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon */}
            {user?.role === 'delegate' && (
              <Link to="/cart" className="relative">
                <ShoppingCartIcon className="h-6 w-6 text-gray-600 hover:text-primary-500" />
                {summary.itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {summary.itemCount}
                  </span>
                )}
              </Link>
            )}

            {/* User Menu */}
            <div className="relative">
              <button className="flex items-center space-x-2">
                <img
                  src={user?.avatar || defaultAvatar}
                  alt={user?.fullName}
                  className="h-8 w-8 rounded-full object-cover"
                  onError={(e) => { e.target.src = defaultAvatar; }}
                />
                <span className="hidden md:inline text-sm font-medium text-gray-700">
                  {user?.fullName?.split(' ')[0]}
                </span>
              </button>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-red-500 transition-colors"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
            </button>

            {/* Mobile menu button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            {visibleNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg ${
                  isActive(item.path)
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-600'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;