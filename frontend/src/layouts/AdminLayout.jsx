import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/Layout/AdminSidebar';
import { Bars3Icon, BellIcon, MagnifyingGlassIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar Desktop */}
      <div className="hidden lg:block fixed inset-y-0 left-0 w-72 z-30 shadow-2xl">
        <AdminSidebar />
      </div>

      {/* Sidebar Mobile */}
      {sidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 lg:hidden">
            <AdminSidebar isMobile onClose={() => setSidebarOpen(false)} />
          </div>
        </>
      )}

      {/* Contenu principal */}
      <div className="lg:ml-72">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-20">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Bars3Icon className="h-6 w-6 text-gray-600" />
              </button>
              <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2 w-80">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="bg-transparent border-none focus:outline-none ml-2 text-sm w-full"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <BellIcon className="h-5 w-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-700">Administrateur</p>
                  <p className="text-xs text-gray-400">Super Admin</p>
                </div>
                <UserCircleIcon className="h-9 w-9 text-gray-400" />
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;