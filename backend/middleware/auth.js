const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware d'authentification JWT
const auth = async (req, res, next) => {
  try {
    // Récupérer le token du header Authorization
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Accès non autorisé. Token manquant.'
      });
    }

    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Trouver l'utilisateur
    const user = await User.findById(decoded.id).select('-password -verificationCode');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur non trouvé.'
      });
    }

    // Vérifier si le compte est actif
    if (!user.isActive || user.accountStatus !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Votre compte n\'est pas actif. Veuillez contacter l\'administrateur.'
      });
    }

    // Ajouter l'utilisateur à la requête
    req.user = user;
    req.userId = user._id;
    req.userRole = user.role;
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token invalide.'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expiré. Veuillez vous reconnecter.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Erreur d\'authentification.',
      error: error.message
    });
  }
};

// Middleware pour vérifier le rôle (Admin uniquement)
const isAdmin = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Accès refusé. Droits administrateur requis.'
    });
  }
  next();
};

// Middleware pour vérifier le rôle (Délégué ou Admin)
const isDelegateOrAdmin = (req, res, next) => {
  if (req.userRole !== 'delegate' && req.userRole !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Accès refusé. Droits délégué médical requis.'
    });
  }
  next();
};

// Middleware pour vérifier le rôle (Pharmacien ou Admin)
const isPharmacistOrAdmin = (req, res, next) => {
  if (req.userRole !== 'pharmacist' && req.userRole !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Accès refusé. Droits pharmacien requis.'
    });
  }
  next();
};

// Middleware pour vérifier le rôle (Livreur ou Admin)
const isDeliveryOrAdmin = (req, res, next) => {
  if (req.userRole !== 'delivery' && req.userRole !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Accès refusé. Droits livreur requis.'
    });
  }
  next();
};

module.exports = {
  auth,
  isAdmin,
  isDelegateOrAdmin,
  isPharmacistOrAdmin,
  isDeliveryOrAdmin
};