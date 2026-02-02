const { mongoose } = require('../config/db');
const Commission = require('../models/Commission');
const Gameplay = require('../models/GameplayTransaction');
const Player = require('../models/Player');
const Referral = require('../models/Referral');
const { adjustWallet } = require('./walletService');

/**
 * Create commissions for a gameplay transaction.
 * - Agent: 10% of player net loss (when netResult < 0)
 * - Affiliate: 20% of NGR for referred users (NGR = player net loss)
 */
async function processGameplayCommission(gameplayId) {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const gameplay = await Gameplay.findById(gameplayId).session(session);
    if (!gameplay) throw new Error('Gameplay not found');
    if (gameplay.processed) throw new Error('Gameplay already processed');

    const player = await Player.findById(gameplay.userId).session(session);
    if (!player) throw new Error('Player not found');

    const net = gameplay.netResult; // negative means player lost

    // Agent commission
    if (player.agentId && net < 0) {
      const agentCommission = Math.round((-net * 0.1) * 100) / 100; // 10%
      if (agentCommission > 0) {
        await Commission.create(
          [
            {
              ownerId: player.agentId,
              ownerType: 'Agent',
              sourceUserId: player._id,
              amount: agentCommission,
              referenceId: gameplay._id,
            },
          ],
          { session }
        );

        await adjustWallet({
          ownerId: player.agentId,
          ownerType: 'Agent',
          amount: agentCommission,
          kind: 'credit',
          reason: 'agent_commission',
          referenceId: gameplay._id,
          session,
        });
      }
    }

    // Affiliate commission
    const referral = await Referral.findOne({ userId: player._id }).session(session);
    if (referral && net < 0) {
      const affiliateCommission = Math.round((-net * 0.2) * 100) / 100; // 20% NGR
      if (affiliateCommission > 0) {
        await Commission.create(
          [
            {
              ownerId: referral.affiliateId,
              ownerType: 'Affiliate',
              sourceUserId: player._id,
              amount: affiliateCommission,
              referenceId: gameplay._id,
            },
          ],
          { session }
        );

        await adjustWallet({
          ownerId: referral.affiliateId,
          ownerType: 'Affiliate',
          amount: affiliateCommission,
          kind: 'credit',
          reason: 'affiliate_commission',
          referenceId: gameplay._id,
          session,
        });
      }
    }

    gameplay.processed = true;
    await gameplay.save({ session });

    await session.commitTransaction();
    session.endSession();
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
}

module.exports = { processGameplayCommission };
