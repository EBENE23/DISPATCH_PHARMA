import React from 'react';
import { ChartBarIcon, UsersIcon, ShoppingBagIcon, CurrencyDollarIcon, TruckIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

const AdminStatistics = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Statistiques avancées</h1>
        <p className="text-gray-500">Analyse détaillée des performances</p>
      </div>

      {/* Cartes récapitulatives */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 text-center">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <UsersIcon className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-800">124</p>
          <p className="text-xs text-gray-500">Utilisateurs actifs</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <TruckIcon className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-800">1 250</p>
          <p className="text-xs text-gray-500">Livraisons effectuées</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <BuildingOfficeIcon className="h-5 w-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-800">18</p>
          <p className="text-xs text-gray-500">Hôpitaux partenaires</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center">
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <CurrencyDollarIcon className="h-5 w-5 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-gray-800">24.5M</p>
          <p className="text-xs text-gray-500">Chiffre d'affaires</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Évolution mensuelle</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <ChartBarIcon className="h-12 w-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-400">Graphique des performances - Chart.js intégré</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Top régions</h3>
          <div className="space-y-3">
            {['Littoral', 'Centre', 'Ouest', 'Nord', 'Extrême-Nord'].map((region, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">{region}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 rounded-full h-2" style={{ width: `${[100, 85, 60, 40, 25][idx]}%` }}></div>
                  </div>
                  <span className="text-sm text-gray-500">{['120', '98', '67', '45', '28'][idx]} commandes</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Performance des délégués</h3>
          <div className="space-y-3">
            {['Jean Kamga', 'Marie Ngo', 'Claire Mbarga', 'Paul Atangana'].map((name, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <UsersIcon className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">{name}</span>
                </div>
                <span className="text-sm text-green-600">{['125', '98', '87', '45'][idx]} ventes</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Produits tendance</h3>
          <div className="space-y-3">
            {['ImmunoBio', 'HepaCare', 'NeuroPlus', 'Biofer'].map((product, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <ShoppingBagIcon className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">{product}</span>
                </div>
                <span className="text-sm text-blue-600">{['+32%', '+28%', '+15%', '+8%'][idx]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStatistics;