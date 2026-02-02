const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' },
  affiliateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Affiliate' },
  email: { type: String, required: true, unique: true, lowercase: true },
  status: { type: String, default: 'active' },
  walletBalance: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Player', PlayerSchema);
