const mongoose = require('mongoose');

const CommissionSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
  ownerType: { type: String, required: true, enum: ['Agent', 'Affiliate'] },
  sourceUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
  amount: { type: Number, required: true },
  status: { type: String, default: 'pending', enum: ['pending', 'paid', 'rejected'] },
  referenceId: { type: mongoose.Schema.Types.ObjectId, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Prevent duplicate processing for same source
CommissionSchema.index({ referenceId: 1, ownerId: 1 }, { unique: true });

module.exports = mongoose.model('Commission', CommissionSchema);
