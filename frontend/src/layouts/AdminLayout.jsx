import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/Layout/AdminSidebar';
import { BellIcon, MagnifyingGlassIcon, UserCircleIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
  const { user, logout } = useAuth(); // ← Ajout de logout ici
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const getPageTitle = () => {
    const path = location.pathname;
    const titles = {
      '/admin': 'Tableau de bord',
      '/admin/catalog': 'Catalogue',
      '/admin/pharmacists': 'Pharmaciens',
      '/admin/delegates': 'Délégués médicaux',
      '/admin/delivery': 'Livreurs',
      '/admin/orders': 'Commandes',
      '/admin/payments': 'Paiements',
      '/admin/announcements': 'Annonces',
      '/admin/statistics': 'Statistiques',
      '/admin/settings': 'Paramètres'
    };
    return titles[path] || 'Administration';
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const goToProfile = () => {
    navigate('/admin/settings');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full z-30 transition-all duration-300 ${
        sidebarCollapsed ? 'w-20' : 'w-64'
      }`}>
        <AdminSidebar collapsed={sidebarCollapsed} onToggleCollapse={toggleSidebar} />
      </div>

      {/* Contenu principal */}
      <div className={`transition-all duration-300 ${
        sidebarCollapsed ? 'ml-20' : 'ml-64'
      }`}>
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-20">
          <div className="px-6 py-3 flex items-center justify-between">
            {/* Partie gauche : Nom de l'onglet */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Bars3Icon className="h-6 w-6 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-800">
                  {getPageTitle()}
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">
                  {user?.fullName || 'Administrateur'} • Super Admin
                </p>
              </div>
            </div>

            {/* Partie centrale : Barre de recherche avec icône d'annulation */}
            <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2 w-96 max-w-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white transition-all">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none focus:outline-none ml-2 text-sm w-full"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <XMarkIcon className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </div>

            {/* Partie droite : Notifications + Profil */}
            <div className="flex items-center gap-4">
              <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <BellIcon className="h-5 w-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Profil cliquable */}
              <button
                onClick={goToProfile}
                className="flex items-center gap-3 hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors group"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                    {user?.fullName || 'Administrateur'}
                  </p>
                  <p className="text-xs text-gray-400">Super Admin</p>
                </div>
                <div className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold ring-2 ring-transparent group-hover:ring-blue-300 transition-all">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    user?.fullName?.charAt(0) || 'A'
                  )}
                </div>
              </button>
            </div>
          </div>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile menu drawer */}
      {mobileMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-2xl z-50 lg:hidden">
            <AdminSidebar collapsed={false} onToggleCollapse={() => {}} />
          </div>
        </>
      )}
    </div>
  );
};

export default AdminLayout;