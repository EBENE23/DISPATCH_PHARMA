const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  
  // Relations
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  delegateId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Dates
  orderDate: { type: Date, default: Date.now },
  deliveredAt: { type: Date },
  
  // Montants
  subtotal: { type: Number, required: true, min: 0 },
  deliveryFee: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true, min: 0 },
  
  // Statuts
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: { 
    type: String, 
    enum: ['bank_transfer', 'cash_on_delivery', 'mobile_money'],
    required: true
  },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  
  // Livraison
  shippingAddress: { type: String, required: true },
  trackingNumber: { type: String },
  
  // Audit
  notes: { type: String },
  
}, { timestamps: true });

// Générer un numéro de commande unique
OrderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const count = await mongoose.model('Order').countDocuments() + 1;
    this.orderNumber = `CMD-${year}${month}-${String(count).padStart(4, '0')}`;
  }
  next();
});

// Index
OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ doctorId: 1 });
OrderSchema.index({ delegateId: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ orderDate: -1 });

module.exports = mongoose.model('Order', OrderSchema);