import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { aiService, doctorService } from '../services/api';
import { toast } from 'react-toastify';
import { SparklesIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon, ChartBarIcon, LightBulbIcon, ArrowPathIcon, ClipboardDocumentListIcon, BeakerIcon } from '@heroicons/react/24/outline';

const AIDashboard = () => {
  const { user, isAdmin } = useAuth();
  const [insights, setInsights] = useState(null);
  const [trends, setTrends] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [trainingLoading, setTrainingLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [insightsRes, trendsRes, doctorsRes] = await Promise.all([
        aiService.getInsights(),
        aiService.getTrends(),
        doctorService.getAll()
      ]);
      setInsights(insightsRes.data.insights);
      setTrends(trendsRes.data);
      setDoctors(doctorsRes.data.doctors || []);
    } catch (error) {
      console.error('Erreur chargement données IA:', error);
      toast.error('Erreur lors du chargement des données IA');
    }
  };

  const handlePredict = async () => {
    if (!selectedDoctor) {
      toast.warning('Veuillez sélectionner un médecin');
      return;
    }
    
    setLoading(true);
    try {
      const response = await aiService.predict(selectedDoctor);
      setPrediction(response.data.prediction);
    } catch (error) {
      toast.error('Erreur lors de la prédiction');
    } finally {
      setLoading(false);
    }
  };

  const handleRecommend = async () => {
    if (!selectedDoctor) {
      toast.warning('Veuillez sélectionner un médecin');
      return;
    }
    
    setLoading(true);
    try {
      const response = await aiService.recommend(selectedDoctor);
      setRecommendation(response.data.recommendation);
    } catch (error) {
      toast.error('Erreur lors de la recommandation');
    } finally {
      setLoading(false);
    }
  };

  const handleTrainModel = async () => {
    setTrainingLoading(true);
    try {
      const response = await aiService.train();
      toast.success(response.data.message);
      await loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'entraînement');
    } finally {
      setTrainingLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <SparklesIcon className="h-8 w-8 text-primary-500" />
          <h1 className="text-2xl font-bold text-gray-800">Assistant IA - Dispatch Pharma</h1>
        </div>
        <p className="text-gray-500 mt-1">Analyses prédictives et recommandations intelligentes</p>
      </div>

      {/* Cartes insights */}
      {insights && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Prédictions totales</p>
                <p className="text-2xl font-bold">{insights.totalPredictions || 0}</p>
              </div>
              <SparklesIcon className="h-8 w-8 text-primary-400" />
            </div>
          </div>
          
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Confiance moyenne</p>
                <p className="text-2xl font-bold">{Math.round(insights.averageConfidence || 0)}%</p>
              </div>
              <ChartBarIcon className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Statut du modèle</p>
                <p className={`text-lg font-bold ${insights.modelStatus === 'entraîné' ? 'text-green-600' : 'text-yellow-600'}`}>
                  {insights.modelStatus || 'Non entraîné'}
                </p>
              </div>
              <LightBulbIcon className="h-8 w-8 text-yellow-400" />
            </div>
          </div>
          
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Tendance</p>
                <div className="flex items-center gap-2 text-2xl font-bold">
                  {trends?.trend === 'up' ? (
                    <ArrowTrendingUpIcon className="h-8 w-8 text-green-400" />
                  ) : trends?.trend === 'down' ? (
                    <ArrowTrendingDownIcon className="h-8 w-8 text-red-400" />
                  ) : (
                    <ChartBarIcon className="h-8 w-8 text-blue-400" />
                  )}
                  <span>{trends?.trend === 'up' ? 'Hausse' : trends?.trend === 'down' ? 'Baisse' : 'Stable'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section prédiction */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Sélection médecin et prédictions */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <ArrowPathIcon className="h-5 w-5 text-primary-500" />
            <h3 className="text-lg font-semibold">Prédiction de commande</h3>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Sélectionner un médecin</label>
            <select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              className="input"
            >
              <option value="">Choisir un médecin...</option>
              {doctors.map(doc => (
                <option key={doc._id} value={doc._id}>{doc.name} - {doc.specialty}</option>
              ))}
            </select>
          </div>
          
          <div className="flex gap-3 mb-6">
            <button onClick={handlePredict} disabled={loading} className="btn-primary flex-1">
              {loading ? 'Analyse...' : 'Prédire'}
            </button>
            <button onClick={handleRecommend} disabled={loading} className="btn-outline flex-1">
              Recommander un produit
            </button>
          </div>
          
          {prediction && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 font-medium mb-2">
                <ChartBarIcon className="h-5 w-5 text-primary-500" />
                <span>Résultat de la prédiction</span>
              </div>
              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Probabilité de commande</span>
                  <span className="font-bold">{prediction.probability}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary-500 rounded-full h-2" style={{ width: `${prediction.probability}%` }}></div>
                </div>
              </div>
              <p className="text-sm text-gray-700">{prediction.message}</p>
              <p className="text-xs text-gray-500 mt-2">Recommandation: {prediction.recommendation}</p>
            </div>
          )}
          
          {recommendation && (
            <div className="mt-4 bg-primary-50 rounded-lg p-4">
              <div className="flex items-center gap-2 font-medium mb-2">
                <BeakerIcon className="h-5 w-5 text-primary-500" />
                <span>Produit recommandé</span>
              </div>
              <p className="font-bold text-primary-600">{recommendation.product?.name}</p>
              <p className="text-sm text-gray-600 mt-1">{recommendation.reason}</p>
              {recommendation.alternatives?.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500">Alternatives: {recommendation.alternatives.map(p => p.name).join(', ')}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tendances et insights */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <ChartBarIcon className="h-5 w-5 text-primary-500" />
            <h3 className="text-lg font-semibold">Analyse des tendances</h3>
          </div>
          
          {trends && (
            <>
              <div className="mb-4">
                <p className="text-gray-600 mb-1">Tendance générale</p>
                <p className="text-2xl font-bold">
                  {trends.trend === 'up' && (
                    <span className="inline-flex items-center gap-2"><ArrowTrendingUpIcon className="h-5 w-5 text-green-500" />Hausse</span>
                  )}
                  {trends.trend === 'down' && (
                    <span className="inline-flex items-center gap-2"><ArrowTrendingDownIcon className="h-5 w-5 text-red-500" />Baisse</span>
                  )}
                  {trends.trend === 'stable' && (
                    <span className="inline-flex items-center gap-2"><ChartBarIcon className="h-5 w-5 text-blue-500" />Stable</span>
                  )}
                </p>
                <p className="text-sm text-gray-500 mt-1">{trends.message}</p>
              </div>
              
              <div className="border-t pt-4">
                <p className="font-medium mb-2">Top produits tendance</p>
                <div className="space-y-2">
                  {trends.topProducts?.map((product, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span>{product.name}</span>
                      <span className="text-primary-600 font-medium">{product.salesCount} ventes</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
          
          <div className="border-t pt-4 mt-4">
            <p className="text-sm text-gray-500">Analyse basée sur {trends?.dataPoints || 0} commandes</p>
          </div>
        </div>
      </div>

      {/* Admin - Entraînement du modèle */}
      {isAdmin && (
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <SparklesIcon className="h-5 w-5 text-primary-500" />
            <h3 className="text-lg font-semibold">Administration de l'IA</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Entraînez le modèle IA avec l'historique des commandes pour améliorer la précision des prédictions.
          </p>
          <button
            onClick={handleTrainModel}
            disabled={trainingLoading}
            className="btn-primary"
          >
            {trainingLoading ? 'Entraînement en cours...' : 'Ré-entraîner le modèle'}
          </button>
        </div>
      )}

      {/* Dernières prédictions */}
      {insights?.recentPredictions?.length > 0 && (
        <div className="card p-6 mt-6">
          <div className="flex items-center gap-2 mb-4">
            <ClipboardDocumentListIcon className="h-5 w-5 text-primary-500" />
            <h3 className="text-lg font-semibold">Dernières prédictions IA</h3>
          </div>
          <div className="space-y-2">
            {insights.recentPredictions.slice(0, 5).map((pred, idx) => (
              <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">{pred.doctorId?.name || 'Médecin'}</p>
                  <p className="text-xs text-gray-500">{pred.type === 'order_prediction' ? 'Prédiction commande' : 'Recommandation produit'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-primary-600">{pred.probability}%</span>
                  <p className="text-xs text-gray-400">{new Date(pred.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIDashboard;