const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const moment = require('moment');

// ========== STATISTIQUES GLOBALES POUR LE DASHBOARD ==========
exports.getDashboardStats = async (req, res) => {
  try {
    const userRole = req.userRole;
    const userId = req.userId;

    // Statistiques de base
    let query = {};
    
    // Si c'est un délégué, filtrer par ses commandes
    if (userRole === 'delegate') {
      query.delegateId = userId;
    }

    // Commandes
    const totalOrders = await Order.countDocuments(query);
    const pendingOrders = await Order.countDocuments({ ...query, status: 'pending' });
    const deliveredOrders = await Order.countDocuments({ ...query, status: 'delivered' });

    // Ventes
    const salesAgg = await Order.aggregate([
      { $match: { ...query, status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalSales = salesAgg[0]?.total || 0;

    // Clients (médecins)
    const doctors = await Order.distinct('doctorId', query);
    const totalClients = doctors.length;

    // Livraisons en cours
    const pendingDelivery = await Order.countDocuments({ ...query, status: 'shipped' });

    // Ventes des 7 derniers jours
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = moment().subtract(i, 'days');
      const dayStart = date.startOf('day').toDate();
      const dayEnd = date.endOf('day').toDate();
      
      const dailySales = await Order.aggregate([
        { 
          $match: { 
            ...query,
            orderDate: { $gte: dayStart, $lte: dayEnd },
            status: 'delivered'
          } 
        },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]);
      
      last7Days.push({
        day: date.format('ddd'),
        date: date.format('DD/MM'),
        sales: dailySales[0]?.total || 0
      });
    }

    // Top produits
    const topProducts = await Product.find()
      .sort({ salesCount: -1 })
      .limit(5)
      .select('name salesCount price');

    res.json({
      success: true,
      stats: {
        totalOrders,
        pendingOrders,
        deliveredOrders,
        totalSales,
        totalClients,
        pendingDelivery,
        weeklySales: last7Days,
        topProducts
      }
    });

  } catch (error) {
    console.error('Erreur statistiques dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message
    });
  }
};

// ========== STATISTIQUES PAR MÉDECIN ==========
exports.getDoctorStats = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const orders = await Order.find({ doctorId });
    const totalOrders = orders.length;
    const totalAmount = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    
    const lastOrder = await Order.findOne({ doctorId }).sort({ orderDate: -1 });
    
    // Produits préférés
    const orderItems = await OrderItem.find({
      orderId: { $in: orders.map(o => o._id) }
    });

    const productCounts = {};
    orderItems.forEach(item => {
      productCounts[item.productName] = (productCounts[item.productName] || 0) + item.quantity;
    });

    const topProducts = Object.entries(productCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    res.json({
      success: true,
      stats: {
        totalOrders,
        totalAmount,
        averageOrderValue: totalOrders > 0 ? totalAmount / totalOrders : 0,
        lastOrderDate: lastOrder?.orderDate,
        topProducts
      }
    });

  } catch (error) {
    console.error('Erreur statistiques médecin:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message
    });
  }
};

// ========== STATISTIQUES PAR PRODUIT ==========
exports.getProductStats = async (req, res) => {
  try {
    const topSelling = await Product.find()
      .sort({ salesCount: -1 })
      .limit(10)
      .select('name salesCount price stock');

    const lowStock = await Product.find({ stock: { $lt: 50 } })
      .sort({ stock: 1 })
      .select('name stock price');

    const categories = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 }, totalSales: { $sum: '$salesCount' } } }
    ]);

    res.json({
      success: true,
      stats: {
        topSelling,
        lowStock,
        categories
      }
    });

  } catch (error) {
    console.error('Erreur statistiques produits:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message
    });
  }
};

// ========== STATISTIQUES PAR DÉLÉGUÉ ==========
exports.getDelegateStats = async (req, res) => {
  try {
    const { delegateId } = req.params;

    const orders = await Order.find({ delegateId });
    const totalOrders = orders.length;
    const totalAmount = orders.reduce((sum, o) => sum + o.totalAmount, 0);

    const doctors = await Order.distinct('doctorId', { delegateId });
    const uniqueDoctors = doctors.length;

    const monthlyOrders = await Order.aggregate([
      { $match: { delegateId: mongoose.Types.ObjectId(delegateId) } },
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
        totalOrders,
        totalAmount,
        uniqueDoctors,
        averageOrderValue: totalOrders > 0 ? totalAmount / totalOrders : 0,
        monthly: monthlyOrders
      }
    });

  } catch (error) {
    console.error('Erreur statistiques délégué:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message
    });
  }
};