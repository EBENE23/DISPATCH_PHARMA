const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Product = require('../models/Product');
const Doctor = require('../models/Doctor');
const CartItem = require('../models/CartItem');
const aiModel = require('../utils/brainModel');

// ========== CRÉER UNE COMMANDE À PARTIR DU PANIER ==========
exports.createOrder = async (req, res) => {
  try {
    const { doctorId, paymentMethod, shippingAddress, notes } = req.body;
    const delegateId = req.userId;

    // Récupérer les articles du panier
    const cartItems = await CartItem.find({ 
      userId: delegateId, 
      doctorId: doctorId 
    }).populate('productId');

    if (cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Le panier est vide'
      });
    }

    // Calculer les totaux
    let subtotal = 0;
    const orderItems = [];

    for (const item of cartItems) {
      const product = item.productId;
      const totalPrice = product.price * item.quantity;
      subtotal += totalPrice;
      
      orderItems.push({
        productId: product._id,
        productName: product.name,
        quantity: item.quantity,
        unitPrice: product.price,
        totalPrice: totalPrice
      });

      // Mettre à jour le stock
      await Product.findByIdAndUpdate(product._id, {
        $inc: { stock: -item.quantity, salesCount: item.quantity }
      });
    }

    const deliveryFee = 2000; // Frais de livraison fixes
    const totalAmount = subtotal + deliveryFee;

    // Créer la commande
    const order = new Order({
      doctorId: doctorId,
      delegateId: delegateId,
      subtotal: subtotal,
      deliveryFee: deliveryFee,
      totalAmount: totalAmount,
      paymentMethod: paymentMethod,
      shippingAddress: shippingAddress,
      notes: notes,
      status: 'pending',
      paymentStatus: 'pending'
    });

    await order.save();

    // Créer les items de commande
    for (const item of orderItems) {
      await OrderItem.create({
        orderId: order._id,
        ...item
      });
    }

    // Mettre à jour les statistiques du médecin
    await Doctor.findByIdAndUpdate(doctorId, {
      $inc: { totalOrders: 1, totalAmount: totalAmount },
      $set: { lastOrderDate: Date.now() }
    });

    // Vider le panier
    await CartItem.deleteMany({ userId: delegateId, doctorId: doctorId });

    // Prédiction IA pour la prochaine commande (optionnel)
    const doctor = await Doctor.findById(doctorId);
    const prediction = aiModel.predictOrderProbability(doctor);

    res.status(201).json({
      success: true,
      message: 'Commande créée avec succès',
      order: order,
      orderNumber: order.orderNumber,
      aiPrediction: prediction
    });

  } catch (error) {
    console.error('Erreur création commande:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la commande',
      error: error.message
    });
  }
};

// ========== OBTENIR MES COMMANDES (délégué) ==========
exports.getMyOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    
    let query = { delegateId: req.userId };
    if (status) query.status = status;

    const orders = await Order.find(query)
      .populate('doctorId', 'name hospital phone')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      orders: orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total: total
    });

  } catch (error) {
    console.error('Erreur récupération commandes:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des commandes',
      error: error.message
    });
  }
};

// ========== OBTENIR UNE COMMANDE PAR ID ==========
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('doctorId', 'name hospital phone email')
      .populate('delegateId', 'fullName email phone');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Commande non trouvée'
      });
    }

    // Vérifier les droits d'accès
    if (order.delegateId._id.toString() !== req.userId.toString() && req.userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'avez pas accès à cette commande'
      });
    }

    const items = await OrderItem.find({ orderId: order._id }).populate('productId');

    res.json({
      success: true,
      order: order,
      items: items
    });

  } catch (error) {
    console.error('Erreur récupération commande:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la commande',
      error: error.message
    });
  }
};

// ========== METTRE À JOUR LE STATUT D'UNE COMMANDE ==========
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingNumber } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Commande non trouvée'
      });
    }

    // Seul admin ou livreur peut mettre à jour le statut
    if (req.userRole !== 'admin' && req.userRole !== 'delivery') {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'avez pas les droits pour modifier cette commande'
      });
    }

    order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (status === 'delivered') order.deliveredAt = Date.now();

    await order.save();

    res.json({
      success: true,
      message: 'Statut de la commande mis à jour',
      order: order
    });

  } catch (error) {
    console.error('Erreur mise à jour statut:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du statut',
      error: error.message
    });
  }
};

// ========== OBTENIR TOUTES LES COMMANDES (admin) ==========
exports.getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, dateFrom, dateTo } = req.query;
    
    let query = {};
    if (status) query.status = status;
    
    if (dateFrom || dateTo) {
      query.orderDate = {};
      if (dateFrom) query.orderDate.$gte = new Date(dateFrom);
      if (dateTo) query.orderDate.$lte = new Date(dateTo);
    }

    const orders = await Order.find(query)
      .populate('doctorId', 'name hospital')
      .populate('delegateId', 'fullName email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      orders: orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total: total
    });

  } catch (error) {
    console.error('Erreur récupération commandes:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des commandes',
      error: error.message
    });
  }
};

// ========== STATISTIQUES DES COMMANDES ==========
exports.getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const processingOrders = await Order.countDocuments({ status: 'processing' });
    const deliveredOrders = await Order.countDocuments({ status: 'delivered' });
    
    const totalRevenue = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const monthlyOrders = await Order.aggregate([
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      stats: {
        total: totalOrders,
        pending: pendingOrders,
        processing: processingOrders,
        delivered: deliveredOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        monthly: monthlyOrders
      }
    });

  } catch (error) {
    console.error('Erreur statistiques commandes:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message
    });
  }
};