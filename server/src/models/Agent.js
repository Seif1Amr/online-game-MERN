const mongoose = require('mongoose');

const AgentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String },
  walletBalance: { type: Number, default: 0 },
  role: { type: String, default: 'agent' },
  oauthProvider: { type: String },
  refreshToken: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Agent', AgentSchema);
