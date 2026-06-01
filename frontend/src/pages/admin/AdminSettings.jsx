import React, { useState } from 'react';
import { Cog6ToothIcon, ShieldCheckIcon, BellIcon, LanguageIcon, PaintBrushIcon } from '@heroicons/react/24/outline';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'Général', icon: <Cog6ToothIcon className="h-5 w-5" /> },
    { id: 'security', label: 'Sécurité', icon: <ShieldCheckIcon className="h-5 w-5" /> },
    { id: 'notifications', label: 'Notifications', icon: <BellIcon className="h-5 w-5" /> },
    { id: 'appearance', label: 'Apparence', icon: <PaintBrushIcon className="h-5 w-5" /> },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Paramètres</h1>
        <p className="text-gray-500">Configurez les paramètres de l'application</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Contenu des onglets */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nom de l'application</label>
              <input type="text" value="DISPATCH PHARMA" className="input w-full md:w-96" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email de contact</label>
              <input type="email" value="contact@dispatchpharma.com" className="input w-full md:w-96" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
              <input type="tel" value="+237 696 922 124" className="input w-full md:w-96" />
            </div>
            <button className="btn-primary">Enregistrer les modifications</button>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">Authentification à deux facteurs</p>
                <p className="text-sm text-gray-500">Sécurisez l'accès administrateur</p>
              </div>
              <button className="px-4 py-2 bg-green-500 text-white rounded-lg">Activée</button>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">Journal des connexions</p>
                <p className="text-sm text-gray-500">Consultez l'historique des connexions</p>
              </div>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">Voir les logs</button>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">Notifications email</p>
                <p className="text-sm text-gray-500">Recevoir les alertes par email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">Nouvelles commandes</p>
                <p className="text-sm text-gray-500">Notification lors d'une nouvelle commande</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        )}

        {activeTab === 'appearance' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Thème</label>
              <select className="input w-full md:w-64">
                <option>Clair</option>
                <option>Sombre</option>
                <option>Système</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Couleur principale</label>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 cursor-pointer ring-2 ring-offset-2 ring-blue-600"></div>
                <div className="w-8 h-8 rounded-full bg-green-600 cursor-pointer"></div>
                <div className="w-8 h-8 rounded-full bg-purple-600 cursor-pointer"></div>
                <div className="w-8 h-8 rounded-full bg-red-600 cursor-pointer"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSettings;