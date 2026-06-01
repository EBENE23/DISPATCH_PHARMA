const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statisticsController');
const { auth, isDelegateOrAdmin, isAdmin } = require('../middleware/auth');

// Routes protégées
router.use(auth);

// Dashboard général
router.get('/dashboard', isDelegateOrAdmin, statisticsController.getDashboardStats);

// Stats par médecin
router.get('/doctor/:doctorId', isDelegateOrAdmin, statisticsController.getDoctorStats);

// Stats par produit (admin uniquement)
router.get('/products', isAdmin, statisticsController.getProductStats);

// Stats par délégué (admin uniquement)
router.get('/delegate/:delegateId', isAdmin, statisticsController.getDelegateStats);

module.exports = router;