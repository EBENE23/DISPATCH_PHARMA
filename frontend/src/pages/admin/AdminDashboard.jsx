import React, { useState } from 'react';
import { 
  UsersIcon, 
  TruckIcon, 
  BuildingOfficeIcon, 
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ShoppingBagIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    delegates: 24,
    delivery: 12,
    hospitals: 18,
    revenue: 24500000,
    orders: 1250,
    products: 48,
    revenueGrowth: 18,
    ordersGrowth: 12
  });

  const [recentActivities, setRecentActivities] = useState([
    { id: 1, action: 'Nouveau délégué inscrit', user: 'Jean Kamga', time: 'Il y a 5 minutes', type: 'delegate' },
    { id: 2, action: 'Commande #CMD-001 livrée', user: 'Dr. Mbarga', time: 'Il y a 1 heure', type: 'order' },
    { id: 3, action: 'Nouvel hôpital enregistré', user: 'Clinique Bastos', time: 'Il y a 3 heures', type: 'hospital' },
    { id: 4, action: 'Livreur assigné', user: 'Paul Ndi', time: 'Il y a 5 heures', type: 'delivery' },
    { id: 5, action: 'Nouveau produit ajouté', user: 'ImmunoBio', time: 'Hier', type: 'product' },
  ]);

  const StatCard = ({ title, value, icon, color, trend }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-800">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <ArrowTrendingUpIcon className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-600">{trend}% vs mois dernier</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white`} style={{ backgroundColor: color }}>
          {icon}
        </div>
      </div>
    </div>
  );

  const getActivityIcon = (type) => {
    switch(type) {
      case 'delegate': return <UsersIcon className="h-4 w-4 text-blue-500" />;
      case 'delivery': return <TruckIcon className="h-4 w-4 text-orange-500" />;
      case 'hospital': return <BuildingOfficeIcon className="h-4 w-4 text-purple-500" />;
      case 'order': return <ClipboardDocumentListIcon className="h-4 w-4 text-green-500" />;
      case 'product': return <ShoppingBagIcon className="h-4 w-4 text-pink-500" />;
      default: return <UsersIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Tableau de bord</h1>
        <p className="text-gray-500">Bienvenue dans votre espace d'administration</p>
      </div>

      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Délégués médicaux" 
          value={stats.delegates} 
          icon={<UsersIcon className="h-6 w-6" />} 
          color="#0157bd" 
          trend={8} 
        />
        <StatCard 
          title="Livreurs" 
          value={stats.delivery} 
          icon={<TruckIcon className="h-6 w-6" />} 
          color="#f59e0b" 
          trend={5} 
        />
        <StatCard 
          title="Hôpitaux actifs" 
          value={stats.hospitals} 
          icon={<BuildingOfficeIcon className="h-6 w-6" />} 
          color="#44ac40" 
          trend={12} 
        />
        <StatCard 
          title="Chiffre d'affaires" 
          value={`${(stats.revenue / 1000000).toFixed(1)}M FCFA`} 
          icon={<CurrencyDollarIcon className="h-6 w-6" />} 
          color="#ef4444" 
          trend={stats.revenueGrowth} 
        />
      </div>

      {/* Deuxième ligne de statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <StatCard 
          title="Commandes totales" 
          value={stats.orders} 
          icon={<ClipboardDocumentListIcon className="h-6 w-6" />} 
          color="#8b5cf6" 
          trend={stats.ordersGrowth} 
        />
        <StatCard 
          title="Produits en catalogue" 
          value={stats.products} 
          icon={<ShoppingBagIcon className="h-6 w-6" />} 
          color="#ec4899" 
          trend={3} 
        />
      </div>

      {/* Graphique simple */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Évolution du chiffre d'affaires</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <CurrencyDollarIcon className="h-12 w-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-400">Graphique des ventes - Chart.js intégré</p>
              <p className="text-sm text-gray-400 mt-2">Janvier - Décembre 2025</p>
            </div>
          </div>
        </div>

        {/* Activités récentes */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Activités récentes</h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                <div className="mt-0.5">{getActivityIcon(activity.type)}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.user}</p>
                  <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Accès rapides */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Accès rapides</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
            <UsersIcon className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Gérer les délégués</span>
          </button>
          <button className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors">
            <TruckIcon className="h-5 w-5 text-orange-600" />
            <span className="text-sm font-medium text-orange-700">Gérer les livreurs</span>
          </button>
          <button className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors">
            <BuildingOfficeIcon className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">Gérer les hôpitaux</span>
          </button>
          <button className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors">
            <CurrencyDollarIcon className="h-5 w-5 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-700">Voir les finances</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;