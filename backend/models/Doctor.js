const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  specialty: { type: String, required: true },
  hospital: { type: String, required: true },
  address: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  phone: { type: String, trim: true },
  email: { type: String, lowercase: true, trim: true },
  
  // Statistiques pour l'IA
  preferredContactHour: { type: Number, min: 8, max: 18, default: 10 },
  visitScore: { type: Number, min: 0, max: 100, default: 50 },
  totalOrders: { type: Number, default: 0 },
  totalAmount: { type: Number, default: 0 },
  lastOrderDate: { type: Date },
  
  // Statut
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'blacklisted'],
    default: 'active'
  },
  
  // Audit
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
}, { timestamps: true });

// Index pour la recherche
DoctorSchema.index({ name: 'text', specialty: 'text', hospital: 'text' });
DoctorSchema.index({ specialty: 1 });
DoctorSchema.index({ status: 1 });

module.exports = mongoose.model('Doctor', DoctorSchema);