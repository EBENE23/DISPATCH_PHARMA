const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { auth, isAdmin } = require('../middleware/auth');
const { generateVerificationCode, sendInvitationEmail } = require('../utils/emailService');
const jwt = require('jsonwebtoken');

// Toutes les routes nécessitent admin
router.use(auth);
router.use(isAdmin);

// ========== LISTER TOUS LES UTILISATEURS ==========
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, role, status } = req.query;
    
    let query = {};
    if (role) query.role = role;
    if (status) query.accountStatus = status;

    const users = await User.find(query)
      .select('-password -verificationCode')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Erreur liste users:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ========== CRÉER UN UTILISATEUR (INVITATION) ==========
router.post('/', async (req, res) => {
  try {
    const { email, fullName, phone, role, employeeId, licenseNumber, vehiclePlate, company, hospitalName, sector } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Cet email est déjà utilisé' });
    }

    // Créer l'utilisateur
    const userData = {
      email,
      fullName,
      phone,
      role,
      accountStatus: 'pending',
      createdBy: 'admin',
      isApproved: true,
      approvedBy: req.userId,
      approvedAt: new Date()
    };

    if (role === 'delegate') {
      userData.employeeId = employeeId;
      userData.company = company;
      userData.sector = sector;
    } else if (role === 'pharmacist') {
      userData.licenseNumber = licenseNumber;
      userData.hospitalName = hospitalName;
    } else if (role === 'delivery') {
      userData.vehiclePlate = vehiclePlate;
      userData.deliveryCompany = company;
      userData.zone = sector;
    }

    const user = new User(userData);
    await user.save();

    // Générer un token d'invitation
    const tempToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '48h' }
    );

    // Envoyer l'invitation
    await sendInvitationEmail(email, fullName, role, tempToken);

    res.status(201).json({
      success: true,
      message: 'Invitation envoyée avec succès',
      user: { id: user._id, email, fullName, role }
    });
  } catch (error) {
    console.error('Erreur création user:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ========== METTRE À JOUR UN UTILISATEUR ==========
router.put('/:id', async (req, res) => {
  try {
    const { isActive, accountStatus, role, sector, hospitalName, company } = req.body;
    
    const updates = { isActive, accountStatus, role, sector, hospitalName, company };
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { ...updates, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).select('-password -verificationCode');

    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error('Erreur mise à jour user:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ========== SUPPRIMER UN UTILISATEUR ==========
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
    }
    res.json({ success: true, message: 'Utilisateur supprimé' });
  } catch (error) {
    console.error('Erreur suppression user:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;