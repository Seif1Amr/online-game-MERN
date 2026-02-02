const { mongoose } = require('../config/db');
const WalletLedger = require('../models/WalletLedger');
const Agent = require('../models/Agent');
const Affiliate = require('../models/Affiliate');
const Player = require('../models/Player');

const OWNER_MAP = {
  Agent,
  Affiliate,
  Player,
};

async function adjustWallet({ ownerId, ownerType, amount, kind, reason, referenceId, session = null }) {
  if (!OWNER_MAP[ownerType]) throw new Error('Invalid ownerType');
  if (amount === 0) return;

  const Owner = OWNER_MAP[ownerType];

  const sess = session || (await mongoose.startSession());
  let ownSession = !!session;
  try {
    if (!ownSession) sess.startTransaction();

    const owner = await Owner.findById(ownerId).session(sess);
    if (!owner) throw new Error('Owner not found');

    const newBalance = owner.walletBalance + (kind === 'credit' ? amount : -amount);
    if (newBalance < 0) throw new Error('Insufficient funds');

    owner.walletBalance = newBalance;
    await owner.save({ session: sess });

    await WalletLedger.create(
      [
        {
          ownerId,
          ownerType,
          amount,
          kind,
          reason,
          referenceId,
        },
      ],
      { session: sess }
    );

    if (!ownSession) await sess.commitTransaction();
  } catch (err) {
    if (!ownSession) await sess.abortTransaction();
    throw err;
  } finally {
    if (!ownSession) sess.endSession();
  }
}

module.exports = { adjustWallet };
