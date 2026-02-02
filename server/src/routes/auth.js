const express = require('express');
const router = express.Router();
const { registerController, loginController } = require('../controllers/authController');

router.post('/register', registerController);
router.post('/login', loginController);

// /google and /refresh endpoints can be added later (stubs)
router.post('/google', (req, res) => res.json({ message: 'google OAuth stub' }));
router.post('/refresh', (req, res) => res.json({ message: 'refresh token stub' }));

module.exports = router;
