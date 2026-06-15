import React, { useState } from 'react';
import { 
  ChartBarIcon, 
  UsersIcon, 
  ShoppingBagIcon, 
  CurrencyDollarIcon, 
  TruckIcon, 
  BuildingOfficeIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

const AdminStatistics = () => {
  const [period, setPeriod] = useState('month'); // month, quarter, year

  // Données de test
  const monthlyData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juillet', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
    revenue: [1850000, 2100000, 2250000, 1980000, 2450000, 2680000, 2820000, 2750000, 2910000, 3050000, 3120000, 3280000],
    orders: [42, 48, 52, 45, 56, 62, 65, 63, 68, 72, 75, 78]
  };

  const quarterlyData = {
    labels: ['T1', 'T2', 'T3', 'T4'],
    revenue: [6200000, 7110000, 8480000, 9450000],
    orders: [142, 163, 196, 225]
  };

  const yearlyData = {
    labels: ['2022', '2023', '2024', '2025'],
    revenue: [18500000, 24500000, 31200000, 39800000],
    orders: [420, 560, 720, 890]
  };

  const currentData = period === 'month' ? monthlyData : period === 'quarter' ? quarterlyData : yearlyData;

  // Calcul des pourcentages pour les barres
  const maxRevenue = Math.max(...currentData.revenue);
  const maxOrders = Math.max(...currentData.orders);

  // Top produits
  const topProducts = [
    { name: 'ImmunoBio', sales: 125, revenue: 15625000, growth: 32 },
    { name: 'HepaCare', sales: 98, revenue: 1470000, growth: 28 },
    { name: 'NeuroPlus', sales: 75, revenue: 1125000, growth: 15 },
    { name: 'Biofer', sales: 45, revenue: 1012500, growth: 8 },
    { name: 'CardioStab', sales: 38, revenue: 703000, growth: 12 }
  ];

  // Top délégués
  const topDelegates = [
    { name: 'Jean Kamga', orders: 52, revenue: 1250000, region: 'Centre' },
    { name: 'Claire Mbarga', orders: 48, revenue: 1180000, region: 'Littoral' },
    { name: 'Marie Ngo', orders: 45, revenue: 1100000, region: 'Littoral' },
    { name: 'Paul Atangana', orders: 38, revenue: 890000, region: 'Centre' }
  ];

  // Top régions
  const topRegions = [
    { name: 'Littoral', orders: 245, revenue: 6125000, percentage: 35 },
    { name: 'Centre', orders: 210, revenue: 5250000, percentage: 30 },
    { name: 'Ouest', orders: 98, revenue: 2450000, percentage: 14 },
    { name: 'Nord', orders: 67, revenue: 1675000, percentage: 10 },
    { name: 'Extrême-Nord', orders: 45, revenue: 1125000, percentage: 6 }
  ];

  const statsCards = [
    { title: 'Utilisateurs actifs', value: '124', change: '+8', icon: <UsersIcon className="h-6 w-6" />, color: 'bg-blue-500' },
    { title: 'Livraisons effectuées', value: '1 250', change: '+12', icon: <TruckIcon className="h-6 w-6" />, color: 'bg-green-500' },
    { title: 'Hôpitaux partenaires', value: '18', change: '+3', icon: <BuildingOfficeIcon className="h-6 w-6" />, color: 'bg-purple-500' },
    { title: 'Chiffre d\'affaires', value: '24.5M', change: '+18', icon: <CurrencyDollarIcon className="h-6 w-6" />, color: 'bg-emerald-500' },
  ];

  const getPeriodButtonClass = (p) => {
    return period === p 
      ? 'bg-blue-600 text-white' 
      : 'bg-white text-gray-700 border hover:bg-gray-50';
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Statistiques avancées</h1>
        <p className="text-gray-500">Analyse détaillée des performances</p>
      </div>

      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statsCards.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowTrendingUpIcon className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600">{stat.change}%</span>
                  <span className="text-xs text-gray-400">vs période préc.</span>
                </div>
              </div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sélecteur de période */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setPeriod('month')}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${getPeriodButtonClass('month')}`}
        >
          <CalendarIcon className="h-4 w-4" />
          Mois
        </button>
        <button
          onClick={() => setPeriod('quarter')}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${getPeriodButtonClass('quarter')}`}
        >
          <CalendarIcon className="h-4 w-4" />
          Trimestre
        </button>
        <button
          onClick={() => setPeriod('year')}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${getPeriodButtonClass('year')}`}
        >
          <CalendarIcon className="h-4 w-4" />
          Année
        </button>
      </div>

      {/* Graphique Chiffre d'affaires */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Évolution du chiffre d'affaires</h3>
            <p className="text-sm text-gray-500">en FCFA</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary-600">{currentData.revenue[currentData.revenue.length - 1].toLocaleString()} FCFA</p>
            <div className="flex items-center gap-1 justify-end">
              <ArrowTrendingUpIcon className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-600">+18% vs période précédente</span>
            </div>
          </div>
        </div>
        <div className="h-64">
          <div className="flex items-end h-56 gap-2">
            {currentData.revenue.map((value, idx) => {
              const height = (value / maxRevenue) * 100;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-blue-500 rounded-t-lg transition-all hover:bg-blue-600" style={{ height: `${height}%`, minHeight: '4px' }} />
                  <span className="text-xs text-gray-500 rotate-45 origin-left -ml-2">{currentData.labels[idx]}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Graphique Commandes */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Nombre de commandes</h3>
            <p className="text-sm text-gray-500">évolution mensuelle</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary-600">{currentData.orders[currentData.orders.length - 1]} commandes</p>
            <div className="flex items-center gap-1 justify-end">
              <ArrowTrendingUpIcon className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-600">+15% vs période précédente</span>
            </div>
          </div>
        </div>
        <div className="h-64">
          <div className="flex items-end h-56 gap-2">
            {currentData.orders.map((value, idx) => {
              const height = (value / maxOrders) * 100;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-green-500 rounded-t-lg transition-all hover:bg-green-600" style={{ height: `${height}%`, minHeight: '4px' }} />
                  <span className="text-xs text-gray-500 rotate-45 origin-left -ml-2">{currentData.labels[idx]}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Deux colonnes : Top produits et Top régions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Top produits */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingBagIcon className="h-5 w-5 text-primary-500" />
            <h3 className="text-lg font-semibold text-gray-800">Top produits</h3>
          </div>
          <div className="space-y-4">
            {topProducts.map((product, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-400 w-6">#{idx + 1}</span>
                  <div>
                    <p className="font-medium text-gray-800">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.sales} ventes</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary-600">{product.revenue.toLocaleString()} FCFA</p>
                  <div className="flex items-center gap-1 justify-end">
                    <ArrowTrendingUpIcon className="h-3 w-3 text-green-500" />
                    <span className="text-xs text-green-600">+{product.growth}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 text-sm text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-600 hover:text-white transition-colors flex items-center justify-center gap-2">
            <EyeIcon className="h-4 w-4" />
            Voir tous les produits
          </button>
        </div>

        {/* Top régions */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <BuildingOfficeIcon className="h-5 w-5 text-primary-500" />
            <h3 className="text-lg font-semibold text-gray-800">Top régions</h3>
          </div>
          <div className="space-y-4">
            {topRegions.map((region, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{region.name}</span>
                  <span className="text-gray-500">{region.orders} commandes</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 rounded-full h-2" style={{ width: `${region.percentage}%` }}></div>
                  </div>
                  <span className="text-xs text-gray-500">{region.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top délégués */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <UsersIcon className="h-5 w-5 text-primary-500" />
          <h3 className="text-lg font-semibold text-gray-800">Performance des délégués</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 rounded-lg">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Délégué</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Région</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Commandes</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Chiffre d'affaires</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Performance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {topDelegates.map((delegate, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-sm">
                        {delegate.name.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-800">{delegate.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{delegate.region}</td>
                  <td className="px-4 py-3 text-center text-sm font-medium text-gray-800">{delegate.orders}</td>
                  <td className="px-4 py-3 text-right text-sm font-bold text-primary-600">{delegate.revenue.toLocaleString()} FCFA</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center gap-1 justify-center">
                      <ArrowTrendingUpIcon className="h-3 w-3 text-green-500" />
                      <span className="text-xs text-green-600">+{Math.floor(Math.random() * 20) + 5}%</span>
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

export default AdminStatistics;