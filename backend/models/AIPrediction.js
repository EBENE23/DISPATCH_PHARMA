const mongoose = require('mongoose');

const AIPredictionSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ['order_prediction', 'product_recommendation', 'time_prediction'],
    required: true 
  },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  predictedProduct: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  probability: { type: Number, min: 0, max: 100 },
  confidence: { type: String, enum: ['low', 'medium', 'high'] },
  metadata: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

AIPredictionSchema.index({ doctorId: 1, createdAt: -1 });
AIPredictionSchema.index({ type: 1 });

module.exports = mongoose.model('AIPrediction', AIPredictionSchema);