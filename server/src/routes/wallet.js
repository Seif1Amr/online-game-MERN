const express = require('express');
const router = express.Router();
const { getWallet, ledger, requestWithdrawal, approveWithdrawal } = require('../controllers/walletController');

router.get('/wallet', getWallet);
router.get('/ledger', ledger);
router.post('/withdraw', requestWithdrawal);
router.post('/admin/withdrawals/:id/approve', approveWithdrawal);

module.exports = router;
const express = require('express');
const router = express.Router();
const { getWallet, ledger, requestWithdrawal, approveWithdrawal } = require('../controllers/walletController');
const { authMiddleware } = require('../middleware/auth');

router.get('/wallet', authMiddleware(process.env.JWT_SECRET), getWallet);
router.get('/ledger', authMiddleware(process.env.JWT_SECRET), ledger);
router.post('/withdraw', authMiddleware(process.env.JWT_SECRET), requestWithdrawal);

// admin approve route - dummy admin guard for demo
router.post('/admin/withdrawals/:id/approve', approveWithdrawal);

module.exports = router;
