// Vérification spécifique par rôle
const roleCheck = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur non authentifié.'
      });
    }

    if (!allowedRoles.includes(req.userRole)) {
      return res.status(403).json({
        success: false,
        message: `Accès refusé. Rôle requis: ${allowedRoles.join(', ')}`,
        yourRole: req.userRole
      });
    }

    next();
  };
};

// Vérifier si l'utilisateur peut accéder à une ressource spécifique
const canAccessResource = (resourceUserId) => {
  return (req, res, next) => {
    // Admin a toujours accès
    if (req.userRole === 'admin') {
      return next();
    }
    
    // Sinon, vérifier que l'utilisateur est le propriétaire
    if (req.userId.toString() !== resourceUserId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'avez pas accès à cette ressource.'
      });
    }
    
    next();
  };
};

module.exports = {
  roleCheck,
  canAccessResource
};