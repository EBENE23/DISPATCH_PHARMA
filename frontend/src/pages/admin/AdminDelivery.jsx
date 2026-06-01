import React, { useState } from 'react';
import { MagnifyingGlassIcon, PlusIcon, PencilIcon, TrashIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const AdminDelegates = () => {
  const [delegates, setDelegates] = useState([
    { id: 1, name: 'Jean Kamga', email: 'jean.kamga@dispatch.com', sector: 'Yaoundé Centre', status: 'Actif', orders: 45, revenue: 1250000 },
    { id: 2, name: 'Marie Ngo', email: 'marie.ngo@dispatch.com', sector: 'Douala', status: 'Actif', orders: 38, revenue: 980000 },
    { id: 3, name: 'Paul Atangana', email: 'paul.atangana@dispatch.com', sector: 'Littoral', status: 'Inactif', orders: 12, revenue: 320000 },
    { id: 4, name: 'Claire Mbarga', email: 'claire.mbarga@dispatch.com', sector: 'Yaoundé Nord', status: 'Actif', orders: 52, revenue: 1560000 },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredDelegates = delegates.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.sector.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    return status === 'Actif' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Délégués médicaux</h1>
        <p className="text-gray-500">Gérez l'ensemble des délégués médicaux de la plateforme</p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un délégué..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>
        <button className="btn-primary flex items-center gap-2">
          <PlusIcon className="h-5 w-5" />
          Nouveau délégué
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{delegates.length}</p>
          <p className="text-sm text-gray-500">Total délégués</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{delegates.filter(d => d.status === 'Actif').length}</p>
          <p className="text-sm text-gray-500">Actifs</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">{delegates.reduce((sum, d) => sum + d.orders, 0)}</p>
          <p className="text-sm text-gray-500">Commandes totales</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-emerald-600">{(delegates.reduce((sum, d) => sum + d.revenue, 0) / 1000000).toFixed(1)}M FCFA</p>
          <p className="text-sm text-gray-500">CA généré</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Secteur</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commandes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CA</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDelegates.map((delegate) => (
                <tr key={delegate.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{delegate.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{delegate.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{delegate.sector}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{delegate.orders}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{delegate.revenue.toLocaleString()} FCFA</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(delegate.status)}`}>
                      {delegate.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDelegates;