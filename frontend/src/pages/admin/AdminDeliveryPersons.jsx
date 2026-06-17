import React, { useState } from 'react';
import { MagnifyingGlassIcon, EllipsisHorizontalIcon, EnvelopeIcon, TrashIcon, XMarkIcon, TruckIcon } from '@heroicons/react/24/outline';

const AdminDeliveryPersons = () => {
  const [deliveryPersons, setDeliveryPersons] = useState([
    { id: 1, name: 'Paul Ndi', email: 'paul.ndi@delivery.cm', phone: '677889900', city: 'Douala', district: 'Akwa', joinDate: '2025-01-20', status: 'active', vehiclePlate: 'LT-123-CD', vehicleType: 'moto', totalDeliveries: 145 },
    { id: 2, name: 'Jacques Mbarga', email: 'jacques.mbarga@delivery.cm', phone: '698765432', city: 'Yaoundé', district: 'Bastos', joinDate: '2025-02-25', status: 'active', vehiclePlate: 'LT-456-AB', vehicleType: 'voiture', totalDeliveries: 98 },
    { id: 3, name: 'Marie Ngo', email: 'marie.ngo@delivery.cm', phone: '691234567', city: 'Douala', district: 'Bonamoussadi', joinDate: '2025-03-30', status: 'suspended', vehiclePlate: 'LT-789-EF', vehicleType: 'moto', totalDeliveries: 45 },
    { id: 4, name: 'Robert Ndongo', email: 'robert.ndongo@delivery.cm', phone: '690001122', city: 'Yaoundé', district: 'Mvog-Mbi', joinDate: '2025-04-15', status: 'active', vehiclePlate: 'LT-999-CD', vehicleType: 'camionnette', totalDeliveries: 67 },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [showActionsMenu, setShowActionsMenu] = useState(null);

  const getFilteredDelivery = () => {
    let filtered = deliveryPersons.filter(d => 
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.city.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filterType === 'new') {
      filtered = filtered.filter(d => new Date(d.joinDate) > new Date('2025-03-01'));
    } else if (filterType === 'suspended') {
      filtered = filtered.filter(d => d.status === 'suspended');
    }
    return filtered;
  };

  const stats = { total: deliveryPersons.length, new: deliveryPersons.filter(d => new Date(d.joinDate) > new Date('2025-03-01')).length, suspended: deliveryPersons.filter(d => d.status === 'suspended').length };
  const getVehicleIcon = (type) => ({ moto: '🏍️', voiture: '🚗', camionnette: '🚚' }[type] || '🚛');

  return (
    <div>
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b">
          <button onClick={() => setFilterType('all')} className={`text-center p-3 rounded-lg ${filterType === 'all' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}><p className="text-2xl font-bold">{stats.total}</p><p className="text-sm">Tous</p></button>
          <button onClick={() => setFilterType('new')} className={`text-center p-3 rounded-lg ${filterType === 'new' ? 'bg-green-50 text-green-600' : 'hover:bg-gray-50'}`}><p className="text-2xl font-bold">{stats.new}</p><p className="text-sm">Nouveaux</p></button>
          <button onClick={() => setFilterType('suspended')} className={`text-center p-3 rounded-lg ${filterType === 'suspended' ? 'bg-red-50 text-red-600' : 'hover:bg-gray-50'}`}><p className="text-2xl font-bold">{stats.suspended}</p><p className="text-sm">Suspendus</p></button>
        </div>
        <div className="relative"><MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" /><input type="text" placeholder="Rechercher un livreur..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="input pl-10" /></div>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full"><thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom complet</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date d'adhésion</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User ID</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Localisation</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th></tr></thead>
          <tbody className="divide-y divide-gray-200">{getFilteredDelivery().map((d) => (<tr key={d.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedDelivery(d)}><td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold">{d.name.charAt(0)}</div><div><p className="font-medium">{d.name}</p><p className="text-xs text-gray-500">{d.email}</p></div></div></td><td className="px-6 py-4">{new Date(d.joinDate).toLocaleDateString('fr-FR')}</td><td className="px-6 py-4 font-mono text-sm">#{d.id.toString().padStart(6, '0')}</td><td className="px-6 py-4">{d.city} - {d.district}</td><td className="px-6 py-4 relative" onClick={(e) => e.stopPropagation()}><button onClick={() => setShowActionsMenu(showActionsMenu === d.id ? null : d.id)} className="p-2 hover:bg-gray-100 rounded-lg"><EllipsisHorizontalIcon className="h-5 w-5 text-gray-500" /></button>{showActionsMenu === d.id && (<div className="absolute right-6 top-12 bg-white rounded-lg shadow-lg border w-40 z-10"><button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"><EnvelopeIcon className="h-4 w-4" />Message</button><button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"><TrashIcon className="h-4 w-4" />Supprimer</button></div>)}</td></tr>))}</tbody>
        </table>
      </div>
      {selectedDelivery && (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedDelivery(null)}><div className="bg-white rounded-xl max-w-2xl w-full p-6" onClick={(e) => e.stopPropagation()}><div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold">Détails du livreur</h3><button onClick={() => setSelectedDelivery(null)}><XMarkIcon className="h-6 w-6" /></button></div><div className="flex items-center gap-4 mb-6"><div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 text-3xl font-bold">{selectedDelivery.name.charAt(0)}</div><div><h2 className="text-2xl font-bold">{selectedDelivery.name}</h2><p className="text-gray-500">{selectedDelivery.email}</p></div></div><div className="grid grid-cols-2 gap-4"><div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-500">Livraisons</p><p className="text-xl font-bold">{selectedDelivery.totalDeliveries}</p></div><div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-500">Date d'adhésion</p><p className="text-xl font-bold">{new Date(selectedDelivery.joinDate).toLocaleDateString('fr-FR')}</p></div><div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-500">Véhicule</p><p className="text-xl font-bold">{getVehicleIcon(selectedDelivery.vehicleType)} {selectedDelivery.vehiclePlate}</p></div><div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-500">Localisation</p><p className="text-xl font-bold">{selectedDelivery.city} - {selectedDelivery.district}</p></div></div></div></div>)}
    </div>
  );
};

export default AdminDeliveryPersons;