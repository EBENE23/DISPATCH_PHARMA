const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  // === Informations de base ===
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Veuillez entrer un email valide']
  },
  phone: { type: String, trim: true },
  fullName: { type: String, required: true, trim: true },
  
  // === Rôle de l'utilisateur ===
  role: { 
    type: String, 
    enum: ['admin', 'delegate', 'pharmacist', 'delivery'],
    required: true 
  },
  
  // === Authentification ===
  password: { type: String }, // Peut être null pour les comptes invités
  verificationCode: { type: String },
  verificationCodeExpires: { type: Date },
  twoFactorEnabled: { type: Boolean, default: false },
  
  // === Pour DÉLÉGUÉ MÉDICAL ===
  employeeId: { type: String, unique: true, sparse: true },
  company: { type: String },
  sector: { type: String },
  supervisor: { type: String },
  isEmployeeIdVerified: { type: Boolean, default: false },
  
  // === Pour PHARMACIEN ===
  licenseNumber: { type: String, unique: true, sparse: true },
  hospitalId: { type: String },
  hospitalName: { type: String },
  isLicenseVerified: { type: Boolean, default: false },
  
  // === Pour LIVREUR ===
  vehiclePlate: { type: String, unique: true, sparse: true },
  vehicleType: { type: String, enum: ['moto', 'voiture', 'camionnette'] },
  deliveryCompany: { type: String },
  zone: { type: String },
  idCardPhoto: { type: String },
  isIdentityVerified: { type: Boolean, default: false },
  
  // === Statut du compte ===
  accountStatus: { 
    type: String, 
    enum: ['pending', 'active', 'suspended', 'rejected'],
    default: 'pending'
  },
  isActive: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: false },
  approvedBy: { type: String },
  approvedAt: { type: Date },
  rejectionReason: { type: String },
  
  // === Audit et sécurité ===
  createdBy: { 
    type: String, 
    enum: ['self_registration', 'admin', 'invitation'],
    default: 'self_registration'
  },
  lastLoginAt: { type: Date },
  loginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date },
  
  // === Tokens ===
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  
  // === Avatar ===
  avatar: { type: String, default: '/images/avatars/default.png' },
  
}, {
  timestamps: true
});

// Index pour les recherches
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ sector: 1 });
UserSchema.index({ employeeId: 1 });
UserSchema.index({ licenseNumber: 1 });
UserSchema.index({ vehiclePlate: 1 });

// Méthode pour vérifier si le compte est verrouillé
UserSchema.methods.isLocked = function() {
  return this.lockUntil && this.lockUntil > Date.now();
};

// Méthode pour incrémenter les tentatives de connexion
UserSchema.methods.incrementLoginAttempts = async function() {
  this.loginAttempts += 1;
  
  // Verrouiller après 5 tentatives (30 minutes)
  if (this.loginAttempts >= 5) {
    this.lockUntil = Date.now() + 30 * 60 * 1000;
  }
  
  await this.save();
};

// Méthode pour réinitialiser les tentatives
UserSchema.methods.resetLoginAttempts = async function() {
  this.loginAttempts = 0;
  this.lockUntil = null;
  await this.save();
};

module.exports = mongoose.model('User', UserSchema);