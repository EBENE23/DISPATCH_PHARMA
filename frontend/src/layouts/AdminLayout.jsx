import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/Layout/AdminSidebar';
import { BellIcon, MagnifyingGlassIcon, UserCircleIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar fixe à gauche avec collapse */}
      <div className={`fixed left-0 top-0 h-full z-30 transition-all duration-300 ${
        sidebarCollapsed ? 'w-20' : 'w-64'
      }`}>
        <AdminSidebar collapsed={sidebarCollapsed} onToggleCollapse={toggleSidebar} />
      </div>

      {/* Contenu principal - s'adapte à la taille de la sidebar */}
      <div className={`transition-all duration-300 ${
        sidebarCollapsed ? 'ml-20' : 'ml-64'
      }`}>
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-20">
          <div className="px-6 py-3 flex items-center justify-between">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
              <Bars3Icon className="h-6 w-6 text-gray-600" />
            </button>
            <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2 w-80">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              <input type="text" placeholder="Rechercher..." className="bg-transparent focus:outline-none ml-2 text-sm w-full" />
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 rounded-lg hover:bg-gray-100">
                <BellIcon className="h-5 w-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-700">{user?.fullName || 'Administrateur'}</p>
                  <p className="text-xs text-gray-400">Super Admin</p>
                </div>
                <UserCircleIcon className="h-9 w-9 text-gray-400" />
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>

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