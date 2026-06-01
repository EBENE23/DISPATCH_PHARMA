import React, { useState } from 'react';
import { MagnifyingGlassIcon, PlusIcon, PencilIcon, TrashIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

const AdminHospitals = () => {
  const [hospitals, setHospitals] = useState([
    { id: 1, name: 'Hôpital Central de Yaoundé', city: 'Yaoundé', region: 'Centre', doctors: 45, status: 'Actif' },
    { id: 2, name: 'Clinique Saint Michel', city: 'Douala', region: 'Littoral', doctors: 28, status: 'Actif' },
    { id: 3, name: 'Hôpital Gynéco-obstétrique', city: 'Yaoundé', region: 'Centre', doctors: 32, status: 'Actif' },
    { id: 4, name: 'Hôpital Laquintinie', city: 'Douala', region: 'Littoral', doctors: 56, status: 'Inactif' },
    { id: 5, name: 'Centre Hospitalier Universitaire', city: 'Yaoundé', region: 'Centre', doctors: 120, status: 'Actif' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = hospitals.filter(h => 
    h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    return status === 'Actif' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Hôpitaux</h1>
        <p className="text-gray-500">Gérez les établissements de santé partenaires</p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un hôpital..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>
        <button className="btn-primary flex items-center gap-2">
          <PlusIcon className="h-5 w-5" />
          Ajouter un hôpital
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">{hospitals.length}</p>
          <p className="text-sm text-gray-500">Total hôpitaux</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{hospitals.filter(h => h.status === 'Actif').length}</p>
          <p className="text-sm text-gray-500">Actifs</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{hospitals.reduce((sum, h) => sum + h.doctors, 0)}</p>
          <p className="text-sm text-gray-500">Médecins total</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center">
          <BuildingOfficeIcon className="h-8 w-8 text-gray-400 mx-auto" />
          <p className="text-sm text-gray-500 mt-1">Établissements</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ville</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Région</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Médecins</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.city}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.region}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.doctors}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg">
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-red-600 hover:bg-red-50 rounded-lg">
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

export default AdminHospitals;