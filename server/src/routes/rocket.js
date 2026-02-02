const express = require('express');
const router = express.Router();
const { startRound, getRound, placeBet, cashout } = require('../controllers/rocketController');

router.post('/start', startRound);
router.get('/round/:id', getRound);
router.post('/bet', placeBet);
router.post('/cashout', cashout);

module.exports = router;
