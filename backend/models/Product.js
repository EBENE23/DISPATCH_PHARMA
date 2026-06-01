const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  type: { type: String, required: true },
  category: { type: String, required: true },
  laboratory: { type: String, required: true },
  description: { type: String },
  indications: { type: String },
  contraindications: { type: String },
  
  // Prix et stock
  price: { type: Number, required: true, min: 0 },
  unit: { type: String, required: true },
  stock: { type: Number, default: 0, min: 0 },
  
  // Ciblage IA
  targetSpecialties: [{ type: String }],
  
  // Image
  imageUrl: { type: String, default: '/images/products/default.png' },
  
  // Statistiques
  salesCount: { type: Number, default: 0 },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  
  // Statut
  isActive: { type: Boolean, default: true },
  
}, { timestamps: true });

// Index
ProductSchema.index({ name: 'text', type: 'text', laboratory: 'text' });
ProductSchema.index({ category: 1 });
ProductSchema.index({ price: 1 });

module.exports = mongoose.model('Product', ProductSchema);