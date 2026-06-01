const Order = require('../models/Order');
const Doctor = require('../models/Doctor');
const Product = require('../models/Product');
const aiModel = require('../utils/brainModel');

// ========== ENTRAÎNER LE MODÈLE IA ==========
exports.trainModel = async (req, res) => {
  try {
    // Récupérer l'historique des commandes
    const orders = await Order.find({ status: 'delivered' })
      .populate('doctorId')
      .limit(1000);

    if (orders.length < 10) {
      return res.status(400).json({
        success: false,
        message: `Données insuffisantes pour entraîner l'IA. Besoin d'au moins 10 commandes. (Actuellement: ${orders.length})`
      });
    }

    // Préparer les données d'entraînement
    const trainingData = orders.map(order => ({
      doctorScore: order.doctorId?.visitScore || 50,
      previousOrders: order.doctorId?.totalOrders || 0,
      amount: order.totalAmount,
      month: new Date(order.orderDate).getMonth(),
      dayOfWeek: new Date(order.orderDate).getDay(),
      didOrder: true
    }));

    // Ajouter des exemples négatifs (médecins qui n'ont pas commandé)
    const allDoctors = await Doctor.find();
    const doctorsWithOrders = new Set(orders.map(o => o.doctorId?._id.toString()));
    const negativeExamples = allDoctors
      .filter(d => !doctorsWithOrders.has(d._id.toString()))
      .slice(0, orders.length)
      .map(doctor => ({
        doctorScore: doctor.visitScore || 50,
        previousOrders: doctor.totalOrders || 0,
        amount: 0,
        month: new Date().getMonth(),
        dayOfWeek: new Date().getDay(),
        didOrder: false
      }));

    const allTrainingData = [...trainingData, ...negativeExamples];
    
    // Entraîner le modèle
    await aiModel.trainPredictionModel(allTrainingData);

    res.json({
      success: true,
      message: 'Modèle IA entraîné avec succès',
      dataPoints: allTrainingData.length,
      positiveExamples: trainingData.length,
      negativeExamples: negativeExamples.length
    });

  } catch (error) {
    console.error('Erreur entraînement IA:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'entraînement du modèle',
      error: error.message
    });
  }
};

// ========== PRÉDIRE LA PROBABILITÉ DE COMMANDE ==========
exports.predictOrder = async (req, res) => {
  try {
    const { doctorId } = req.params;
    
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Médecin non trouvé'
      });
    }

    const prediction = aiModel.predictOrderProbability(doctor);

    // Enregistrer la prédiction
    const AIPrediction = require('../models/AIPrediction');
    await AIPrediction.create({
      type: 'order_prediction',
      doctorId: doctor._id,
      predictedProduct: null,
      probability: prediction.probability,
      confidence: prediction.recommendation,
      createdAt: new Date()
    });

    res.json({
      success: true,
      prediction: prediction,
      doctor: {
        id: doctor._id,
        name: doctor.name,
        specialty: doctor.specialty,
        visitScore: doctor.visitScore,
        totalOrders: doctor.totalOrders
      }
    });

  } catch (error) {
    console.error('Erreur prédiction:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la prédiction',
      error: error.message
    });
  }
};

// ========== RECOMMANDER UN PRODUIT ==========
exports.recommendProduct = async (req, res) => {
  try {
    const { doctorId } = req.params;
    
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Médecin non trouvé'
      });
    }

    const products = await Product.find({ isActive: true, stock: { $gt: 0 } });
    const orderHistory = await Order.find({ doctorId }).populate('orderitems');

    const recommendation = aiModel.recommendProduct(doctor, products, orderHistory);

    if (!recommendation) {
      return res.json({
        success: true,
        message: 'Aucune recommandation disponible pour le moment',
        product: null
      });
    }

    // Enregistrer la recommandation
    const AIPrediction = require('../models/AIPrediction');
    await AIPrediction.create({
      type: 'product_recommendation',
      doctorId: doctor._id,
      predictedProduct: recommendation.product._id,
      probability: 0,
      confidence: 'medium',
      createdAt: new Date()
    });

    res.json({
      success: true,
      recommendation: {
        product: recommendation.product,
        reason: recommendation.reason,
        alternatives: recommendation.alternatives
      }
    });

  } catch (error) {
    console.error('Erreur recommandation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la recommandation',
      error: error.message
    });
  }
};

// ========== ANALYSER LES TENDANCES ==========
exports.analyzeTrends = async (req, res) => {
  try {
    const orders = await Order.find({ status: 'delivered' })
      .sort({ orderDate: -1 })
      .limit(100);

    const trends = aiModel.analyzeTrends(orders);

    // Produits tendance
    const productTrends = await Product.aggregate([
      { $match: { isActive: true } },
      { $sort: { salesCount: -1 } },
      { $limit: 5 },
      { $project: { name: 1, salesCount: 1, price: 1 } }
    ]);

    res.json({
      success: true,
      trends: trends,
      topProducts: productTrends,
      period: '30 days',
      dataPoints: orders.length
    });

  } catch (error) {
    console.error('Erreur analyse tendances:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'analyse des tendances',
      error: error.message
    });
  }
};

// ========== DASHBOARD IA (INSIGHTS) ==========
exports.getAIInsights = async (req, res) => {
  try {
    const AIPrediction = require('../models/AIPrediction');
    
    // Récupérer les dernières prédictions
    const recentPredictions = await AIPrediction.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('doctorId', 'name specialty')
      .populate('predictedProduct', 'name');

    // Compter les prédictions par type
    const predictionsByType = await AIPrediction.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    // Score de confiance moyen
    const avgConfidence = await AIPrediction.aggregate([
      { $match: { confidence: { $ne: null } } },
      { $group: { _id: null, avgConfidence: { $avg: '$probability' } } }
    ]);

    res.json({
      success: true,
      insights: {
        totalPredictions: await AIPrediction.countDocuments(),
        predictionsByType: predictionsByType,
        averageConfidence: avgConfidence[0]?.avgConfidence || 0,
        recentPredictions: recentPredictions,
        modelStatus: aiModel.isTrained ? 'entraîné' : 'non entraîné'
      }
    });

  } catch (error) {
    console.error('Erreur insights IA:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des insights',
      error: error.message
    });
  }
};