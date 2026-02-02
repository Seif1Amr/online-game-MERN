const jwt = require('jsonwebtoken');

function signAccess(payload, secret, opts = {}) {
  return jwt.sign(payload, secret, { expiresIn: opts.expiresIn || '15m' });
}

function signRefresh(payload, secret, opts = {}) {
  return jwt.sign(payload, secret, { expiresIn: opts.expiresIn || '7d' });
}

function verify(token, secret) {
  return jwt.verify(token, secret);
}

module.exports = { signAccess, signRefresh, verify };
