require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { connect } = require('./config/db');

const authRoutes = require('./routes/auth');
const agentRoutes = require('./routes/agent');
const affiliateRoutes = require('./routes/affiliate');
const walletRoutes = require('./routes/wallet');
const rocketRoutes = require('./routes/rocket');

async function start() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(morgan('dev'));

  app.use('/api/auth', authRoutes);
  app.use('/api/agent', agentRoutes);
  app.use('/api/affiliate', affiliateRoutes);
  app.use('/api/shared', walletRoutes);
  app.use('/api/game/rocket', rocketRoutes);

  const port = process.env.PORT || 4000;
  await connect(process.env.MONGODB_URI);
  app.listen(port, () => console.log(`Server listening on ${port}`));
}

start().catch((err) => {
  console.error('Failed to start', err);
  process.exit(1);
});
