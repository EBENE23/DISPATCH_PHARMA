const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { auth, isDelegateOrAdmin, isAdmin } = require('../middleware/auth');

// Routes publiques (lecture uniquement, avec auth)
router.use(auth);

router.get('/', isDelegateOrAdmin, productController.getAllProducts);
router.get('/categories', isDelegateOrAdmin, productController.getCategories);
router.get('/:id', isDelegateOrAdmin, productController.getProductById);

// Routes d'écriture (admin uniquement)
router.post('/', isAdmin, productController.createProduct);
router.put('/:id', isAdmin, productController.updateProduct);
router.put('/:id/stock', isAdmin, productController.updateStock);
router.delete('/:id', isAdmin, productController.deleteProduct);

module.exports = router;