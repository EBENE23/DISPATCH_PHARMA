const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { auth, isDelegateOrAdmin, isDeliveryOrAdmin, isAdmin } = require('../middleware/auth');

// Routes protégées
router.use(auth);

// Commandes
router.post('/', isDelegateOrAdmin, orderController.createOrder);
router.get('/my-orders', isDelegateOrAdmin, orderController.getMyOrders);
router.get('/stats', isAdmin, orderController.getOrderStats);
router.get('/all', isAdmin, orderController.getAllOrders);
router.get('/:id', orderController.getOrderById);
router.put('/:id/status', isDeliveryOrAdmin, orderController.updateOrderStatus);

module.exports = router;