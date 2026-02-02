require('dotenv').config();
const { connect, mongoose } = require('../config/db');
const Agent = require('../models/Agent');
const Affiliate = require('../models/Affiliate');
const Player = require('../models/Player');
const Gameplay = require('../models/GameplayTransaction');
const Referral = require('../models/Referral');
const { processGameplayCommission } = require('../services/commissionService');
const { hashPassword } = require('../services/authService');

async function seed() {
  await connect(process.env.MONGODB_URI);
  console.log('Connected');

  await mongoose.connection.dropDatabase();

  const agent = await Agent.create({ name: 'Agent One', email: 'agent1@example.com', passwordHash: await hashPassword('password'), walletBalance: 0 });
  const affiliate = await Affiliate.create({ name: 'Aff One', email: 'aff1@example.com', passwordHash: await hashPassword('password'), walletBalance: 0 });

  const players = [];
  for (let i = 0; i < 5; i++) {
    const p = await Player.create({ email: `player${i + 1}@example.com`, agentId: agent._id, affiliateId: affiliate._id, walletBalance: 100 });
    players.push(p);
    await Referral.create({ affiliateId: affiliate._id, userId: p._id });
  }

  // create gameplay history
  for (const p of players) {
    // 3 games each
    for (let g = 0; g < 3; g++) {
      const wager = Math.round(Math.random() * 50 + 1);
      // simulate winAmount with some losing bias
      const winAmount = Math.random() > 0.6 ? Math.round(Math.random() * wager * 2) : 0;
      const net = winAmount - wager;
      const tx = await Gameplay.create({ userId: p._id, wager, winAmount, netResult: net });
      try {
        await processGameplayCommission(tx._id);
      } catch (e) {
        console.warn('commission failed', e.message);
      }
    }
  }

  console.log('Seed complete');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
