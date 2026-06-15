import React, { useState } from 'react';
import { 
  ShoppingBagIcon, 
  CurrencyDollarIcon, 
  UsersIcon, 
  ClockIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Données selon la période
  const activities = {
    week: {
      orders: 45,
      revenue: 3250000,
      newUsers: 8,
      pendingDeliveries: 5,
      growth: 8
    },
    month: {
      orders: 187,
      revenue: 12450000,
      newUsers: 32,
      pendingDeliveries: 12,
      growth: 18
    },
    year: {
      orders: 1250,
      revenue: 89200000,
      newUsers: 156,
      pendingDeliveries: 24,
      growth: 25
    }
  };

  const currentData = activities[selectedPeriod];

  const aiInsights = [
    { type: 'positive', message: 'Les commandes ont augmenté de 18% ce mois-ci', action: 'Voir détails', bgColor: 'bg-green-900/30', borderColor: 'border-green-400', textColor: 'text-green-200' },
    { type: 'warning', message: 'Stock faible pour ImmunoBio (12 unités restantes)', action: 'Réapprovisionner', bgColor: 'bg-orange-900/40', borderColor: 'border-orange-400', textColor: 'text-orange-100' },
    { type: 'info', message: 'Le Dr. Mbarga n\'a pas commandé depuis 3 semaines', action: 'Contacter', bgColor: 'bg-blue-900/30', borderColor: 'border-blue-400', textColor: 'text-blue-200' },
    { type: 'positive', message: '5 livraisons en attente dans la zone de Douala', action: 'Voir', bgColor: 'bg-green-900/30', borderColor: 'border-green-400', textColor: 'text-green-200' },
    { type: 'warning', message: 'Objectif mensuel atteint à 78%', action: 'Détails', bgColor: 'bg-yellow-900/40', borderColor: 'border-yellow-400', textColor: 'text-yellow-100' },
  ];

  const getInsightStyles = (type) => {
    switch(type) {
      case 'positive': return { bg: 'bg-green-900/30', border: 'border-green-400', text: 'text-green-200', button: 'text-green-300 hover:text-green-100' };
      case 'warning': return { bg: 'bg-orange-900/40', border: 'border-orange-400', text: 'text-orange-100', button: 'text-orange-300 hover:text-orange-100' };
      default: return { bg: 'bg-blue-900/30', border: 'border-blue-400', text: 'text-blue-200', button: 'text-blue-300 hover:text-blue-100' };
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Tableau de bord</h1>
        <p className="text-gray-500">Aperçu des activités et statistiques</p>
      </div>

      {/* Période selector */}
      <div className="flex gap-2 mb-6">
        {['week', 'month', 'year'].map((period) => (
          <button
            key={period}
            onClick={() => setSelectedPeriod(period)}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              selectedPeriod === period ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border hover:bg-gray-50'
            }`}
          >
            <CalendarIcon className="h-4 w-4" />
            {period === 'week' ? 'Semaine' : period === 'month' ? 'Mois' : 'Année'}
          </button>
        ))}
      </div>

      {/* Cartes d'activités */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Commandes</p>
              <p className="text-3xl font-bold text-gray-800">{currentData.orders}</p>
              <div className="flex items-center gap-1 mt-2">
                <ArrowTrendingUpIcon className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-600">+{currentData.growth}%</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <ShoppingBagIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Chiffre d'affaires</p>
              <p className="text-3xl font-bold text-green-600">{(currentData.revenue / 1000000).toFixed(1)}M FCFA</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Nouveaux utilisateurs</p>
              <p className="text-3xl font-bold text-gray-800">{currentData.newUsers}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <UsersIcon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Livraisons en attente</p>
              <p className="text-3xl font-bold text-orange-600">{currentData.pendingDeliveries}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <ClockIcon className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Assistant IA */}
      <div className="bg-gradient-to-r from-blue-800 to-indigo-900 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <SparklesIcon className="h-8 w-8 text-yellow-400" />
          <h2 className="text-xl font-semibold">Assistant IA</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {aiInsights.map((insight, idx) => {
            const styles = getInsightStyles(insight.type);
            return (
              <div key={idx} className={`border-l-4 ${styles.border} ${styles.bg} backdrop-blur-sm rounded-lg p-3`}>
                <p className={`text-sm font-medium ${styles.text}`}>{insight.message}</p>
                <button className={`text-xs ${styles.button} mt-1 transition-colors`}>
                  {insight.action} →
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;