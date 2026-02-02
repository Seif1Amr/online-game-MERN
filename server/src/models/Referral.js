const mongoose = require('mongoose');

const ReferralSchema = new mongoose.Schema({
  affiliateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Affiliate', required: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true, index: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Referral', ReferralSchema);
