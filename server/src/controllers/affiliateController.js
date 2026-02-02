const Affiliate = require('../models/Affiliate');
const AffiliateClick = require('../models/AffiliateClick');
const Referral = require('../models/Referral');
const Commission = require('../models/Commission');

async function referralLink(req, res) {
  const affiliateId = req.user.sub;
  const aff = await Affiliate.findById(affiliateId);
  if (!aff) return res.status(404).json({ message: 'Not found' });
  res.json({ referralCode: aff.referralCode });
}

async function click(req, res) {
  const { referralCode } = req.body;
  const aff = await Affiliate.findOne({ referralCode });
  if (!aff) return res.status(404).json({ message: 'Affiliate not found' });
  await AffiliateClick.create({ affiliateId: aff._id, ip: req.ip, userAgent: req.headers['user-agent'] });
  res.json({ ok: true });
}

async function conversions(req, res) {
  const affiliateId = req.user.sub;
  const conv = await Referral.find({ affiliateId }).limit(100);
  res.json({ conv });
}

async function dashboard(req, res) {
  const affiliateId = req.user.sub;
  const clicks = await AffiliateClick.countDocuments({ affiliateId });
  const conversions = await Referral.countDocuments({ affiliateId });
  const revenueAgg = await Commission.aggregate([
    { $match: { ownerId: require('mongoose').Types.ObjectId(affiliateId) } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  res.json({ clicks, conversions, revenue: revenueAgg[0]?.total || 0 });
}

async function payouts(req, res) {
  const affiliateId = req.user.sub;
  // return unpaid commissions as payouts
  const items = await Commission.find({ ownerId: affiliateId });
  res.json({ items });
}

module.exports = { referralLink, click, conversions, dashboard, payouts };
