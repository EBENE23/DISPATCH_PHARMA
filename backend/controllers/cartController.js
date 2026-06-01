const CartItem = require('../models/CartItem');
const Product = require('../models/Product');
const Doctor = require('../models/Doctor');

// ========== AJOUTER AU PANIER ==========
exports.addToCart = async (req, res) => {
  try {
    const { doctorId, productId, quantity } = req.body;
    const userId = req.userId;

    // Vérifier si le produit existe
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
    }

    // Vérifier le stock
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Stock insuffisant. Il reste ${product.stock} unités.`
      });
    }

    // Vérifier si le médecin existe
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Médecin non trouvé'
      });
    }

    // Ajouter ou mettre à jour le panier
    const cartItem = await CartItem.findOneAndUpdate(
      { userId, doctorId, productId },
      { $inc: { quantity: quantity } },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      message: 'Produit ajouté au panier',
      cartItem: cartItem
    });

  } catch (error) {
    console.error('Erreur ajout panier:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'ajout au panier',
      error: error.message
    });
  }
};

// ========== OBTENIR LE PANIER ==========
exports.getCart = async (req, res) => {
  try {
    const { doctorId } = req.query;
    const userId = req.userId;

    let query = { userId };
    if (doctorId) query.doctorId = doctorId;

    const cartItems = await CartItem.find(query)
      .populate('productId')
      .populate('doctorId', 'name hospital');

    // Calculer le total
    let subtotal = 0;
    const itemsWithTotal = cartItems.map(item => {
      const total = item.productId.price * item.quantity;
      subtotal += total;
      return {
        ...item.toObject(),
        itemTotal: total
      };
    });

    const deliveryFee = 2000;
    const total = subtotal + deliveryFee;

    res.json({
      success: true,
      cart: itemsWithTotal,
      summary: {
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        total: total,
        itemCount: cartItems.reduce((acc, item) => acc + item.quantity, 0)
      }
    });

  } catch (error) {
    console.error('Erreur récupération panier:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du panier',
      error: error.message
    });
  }
};

// ========== METTRE À JOUR LA QUANTITÉ ==========
exports.updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { itemId } = req.params;

    const cartItem = await CartItem.findById(itemId);
    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Article non trouvé dans le panier'
      });
    }

    // Vérifier les droits
    if (cartItem.userId.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'avez pas accès à ce panier'
      });
    }

    if (quantity <= 0) {
      await CartItem.findByIdAndDelete(itemId);
      return res.json({
        success: true,
        message: 'Article retiré du panier'
      });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    res.json({
      success: true,
      message: 'Quantité mise à jour',
      cartItem: cartItem
    });

  } catch (error) {
    console.error('Erreur mise à jour panier:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du panier',
      error: error.message
    });
  }
};

// ========== SUPPRIMER UN ARTICLE DU PANIER ==========
exports.removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;

    const cartItem = await CartItem.findById(itemId);
    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Article non trouvé'
      });
    }

    if (cartItem.userId.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé'
      });
    }

    await CartItem.findByIdAndDelete(itemId);

    res.json({
      success: true,
      message: 'Article retiré du panier'
    });

  } catch (error) {
    console.error('Erreur suppression panier:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression',
      error: error.message
    });
  }
};

// ========== VIDER LE PANIER ==========
exports.clearCart = async (req, res) => {
  try {
    const { doctorId } = req.body;
    const userId = req.userId;

    let query = { userId };
    if (doctorId) query.doctorId = doctorId;

    await CartItem.deleteMany(query);

    res.json({
      success: true,
      message: 'Panier vidé avec succès'
    });

  } catch (error) {
    console.error('Erreur vidage panier:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du vidage du panier',
      error: error.message
    });
  }
};