const mongoose = require('mongoose');
const crypto = require('crypto');

const AffiliateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String },
  referralCode: { type: String, unique: true, default: () => crypto.randomBytes(4).toString('hex') },
  walletBalance: { type: Number, default: 0 },
  role: { type: String, default: 'affiliate' },
  oauthProvider: { type: String },
  refreshToken: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Affiliate', AffiliateSchema);
