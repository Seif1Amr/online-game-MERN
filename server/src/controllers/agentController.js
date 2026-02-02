const Player = require('../models/Player');
const Commission = require('../models/Commission');
const Withdrawal = require('../models/Withdrawal');

async function dashboard(req, res) {
  try {
    const agentId = req.user.sub;
    const players = await Player.countDocuments({ agentId });
    const totalRevenueAgg = await Commission.aggregate([
      { $match: { ownerId: require('mongoose').Types.ObjectId(agentId) } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const pendingCommission = await Commission.aggregate([
      { $match: { ownerId: require('mongoose').Types.ObjectId(agentId), status: 'pending' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    res.json({ players, totalRevenue: totalRevenueAgg[0]?.total || 0, pending: pendingCommission[0]?.total || 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function listUsers(req, res) {
  const { page = 1, limit = 20 } = req.query;
  const agentId = req.user.sub;
  const users = await Player.find({ agentId })
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .lean();
  res.json({ users });
}

async function blockUser(req, res) {
  const { id } = req.params;
  const { action } = req.body;
  const p = await Player.findById(id);
  if (!p) return res.status(404).json({ message: 'Not found' });
  p.status = action === 'block' ? 'blocked' : 'active';
  await p.save();
  res.json({ ok: true });
}

async function commissions(req, res) {
  const agentId = req.user.sub;
  const items = await Commission.find({ ownerId: agentId }).sort({ createdAt: -1 }).limit(100);
  res.json({ items });
}

async function withdrawals(req, res) {
  const agentId = req.user.sub;
  const items = await Withdrawal.find({ ownerId: agentId }).sort({ createdAt: -1 }).limit(100);
  res.json({ items });
}

module.exports = { dashboard, listUsers, blockUser, commissions, withdrawals };
