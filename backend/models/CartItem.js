const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1, default: 1 },
}, { timestamps: true });

// Index composite pour éviter les doublons
CartItemSchema.index({ userId: 1, doctorId: 1, productId: 1 }, { unique: true });

module.exports = mongoose.model('CartItem', CartItemSchema);