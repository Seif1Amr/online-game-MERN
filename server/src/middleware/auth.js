const { verify } = require('../utils/jwt');
const Agent = require('../models/Agent');
const Affiliate = require('../models/Affiliate');

function authMiddleware(jwtSecret) {
  return async function (req, res, next) {
    try {
      const header = req.headers.authorization;
      if (!header) return res.status(401).json({ message: 'Missing authorization' });
      const parts = header.split(' ');
      if (parts.length !== 2) return res.status(401).json({ message: 'Invalid authorization' });
      const token = parts[1];
      const payload = verify(token, jwtSecret);
      req.user = payload;
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Unauthorized', error: err.message });
    }
  };
}

function requireRole(role) {
  return function (req, res, next) {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    if (req.user.role !== role) return res.status(403).json({ message: 'Forbidden' });
    next();
  };
}

module.exports = { authMiddleware, requireRole };
