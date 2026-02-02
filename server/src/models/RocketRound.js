const mongoose = require('mongoose');

const RocketRoundSchema = new mongoose.Schema({
  crashPoint: { type: Number, required: true },
  startedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['running', 'crashed', 'ended'], default: 'running' },
  metadata: { type: Object },
});

module.exports = mongoose.model('RocketRound', RocketRoundSchema);
