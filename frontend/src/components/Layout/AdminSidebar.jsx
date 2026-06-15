import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  HomeIcon, 
  UsersIcon, 
  ShoppingBagIcon, 
  ClipboardDocumentListIcon, 
  TruckIcon,
  CurrencyDollarIcon,
  MegaphoneIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ChartBarIcon,
  BuildingOfficeIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import logo from '../../assets/images/logos/dispatch-logo.png';

const AdminSidebar = ({ collapsed, onToggleCollapse }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/admin', label: 'Tableau de bord', icon: <HomeIcon className="h-5 w-5" />, end: true },
    { path: '/admin/catalog', label: 'Catalogue', icon: <ShoppingBagIcon className="h-5 w-5" /> },
    { path: '/admin/pharmacists', label: 'Pharmaciens', icon: <BuildingOfficeIcon className="h-5 w-5" /> },
    { path: '/admin/delegates', label: 'Délégués', icon: <UsersIcon className="h-5 w-5" /> },
    { path: '/admin/delivery', label: 'Livreurs', icon: <TruckIcon className="h-5 w-5" /> },
    { path: '/admin/orders', label: 'Commandes', icon: <ClipboardDocumentListIcon className="h-5 w-5" /> },
    { path: '/admin/payments', label: 'Paiements', icon: <CurrencyDollarIcon className="h-5 w-5" /> },
    { path: '/admin/announcements', label: 'Annonces', icon: <MegaphoneIcon className="h-5 w-5" /> },
    { path: '/admin/statistics', label: 'Statistiques', icon: <ChartBarIcon className="h-5 w-5" /> },
    { path: '/admin/settings', label: 'Paramètres', icon: <Cog6ToothIcon className="h-5 w-5" /> },
  ];

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className={`h-full bg-gray-900 text-white flex flex-col transition-all duration-300 ${
      collapsed ? 'w-20' : 'w-64'
    }`}>
      {/* Logo */}
      <div className={`p-5 border-b border-gray-700 ${collapsed ? 'px-3' : ''}`}>
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-3 ${collapsed ? 'justify-center w-full' : ''}`}>
            <img src={logo} alt="Logo" className="h-8 w-8 brightness-0 invert" />
            {!collapsed && (
              <div>
                <div className="font-bold text-white">DISPATCH PHARMA</div>
                <div className="text-xs text-gray-400">Administrateur</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end || false}
            className={({ isActive }) =>
              `flex items-center gap-3 px-5 py-3 text-sm transition-colors ${
                isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              } ${collapsed ? 'justify-center px-2' : ''}`
            }
            title={collapsed ? item.label : ''}
          >
            {item.icon}
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer avec bouton de collapse - FLÈCHE BIEN VISIBLE */}
      <div className="p-4 border-t border-gray-700">
        {/* Bouton de collapse/expand - Placé en premier pour être visible */}
        <button
          onClick={onToggleCollapse}
          className={`flex items-center justify-center mb-4 p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors w-full ${
            collapsed ? 'flex-col' : ''
          }`}
          title={collapsed ? 'Agrandir' : 'Réduire'}
        >
          {collapsed ? (
            <>
              <ChevronRightIcon className="h-5 w-5" />
              <span className="text-xs mt-1">Agrandir</span>
            </>
          ) : (
            <>
              <ChevronLeftIcon className="h-5 w-5" />
              <span className="ml-2 text-sm">Réduire le menu</span>
            </>
          )}
        </button>

        {/* Bouton déconnexion */}
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 px-5 py-3 text-sm text-gray-300 hover:bg-red-600 hover:text-white rounded-lg transition-colors ${
            collapsed ? 'justify-center px-2' : ''
          } w-full`}
          title={collapsed ? 'Déconnexion' : ''}
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          {!collapsed && <span>Déconnexion</span>}
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;