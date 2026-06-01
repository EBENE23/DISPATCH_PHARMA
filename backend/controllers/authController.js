const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateVerificationCode, sendVerificationCode, sendInvitationEmail } = require('../utils/emailService');

// Générer un token JWT
const generateToken = (userId, role, expiresIn = process.env.JWT_EXPIRE) => {
  return jwt.sign(
    { id: userId, role: role },
    process.env.JWT_SECRET,
    { expiresIn: expiresIn }
  );
};

// ========== INSCRIPTION (self-registration) ==========
exports.register = async (req, res) => {
  try {
    const { email, fullName, phone, role, employeeId, licenseNumber, vehiclePlate, company, hospitalName } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Cet email est déjà utilisé'
      });
    }

    // Vérifier les identifiants uniques selon le rôle
    if (role === 'delegate' && employeeId) {
      const existingEmployee = await User.findOne({ employeeId });
      if (existingEmployee) {
        return res.status(400).json({
          success: false,
          message: 'Ce matricule employé existe déjà'
        });
      }
    }

    if (role === 'pharmacist' && licenseNumber) {
      const existingLicense = await User.findOne({ licenseNumber });
      if (existingLicense) {
        return res.status(400).json({
          success: false,
          message: 'Ce numéro de licence existe déjà'
        });
      }
    }

    if (role === 'delivery' && vehiclePlate) {
      const existingPlate = await User.findOne({ vehiclePlate });
      if (existingPlate) {
        return res.status(400).json({
          success: false,
          message: 'Cette plaque d\'immatriculation existe déjà'
        });
      }
    }

    // Créer l'utilisateur (sans mot de passe, en attente de validation)
    const userData = {
      email,
      fullName,
      phone,
      role,
      accountStatus: 'pending',
      createdBy: 'self_registration'
    };

    // Ajouter les champs spécifiques
    if (role === 'delegate') {
      userData.employeeId = employeeId;
      userData.company = company;
      userData.sector = req.body.sector;
      userData.isEmployeeIdVerified = false;
    } else if (role === 'pharmacist') {
      userData.licenseNumber = licenseNumber;
      userData.hospitalName = hospitalName;
      userData.isLicenseVerified = false;
    } else if (role === 'delivery') {
      userData.vehiclePlate = vehiclePlate;
      userData.vehicleType = req.body.vehicleType;
      userData.deliveryCompany = req.body.deliveryCompany;
      userData.zone = req.body.zone;
      userData.isIdentityVerified = false;
    }

    const user = new User(userData);
    await user.save();

    // Générer un token temporaire pour l'activation
    const tempToken = generateToken(user._id, user.role, '48h');

    // Envoyer email d'invitation
    await sendInvitationEmail(email, fullName, role, tempToken);

    res.status(201).json({
      success: true,
      message: 'Inscription réussie. Un email d\'activation vous a été envoyé.',
      userId: user._id
    });

  } catch (error) {
    console.error('Erreur inscription:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'inscription',
      error: error.message
    });
  }
};

// ========== ACTIVATION DE COMPTE (création mot de passe) ==========
exports.activateAccount = async (req, res) => {
  try {
    const { token, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Les mots de passe ne correspondent pas'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Le mot de passe doit contenir au moins 8 caractères'
      });
    }

    // Vérifier le token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: 'Lien d\'activation invalide ou expiré'
      });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    if (user.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Ce compte est déjà activé'
      });
    }

    // Hasher le mot de passe
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS));
    const hashedPassword = await bcrypt.hash(password, salt);

    // Activer le compte
    user.password = hashedPassword;
    user.isActive = true;
    user.accountStatus = 'active';
    await user.save();

    res.json({
      success: true,
      message: 'Compte activé avec succès. Vous pouvez maintenant vous connecter.'
    });

  } catch (error) {
    console.error('Erreur activation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'activation',
      error: error.message
    });
  }
};

// ========== PREMIÈRE ÉTAPE DE CONNEXION (email + mot de passe) ==========
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Vérifier si le compte est verrouillé
    if (user.isLocked && user.isLocked()) {
      const remainingTime = Math.ceil((user.lockUntil - Date.now()) / 60000);
      return res.status(401).json({
        success: false,
        message: `Compte verrouillé. Réessayez dans ${remainingTime} minutes.`
      });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      if (user.incrementLoginAttempts) await user.incrementLoginAttempts();
      const attemptsLeft = 5 - (user.loginAttempts || 0);
      return res.status(401).json({
        success: false,
        message: `Email ou mot de passe incorrect. Tentatives restantes: ${attemptsLeft}`
      });
    }

    // Vérifier si le compte est actif
    if (!user.isActive || user.accountStatus !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Votre compte n\'est pas actif. Veuillez contacter l\'administrateur.'
      });
    }

    // Réinitialiser les tentatives de connexion
    if (user.resetLoginAttempts) await user.resetLoginAttempts();

    // Générer un code de vérification à 6 chiffres
    const verificationCode = generateVerificationCode();
    const verificationExpires = new Date(Date.now() + 5 * 60000); // 5 minutes

    user.verificationCode = verificationCode;
    user.verificationCodeExpires = verificationExpires;
    await user.save();

    // ==============================================================
    // MODE TEST : Afficher le code dans la console au lieu d'envoyer un email
    // ==============================================================
    console.log('\n╔════════════════════════════════════════════════════════════════════╗');
    console.log('║                    🔐 CODE DE CONNEXION 2FA                        ║');
    console.log('╠════════════════════════════════════════════════════════════════════╣');
    console.log(`║   👤 Utilisateur : ${user.fullName}`);
    console.log(`║   📧 Email : ${user.email}`);
    console.log(`║   🔑 CODE À 6 CHIFFRES : ${verificationCode}`);
    console.log(`║   ⏰ Expire dans : 5 minutes`);
    console.log('╠════════════════════════════════════════════════════════════════════╣');
    console.log('║   ℹ️  Pour vous connecter, saisissez ce code dans l\'application   ║');
    console.log('╚════════════════════════════════════════════════════════════════════╝\n');

    // Générer un token TEMPORAIRE pour la deuxième étape
    const tempToken = generateToken(user._id, user.role, '5m');

    res.json({
      success: true,
      message: 'Code de vérification généré (Mode TEST - voir console)',
      requiresCode: true,
      tempToken: tempToken
    });

  } catch (error) {
    console.error('Erreur connexion:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion',
      error: error.message
    });
  }
};

// ========== DEUXIÈME ÉTAPE : VÉRIFICATION DU CODE 2FA ==========
exports.verifyCode = async (req, res) => {
  try {
    const { tempToken, code } = req.body;

    // Vérifier le token temporaire
    let decoded;
    try {
      decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: 'Session expirée. Veuillez vous reconnecter.'
      });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Vérifier le code
    if (user.verificationCode !== code) {
      return res.status(400).json({
        success: false,
        message: 'Code de vérification incorrect'
      });
    }

    // Vérifier si le code n'a pas expiré
    if (user.verificationCodeExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'Le code de vérification a expiré. Veuillez vous reconnecter.'
      });
    }

    // Effacer le code de vérification
    user.verificationCode = null;
    user.verificationCodeExpires = null;
    user.lastLoginAt = Date.now();
    await user.save();

    // Générer le token JWT final
    const token = generateToken(user._id, user.role);

    // Retourner les informations utilisateur (sans données sensibles)
    const userResponse = {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      avatar: user.avatar,
      sector: user.sector,
      hospitalName: user.hospitalName,
      company: user.company
    };

    console.log(`\n✅ Connexion réussie : ${user.email} (${user.role})\n`);

    res.json({
      success: true,
      message: 'Connexion réussie',
      token: token,
      user: userResponse
    });

  } catch (error) {
    console.error('Erreur vérification code:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification',
      error: error.message
    });
  }
};

// ========== RENVOYER LE CODE DE VÉRIFICATION ==========
exports.resendVerificationCode = async (req, res) => {
  try {
    const { tempToken } = req.body;

    let decoded;
    try {
      decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: 'Session expirée. Veuillez vous reconnecter.'
      });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Générer un nouveau code
    const verificationCode = generateVerificationCode();
    const verificationExpires = new Date(Date.now() + 5 * 60000);

    user.verificationCode = verificationCode;
    user.verificationCodeExpires = verificationExpires;
    await user.save();

    // Afficher le nouveau code dans la console
    console.log('\n╔════════════════════════════════════════════════════════════════════╗');
    console.log('║                 🔄 NOUVEAU CODE DE CONNEXION 2FA                    ║');
    console.log('╠════════════════════════════════════════════════════════════════════╣');
    console.log(`║   👤 Utilisateur : ${user.fullName}`);
    console.log(`║   📧 Email : ${user.email}`);
    console.log(`║   🔑 NOUVEAU CODE : ${verificationCode}`);
    console.log(`║   ⏰ Expire dans : 5 minutes`);
    console.log('╚════════════════════════════════════════════════════════════════════╝\n');

    // Générer un nouveau token temporaire
    const newTempToken = generateToken(user._id, user.role, '5m');

    res.json({
      success: true,
      message: 'Nouveau code généré (Mode TEST - voir console)',
      tempToken: newTempToken
    });

  } catch (error) {
    console.error('Erreur renvoi code:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du renvoi du code',
      error: error.message
    });
  }
};

// ========== DÉCONNEXION ==========
exports.logout = async (req, res) => {
  res.json({
    success: true,
    message: 'Déconnexion réussie'
  });
};

// ========== OBTENIR MON PROFIL ==========
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password -verificationCode -verificationCodeExpires');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.json({
      success: true,
      user: user
    });

  } catch (error) {
    console.error('Erreur getMe:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du profil',
      error: error.message
    });
  }
};