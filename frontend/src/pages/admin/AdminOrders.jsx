import React, { useState } from 'react';
import { EyeIcon, TruckIcon, CheckCircleIcon, ClockIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const AdminOrders = () => {
  const [orders] = useState([
    { id: 'CMD-001', client: 'Hôpital Central de Yaoundé', amount: 125000, status: 'delivered', date: '2025-06-01', delegate: 'Jean Kamga' },
    { id: 'CMD-002', client: 'Clinique Saint Michel', amount: 75000, status: 'shipped', date: '2025-05-31', delegate: 'Marie Ngo' },
    { id: 'CMD-003', client: 'Centre de Santé d\'Efoulan', amount: 250000, status: 'pending', date: '2025-05-30', delegate: 'Paul Atangana' },
    { id: 'CMD-004', client: 'Pharmacie du Marché', amount: 45000, status: 'delivered', date: '2025-05-29', delegate: 'Jean Kamga' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const filteredOrders = orders.filter(o => o.id.toLowerCase().includes(searchTerm.toLowerCase()) || o.client.toLowerCase().includes(searchTerm.toLowerCase()));

  const getStatusBadge = (status) => {
    switch(status) {
      case 'delivered': return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800"><CheckCircleIcon className="h-3 w-3 inline mr-1" />Livrée</span>;
      case 'shipped': return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800"><TruckIcon className="h-3 w-3 inline mr-1" />Expédiée</span>;
      case 'pending': return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800"><ClockIcon className="h-3 w-3 inline mr-1" />En attente</span>;
      default: return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div>
      <div className="mb-6"><h1 className="text-2xl font-bold text-gray-800">Commandes</h1><p className="text-gray-500">Suivez toutes les commandes</p></div>
      <div className="flex gap-4 mb-6"><div className="relative flex-1"><MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" /><input type="text" placeholder="Rechercher une commande..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="input pl-10" /></div></div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden"><table className="w-full"><thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">N° commande</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Délégué</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th></tr></thead>
        <tbody className="divide-y divide-gray-200">{filteredOrders.map((order) => (<tr key={order.id} className="hover:bg-gray-50"><td className="px-6 py-4 font-medium">{order.id}</td><td className="px-6 py-4">{order.client}</td><td className="px-6 py-4 text-sm text-gray-600">{order.delegate}</td><td className="px-6 py-4 font-medium">{order.amount.toLocaleString()} FCFA</td><td className="px-6 py-4">{getStatusBadge(order.status)}</td><td className="px-6 py-4">{order.date}</td><td className="px-6 py-4"><button className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg"><EyeIcon className="h-4 w-4" /></button></td></tr>))}</tbody>
      </table></div>
    </div>
  );
};

export default AdminOrders;