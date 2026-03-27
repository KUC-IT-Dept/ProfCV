const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * POST /api/auth/login
 * Queries MongoDB for the user seeded by seed.js.
 * Compares plaintext password (MVP — no bcrypt).
 */
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // MVP: plaintext comparison — no bcrypt
    if (password !== user.password) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });

    return res.status(200).json({ token, user: payload });
  } catch (err) {
    console.error('[authController.login]', err);
    return res.status(500).json({ message: 'Server error during login.' });
  }
};

/**
 * GET /api/auth/me
 * Returns the current user derived from the verified JWT.
 */
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    return res.status(200).json(user);
  } catch (err) {
    console.error('[authController.getMe]', err);
    return res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { login, getMe };
