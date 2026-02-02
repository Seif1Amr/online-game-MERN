const WalletLedger = require('../models/WalletLedger');
const Agent = require('../models/Agent');
const Affiliate = require('../models/Affiliate');
const Withdrawal = require('../models/Withdrawal');
const { adjustWallet } = require('../services/walletService');

async function getWallet(req, res) {
  const { ownerId, ownerType } = req.query;
  if (!ownerId || !ownerType) return res.status(400).json({ message: 'ownerId & ownerType required' });
  let Model = ownerType === 'Agent' ? Agent : ownerType === 'Affiliate' ? Affiliate : null;
  if (!Model) return res.status(400).json({ message: 'Invalid ownerType' });
  const owner = await Model.findById(ownerId);
  if (!owner) return res.status(404).json({ message: 'Not found' });
  res.json({ walletBalance: owner.walletBalance });
}

async function ledger(req, res) {
  const { ownerId } = req.query;
  if (!ownerId) return res.status(400).json({ message: 'ownerId required' });
  const items = await WalletLedger.find({ ownerId }).sort({ createdAt: -1 }).limit(200);
  res.json({ items });
}

async function requestWithdrawal(req, res) {
  const { ownerId, ownerType, amount } = req.body;
  if (!ownerId || !ownerType || !amount) return res.status(400).json({ message: 'Missing fields' });
  const w = await Withdrawal.create({ ownerId, ownerType, amount, status: 'pending' });
  res.json({ ok: true, withdrawal: w });
}

async function approveWithdrawal(req, res) {
  try {
    const { id } = req.params;
    const w = await Withdrawal.findById(id);
    if (!w) return res.status(404).json({ message: 'Not found' });
    if (w.status !== 'pending') return res.status(400).json({ message: 'Already processed' });

    // simulate admin approval: deduct wallet and add ledger
    await adjustWallet({ ownerId: w.ownerId, ownerType: w.ownerType, amount: w.amount, kind: 'debit', reason: 'withdrawal', referenceId: w._id });
    w.status = 'approved';
    w.processedAt = new Date();
    await w.save();
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { getWallet, ledger, requestWithdrawal, approveWithdrawal };
