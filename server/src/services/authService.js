const bcrypt = require('bcrypt');
const Agent = require('../models/Agent');
const Affiliate = require('../models/Affiliate');
const Player = require('../models/Player');
const { signAccess, signRefresh } = require('../utils/jwt');

const SALT_ROUNDS = 10;

async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function compare(password, hash) {
  return bcrypt.compare(password, hash);
}

function modelForRole(role) {
  if (role === 'agent') return Agent;
  if (role === 'affiliate') return Affiliate;
  return null;
}

async function register({ name, email, password, role }) {
  const Model = modelForRole(role);
  if (!Model) throw new Error('Invalid role');
  const passwordHash = password ? await hashPassword(password) : undefined;
  const doc = await Model.create({ name, email, passwordHash });
  return doc;
}

async function login({ email, password, role }, jwtSecret) {
  const Model = modelForRole(role);
  if (!Model) throw new Error('Invalid role');
  const user = await Model.findOne({ email });
  if (!user) throw new Error('Invalid credentials');
  const match = await compare(password, user.passwordHash);
  if (!match) throw new Error('Invalid credentials');

  const access = signAccess({ sub: user._id, role: user.role }, jwtSecret);
  const refresh = signRefresh({ sub: user._id, role: user.role }, jwtSecret);

  user.refreshToken = refresh;
  await user.save();

  return { access, refresh, user };
}

module.exports = { register, login, hashPassword, compare };
