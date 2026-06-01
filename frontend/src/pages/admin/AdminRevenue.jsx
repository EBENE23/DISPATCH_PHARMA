import React, { useState } from 'react';
import { 
  CurrencyDollarIcon, 
  ArrowTrendingUpIcon, 
  CalendarIcon, 
  DocumentTextIcon 
} from '@heroicons/react/24/outline';

const AdminRevenue = () => {
  const [period, setPeriod] = useState('month');

  const revenueData = {
    total: 24500000,
    growth: 18,
    monthly: [
      { month: 'Janvier', revenue: 1850000 },
      { month: 'Février', revenue: 2100000 },
      { month: 'Mars', revenue: 2250000 },
      { month: 'Avril', revenue: 1980000 },
      { month: 'Mai', revenue: 2450000 },
      { month: 'Juin', revenue: 2680000 },
    ],
    breakdown: [
      { category: 'ImmunoBio', revenue: 8750000, percentage: 36 },
      { category: 'HepaCare', revenue: 5250000, percentage: 21 },
      { category: 'NeuroPlus', revenue: 4200000, percentage: 17 },
      { category: 'Biofer', revenue: 3150000, percentage: 13 },
      { category: 'Autres', revenue: 3150000, percentage: 13 },
    ]
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Chiffre d'affaires</h1>
        <p className="text-gray-500">Suivez les performances financières de la plateforme</p>
      </div>

      {/* Période selector */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setPeriod('week')}
          className={`px-4 py-2 rounded-lg transition-colors ${period === 'week' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          Semaine
        </button>
        <button
          onClick={() => setPeriod('month')}
          className={`px-4 py-2 rounded-lg transition-colors ${period === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          Mois
        </button>
        <button
          onClick={() => setPeriod('year')}
          className={`px-4 py-2 rounded-lg transition-colors ${period === 'year' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          Année
        </button>
      </div>

      {/* Carte principale */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-blue-100 text-sm">Chiffre d'affaires total</p>
              <p className="text-4xl font-bold mt-1">{revenueData.total.toLocaleString()} FCFA</p>
              <div className="flex items-center gap-1 mt-2">
                <ArrowTrendingUpIcon className="h-4 w-4 text-green-300" />
                <span className="text-sm text-green-200">{revenueData.growth}% vs mois dernier</span>
              </div>
            </div>
            <CurrencyDollarIcon className="h-12 w-12 text-blue-300 opacity-50" />
          </div>
          <div className="h-32 flex items-end gap-2 mt-4">
            {revenueData.monthly.map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-blue-400 rounded-t-lg transition-all hover:bg-blue-300"
                  style={{ height: `${(item.revenue / 3000000) * 100}px` }}
                ></div>
                <span className="text-xs text-blue-200 mt-1">{item.month.substring(0, 3)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Répartition */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Répartition par produit</h3>
          <div className="space-y-3">
            {revenueData.breakdown.map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{item.category}</span>
                  <span className="text-gray-500">{item.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 rounded-full h-2" style={{ width: `${item.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all">
          <DocumentTextIcon className="h-6 w-6 text-blue-600" />
          <div className="text-left">
            <p className="font-medium text-gray-800">Exporter les rapports</p>
            <p className="text-xs text-gray-500">PDF / Excel</p>
          </div>
        </button>
        <button className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all">
          <CalendarIcon className="h-6 w-6 text-green-600" />
          <div className="text-left">
            <p className="font-medium text-gray-800">Voir historique</p>
            <p className="text-xs text-gray-500">Années précédentes</p>
          </div>
        </button>
        <button className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all">
          <ArrowTrendingUpIcon className="h-6 w-6 text-purple-600" />
          <div className="text-left">
            <p className="font-medium text-gray-800">Prévisions</p>
            <p className="text-xs text-gray-500">Analyse IA</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default AdminRevenue;