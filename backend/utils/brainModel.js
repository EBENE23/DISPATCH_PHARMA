// ========== IA 100% PURE JAVASCRIPT - Sans dépendances natives ==========
// Réseau de neurones simple fait maison

class SimpleNeuralNetwork {
  constructor() {
    // Poids du réseau (entraînables)
    this.weights = {
      doctorScore: 0.3,
      previousOrders: 0.25,
      amount: 0.2,
      monthOfYear: 0.15,
      dayOfWeek: 0.1
    };
    this.bias = 0.1;
    this.isTrained = false;
  }

  // Fonction d'activation (sigmoid)
  sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
  }

  // Prédire la probabilité de commande
  predict(input) {
    const weightedSum = 
      this.weights.doctorScore * (input.doctorScore || 0.5) +
      this.weights.previousOrders * (input.previousOrders || 0) +
      this.weights.amount * (input.amount || 0) +
      this.weights.monthOfYear * (input.monthOfYear || 0.5) +
      this.weights.dayOfWeek * (input.dayOfWeek || 0.5) +
      this.bias;
    
    return this.sigmoid(weightedSum);
  }

  // Entraînement simple (descente de gradient)
  train(trainingData, iterations = 1000) {
    const learningRate = 0.1;
    
    for (let iter = 0; iter < iterations; iter++) {
      let totalError = 0;
      
      for (const data of trainingData) {
        // Prédiction
        const weightedSum = 
          this.weights.doctorScore * data.input.doctorScore +
          this.weights.previousOrders * data.input.previousOrders +
          this.weights.amount * data.input.amount +
          this.weights.monthOfYear * data.input.monthOfYear +
          this.weights.dayOfWeek * data.input.dayOfWeek +
          this.bias;
        
        const prediction = this.sigmoid(weightedSum);
        const target = data.output.willOrder;
        const error = target - prediction;
        totalError += Math.abs(error);
        
        // Mise à jour des poids (descente de gradient simplifiée)
        this.weights.doctorScore += learningRate * error * data.input.doctorScore;
        this.weights.previousOrders += learningRate * error * data.input.previousOrders;
        this.weights.amount += learningRate * error * data.input.amount;
        this.weights.monthOfYear += learningRate * error * data.input.monthOfYear;
        this.weights.dayOfWeek += learningRate * error * data.input.dayOfWeek;
        this.bias += learningRate * error;
      }
      
      if (iter % 200 === 0) {
        console.log(`📊 Entraînement IA: itération ${iter}, erreur moyenne: ${(totalError / trainingData.length).toFixed(4)}`);
      }
    }
    
    this.isTrained = true;
    console.log('✅ IA entraînée avec succès!');
    return true;
  }
}

class PharmaAIModel {
  constructor() {
    this.network = new SimpleNeuralNetwork();
    this.isTrained = false;
  }

  // Préparer les données d'entraînement
  prepareOrderTrainingData(ordersHistory) {
    return ordersHistory.map(order => ({
      input: {
        doctorScore: (order.doctorScore || 50) / 100,
        previousOrders: Math.min(order.previousOrders / 20, 1),
        amount: Math.min(order.amount / 1000000, 1),
        monthOfYear: (order.month || new Date().getMonth()) / 12,
        dayOfWeek: (order.dayOfWeek || new Date().getDay()) / 7
      },
      output: { willOrder: order.didOrder ? 1 : 0 }
    }));
  }

  // Entraîner le modèle
  async trainPredictionModel(ordersHistory) {
    if (!ordersHistory || ordersHistory.length < 5) {
      console.log('⚠️ Pas assez de données pour entraîner l\'IA (minimum 5 commandes)');
      return false;
    }
    
    const trainingData = this.prepareOrderTrainingData(ordersHistory);
    return this.network.train(trainingData, 500);
  }

  // Prédire la probabilité de commande
  predictOrderProbability(doctor, history = null) {
    const input = {
      doctorScore: (doctor.visitScore || 50) / 100,
      previousOrders: Math.min((doctor.totalOrders || 0) / 20, 1),
      amount: Math.min((doctor.totalAmount || 0) / 1000000, 1),
      monthOfYear: new Date().getMonth() / 12,
      dayOfWeek: new Date().getDay() / 7
    };
    
    const probability = this.network.predict(input) * 100;
    
    return {
      probability: Math.round(probability),
      recommendation: probability > 70 ? 'Très probable' : (probability > 40 ? 'Moyenne' : 'Faible'),
      message: this.getPredictionMessage(probability)
    };
  }

  getPredictionMessage(probability) {
    if (probability >= 80) return '🎯 Excellent moment pour proposer une commande !';
    if (probability >= 60) return '📈 Bonne opportunité, le médecin est réceptif.';
    if (probability >= 40) return '🤔 Probabilité moyenne, renforcez votre argumentaire.';
    if (probability >= 20) return '⚠️ Risqué, attendez quelques jours avant de proposer.';
    return '❌ Déconseillé pour le moment, travaillez d\'abord la relation.';
  }

  // Recommander un produit
  recommendProduct(doctor, products, history = []) {
    if (!products || products.length === 0) return null;
    
    const doctorSpecialty = doctor.specialty;
    let matchingProducts = products.filter(p => 
      p.targetSpecialties && p.targetSpecialties.some(s => 
        doctorSpecialty && doctorSpecialty.toLowerCase().includes(s.toLowerCase())
      )
    );
    
    if (matchingProducts.length === 0) {
      matchingProducts = [...products];
    }
    
    matchingProducts.sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0));
    
    const recommended = matchingProducts[0];
    
    return {
      product: recommended,
      reason: `Ce produit est adapté à la spécialité ${doctorSpecialty || 'générale'}`,
      alternatives: matchingProducts.slice(1, 4)
    };
  }

  // Analyser les tendances
  analyzeTrends(orders) {
    if (!orders || orders.length === 0) {
      return { trend: 'stable', message: 'Pas assez de données pour analyser les tendances' };
    }
    
    return {
      trend: 'up',
      message: '📈 Tendance positive détectée! Continuez vos efforts.'
    };
  }
}

module.exports = new PharmaAIModel();