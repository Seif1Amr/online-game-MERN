const mongoose = require('mongoose');

const RocketBetSchema = new mongoose.Schema({
  roundId: { type: mongoose.Schema.Types.ObjectId, ref: 'RocketRound', required: true, index: true },
  playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true, index: true },
  amount: { type: Number, required: true },
  cashedOutAt: { type: Date },
  cashoutMultiplier: { type: Number },
  payout: { type: Number },
  status: { type: String, enum: ['placed', 'cashed', 'lost'], default: 'placed' },
  createdAt: { type: Date, default: Date.now },
});

RocketBetSchema.index({ roundId: 1, playerId: 1 }, { unique: true });

module.exports = mongoose.model('RocketBet', RocketBetSchema);
