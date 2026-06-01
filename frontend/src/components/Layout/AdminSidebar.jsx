import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  HomeIcon, 
  UsersIcon, 
  TruckIcon, 
  BuildingOfficeIcon, 
  CurrencyDollarIcon,
  ShoppingBagIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  XMarkIcon,
  ChartBarIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import logo from '../../assets/images/logos/dispatch-logo.png';

const AdminSidebar = ({ isMobile, onClose }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/admin', label: 'Tableau de bord', icon: <HomeIcon className="h-5 w-5" />, color: 'bg-blue-500' },
    { path: '/admin/delegates', label: 'Délégués médicaux', icon: <UserGroupIcon className="h-5 w-5" />, color: 'bg-green-500' },
    { path: '/admin/delivery', label: 'Livreurs', icon: <TruckIcon className="h-5 w-5" />, color: 'bg-orange-500' },
    { path: '/admin/hospitals', label: 'Hôpitaux', icon: <BuildingOfficeIcon className="h-5 w-5" />, color: 'bg-purple-500' },
    { path: '/admin/revenue', label: 'Chiffre d\'affaires', icon: <CurrencyDollarIcon className="h-5 w-5" />, color: 'bg-emerald-500' },
    { path: '/admin/orders', label: 'Commandes', icon: <ClipboardDocumentListIcon className="h-5 w-5" />, color: 'bg-indigo-500' },
    { path: '/admin/products', label: 'Produits', icon: <ShoppingBagIcon className="h-5 w-5" />, color: 'bg-pink-500' },
    { path: '/admin/statistics', label: 'Statistiques', icon: <ChartBarIcon className="h-5 w-5" />, color: 'bg-cyan-500' },
    { path: '/admin/settings', label: 'Paramètres', icon: <Cog6ToothIcon className="h-5 w-5" />, color: 'bg-gray-500' },
  ];

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    if (onClose) onClose();
  };

  return (
    <div className="h-full w-full bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col shadow-xl">
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-xl">
              <img src={logo} alt="Dispatch Pharma" className="h-8 w-auto brightness-0 invert" />
            </div>
            <div>
              <span className="font-bold text-lg block">
                <span style={{ color: '#ffffff' }}>DISPATCH</span>
                <span style={{ color: '#44ac40' }}>PHARMA</span>
              </span>
              <span className="text-xs text-gray-400">Espace Administrateur</span>
            </div>
          </div>
          {isMobile && (
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-700 transition-colors">
              <XMarkIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Profil administrateur */}
      <div className="p-4 m-3 bg-gray-700/50 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">Administrateur</p>
            <p className="text-xs text-gray-400">Super Admin</p>
          </div>
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-4 overflow-y-auto">
        <div className="mb-6">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-3 px-4">Navigation principale</p>
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={() => isMobile && onClose?.()}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                      isActive
                        ? 'bg-gray-700 text-white shadow-lg'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`
                  }
                >
                  <div className={`p-1 rounded-lg ${item.color} bg-opacity-20 group-hover:bg-opacity-30 transition-all`}>
                    {item.icon}
                  </div>
                  <span className="text-sm font-medium">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-red-600 hover:text-white transition-all duration-200 w-full group"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5 group-hover:rotate-180 transition-transform duration-300" />
          <span className="text-sm font-medium">Déconnexion</span>
        </button>
        <p className="text-gray-500 text-xs text-center mt-4">
          © 2025 DISPATCH PHARMA<br />
          Version 1.0.0
        </p>
      </div>
    </div>
  );
};

export default AdminSidebar;