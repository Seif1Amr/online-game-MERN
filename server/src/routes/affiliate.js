const express = require('express');
const router = express.Router();
const { referralLink, click, conversions, dashboard, payouts } = require('../controllers/affiliateController');
const { authMiddleware, requireRole } = require('../middleware/auth');

router.post('/click', click); // public click endpoint

router.use(authMiddleware(process.env.JWT_SECRET), requireRole('affiliate'));
router.get('/referral-link', referralLink);
router.get('/conversions', conversions);
router.get('/dashboard', dashboard);
router.get('/payouts', payouts);

module.exports = router;
