const mongoose = require('mongoose');

const GameplaySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
  wager: { type: Number, required: true },
  winAmount: { type: Number, required: true },
  netResult: { type: Number, required: true },
  processed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('GameplayTransaction', GameplaySchema);
