const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true, min: 0 },
  totalPrice: { type: Number, required: true, min: 0 },
}, { timestamps: true });

// Index
OrderItemSchema.index({ orderId: 1 });
OrderItemSchema.index({ productId: 1 });

module.exports = mongoose.model('OrderItem', OrderItemSchema);