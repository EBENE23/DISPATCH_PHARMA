import React, { useState } from 'react';
import { MagnifyingGlassIcon, EllipsisHorizontalIcon, EnvelopeIcon, TrashIcon, XMarkIcon, EyeIcon } from '@heroicons/react/24/outline';

const AdminPharmacists = () => {
  const [pharmacists, setPharmacists] = useState([
    { id: 1, name: 'Dr. Pierre Fouda', email: 'pierre.fouda@chu-yaounde.cm', phone: '691234567', city: 'Yaoundé', district: 'Bastos', totalSpent: 2450000, joinDate: '2025-01-15', status: 'active', license: 'PHARM-CM-001' },
    { id: 2, name: 'Dr. Claire Ngo', email: 'claire.ngo@clinique-douala.cm', phone: '698765432', city: 'Douala', district: 'Akwa', totalSpent: 1875000, joinDate: '2025-02-20', status: 'active', license: 'PHARM-CM-002' },
    { id: 3, name: 'Dr. Jean Mbarga', email: 'jean.mbarga@hopital-central.cm', phone: '677889900', city: 'Yaoundé', district: 'Mvog-Mbi', totalSpent: 980000, joinDate: '2025-03-10', status: 'suspended', license: 'PHARM-CM-003' },
    { id: 4, name: 'Dr. Paul Atangana', email: 'paul.atangana@pharmacie-marche.cm', phone: '690001122', city: 'Douala', district: 'Bonamoussadi', totalSpent: 3420000, joinDate: '2025-04-05', status: 'active', license: 'PHARM-CM-004' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedPharmacist, setSelectedPharmacist] = useState(null);
  const [showActionsMenu, setShowActionsMenu] = useState(null);

  const getFilteredPharmacists = () => {
    let filtered = pharmacists.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.city.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filterType === 'new') {
      filtered = filtered.filter(p => new Date(p.joinDate) > new Date('2025-03-01'));
    } else if (filterType === 'suspended') {
      filtered = filtered.filter(p => p.status === 'suspended');
    }
    return filtered;
  };

  const stats = {
    total: pharmacists.length,
    new: pharmacists.filter(p => new Date(p.joinDate) > new Date('2025-03-01')).length,
    suspended: pharmacists.filter(p => p.status === 'suspended').length
  };

  return (
    <div>
      {/* Première ligne : statistiques et recherche */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b">
          <button onClick={() => setFilterType('all')} className={`text-center p-3 rounded-lg transition-colors ${filterType === 'all' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}>
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-sm">Tous</p>
          </button>
          <button onClick={() => setFilterType('new')} className={`text-center p-3 rounded-lg transition-colors ${filterType === 'new' ? 'bg-green-50 text-green-600' : 'hover:bg-gray-50'}`}>
            <p className="text-2xl font-bold">{stats.new}</p>
            <p className="text-sm">Nouveaux</p>
          </button>
          <button onClick={() => setFilterType('suspended')} className={`text-center p-3 rounded-lg transition-colors ${filterType === 'suspended' ? 'bg-red-50 text-red-600' : 'hover:bg-gray-50'}`}>
            <p className="text-2xl font-bold">{stats.suspended}</p>
            <p className="text-sm">Suspendus</p>
          </button>
        </div>
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input type="text" placeholder="Rechercher un pharmacien..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="input pl-10" />
        </div>
      </div>

      {/* Deuxième ligne : tableau des pharmaciens */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom complet</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Caisse</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date d'adhésion</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Localisation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {getFilteredPharmacists().map((pharmacist) => (
                <tr key={pharmacist.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedPharmacist(pharmacist)}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                        {pharmacist.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{pharmacist.name}</p>
                        <p className="text-xs text-gray-500">{pharmacist.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{pharmacist.totalSpent.toLocaleString()} FCFA</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{new Date(pharmacist.joinDate).toLocaleDateString('fr-FR')}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 font-mono">#{pharmacist.id.toString().padStart(6, '0')}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{pharmacist.city} - {pharmacist.district}</td>
                  <td className="px-6 py-4 relative" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => setShowActionsMenu(showActionsMenu === pharmacist.id ? null : pharmacist.id)} className="p-2 hover:bg-gray-100 rounded-lg">
                      <EllipsisHorizontalIcon className="h-5 w-5 text-gray-500" />
                    </button>
                    {showActionsMenu === pharmacist.id && (
                      <div className="absolute right-6 top-12 bg-white rounded-lg shadow-lg border w-40 z-10">
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                          <EnvelopeIcon className="h-4 w-4" /> Envoyer message
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                          <TrashIcon className="h-4 w-4" /> Supprimer
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal détails pharmacien */}
      {selectedPharmacist && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedPharmacist(null)}>
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h3 className="text-xl font-bold">Détails du pharmacien</h3>
              <button onClick={() => setSelectedPharmacist(null)} className="p-1 hover:bg-gray-100 rounded-lg"><XMarkIcon className="h-6 w-6" /></button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-3xl font-bold">{selectedPharmacist.name.charAt(0)}</div>
                <div><h2 className="text-2xl font-bold">{selectedPharmacist.name}</h2><p className="text-gray-500">{selectedPharmacist.email}</p><p className="text-gray-500">{selectedPharmacist.phone}</p></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-500">Total dépensé</p><p className="text-xl font-bold text-green-600">{selectedPharmacist.totalSpent.toLocaleString()} FCFA</p></div>
                <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-500">Date d'adhésion</p><p className="text-xl font-bold">{new Date(selectedPharmacist.joinDate).toLocaleDateString('fr-FR')}</p></div>
                <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-500">Localisation</p><p className="text-xl font-bold">{selectedPharmacist.city} - {selectedPharmacist.district}</p></div>
                <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-500">Licence</p><p className="text-xl font-bold font-mono text-sm">{selectedPharmacist.license}</p></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPharmacists;