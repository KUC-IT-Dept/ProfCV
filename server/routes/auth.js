const express = require('express');
const router = express.Router();
const { login, getMe, updatePassword } = require('../controllers/authController');
const verifyToken = require('../middleware/auth');

router.post('/login', login);
router.get('/me', verifyToken, getMe);
router.put('/password', verifyToken, updatePassword);

module.exports = router;
