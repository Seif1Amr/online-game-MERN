const { register, login } = require('../services/authService');
const Agent = require('../models/Agent');
const Affiliate = require('../models/Affiliate');
const Player = require('../models/Player');

async function registerController(req, res) {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !role) return res.status(400).json({ message: 'Missing fields' });
    const doc = await register({ name, email, password, role });
    res.json({ ok: true, user: doc });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function loginController(req, res) {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) return res.status(400).json({ message: 'Missing fields' });
    const { access, refresh, user } = await login({ email, password, role }, process.env.JWT_SECRET);
    res.json({ access, refresh, user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

module.exports = { registerController, loginController };
