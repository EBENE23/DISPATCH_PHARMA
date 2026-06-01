import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { orderService, productService, aiService } from '../services/api';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { toast } from 'react-toastify';
import { ShoppingBagIcon, CurrencyDollarIcon, UsersIcon, ClockIcon, SparklesIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon, ChartBarIcon, TrophyIcon } from '@heroicons/react/24/outline';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSales: 0,
    totalClients: 0,
    pendingOrders: 0,
  });
  const [weeklySales, setWeeklySales] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiPrediction, setAiPrediction] = useState(null);

  useEffect(() => {
    loadDashboardData();
    loadAIPrediction();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [ordersRes, productsRes] = await Promise.all([
        orderService.getAll(),
        productService.getAll(),
      ]);
      
      const orders = ordersRes.data.orders || [];
      const products = productsRes.data.products || [];
      
      // Calculer les statistiques
      const totalSales = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
      const uniqueDoctors = new Set(orders.map(o => o.doctorId?._id)).size;
      const pendingOrders = orders.filter(o => o.status === 'pending').length;
      
      setStats({
        totalOrders: orders.length,
        totalSales: totalSales,
        totalClients: uniqueDoctors,
        pendingOrders: pendingOrders,
      });
      
      // Données pour le graphique (simulées)
      const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
      const salesData = [125000, 150000, 98000, 175000, 210000, 95000, 80000];
      setWeeklySales(days.map((day, i) => ({ day, sales: salesData[i] })));
      
      // Top produits
      setTopProducts(products.slice(0, 5));
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };
  
  const loadAIPrediction = async () => {
    try {
      const response = await aiService.getTrends();
      setAiPrediction(response.data);
    } catch (error) {
      console.error('Erreur IA:', error);
    }
  };
  
  const chartData = {
    labels: weeklySales.map(d => d.day),
    datasets: [
      {
        label: 'Ventes (FCFA)',
        data: weeklySales.map(d => d.sales),
        backgroundColor: 'rgba(0, 170, 105, 0.6)',
        borderColor: '#00aa69',
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      tooltip: { callbacks: { label: (ctx) => `${ctx.raw.toLocaleString()} FCFA` } },
    },
    scales: { y: { ticks: { callback: (value) => `${value.toLocaleString()} FCFA` } } },
  };
  
  const StatCard = ({ title, value, icon, color, trend }) => (
    <div className="card p-6 hover:shadow-xl transition-all">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-800">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {trend && <p className="text-xs text-green-600 mt-1">{trend}</p>}
        </div>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-xl`} style={{ backgroundColor: color }}>
          {icon}
        </div>
      </div>
    </div>
  );
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Bonjour, {user?.fullName?.split(' ')[0]} !</h1>
        <p className="text-gray-500 mt-1">Voici un aperçu de votre activité</p>
      </div>
      
      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Commandes" value={stats.totalOrders} icon={<ShoppingBagIcon className="h-6 w-6" />} color="#00aa69" />
        <StatCard title="Ventes totales" value={`${(stats.totalSales / 1000000).toFixed(1)}M FCFA`} icon={<CurrencyDollarIcon className="h-6 w-6" />} color="#1a73e8" />
        <StatCard title="Clients" value={stats.totalClients} icon={<UsersIcon className="h-6 w-6" />} color="#f59e0b" />
        <StatCard title="En attente" value={stats.pendingOrders} icon={<ClockIcon className="h-6 w-6" />} color="#ef4444" />
      </div>
      
      {/* Graphique et IA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Graphique des ventes */}
        <div className="lg:col-span-2 card p-6">
          <h3 className="text-lg font-semibold mb-4">Ventes (7 derniers jours)</h3>
          <div className="h-80">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
        
        {/* Carte IA */}
        <div className="card p-6 bg-gradient-to-br from-primary-500 to-primary-700 text-white">
          <div className="flex items-center space-x-2 mb-4">
            <SparklesIcon className="h-6 w-6" />
            <h3 className="text-lg font-semibold">Assistant IA</h3>
          </div>
          
          {aiPrediction && (
            <div className="space-y-3">
              <p className="text-sm opacity-90">Tendance des commandes</p>
              <div className="flex items-center gap-2 text-2xl font-bold">
                {aiPrediction.trend === 'up' ? (
                  <ArrowTrendingUpIcon className="h-6 w-6" />
                ) : aiPrediction.trend === 'down' ? (
                  <ArrowTrendingDownIcon className="h-6 w-6" />
                ) : (
                  <ChartBarIcon className="h-6 w-6" />
                )}
                <span>{aiPrediction.trend === 'up' ? 'En hausse' : aiPrediction.trend === 'down' ? 'En baisse' : 'Stable'}</span>
              </div>
              <p className="text-sm opacity-90 mt-2">{aiPrediction.message}</p>
            </div>
          )}
          
          <div className="mt-4 pt-4 border-t border-white/20">
            <p className="text-xs opacity-75">Analyse basée sur l'historique des commandes</p>
          </div>
        </div>
      </div>
      
      {/* Top produits */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4"><TrophyIcon className="h-5 w-5 inline-block mr-2 text-primary-500" />Top produits</h3>
        <div className="space-y-3">
          {topProducts.map((product, idx) => (
            <div key={product._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-xl font-bold text-gray-400 w-8">#{idx + 1}</span>
                <img src={product.imageUrl || '/images/products/default.png'} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-xs text-gray-500">{product.type}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary-600">{product.price.toLocaleString()} FCFA</p>
                <p className="text-xs text-gray-500">{product.salesCount || 0} ventes</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;