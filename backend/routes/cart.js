const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { auth, isDelegateOrAdmin } = require('../middleware/auth');

// Routes protégées (délégué uniquement)
router.use(auth);
router.use(isDelegateOrAdmin);

router.get('/', cartController.getCart);
router.post('/add', cartController.addToCart);
router.put('/item/:itemId', cartController.updateCartItem);
router.delete('/item/:itemId', cartController.removeFromCart);
router.delete('/clear', cartController.clearCart);

module.exports = router;