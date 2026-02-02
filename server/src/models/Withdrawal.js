const mongoose = require('mongoose');

const WithdrawalSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
  ownerType: { type: String, required: true, enum: ['Agent', 'Affiliate'] },
  amount: { type: Number, required: true },
  status: { type: String, default: 'pending', enum: ['pending', 'approved', 'rejected'] },
  createdAt: { type: Date, default: Date.now },
  processedAt: { type: Date },
});

module.exports = mongoose.model('Withdrawal', WithdrawalSchema);
