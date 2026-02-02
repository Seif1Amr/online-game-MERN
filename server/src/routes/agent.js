const express = require('express');
const router = express.Router();
const { dashboard, listUsers, blockUser, commissions, withdrawals } = require('../controllers/agentController');
const { authMiddleware, requireRole } = require('../middleware/auth');

router.use(authMiddleware(process.env.JWT_SECRET), requireRole('agent'));

router.get('/dashboard', dashboard);
router.get('/users', listUsers);
router.post('/users/:id/block', blockUser);
router.get('/commissions', commissions);
router.get('/withdrawals', withdrawals);

module.exports = router;
