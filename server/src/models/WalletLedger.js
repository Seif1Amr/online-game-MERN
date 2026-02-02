const mongoose = require('mongoose');

const LedgerSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
  ownerType: { type: String, required: true, enum: ['Agent', 'Affiliate', 'Player'] },
  amount: { type: Number, required: true },
  kind: { type: String, required: true, enum: ['credit', 'debit'] },
  reason: { type: String },
  referenceId: { type: mongoose.Schema.Types.ObjectId },
  meta: { type: Object },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('WalletLedger', LedgerSchema);
