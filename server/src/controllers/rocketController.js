const RocketRound = require('../models/RocketRound');
const RocketBet = require('../models/RocketBet');
const Player = require('../models/Player');
const { adjustWallet } = require('../services/walletService');
const { mongoose } = require('../config/db');

function generateCrashPoint() {
  // generate a pseudo-random crash between 1.2 and 10.0 with heavier weight towards low numbers
  const r = Math.random();
  const value = 1.2 + Math.pow(r, 2) * (10 - 1.2);
  return Math.round(value * 100) / 100;
}

function currentMultiplierForRound(round) {
  const started = round.startedAt.getTime();
  const now = Date.now();
  const elapsed = Math.max(0, (now - started) / 1000); // seconds
  const rate = 0.5; // multiplier per second slope
  const m = 1 + elapsed * rate;
  return Math.round(m * 100) / 100;
}

async function startRound(req, res) {
  try {
    const crashPoint = generateCrashPoint();
    const round = await RocketRound.create({ crashPoint });
    res.json({ roundId: round._id, startedAt: round.startedAt });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getRound(req, res) {
  try {
    const { id } = req.params;
    const round = await RocketRound.findById(id);
    if (!round) return res.status(404).json({ message: 'Round not found' });

    let current = currentMultiplierForRound(round);
    let crashed = false;
    if (current >= round.crashPoint) {
      crashed = true;
      round.status = 'crashed';
      await round.save().catch(() => {});
      current = round.crashPoint;
    }

    res.json({ roundId: round._id, currentMultiplier: current, crashed, crashPoint: crashed ? round.crashPoint : undefined });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function placeBet(req, res) {
  try {
    const { roundId, playerId, amount } = req.body;
    if (!roundId || !playerId || !amount) return res.status(400).json({ message: 'Missing fields' });
    const round = await RocketRound.findById(roundId);
    if (!round) return res.status(404).json({ message: 'Round not found' });
    if (round.status !== 'running') return res.status(400).json({ message: 'Round not accepting bets' });

    // debit player's wallet immediately (reserve)
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      const player = await Player.findById(playerId).session(session);
      if (!player) throw new Error('Player not found');
      // adjust wallet: debit amount
      await adjustWallet({ ownerId: player._id, ownerType: 'Player', amount, kind: 'debit', reason: 'rocket_bet', referenceId: round._id, session });

      const bet = await RocketBet.create(
        [
          {
            roundId: round._id,
            playerId: player._id,
            amount,
          },
        ],
        { session }
      );

      await session.commitTransaction();
      session.endSession();
      res.json({ ok: true, bet: bet[0] });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function cashout(req, res) {
  try {
    const { roundId, playerId } = req.body;
    if (!roundId || !playerId) return res.status(400).json({ message: 'Missing fields' });
    const round = await RocketRound.findById(roundId);
    if (!round) return res.status(404).json({ message: 'Round not found' });

    // compute current multiplier
    const current = currentMultiplierForRound(round);
    // find bet
    const bet = await RocketBet.findOne({ roundId, playerId });
    if (!bet) return res.status(404).json({ message: 'Bet not found' });
    if (bet.status !== 'placed') return res.status(400).json({ message: 'Bet already cashed/lost' });

    // If current >= crashPoint -> already crashed, player lost
    if (current >= round.crashPoint) {
      bet.status = 'lost';
      await bet.save();
      return res.json({ ok: true, result: 'lost' });
    }

    // otherwise payout
    const payoutMultiplier = current;
    const payout = Math.round(bet.amount * payoutMultiplier * 100) / 100;

    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      // credit payout
      await adjustWallet({ ownerId: bet.playerId, ownerType: 'Player', amount: payout, kind: 'credit', reason: 'rocket_payout', referenceId: bet._id, session });

      bet.status = 'cashed';
      bet.cashedOutAt = new Date();
      bet.cashoutMultiplier = payoutMultiplier;
      bet.payout = payout;
      await bet.save({ session });

      await session.commitTransaction();
      session.endSession();
      res.json({ ok: true, payout, multiplier: payoutMultiplier });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

module.exports = { startRound, getRound, placeBet, cashout };
