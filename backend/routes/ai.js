const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { auth, isDelegateOrAdmin, isAdmin } = require('../middleware/auth');

// Routes protégées
router.use(auth);

// IA publique (délégués et admin)
router.get('/predict/:doctorId', isDelegateOrAdmin, aiController.predictOrder);
router.get('/recommend/:doctorId', isDelegateOrAdmin, aiController.recommendProduct);
router.get('/trends', isDelegateOrAdmin, aiController.analyzeTrends);
router.get('/insights', isDelegateOrAdmin, aiController.getAIInsights);

// Admin uniquement (pour entraîner le modèle)
router.post('/train', isAdmin, aiController.trainModel);

module.exports = router;